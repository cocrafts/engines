import {
	CommandCreator,
	CommandRunner,
	CommandType,
	DuelPlace,
} from '../../../../types';
import { createCommandResult } from '../../../util';

import { destroyMove } from './destroy';
import { move } from './internal';
import { relocateMove } from './relocate';
import { summonMove } from './summon';

export const create: CommandCreator = ({ owner, from, target, side }) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		owner,
		type: CommandType.CardMove,
		from,
		target,
		side,
	});

	return commands;
};

export const run: CommandRunner = (runPayload) => {
	const { from, target } = runPayload.command;
	const fromGround = from.place === DuelPlace.Ground;
	const toGround = target.place === DuelPlace.Ground;
	const toGrave = target.place === DuelPlace.Grave;

	if (fromGround && toGround) {
		return relocateMove(runPayload);
	} else if (fromGround && toGrave) {
		return destroyMove(runPayload);
	} else if (toGround) {
		return summonMove(runPayload);
	}

	return move(runPayload);
};

export const moveCommand = {
	create,
	run,
};

export default moveCommand;
