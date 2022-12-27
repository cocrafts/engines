import { createCommandBundle } from '../utils/state';
import { DuelState, MoveResult } from '../utils/type';

export const fight = (duel: DuelState): MoveResult => {
	const fightBundle = createCommandBundle(duel);

	return {
		duel,
		commandBundles: [fightBundle],
	};
};
