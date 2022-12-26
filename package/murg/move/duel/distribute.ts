import { createCommand } from '../../command';
import {
	createAndMergeBundle,
	createBundle,
	runAndMergeBundle,
} from '../../utils/state';
import { DuelPhases, DuelState, MaybeMoveResult } from '../../utils/type';

export const distributeInitialCards = (duel: DuelState): MaybeMoveResult => {
	if (duel.turn > 0) return undefined;

	const { firstPlayer, secondPlayer } = duel;
	const firstDrawBundle = createAndMergeBundle(
		duel,
		DuelPhases.Draw,
		createCommand.cardDraw({
			duel,
			owner: firstPlayer.id,
			amount: duel.setting.initialCardCount,
		}),
	);

	const secondDrawBundle = createAndMergeBundle(
		duel,
		DuelPhases.Draw,
		createCommand.cardDraw({
			duel,
			owner: secondPlayer.id,
			amount: duel.setting.initialCardCount,
		}),
	);

	const cleanUpBundle = createAndMergeBundle(
		duel,
		DuelPhases.CleanUp,
		createCommand.duelMutate({ payload: { turn: 1 } }),
	);

	return {
		duel,
		commandBundles: [firstDrawBundle, secondDrawBundle, cleanUpBundle],
	};
};
