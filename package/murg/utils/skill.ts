import { getCardState } from './card';
import { pickUniqueIds } from './helper';
import { CardState, DuelState } from './type';

export const pickGroundUnits = (list: string[], amount = 1) => {
	const filteredList = list.filter((i) => !!i);
	if (amount >= filteredList.length) return filteredList;

	return pickUniqueIds(filteredList, amount);
};

export const pickLowestHealth = (
	duel: DuelState,
	list: string[],
): CardState => {
	return list
		.filter((i) => !!i)
		.map((id) => getCardState(duel.stateMap, id))
		.reduce((prev: CardState, current: CardState) => {
			if (prev.health <= current.health) return prev;
			return current;
		});
};
