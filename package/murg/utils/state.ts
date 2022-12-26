import { runCommand } from '../command';

import { DuelCommand, DuelCommandBundle, DuelPhases, DuelState } from './type';

export const mergeFragmentToState = (
	state: DuelState,
	fragment: Partial<DuelState>,
): void => {
	[
		'uniqueCardCount',
		'turn',
		'phase',
		'phaseOf',
		'firstMover',
		'firstPlayer',
		'secondPlayer',
		'firstDeck',
		'secondDeck',
		'firstHand',
		'secondHand',
		'firstGround',
		'secondGround',
		'firstGrave',
		'secondGrave',
	].forEach((key) => {
		state[key] = fragment[key] || state[key];
	});

	Object.keys(fragment.stateMap || {}).forEach((id) => {
		state.stateMap[id] = fragment.stateMap[id];
	});
};

export const runAndMergeBundle = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	commands: DuelCommand[],
) => {
	commands.forEach((command) => {
		bundle.commands.push(command);
		mergeFragmentToState(duel, runCommand({ duel, command }));
	});

	return bundle;
};

export const createAndMergeBundle = (
	duel: DuelState,
	phase: DuelPhases,
	commands: DuelCommand[],
) => {
	const bundle: DuelCommandBundle = {
		turn: duel.turn,
		phase,
		commands: [],
	};

	return runAndMergeBundle(duel, bundle, commands);
};
