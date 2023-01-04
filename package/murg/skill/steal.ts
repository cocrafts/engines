import { createCommand } from '../command';
import { getCard, getCardState } from '../utils/card';
import { getFacingIdentifier } from '../utils/ground';
import { createCommandResult } from '../utils/helper';
import { CardType, DuelPlace, SkillRunner } from '../utils/type';

interface Attributes {
	minHealth?: number;
	unitTypes: CardType[];
}

export const runUnitStealer: SkillRunner = ({ duel, cardId }) => {
	const { commands, registerCommand } = createCommandResult();
	const card = getCard(duel.cardMap, cardId);
	const state = getCardState(duel.stateMap, cardId);
	const facingIdentifier = getFacingIdentifier(duel, state.owner, state.id);
	const facingState = getCardState(duel.stateMap, facingIdentifier.id);
	const facingCard = getCard(duel.cardMap, facingIdentifier.id);
	const { minHealth, unitTypes }: Attributes = card.skill.attribute as never;
	const isCardTypeValid = unitTypes?.indexOf(facingCard.kind) >= 0;
	const isHealthValid = facingState.health <= minHealth;

	if (isCardTypeValid && isHealthValid) {
		createCommand
			.cardMove({
				owner: state.owner,
				target: {
					from: {
						owner: facingState.owner,
						id: facingState.id,
						place: DuelPlace.Ground,
					},
					to: {
						owner: state.owner,
						index: 6,
						place: DuelPlace.Ground,
					},
				},
			})
			.forEach(registerCommand);
	}

	return commands;
};
