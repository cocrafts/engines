import { createCommand } from '../command';
import { getCard, getCardState } from '../utils/card';
import { createCommandResult } from '../utils/helper';
import { SkillRunner } from '../utils/type';

interface SkillOptions {
	multiplyFactor: number;
}

export const damageMultiplier: SkillRunner = ({ duel, cardId, sourceType }) => {
	const { commands, registerCommand } = createCommandResult();
	const card = getCard(duel.cardMap, cardId);
	const attr: SkillOptions = card.skill.attribute as never;
	const state = getCardState(duel.stateMap, cardId);

	createCommand
		.cardMutate({
			owner: state.owner,
			target: {
				source: {
					type: sourceType,
					owner: state.owner,
					place: state.place,
					id: state.id,
				},
				to: {
					owner: state.owner,
					place: state.place,
					id: state.id,
				},
			},
			payload: {
				attack: state.attack * attr.multiplyFactor,
			},
		})
		.forEach(registerCommand);

	return commands;
};
