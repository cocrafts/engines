import { createCommand } from '../command';
import { getCard, getCardState } from '../utils/card';
import { createCommandResult, sourceTypeFromCommand } from '../utils/helper';
import { SkillRunner } from '../utils/type';

interface Attributes {
	attack: number;
	defense: number;
	health: number;
}

export const runSelfMutate: SkillRunner = ({ duel, cardId, fromCommand }) => {
	const { commands, registerCommand } = createCommandResult();
	const card = getCard(duel.cardMap, cardId);
	const state = getCardState(duel.stateMap, cardId);
	const { ...stats }: Attributes = card.skill.attribute as never;

	createCommand
		.cardMutate({
			owner: state.owner,
			target: {
				source: {
					type: sourceTypeFromCommand(fromCommand),
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
				attack: state.attack + (stats.attack || 0),
				defense: state.defense + (stats.defense || 0),
				health: state.health + (stats.health || 0),
			},
		})
		.forEach(registerCommand);

	return commands;
};
