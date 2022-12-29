import { runCommand } from '../command';

import {
	BundleGroup,
	DuelCommand,
	DuelCommandBundle,
	DuelState,
	MoveResult,
} from './type';

/* This file is a collection of functions that uses to manage states
 * most of the functions are Impure that mutate params, be careful! */

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

export const createCommandBundle = (
	duel: DuelState,
	group: BundleGroup,
): DuelCommandBundle => {
	return {
		turn: duel.turn,
		group,
		phase: duel.phase,
		phaseOf: duel.phaseOf,
		commands: [],
	};
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
	group: BundleGroup,
	commands: DuelCommand[],
) => {
	const bundle: DuelCommandBundle = {
		turn: duel.turn,
		phase: duel.phase,
		phaseOf: duel.phaseOf,
		commands: [],
	};

	return runAndMergeBundle(duel, bundle, commands);
};

export const emptyMoveResult: MoveResult = {
	commandBundles: [],
};
