import { runCommand } from '../command';
import skillMap from '../skill';

import { getCard } from './card';
import {
	ActivationType,
	BundleGroup,
	DuelCommand,
	DuelCommandBundle,
	DuelPlace,
	DuelState,
	InspireSource,
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
		group,
		phase: duel.phase,
		phaseOf: duel.phaseOf,
		commands: [],
	};

	return runAndMergeBundle(duel, bundle, commands);
};

export const emptyMoveResult: MoveResult = {
	commandBundles: [],
};

export const runAndMergeHooks = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	recentCommands: DuelCommand[],
): DuelCommandBundle => {
	const deathCommands = recentCommands.filter(({ target }) => {
		const fromGround = target?.from?.place === DuelPlace.Ground;
		const toGrave = target?.to?.place === DuelPlace.Grave;

		return fromGround && toGrave;
	});

	const createAndMergeInspireDeath = (cardId: string) => {
		if (!cardId) return;

		const card = getCard(duel.cardMap, cardId);
		const isInspireDeath =
			card?.skill?.activation === ActivationType.Inspire &&
			card?.skill?.inspire === InspireSource.Death;

		if (!isInspireDeath) return;

		const skillFunc = skillMap[card.skill.attribute?.id];

		deathCommands.forEach((command) => {
			const skillCommands = skillFunc?.({ duel, cardId, command });

			skillCommands.forEach((command) => {
				bundle.commands.push(command);
				mergeFragmentToState(duel, runCommand({ duel, command }));
			});

			if (skillCommands.length > 0) {
				runAndMergeHooks(duel, bundle, skillCommands);
			}
		});
	};

	for (let i = 0; i < duel.setting.groundSize; i += 1) {
		createAndMergeInspireDeath(duel.firstGround[i]);
		createAndMergeInspireDeath(duel.secondGround[i]);
	}

	return bundle;
};
