import {
	clonePlayer,
	createCommandResult,
	createDuelFragment,
} from '../../utils/helper';
import {
	CommandCreator,
	CommandRunner,
	DuelCommandType,
} from '../../utils/type';

export const create: CommandCreator<'owner' | 'payload'> = ({
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
	const fragment = createDuelFragment(duel);
	const playerClone = clonePlayer(duel, owner);

	Object.keys(payload).forEach((key) => {
		const value = payload[key];

		if (isNaN(value)) {
			playerClone.state[key] = value;
		} else {
			playerClone.state[key] = value || 0;
		}
	});

	fragment[playerClone.key] = playerClone.state;

	return fragment;
};

export const playerMutate = {
	create,
	run,
};

export default playerMutate;
