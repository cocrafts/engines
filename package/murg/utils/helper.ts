import { customAlphabet } from 'nanoid';

import { CardState, DuelPlace, DuelState, PlayerState } from './type';

const dictionary =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const nanoId = customAlphabet(dictionary, 9);
export const microId = customAlphabet(dictionary, 16);
export const nanoToken = customAlphabet(dictionary, 16);

export const selectState = (
	state: DuelState,
	owner: string,
	source: DuelPlace,
) => {
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

export const selectPlayer = (state: DuelState, owner: string): PlayerState => {
	return selectState(state, owner, DuelPlace.Player);
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
