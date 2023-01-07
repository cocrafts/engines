import { createCommand } from '../command';
import { skillMap } from '../skill';
import { getCard } from '../utils/card';
import { runFightAt } from '../utils/fight';
import { groundTraverse } from '../utils/ground';
import {
	createAndMergeBundle,
	createCommandBundle,
	runAndMergeHooks,
} from '../utils/state';
import {
	ActivationType,
	BundleGroup,
	DuelPhases,
	DuelState,
	MoveResult,
} from '../utils/type';

export const fight = (duel: DuelState): MoveResult => {
	const commandBundles = [];

	for (let i = 0; i < duel.setting.groundSize; i++) {
		const fightBundle = createCommandBundle(duel, BundleGroup.FightCombat);
		runFightAt(duel, fightBundle, i);

		if (fightBundle.commands.length > 0) {
			runAndMergeHooks(duel, fightBundle, fightBundle.commands);
			commandBundles.push(fightBundle);
		}
	}

	const cleanUpBundle = createAndMergeBundle(
		duel,
		BundleGroup.PhaseUpdate,
		createCommand.duelMutate({ payload: { phase: DuelPhases.PostFight } }),
	);

	commandBundles.push(cleanUpBundle);

	return { duel, commandBundles };
};

export const preFight = (duel: DuelState): MoveResult => {
	return runFightHook(duel, ActivationType.PreFight, DuelPhases.Fight);
};

export const postFight = (duel: DuelState): MoveResult => {
	return runFightHook(duel, ActivationType.PostFight, DuelPhases.CleanUp);
};

const runFightHook = (
	duel: DuelState,
	activation: ActivationType,
	nextPhase: DuelPhases,
): MoveResult => {
	const commandBundles = [];

	groundTraverse(duel, (cardId) => {
		if (!cardId) return;

		const card = getCard(duel.cardMap, cardId);
		const isFightHookActivation = card?.skill?.activation === activation;

		if (isFightHookActivation) {
			const skillFunc = skillMap[card.skill.attribute?.id];
			const commands = skillFunc?.({ duel, cardId }) || [];

			if (commands.length > 0) {
				const skillBundle = createAndMergeBundle(
					duel,
					BundleGroup.FightSkill,
					commands,
				);

				runAndMergeHooks(duel, skillBundle, commands);
				commandBundles.push(skillBundle);
			}
		}
	});

	const cleanUpBundle = createAndMergeBundle(
		duel,
		BundleGroup.PhaseUpdate,
		createCommand.duelMutate({ payload: { phase: nextPhase } }),
	);

	commandBundles.push(cleanUpBundle);

	return { duel, commandBundles };
};
