import { createCommand, runCommand } from '../command';
import { getCard, getCardState } from '../utils/card';
import { createCommandResult } from '../utils/helper';
import { createCommandBundle, mergeFragmentToState } from '../utils/state';
import { BundleGroup, DuelState, MoveResult } from '../utils/type';

export const cleanUp = (duel: DuelState): MoveResult => {
	const cleanUpBundle = createCommandBundle(duel, BundleGroup.TurnCleanUp);

	const createAndMergeCardMutate = (cardId: string) => {
		if (!cardId) return;

		const { commands, registerCommand } = createCommandResult();
		const card = getCard(duel.cardMap, cardId);
		const state = getCardState(duel.stateMap, cardId);

		if (card.skill?.charge > 0) {
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
			cleanUpBundle.commands.push(command);
			mergeFragmentToState(duel, runCommand({ duel, command }));
		});
	};

	for (let i = 0; i < duel.setting.groundSize; i++) {
		createAndMergeCardMutate(duel.firstGround[i]);
		createAndMergeCardMutate(duel.secondGround[i]);
	}

	return {
		duel,
		commandBundles: [cleanUpBundle],
	};
};
