import { customAlphabet } from 'nanoid';

import { CardState, DuelState, PlayerState } from './type';

const dictionary =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const nanoId = customAlphabet(dictionary, 9);
export const microId = customAlphabet(dictionary, 16);
export const nanoToken = customAlphabet(dictionary, 16);

export const selectStateSource = (
	state: DuelState,
	owner: string,
	source: 'Player' | 'Deck' | 'Hand' | 'Ground' | 'Grave',
) => {
	if (!owner) return;
	const firstSource = `first${source}`;

	if (state[firstSource].id === owner) {
		return state[firstSource];
	}

	return state[`second${source}`];
};

export const selectPlayer = (state: DuelState, owner: string): PlayerState => {
	return selectStateSource(state, owner, 'Player');
};

export const selectDeck = (state: DuelState, owner: string): CardState[] => {
	return selectStateSource(state, owner, 'Deck');
};

export const selectHand = (state: DuelState, owner: string): CardState[] => {
	return selectStateSource(state, owner, 'Hand');
};

export const selectGround = (state: DuelState, owner: string): CardState[] => {
	return selectStateSource(state, owner, 'Ground');
};

export const selectGrave = (state: DuelState, owner: string): CardState[] => {
	return selectStateSource(state, owner, 'Grave');
};
