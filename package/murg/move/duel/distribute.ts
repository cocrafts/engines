import { createCommand, runCommand } from '../../command';
import { createCommandResult } from '../../utils/helper';
import { DuelState, MoveResult } from '../../utils/type';

export const distributeCards = (state: DuelState, amount = 5): MoveResult => {
	const { firstPlayer, secondPlayer } = state;
	const { commands, registerCommand } = createCommandResult();
	let snapshot = { ...state };

	for (let i = 0; i < amount * 2; i += 1) {
		const owner = i >= amount ? firstPlayer.id : secondPlayer.id;

		createCommand.cardDraw({ state: snapshot, owner }).forEach((command) => {
			registerCommand(command);

			snapshot = {
				...snapshot,
				...runCommand({ state: snapshot, command }),
			};
		});
	}

	return {
		state: snapshot,
		commands,
	};
};
