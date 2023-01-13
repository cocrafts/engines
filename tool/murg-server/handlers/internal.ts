import { makeDuel, makeMeta, move, PlayerConfig } from '@metacraft/murg-engine';

import { generateRandomDeck } from '../util/deck';
import { DuelRecord } from '../util/type';

const duelCache: Record<string, DuelRecord> = {};

export const fetchDuel = (id: string, version = '00001'): DuelRecord => {
	if (!duelCache[id]) {
		const meta = makeMeta(version);
		const firstPlayer: PlayerConfig = {
			id: 'A',
			deck: generateRandomDeck(meta),
		};
		const secondPlayer: PlayerConfig = {
			id: 'B',
			deck: generateRandomDeck(meta),
		};
		const { config, state } = makeDuel([firstPlayer, secondPlayer], version);
		const { duel, commandBundles } = move.distributeInitialCards(state);

		move.distributeTurnCards(duel).commandBundles.forEach((bundle) => {
			commandBundles.push(bundle);
		});

		duelCache[id] = { config, history: commandBundles };
	}

	return duelCache[id];
};
