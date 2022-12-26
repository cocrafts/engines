import { createCommand } from '../../command';
import { createAndMergeBundle, runAndMergeBundle } from '../../utils/state';
import {
	DuelCommandBundle,
	DuelPhases,
	DuelState,
	MoveResult,
} from '../../utils/type';

export const distributeInitialCards = (duel: DuelState): MoveResult => {
	const { firstPlayer, secondPlayer } = duel;
	const firstDrawBundle: DuelCommandBundle = {
		turn: duel.turn,
		phase: DuelPhases.Draw,
		phaseOf: firstPlayer.id,
		commands: [],
	};
	const secondDrawBundle: DuelCommandBundle = {
		turn: duel.turn,
		phase: DuelPhases.Draw,
		phaseOf: secondPlayer.id,
		commands: [],
	};

	for (let i = 0; i < duel.setting.initialCardCount; i += 1) {
		runAndMergeBundle(
			duel,
			firstDrawBundle,
			createCommand.cardDraw({ duel, owner: firstPlayer.id }),
		);

		runAndMergeBundle(
			duel,
			secondDrawBundle,
			createCommand.cardDraw({ duel, owner: secondPlayer.id }),
		);
	}

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
