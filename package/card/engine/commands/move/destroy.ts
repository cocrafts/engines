import { DuelPlace, DuelState, RunCommandPayload } from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const handleDestroy = ({
	snapshot,
	command,
}: RunCommandPayload): DuelState => {
	const { player } = snapshot;
	const { owner, from } = command;
	const [, fromId, fromIndex] = from;
	const order = getPlayerOrder(player, owner);
	const groundClone = cloneDuelSource(snapshot, DuelPlace.Ground);
	const currentGround = groundClone.source[order];
	const currentInstance = currentGround[fromIndex];
	if (currentInstance?.id !== fromId) return {} as DuelState;

	currentGround[fromIndex] = null;

	return {
		ground: groundClone.source,
	} as DuelState;
};
