import { DuelPlace, DuelState, RunCommandPayload } from '../../../types';
import { addToGround, cloneDuelSource, getPlayerOrder } from '../../util';

export const handleSummon = ({
	snapshot,
	command,
}: RunCommandPayload): DuelState => {
	const { player, cardMap } = snapshot;
	const { owner, from, side } = command;
	const order = getPlayerOrder(player, owner);
	const [fromPlace, fromId, fromIndex] = from;
	const groundClone = cloneDuelSource(snapshot, DuelPlace.Ground);
	const currentGround = groundClone.source[order];

	if (fromPlace === DuelPlace.Ability) {
		const targetedCard = cardMap[`${fromId}0000`];
		const selectedCard = { ...targetedCard, base: targetedCard };

		addToGround(selectedCard, currentGround, side);

		return {
			ground: groundClone.source,
		} as DuelState;
	} else {
		const fromClone = cloneDuelSource(snapshot, fromPlace);
		const currentFrom = fromClone.source[order];
		const selectedCard = currentFrom[fromIndex];

		addToGround(selectedCard, currentGround, side);
		currentFrom.splice(fromIndex, 1);

		return {
			[fromClone.key]: fromClone.source as unknown,
			ground: groundClone.source,
		} as DuelState;
	}
};
