import {
	CommandType,
	CreateCommandPayload,
	DuelCommand,
	DuelPlace,
	DuelState,
	RunCommandPayload,
} from '../../../types';
import { getPlayerOrder } from '../../util';

import { handleDestroy } from './destroy';
import { move } from './internal';
import { handleSummon } from './summon';

export const create = ({
	owner,
	snapshot,
	from,
	target,
	side,
}: CreateCommandPayload): DuelCommand[] => {
	const commands: DuelCommand[] = [];
	const { player, hand } = snapshot;
	const order = getPlayerOrder(player, owner);
	const [targetSource] = target;

	commands.push({
		owner,
		type: CommandType.Move,
		from,
		target,
		side,
	});

	if (targetSource === DuelPlace.Ground) {
		/* <- Simulate ability */
		commands.push({
			owner,
			type: CommandType.Move,
			from: [DuelPlace.Ability, '0002'],
			target: [DuelPlace.Ground, null, hand[order].length + 1],
			side: Math.floor(Math.random() * 2),
		});
	}

	return commands;
};

export const run = (payload: RunCommandPayload): DuelState => {
	const { from, target } = payload.command;
	const [fromPlace] = from;
	const [targetPlace] = target;

	if (fromPlace === DuelPlace.Ground) {
		/* <- Remove from Ground */
		return handleDestroy(payload);
	} else if (targetPlace == DuelPlace.Ground) {
		/* <- Add to Ground */
		return handleSummon(payload);
	}

	return move(payload);
};

export const moveCommand = {
	create,
	run,
};

export default moveCommand;
