import { skillMap } from '../skill';
import { getCard, getCardState } from '../utils/card';
import { groundTraverse } from '../utils/ground';
import { createCommandBundle, runAndMergeBundle } from '../utils/state';
import { ActivationType, DuelState, MoveResult } from '../utils/type';

export const postFight = (duel: DuelState): MoveResult => {
	const skillBundle = createCommandBundle(duel);

	groundTraverse(duel, (cardId) => {
		if (!cardId) return;

		const card = getCard(duel.cardMap, cardId);
		const state = getCardState(duel.stateMap, cardId);

		if (card.skill?.activation === ActivationType.PostFight) {
			const commands = skillMap[card.skill.attribute?.id]?.(duel, card, state);
			runAndMergeBundle(duel, skillBundle, commands);
		}
	});

	return {
		duel,
		commandBundles: [skillBundle],
	};
};
