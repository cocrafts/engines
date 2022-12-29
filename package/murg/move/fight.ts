import { createCommand, runCommand } from '../command';
import { runFightAt } from '../utils/fight';
import {
	createAndMergeBundle,
	createCommandBundle,
	mergeFragmentToState,
} from '../utils/state';
import { BundleGroup, DuelPhases, DuelState, MoveResult } from '../utils/type';

export const fight = (duel: DuelState): MoveResult => {
	const fightBundle = createCommandBundle(duel, BundleGroup.FightCombat);

	for (let i = 0; i < duel.setting.groundSize; i++) {
		runFightAt(duel, i).forEach((command) => {
			fightBundle.commands.push(command);
			mergeFragmentToState(duel, runCommand({ duel, command }));
		});
	}

	const cleanUpBundle = createAndMergeBundle(
		duel,
		BundleGroup.PhaseUpdate,
		createCommand.duelMutate({ payload: { phase: DuelPhases.PostFight } }),
	);

	return {
		duel,
		commandBundles: [fightBundle, cleanUpBundle],
	};
};
