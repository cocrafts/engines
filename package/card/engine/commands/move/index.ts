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

import { destroyMove } from './destroy';
import { move } from './internal';
import { summonMove } from './summon';

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
			side: SummonSide.Right,
		});
	}

	return commands;
};

export const run = (runPayload: RunCommandPayload): DuelState => {
	const { from, target } = runPayload.command;
	const [fromPlace] = from;
	const [targetPlace] = target;

	if (fromPlace === DuelPlace.Ground) {
		return destroyMove(runPayload);
	} else if (targetPlace == DuelPlace.Ground) {
		return summonMove(runPayload);
	}

	return move(runPayload);
};

export const moveCommand = {
	create,
	run,
};

export default moveCommand;
