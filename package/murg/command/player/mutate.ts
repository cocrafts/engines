import {
	clonePlayer,
	createCommandResult,
	selectPlayer,
} from '../../utils/helper';
import {
	CommandRunner,
	DuelCommandType,
	StatefulCommand,
} from '../../utils/type';

export const create: StatefulCommand<'target' | 'payload'> = ({
	duel,
	target,
	payload,
}) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		type: DuelCommandType.PlayerMutate,
		target,
		payload,
	});

	if (payload.health) {
		const player = selectPlayer(duel, target.to.owner);
		const nextHealth = player.health;

		if (nextHealth <= 0) {
			registerCommand({
				type: DuelCommandType.DuelMutate,
				payload: { gameOver: true },
			});
		}
	}

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
