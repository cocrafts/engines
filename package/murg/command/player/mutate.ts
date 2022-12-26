import { clonePlayer, createCommandResult } from '../../utils/helper';
import {
	CommandRunner,
	DuelCommandType,
	StatelessCommand,
} from '../../utils/type';

export const create: StatelessCommand<'target' | 'payload'> = ({
	target,
	payload,
}) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		type: DuelCommandType.PlayerMutate,
		target,
		payload,
	});

	return commands;
};

export const run: CommandRunner = ({ duel, command: { owner, payload } }) => {
	const playerClone = clonePlayer(duel, owner);

	Object.keys(payload).forEach((key) => {
		const diff = payload[key] || 0;
		playerClone.state[key] = playerClone.state[key] + diff;
	});

	return {
		[playerClone.key]: playerClone.state,
	};
};

export const playerMutate = {
	create,
	run,
};

export default playerMutate;
