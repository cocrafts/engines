import {
	CommandRunner,
	DuelPlace,
	DuelState,
	PlayerStatePair,
} from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const mutatePlayer: CommandRunner = ({ snapshot, command }) => {
	const { player } = snapshot;
	const { payload, target } = command;
	const order = getPlayerOrder(player, target.owner);
	const playerClone = cloneDuelSource<PlayerStatePair>(
		snapshot,
		DuelPlace.Player,
	);
	const currentPlayer = playerClone.source[order];

	Object.keys(payload).forEach((key) => {
		currentPlayer[key] = currentPlayer[key] + payload[key];
	});

	return {
		[playerClone.key]: playerClone.source as unknown,
	} as DuelState;
};
