import { DuelPlace, DuelState, getPlayerOrder } from '@cocrafts/card';

import { CommandRunner } from '../../../types';
import { cloneDuelSource } from '../../util';

export const relocateMove: CommandRunner = ({ snapshot, command }) => {
	const { player } = snapshot;
	const { from, target } = command;
	const groundClone = cloneDuelSource(snapshot, DuelPlace.Ground);

	if (from.owner === target.owner) {
		const order = getPlayerOrder(player, from.owner);
		const currentGround = groundClone.source[order];
		if (currentGround[target.position]) return {} as DuelState;

		currentGround[target.position] = currentGround[from.position];
		currentGround[from.position] = null;

		return {
			[groundClone.key]: groundClone.source as unknown,
		} as DuelState;
	} else {
		// TODO: handle this case <- borrow/steal Unit from opponent
		return {} as DuelState;
	}
};
