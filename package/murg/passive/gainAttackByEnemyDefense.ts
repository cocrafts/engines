import { getCardState } from '../utils/card';
import { getFacingIdentifier } from '../utils/ground';
import { emptyPassive } from '../utils/helper';
import { PassiveRunner } from '../utils/type';

export const gainAttackByEnemyDefense: PassiveRunner = ({ duel, cardId }) => {
	const state = getCardState(duel.stateMap, cardId);
	const facingIdentifier = getFacingIdentifier(duel, state.owner, cardId);
	const facingState = getCardState(duel.stateMap, facingIdentifier.id);
	const facingDefense = facingState?.defense || 0;

	return [
		{
			attack: Math.max(0, facingDefense),
			health: 0,
			defense: 0,
		},
		emptyPassive,
	];
};
