import { createCommandResult } from '../../utils/helper';
import {
	CommandBundle,
	CommandCreator,
	CommandRunner,
	DuelCommandType,
} from '../../utils/type';

export const create: CommandCreator = ({ payload }) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		type: DuelCommandType.DuelMutate,
		payload,
	});

	return commands;
};

export const run: CommandRunner = ({ state, command: { payload } }) => {
	return { round: state.round + payload.round || 0 };
};

export const duelMutate: CommandBundle = {
	create,
	run,
};

export default duelMutate;
