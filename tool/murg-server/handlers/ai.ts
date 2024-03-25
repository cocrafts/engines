import { DuelCommandBundle } from '@metacraft/murg-engine';
import { getInitialState } from 'package/murg/dist/duel';

import { CommandHandler } from '../util/type';

import { fetchDuel } from './internal';

export const isHumanTurnEnded = (incomingBundles: DuelCommandBundle[]) => {
	const firstBundle = incomingBundles[0];
	return firstBundle?.group === 'EndTurn' && firstBundle?.phaseOf === 'A';
};

export const injectBotMove: CommandHandler<DuelCommandBundle[]> = async (
	{ duelId, send },
	incomingBundles,
) => {
	const duelRecord = fetchDuel(duelId);
	const { config, history } = duelRecord;
	const level = history.length;
	const duel = getInitialState(config);
	runBundles(duel, history);
};
