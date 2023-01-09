import { getCard, getCardState } from '../utils/card';
import { getFacingIdentifier } from '../utils/ground';
import { emptyPassive } from '../utils/helper';
import { PassiveRunner } from '../utils/type';

export const gainAttackByEnemyMissingHealth: PassiveRunner = ({
	duel,
	cardId,
}) => {
	const state = getCardState(duel.stateMap, cardId);
	const facingIdentifier = getFacingIdentifier(duel, state.owner, cardId);
	const facingCard = getCard(duel.cardMap, facingIdentifier.id);
	const facingState = getCardState(duel.stateMap, facingIdentifier.id);
	const missingHealth = !facingState?.id
		? 0
		: facingCard.attribute.health - facingState.health;

	return [
		{
			attack: Math.max(0, missingHealth),
			health: 0,
			defense: 0,
		},
		emptyPassive,
	];
};
