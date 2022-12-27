import { runCommand } from '../command';

import { getCard } from './card';
import {
	Card,
	CardIdentifier,
	CardState,
	DuelCommand,
	DuelCommandBundle,
	DuelPhases,
	DuelState,
	MoveResult,
} from './type';

/* This file is a collection of functions that uses to manage states
 * most of the functions are Impure that mutate params, be careful! */

export const injectCardState = (
	partial: Partial<DuelState>,
	cardMap: Record<string, Card>,
	context: CardIdentifier,
): CardState => {
	const nextUniqueCount = partial.uniqueCardCount + 1;
	const { attribute, skill } = getCard(cardMap, context.id);
	const cardState: CardState = {
		id: `${context.id}#${nextUniqueCount}`,
		owner: context.owner,
		place: context.place,
		attack: attribute.attack,
		health: attribute.health,
		defense: attribute.defense,
	};

	if (skill?.charge) cardState.charge = skill.charge;
	if (!partial.stateMap) partial.stateMap = {};

	partial.uniqueCardCount = nextUniqueCount;
	partial.stateMap[cardState.id] = cardState;

	return cardState;
};

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
	phase?: DuelPhases,
	phaseOf?: string,
): DuelCommandBundle => {
	return {
		turn: duel.turn,
		phase: phase || duel.phase,
		phaseOf: phaseOf || duel.phaseOf,
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
	commands: DuelCommand[],
	options?: Partial<DuelCommandBundle>,
) => {
	const bundle: DuelCommandBundle = {
		turn: duel.turn,
		phase: options?.phase || duel.phase,
		phaseOf: options?.phaseOf || duel.phaseOf,
		commands: [],
	};

	return runAndMergeBundle(duel, bundle, commands);
};

export const emptyMoveResult: MoveResult = {
	commandBundles: [],
};
