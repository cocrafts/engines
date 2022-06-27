import { CommandRunner, DuelState } from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const mutateCard: CommandRunner = ({ snapshot, command }) => {
	const { player } = snapshot;
	const { target, payload } = command;
	const order = getPlayerOrder(player, target.owner);
	const targetClone = cloneDuelSource(snapshot, target.place);
	const currentTarget = targetClone.source[order];
	const targetInstance = currentTarget[target.position];
	if (targetInstance?.id !== target.id) return {} as DuelState;

	Object.keys(payload).forEach((key) => {
		targetInstance[key] = targetInstance[key] + payload[key];
	});

	return {
		[targetClone.key]: targetClone.source as unknown,
	} as DuelState;
};
