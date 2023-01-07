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

	return [
		{
			attack: facingIdentifier?.id
				? facingCard.attribute.health - (facingState?.health || 0)
				: 0,
			health: 0,
			defense: 0,
		},
		emptyPassive,
	];
};
