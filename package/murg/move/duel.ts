import { createCommand, runCommand } from '../command';
import { getCardState } from '../utils/card';
import { createCommandResult } from '../utils/helper';
import {
	createAndMergeBundle,
	createCommandBundle,
	mergeFragmentToState,
} from '../utils/state';
import { BundleGroup, DuelPhases, DuelState, MoveResult } from '../utils/type';

export const turnCleanUp = (duel: DuelState): MoveResult => {
	const unitCleanUpBundle = createCommandBundle(duel, BundleGroup.UnitCleanUp);

	const createAndMergeCardMutate = (cardId: string) => {
		if (!cardId) return;

		const { commands, registerCommand } = createCommandResult();
		const state = getCardState(duel.stateMap, cardId);

		if (state.charge > 0) {
			createCommand
				.cardMutate({
					owner: state.owner,
					target: {
						to: {
							owner: state.owner,
							id: state.id,
							place: state.place,
						},
					},
					payload: { charge: state.charge - 1 },
				})
				.forEach(registerCommand);
		}

		commands.forEach((command) => {
			unitCleanUpBundle.commands.push(command);
			mergeFragmentToState(duel, runCommand({ duel, command }));
		});
	};

	for (let i = 0; i < duel.setting.groundSize; i++) {
		createAndMergeCardMutate(duel.firstGround[i]);
		createAndMergeCardMutate(duel.secondGround[i]);
	}

	const turnCleanUpBundle = createAndMergeBundle(
		duel,
		BundleGroup.TurnCleanUp,
		createCommand.duelMutate({
			payload: {
				turn: duel.turn + 1,
				phase: DuelPhases.Draw,
				phaseOf: duel.firstMover,
			},
		}),
	);

	return {
		duel,
		commandBundles: [unitCleanUpBundle, turnCleanUpBundle],
	};
};
