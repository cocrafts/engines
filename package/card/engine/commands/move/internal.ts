import { CommandRunner, DuelPlace, DuelState } from '../../../types';
import { cloneDuelSource, getPlayerOrder } from '../../util';

export const move: CommandRunner = ({ command, snapshot }) => {
	const { player, cardMap } = snapshot;
	const { owner, from, target } = command;
	const order = getPlayerOrder(player, owner);
	const targetClone = cloneDuelSource(snapshot, target.place);
	const currentTarget = targetClone.source[order];

	if (from.place === DuelPlace.Ability) {
		const targetedCard = cardMap[`${from.id}0000`];
		currentTarget.push({ ...targetedCard, base: targetedCard });

		return { [targetClone.key]: targetClone.source as unknown } as DuelState;
	} else {
		const fromClone = cloneDuelSource(snapshot, from.place);
		const currentFrom = fromClone.source[order];
		const selectedCard = currentFrom[from.position];

		currentTarget.push(selectedCard);
		currentFrom.splice(from.position, 1);

		return {
			[fromClone.key]: fromClone.source as unknown,
			[targetClone.key]: targetClone.source as unknown,
		} as DuelState;
	}
};
