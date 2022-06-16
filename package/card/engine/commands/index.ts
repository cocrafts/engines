import { CommandType, DuelState, RunCommandPayload } from '../../types';

import drawCommand from './draw';
import moveCommand from './move';

export const commandCreators = {
	draw: drawCommand.create,
	move: moveCommand.create,
};

export const runCommand = (payload: RunCommandPayload): DuelState => {
	const { command, snapshot } = payload;

	switch (command.type) {
		case CommandType.Move:
			return moveCommand.run(payload);
		default:
			return snapshot;
	}
};
