import { createCommand } from '../command';
import { skillMap } from '../skill';
import { getCard, getCardState } from '../utils/card';
import { groundTraverse } from '../utils/ground';
import {
	createAndMergeBundle,
	createCommandBundle,
	runAndMergeBundle,
} from '../utils/state';
import {
	ActivationType,
	DuelPhases,
	DuelState,
	MoveResult,
} from '../utils/type';

export const runFightHook = (
	duel: DuelState,
	activation: ActivationType,
	nextPhase: DuelPhases,
): MoveResult => {
	const skillBundle = createCommandBundle(duel);

	groundTraverse(duel, (cardId) => {
		if (!cardId) return;

		const card = getCard(duel.cardMap, cardId);
		const state = getCardState(duel.stateMap, cardId);

		if (card.skill?.activation === activation) {
			const commands = skillMap[card.skill.attribute?.id]?.(duel, card, state);
			runAndMergeBundle(duel, skillBundle, commands);
		}
	});

	const cleanUpBundle = createAndMergeBundle(
		duel,
		createCommand.duelMutate({
			payload: { phase: nextPhase },
		}),
	);

	return {
		duel,
		commandBundles: [skillBundle, cleanUpBundle],
	};
};

export const preFight = (duel: DuelState): MoveResult => {
	return runFightHook(duel, ActivationType.PreFight, DuelPhases.Fight);
};

export const postFight = (duel: DuelState): MoveResult => {
	return runFightHook(duel, ActivationType.PostFight, DuelPhases.CleanUp);
};
