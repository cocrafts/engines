import {
	CommandType,
	CreateCommandPayload,
	DuelCommand,
	DuelState,
	RunCommandPayload,
} from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

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

export const run = ({ command, snapshot }: RunCommandPayload): DuelState => {
	const { player } = snapshot;
	const { owner, target, payload } = command;
	const order = getPlayerOrder(player, owner);
	const [targetPlace, targetId, targetIndex] = target;
	const targetClone = cloneDuelSource(snapshot, targetPlace);
	const currentTarget = targetClone.source[order];
	const targetInstance = currentTarget[targetIndex];
	if (targetInstance?.id !== targetId) return {} as DuelState;

	Object.keys(payload).forEach((key) => {
		targetInstance[key] = targetInstance[key] + payload[key];
	});

	return {
		[targetClone.key]: targetClone.source as unknown,
	} as DuelState;
};

export const mutateCommand = {
	create,
	run,
};

export default mutateCommand;
