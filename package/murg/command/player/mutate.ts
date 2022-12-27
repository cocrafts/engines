import { clonePlayer, createCommandResult } from '../../utils/helper';
import {
	CommandRunner,
	DuelCommandType,
	StatelessCommand,
} from '../../utils/type';

export const create: StatelessCommand<'owner' | 'payload'> = ({
	owner,
	payload,
}) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		type: DuelCommandType.PlayerMutate,
		owner,
		payload,
	});

	return commands;
};

export const run: CommandRunner = ({ duel, command: { owner, payload } }) => {
	const playerClone = clonePlayer(duel, owner);

	Object.keys(payload).forEach((key) => {
		const value = payload[key];

		if (isNaN(value)) {
			playerClone.state[key] = value;
		} else {
			playerClone.state[key] = value || 0;
		}
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
