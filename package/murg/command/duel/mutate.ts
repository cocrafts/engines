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

export const run: CommandRunner = ({ duel, command: { payload } }) => {
	const updates = {};

	Object.keys(payload).forEach((key) => {
		const value = payload[key];
		if (isNaN(value)) {
			updates[key] = value;
		} else {
			updates[key] = duel[key] + (value || 0);
		}
	});

	return updates;
};

export const duelMutate = {
	create,
	run,
};

export default duelMutate;
