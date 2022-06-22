import {
	CommandCreator,
	CommandRunner,
	CommandType,
	DuelCommand,
	DuelPlace,
	SummonSide,
} from '../../../types';
import { getPlayerOrder } from '../../util';

import { destroyMove } from './destroy';
import { move } from './internal';
import { summonMove } from './summon';

export const create: CommandCreator = ({
	owner,
	snapshot,
	from,
	target,
	side,
}) => {
	const commands: DuelCommand[] = [];
	const { player, hand } = snapshot;
	const order = getPlayerOrder(player, owner);

	commands.push({
		owner,
		type: CommandType.Move,
		from,
		target,
		side,
	});

	if (target.place === DuelPlace.Ground) {
		/* <- Simulate ability */
		commands.push({
			owner,
			type: CommandType.Move,
			from: {
				id: '0002',
				place: DuelPlace.Ability,
			},
			target: {
				position: hand[order].length + 1,
				place: DuelPlace.Ground,
			},
			side: SummonSide.Right,
		});
	}

	return commands;
};

export const run: CommandRunner = (runPayload) => {
	const { from, target } = runPayload.command;

	if (from.place === DuelPlace.Ground) {
		return destroyMove(runPayload);
	} else if (target.place == DuelPlace.Ground) {
		return summonMove(runPayload);
	}

	return move(runPayload);
};

export const moveCommand = {
	create,
	run,
};

export default moveCommand;
