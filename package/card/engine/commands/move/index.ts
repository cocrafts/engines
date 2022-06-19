import {
	CommandType,
	CreateCommandPayload,
	DuelCommand,
	DuelPlace,
	DuelState,
	RunCommandPayload,
	SummonSide,
} from '../../../types';
import { getPlayerOrder } from '../../util';

import { move } from './internal';
import { summonMove } from './summon';

export const create = ({
	creator,
	snapshot,
	from,
	target,
	side,
}: CreateCommandPayload): DuelCommand[] => {
	const commands: DuelCommand[] = [];
	const { player, hand } = snapshot;
	const order = getPlayerOrder(player, creator);
	const [targetSource] = target;

	commands.push({
		creator,
		type: CommandType.Move,
		from,
		target,
		side,
	});

	if (targetSource === DuelPlace.Ground) {
		/* <- Simulate ability */
		commands.push({
			creator,
			type: CommandType.Move,
			from: [DuelPlace.Ability, '0002'],
			target: [DuelPlace.Ground, null, hand[order].length + 1],
			side: SummonSide.Right,
		});
	}

	return commands;
};

export const run = (payload: RunCommandPayload): DuelState => {
	const { target } = payload.command;
	const [targetPlace] = target;

	if (targetPlace == DuelPlace.Ground) {
		return summonMove(payload);
	}

	return move(payload);
};

export const moveCommand = {
	create,
	run,
};

export default moveCommand;
