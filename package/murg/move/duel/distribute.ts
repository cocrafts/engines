import { createCommand } from '../../command';
import { createAndMergeBundle } from '../../utils/state';
import { DuelPhases, DuelState, MaybeMoveResult } from '../../utils/type';

export const distributeInitialCards = (duel: DuelState): MaybeMoveResult => {
	if (duel.turn > 0) return undefined;

	const { firstPlayer, secondPlayer } = duel;
	const firstDrawBundle = createAndMergeBundle(
		duel,
		createCommand.cardDraw({
			duel,
			owner: firstPlayer.id,
			amount: duel.setting.initialCardCount,
		}),
	);

	const secondDrawBundle = createAndMergeBundle(
		duel,
		createCommand.cardDraw({
			duel,
			owner: secondPlayer.id,
			amount: duel.setting.initialCardCount,
		}),
	);

	const cleanUpBundle = createAndMergeBundle(
		duel,
		createCommand.duelMutate({ payload: { turn: 1 } }),
	);

	return {
		duel,
		commandBundles: [firstDrawBundle, secondDrawBundle, cleanUpBundle],
	};
};

export const distributeTurnCards = (duel: DuelState): MaybeMoveResult => {
	if (duel.phase !== DuelPhases.Draw) return undefined;

	const { firstPlayer, secondPlayer } = duel;

	const firstDrawBundle = createAndMergeBundle(
		duel,
		createCommand.cardDraw({
			duel,
			owner: firstPlayer.id,
			amount: firstPlayer.perTurnDraw,
		}),
		{ phaseOf: firstPlayer.id },
	);

	const secondDrawBundle = createAndMergeBundle(
		duel,
		createCommand.cardDraw({
			duel,
			owner: secondPlayer.id,
			amount: secondPlayer.perTurnDraw,
		}),
		{ phaseOf: secondPlayer.id },
	);

	return {
		duel,
		commandBundles: [firstDrawBundle, secondDrawBundle],
	};
};
