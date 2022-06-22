import {
	CommandType,
	CreateCommandPayload,
	DuelCommand,
	DuelPlace,
	DuelState,
	RunCommandPayload,
} from '../../../types';

import { mutateCard } from './card';
import { mutatePlayer } from './player';

export const create = ({
	owner,
	from,
	target,
	payload,
}: CreateCommandPayload): DuelCommand[] => {
	const commands: DuelCommand[] = [];

	commands.push({
		owner: owner,
		type: CommandType.Mutate,
		from,
		target,
		payload,
	});

	return commands;
};

export const run = (runPayload: RunCommandPayload): DuelState => {
	const { target } = runPayload.command;

	if (target.place === DuelPlace.Player) {
		return mutatePlayer(runPayload);
	} else {
		return mutateCard(runPayload);
	}
};

export const mutateCommand = {
	create,
	run,
};

export default mutateCommand;
