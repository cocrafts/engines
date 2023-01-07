import { getCardState } from '../utils/card';
import { getFacingIdentifier } from '../utils/ground';
import { emptyPassive } from '../utils/helper';
import { PassiveRunner } from '../utils/type';

export const gainAttackByEnemyDefense: PassiveRunner = ({ duel, cardId }) => {
	const state = getCardState(duel.stateMap, cardId);
	const facingIdentifier = getFacingIdentifier(duel, state.owner, cardId);
	const facingState = getCardState(duel.stateMap, facingIdentifier.id);

	return [
		{
			attack: Math.max(facingState.defense, 0),
			health: 0,
			defense: 0,
		},
		emptyPassive,
	];
};
