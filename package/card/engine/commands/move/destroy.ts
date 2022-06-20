import { DuelPlace, DuelState, RunCommandPayload } from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const destroyMove = ({
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

	const graveClone = cloneDuelSource(snapshot, DuelPlace.Grave);
	const currentGrave = graveClone.source[order];

	currentGround[fromIndex] = null;
	currentGrave.push(currentInstance);

	return {
		ground: groundClone.source,
	} as DuelState;
};
