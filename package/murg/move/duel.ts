import { createCommand } from '../command';
import { getNextPlayerId } from '../utils/helper';
import { createBundle, runAndMergeBundle } from '../utils/state';
import { DuelPhases, DuelState, MoveResult } from '../utils/type';

export const endTurn = (duel: DuelState): MoveResult => {
	const endTurnBundle = createBundle(duel);
	const nextPlayerId = getNextPlayerId(duel);

	runAndMergeBundle(
		duel,
		endTurnBundle,
		createCommand.duelMutate({
			payload: {
				phase: DuelPhases.Draw,
				phaseOf: nextPlayerId,
			},
		}),
	);

	return {
		duel,
		commandBundles: [endTurnBundle],
	};
};
