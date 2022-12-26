import {
	CardType,
	DuelState,
	makeDuel,
	makeMeta,
	PlayerState,
} from '@metacraft/murg-engine';
import { proxy } from 'valtio';

export const generateRandomDeck = (version = '00001', size = 36): string[] => {
	let count = 0;
	const results: string[] = [];
	const { map, entities } = makeMeta(version);

	while (count < size) {
		const randomIndex = Math.floor(Math.random() * entities.length);
		const randomId = entities[randomIndex];
		const sku = randomId.substring(0, 5);
		const existedCard = results.find((id) => id.startsWith(sku));
		const card = map[randomId];

		if (!existedCard && card.kind !== CardType.Troop) {
			results.push(randomId);
			count++;
		}

		entities.splice(randomIndex, 1);
	}

	return results;
};

export const generateDuel = () => {
	return makeDuel([
		{
			id: 'A',
			deck: generateRandomDeck(),
		},
		{
			id: 'B',
			deck: generateRandomDeck(),
		},
	]);
};

export const selectColor = (
	players: [PlayerState, PlayerState],
	colors: [string, string],
	owner: string,
) => {
	return colors[players[0].id === owner ? 0 : 1];
};

import { initialState, replay } from './match/first';

export const duel = proxy<DuelState>(initialState);

export const replayGame = replay;
