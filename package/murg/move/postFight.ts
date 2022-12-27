import skillMap from '../skill';
import { getCard, getCardState } from '../utils/card';
import { createCommandBundle } from '../utils/state';
import {
	ActivationType,
	Card,
	CardState,
	DuelState,
	MoveResult,
	StatedCard,
} from '../utils/type';

export const postFight = (duel: DuelState): MoveResult => {
	const bundle = createCommandBundle(duel);
	const firstPostFightCards = extractPostFights(duel);

	firstPostFightCards.forEach((card) => {
		const skill = skillMap[card.skill?.attribute?.id];
		skill?.(duel, card.skill.attribute, card.id);
	});

	return {
		duel,
		commandBundles: [],
	};
};

const extractPostFights = (duel: DuelState): StatedCard[] => {
	return [...duel.firstGround, ...duel.secondGround]
		.filter((id) => !!id)
		.map((id) => ({
			...getCard(duel.cardMap, id),
			state: getCardState(duel.stateMap, id),
		}))
		.filter(filterPostFightCard);
};

const filterPostFightCard = (card: StatedCard) => {
	return card.skill?.activation === ActivationType.PostFight;
};
