import { customAlphabet } from 'nanoid';

import {
	CardState,
	DuelCommand,
	DuelPlace,
	DuelState,
	PlayerState,
} from './type';

const dictionary =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const nanoId = customAlphabet(dictionary, 9);
export const microId = customAlphabet(dictionary, 16);
export const nanoToken = customAlphabet(dictionary, 16);

export interface CommandResult {
	commands: DuelCommand[];
	registerCommand: (command: DuelCommand) => void;
}

export const createCommandResult = (
	defaults: DuelCommand[] = [],
): CommandResult => {
	return {
		commands: defaults,
		registerCommand: (i) => defaults.push(i),
	};
};

export const selectPlayer = (state: DuelState, owner: string): PlayerState => {
	if (!owner) return;
	if (state.firstPlayer.id === owner) {
		return state.firstPlayer;
	}

	return state.secondPlayer;
};

export interface PlayerClone {
	key: string;
	state: PlayerState;
}

export const clonePlayer = (state: DuelState, owner: string): PlayerClone => {
	const isFirst = state.firstPlayer.id === owner;
	const player = selectPlayer(state, owner);

	return {
		key: isFirst ? 'firstPlayer' : 'secondPlayer',
		state: { ...player },
	};
};

export const selectState = (
	state: DuelState,
	owner: string,
	source: DuelPlace,
): CardState[] => {
	if (!owner) return;
	const firstSource = `first${source}`;

	if (state.firstPlayer.id === owner) {
		return state[firstSource];
	}

	return state[`second${source}`];
};

export interface StateClone {
	key: string;
	state: CardState[];
}

export const cloneState = (
	state: DuelState,
	owner: string,
	source: DuelPlace,
): StateClone => {
	const isFirst = state.firstPlayer.id === owner;
	const firstSource = `first${source}`;
	const secondSource = `second${source}`;
	const selectedState = selectState(state, owner, source) as CardState[];

	return {
		key: isFirst ? firstSource : secondSource,
		state: [...selectedState],
	};
};

export const selectDeck = (state: DuelState, owner: string): CardState[] => {
	return selectState(state, owner, DuelPlace.Deck);
};

export const selectHand = (state: DuelState, owner: string): CardState[] => {
	return selectState(state, owner, DuelPlace.Hand);
};

export const selectGround = (state: DuelState, owner: string): CardState[] => {
	return selectState(state, owner, DuelPlace.Ground);
};

export const selectGrave = (state: DuelState, owner: string): CardState[] => {
	return selectState(state, owner, DuelPlace.Grave);
};
