import { createCommand, runCommand } from '../../command';
import {
	DuelCommandBundle,
	DuelPhases,
	DuelState,
	MoveResult,
} from '../../utils/type';

export const distributeCards = (state: DuelState, amount = 5): MoveResult => {
	const { firstPlayer, secondPlayer } = state;
	const firstBundle: DuelCommandBundle = {
		turn: state.turn,
		phase: DuelPhases.Draw,
		phaseOf: firstPlayer.id,
		commands: [],
	};
	const secondBundle: DuelCommandBundle = {
		turn: state.turn,
		phase: DuelPhases.Draw,
		phaseOf: secondPlayer.id,
		commands: [],
	};
	let snapshot = { ...state };

	for (let i = 0; i < amount; i += 1) {
		createCommand
			.cardDraw({ state: snapshot, owner: firstPlayer.id })
			.forEach((command) => {
				firstBundle.commands.push(command);

				snapshot = {
					...snapshot,
					...runCommand({ state: snapshot, command }),
				};
			});

		createCommand
			.cardDraw({ state: snapshot, owner: secondPlayer.id })
			.forEach((command) => {
				secondBundle.commands.push(command);

				snapshot = {
					...snapshot,
					...runCommand({ state: snapshot, command }),
				};
			});
	}

	return {
		state: snapshot,
		bundles: [firstBundle, secondBundle],
	};
};
