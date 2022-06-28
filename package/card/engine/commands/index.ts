import { CommandType, DuelState, RunCommandPayload } from '../../types';

import cleanupCommand from './board/cleanup';
import combatCommand from './board/combat';
import reinforceCommand from './board/reinforce';
import skillCommand from './board/skill';
import drawCommand from './draw';
import moveCommand from './move';
import mutateCommand from './mutate';

export const commandCreators = {
	draw: drawCommand.create,
	move: moveCommand.create,
	combat: combatCommand.create,
	mutate: mutateCommand.create,
	skill: skillCommand.create,
	reinforce: reinforceCommand.create,
	cleanup: cleanupCommand.create,
};

export const runCommand = (payload: RunCommandPayload): DuelState => {
	const { command, snapshot } = payload;

	switch (command.type) {
		case CommandType.Move:
			return moveCommand.run(payload);
		case CommandType.Mutate:
			return mutateCommand.run(payload);
		default:
			return snapshot;
	}
};
