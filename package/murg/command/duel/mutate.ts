import { createCommandResult } from '../../utils/helper';
import {
	CommandRunner,
	DuelCommandType,
	StatelessCommand,
} from '../../utils/type';

export const create: StatelessCommand<'payload'> = ({ payload }) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		type: DuelCommandType.DuelMutate,
		payload,
	});

	return commands;
};

export const run: CommandRunner = ({ state, command: { payload } }) => {
	return { turn: state.turn + payload.turn || 0 };
};

export const duelMutate = {
	create,
	run,
};

export default duelMutate;
