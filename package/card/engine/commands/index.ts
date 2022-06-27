import { CommandType, DuelState, RunCommandPayload } from '../../types';

import combatCommand from './combat';
import drawCommand from './draw';
import moveCommand from './move';
import mutateCommand from './mutate';
import reinforceCommand from './reinforce';
import skillCommand from './skill';

export const commandCreators = {
	draw: drawCommand.create,
	move: moveCommand.create,
	combat: combatCommand.create,
	mutate: mutateCommand.create,
	skill: skillCommand.create,
	reinforce: reinforceCommand.create,
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
