import { clonePlayer, createCommandResult } from '../../utils/helper';
import {
	CommandBundle,
	CommandCreator,
	CommandRunner,
	DuelCommandType,
} from '../../utils/type';

export const create: CommandCreator = ({ owner, target, payload }) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		owner,
		type: DuelCommandType.PlayerMutate,
		target,
		payload,
	});

	return commands;
};

export const run: CommandRunner = ({ state, command: { owner, payload } }) => {
	const playerClone = clonePlayer(state, owner);

	Object.keys(payload).forEach((key) => {
		const diff = payload[key] || 0;
		playerClone.state[key] = playerClone.state[key] + diff;
	});

	return {
		[playerClone.key]: playerClone.state,
	};
};

export const playerMutate: CommandBundle = {
	create,
	run,
};

export default playerMutate;
