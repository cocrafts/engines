import skillMap from '../skill';
import { getCard, getCardState } from '../utils/card';
import { createCommandBundle } from '../utils/state';
import {
	ActivationType,
	CardState,
	DuelState,
	MoveResult,
} from '../utils/type';

export const postFight = (duel: DuelState): MoveResult => {
	const bundle = createCommandBundle(duel);
	const firstPostFightCards = extractPostFights(duel);

	firstPostFightCards.forEach((state) => {
		const card = getCard(duel.cardMap, state.id);
		const skill = skillMap[card.skill?.attribute?.id];

		skill?.(duel, card, state);
	});

	return {
		duel,
		commandBundles: [bundle],
	};
};

const extractPostFights = (duel: DuelState): CardState[] => {
	return [...duel.firstGround, ...duel.secondGround]
		.filter((id) => filterPostFightCard(duel, id))
		.map((id) => getCardState(duel.stateMap, id));
};

const filterPostFightCard = (duel: DuelState, cardId: string) => {
	if (!cardId) return false;

	const activation = getCard(duel.cardMap, cardId)?.skill?.activation;
	return activation === ActivationType.PostFight;
};
