import { createCommand } from '../command';
import { skillMap } from '../skill';
import { getCard } from '../utils/card';
import { runFightAt } from '../utils/fight';
import { groundTraverse } from '../utils/ground';
import {
	createAndMergeBundle,
	createCommandBundle,
	runAndMergeInspireHooks,
} from '../utils/state';
import {
	ActivationType,
	BundleGroup,
	CommandSourceType,
	DuelPhases,
	DuelState,
	MoveResult,
} from '../utils/type';

export const fight = (duel: DuelState): MoveResult => {
	const fightBundle = createCommandBundle(duel, BundleGroup.FightCombat);

	for (let i = 0; i < duel.setting.groundSize; i++) {
		runFightAt(duel, fightBundle, i);

		if (fightBundle.commands.length > 0) {
			runAndMergeInspireHooks(duel, fightBundle, fightBundle.commands);
		}
	}

	const cleanUpBundle = createAndMergeBundle(
		duel,
		BundleGroup.PhaseUpdate,
		createCommand.duelMutate({ payload: { phase: DuelPhases.PostFight } }),
	);

	return {
		duel,
		commandBundles: [fightBundle, cleanUpBundle],
	};
};

export const preFight = (duel: DuelState): MoveResult => {
	return runFightHook(duel, true, DuelPhases.Fight);
};

export const postFight = (duel: DuelState): MoveResult => {
	return runFightHook(duel, false, DuelPhases.CleanUp);
};

const runFightHook = (
	duel: DuelState,
	isPreFight: boolean,
	nextPhase: DuelPhases,
): MoveResult => {
	const commandBundles = [];

	groundTraverse(duel, (cardId) => {
		if (!cardId) return;

		const card = getCard(duel.cardMap, cardId);
		const activation = isPreFight
			? ActivationType.PreFight
			: ActivationType.PostFight;
		const isFightHookActivation = card?.skill?.activation === activation;

		if (isFightHookActivation) {
			const skillFunc = skillMap[card.skill.attribute?.id];
			const sourceType = isPreFight
				? CommandSourceType.PreFightSkill
				: CommandSourceType.PostFightSkill;
			const skillCommands = skillFunc?.({ duel, cardId, sourceType }) || [];

			if (skillCommands.length > 0) {
				const skillBundle = createAndMergeBundle(
					duel,
					BundleGroup.FightSkill,
					skillCommands,
				);

				runAndMergeInspireHooks(duel, skillBundle, skillCommands);
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
