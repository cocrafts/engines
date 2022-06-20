import { DuelState, RunCommandPayload } from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const mutateCard = ({
	snapshot,
	command,
}: RunCommandPayload): DuelState => {
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
