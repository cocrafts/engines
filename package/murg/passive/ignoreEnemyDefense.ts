import { getCard, getCardState } from '../utils/card';
import { getFacingIdentifier } from '../utils/ground';
import { emptyPassive } from '../utils/helper';
import { PassiveRunner } from '../utils/type';

interface BasicAttributes {
	defense: number;
}

export const ignoreEnemyDefense: PassiveRunner = ({ duel, cardId }) => {
	const card = getCard(duel.cardMap, cardId);
	const { defense }: BasicAttributes = card.skill.passiveAttribute as never;
	const state = getCardState(duel.stateMap, cardId);
	const facingIdentifier = getFacingIdentifier(duel, state.owner, cardId);
	const facingState = getCardState(duel.stateMap, facingIdentifier.id);
	const facingDefense = facingState?.defense || 0;
	let finalDefense = 0;

	if (defense) {
		finalDefense = Math.max(0, defense);
	} else {
		finalDefense = Math.max(0, facingDefense);
	}

	return [
		emptyPassive,
		{
			attack: 0,
			health: 0,
			defense: -finalDefense,
		},
	];
};
