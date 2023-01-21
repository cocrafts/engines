import { createCommand, runCommand } from '../command';
import { getCardState } from '../utils/card';
import { getTraverseIndexes, reinforceArray } from '../utils/ground';
import { createCommandBundle, mergeFragmentToState } from '../utils/state';
import {
	BundleGroup,
	CardState,
	DuelCommandTarget,
	DuelState,
	MoveResult,
} from '../utils/type';

export const reinforce = (duel: DuelState): MoveResult => {
	const reinforceUpBundle = createCommandBundle(duel, BundleGroup.Reinforce);
	const { setting, firstGround, secondGround } = duel;
	const firstReinforced = reinforceArray(firstGround);
	const secondReinforced = reinforceArray(secondGround);

	const registerCardMove = (state: CardState, ground: string[], at: number) => {
		const lastGroundPosition = ground.findIndex((id) => id === state.id);
		if (at === lastGroundPosition) return;

		const target: DuelCommandTarget = {
			from: {
				owner: state.owner,
				id: state.id,
				place: state.place,
			},
			to: {
				owner: state.owner,
				index: at,
				place: state.place,
			},
		};

		createCommand
			.cardMove({ owner: state.owner, target })
			.forEach((command) => {
				reinforceUpBundle.commands.push(command);
				mergeFragmentToState(duel, runCommand({ duel, command }));
			});
	};

	getTraverseIndexes(setting.groundSize).forEach((i) => {
		const firstCardId = firstReinforced[i];
		const secondCardId = secondReinforced[i];

		if (firstCardId) {
			const state = getCardState(duel.stateMap, firstCardId);
			registerCardMove(state, firstGround, i);
		}

		if (secondCardId) {
			const state = getCardState(duel.stateMap, secondCardId);
			registerCardMove(state, secondGround, i);
		}
	});

	return {
		duel,
		commandBundles: [reinforceUpBundle],
	};
};
