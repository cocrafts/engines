import { DuelPlace, DuelState, RunCommandPayload } from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const move = ({ command, snapshot }: RunCommandPayload): DuelState => {
	const { player, cardMap } = snapshot;
	const { owner, from, target } = command;
	const order = getPlayerOrder(player, owner);
	const [fromPlace, fromId, fromIndex] = from;
	const [targetPlace] = target;
	const targetClone = cloneDuelSource(snapshot, targetPlace);
	const currentTarget = targetClone.source[order];

	if (fromPlace === DuelPlace.Ability) {
		const targetedCard = cardMap[`${fromId}0000`];
		currentTarget.push({ ...targetedCard, base: targetedCard });

		return { [targetClone.key]: targetClone.source as unknown } as DuelState;
	} else {
		const fromClone = cloneDuelSource(snapshot, fromPlace);
		const currentFrom = fromClone.source[order];
		const selectedCard = currentFrom[fromIndex];

		currentTarget.push(selectedCard);
		currentFrom.splice(fromIndex, 1);

		return {
			[fromClone.key]: fromClone.source as unknown,
			[targetClone.key]: targetClone.source as unknown,
		} as DuelState;
	}
};
