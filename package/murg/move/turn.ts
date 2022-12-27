import { createCommand } from '../command';
import { getNextPlayerId } from '../utils/helper';
import { createCommandBundle, runAndMergeBundle } from '../utils/state';
import { DuelPhases, DuelState, MoveResult } from '../utils/type';

export const endTurn = (duel: DuelState): MoveResult => {
	const endTurnBundle = createCommandBundle(duel);
	const nextPlayerId = getNextPlayerId(duel);

	runAndMergeBundle(
		duel,
		endTurnBundle,
		createCommand.duelMutate({
			payload: {
				phase:
					duel.phaseOf === duel.firstMover
						? DuelPhases.Draw
						: DuelPhases.PostFight,
				phaseOf: nextPlayerId,
			},
		}),
	);

	return {
		duel,
		commandBundles: [endTurnBundle],
	};
};
