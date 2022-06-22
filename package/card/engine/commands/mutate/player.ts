import {
	DuelPlace,
	DuelState,
	PlayerStatePair,
	RunCommandPayload,
} from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const mutatePlayer = ({
	snapshot,
	command,
}: RunCommandPayload): DuelState => {
	const { player } = snapshot;
	const { payload, target } = command;
	const [, , , targetPlayer] = target;
	const order = getPlayerOrder(player, targetPlayer);
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
