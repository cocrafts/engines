import { DuelPlace, DuelState, RunCommandPayload } from '../../../types';
import { addToGround, cloneDuelSource, getPlayerOrder } from '../../util';

export const summonMove = ({
	snapshot,
	command,
}: RunCommandPayload): DuelState => {
	const { player } = snapshot;
	const { creator, from, side } = command;
	const order = getPlayerOrder(player, creator);
	const [fromPlace, fromIndex] = from;
	const groundClone = cloneDuelSource(snapshot, DuelPlace.Ground);
	const currentGround = groundClone.source[order];

	if (fromPlace === DuelPlace.Ability) {
		return {} as DuelState;
	} else {
		const fromClone = cloneDuelSource(snapshot, fromPlace);
		const currentFrom = fromClone.source[order];
		const selectedCard = currentFrom[fromIndex];

		addToGround(selectedCard, currentGround, side);
	}

	return {} as DuelState;
};
