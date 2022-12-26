import { createCommand, runCommand } from '../../command';
import { mergeFragmentToState } from '../../utils/helper';
import {
	DuelCommandBundle,
	DuelPhases,
	DuelState,
	MoveResult,
} from '../../utils/type';

export const distributeCards = (state: DuelState, amount = 5): MoveResult => {
	const { firstPlayer, secondPlayer } = state;
	const firstDrawBundle: DuelCommandBundle = {
		turn: state.turn,
		phase: DuelPhases.Draw,
		phaseOf: firstPlayer.id,
		commands: [],
	};
	const secondDrawBundle: DuelCommandBundle = {
		turn: state.turn,
		phase: DuelPhases.Draw,
		phaseOf: secondPlayer.id,
		commands: [],
	};
	const snapshot = { ...state };

	for (let i = 0; i < amount; i += 1) {
		createCommand
			.cardDraw({ duel: snapshot, owner: firstPlayer.id })
			.forEach((command) => {
				firstDrawBundle.commands.push(command);

				mergeFragmentToState(snapshot, runCommand({ duel: snapshot, command }));
			});

		createCommand
			.cardDraw({ duel: snapshot, owner: secondPlayer.id })
			.forEach((command) => {
				secondDrawBundle.commands.push(command);

				mergeFragmentToState(snapshot, runCommand({ duel: snapshot, command }));
			});
	}

	const cleanUpBundle: DuelCommandBundle = {
		turn: state.turn,
		phase: DuelPhases.CleanUp,
		commands: [createCommand.duelMutate({ payload: { turn: 1 } })[0]],
	};

	return {
		state: snapshot,
		bundles: [firstDrawBundle, secondDrawBundle, cleanUpBundle],
	};
};
