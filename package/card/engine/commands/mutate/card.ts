import { DuelState, RunCommandPayload } from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const mutateCard = ({
	snapshot,
	command,
}: RunCommandPayload): DuelState => {
	const { player } = snapshot;
	const { owner, target, payload } = command;
	const order = getPlayerOrder(player, owner);

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
