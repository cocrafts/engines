import { createCommand } from '../command';
import { getCard, getCardState } from '../utils/card';
import { getClosestEmpty, getFacingIdentifier } from '../utils/ground';
import {
	createCommandResult,
	selectGround,
	sourceTypeFromCommand,
} from '../utils/helper';
import { CardType, DuelPlace, SkillRunner } from '../utils/type';

interface Attributes {
	minHealth?: number;
	unitTypes: CardType[];
}

export const runUnitStealer: SkillRunner = ({ duel, cardId, fromCommand }) => {
	const { commands, registerCommand } = createCommandResult();
	const card = getCard(duel.cardMap, cardId);
	const state = getCardState(duel.stateMap, cardId);
	const currentGround = selectGround(duel, state.owner);
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
					source: {
						type: sourceTypeFromCommand(fromCommand),
						owner: state.owner,
						id: state.id,
						place: state.place,
					},
					from: {
						owner: facingState.owner,
						id: facingState.id,
						place: DuelPlace.Ground,
					},
					to: {
						owner: state.owner,
						index: getClosestEmpty(currentGround),
						place: DuelPlace.Ground,
					},
				},
			})
			.forEach(registerCommand);
	}

	return commands;
};
