import { CardState } from './card';

export enum DuelPlace {
	Deck,
	Hand,
	Ground,
	Grave,
	Ability,
}

export interface DuelSetup {
	version?: string;
	firstMover?: string;
	players?: [string, string];
	deck?: [string[], string[]];
}

export type DuelState = Omit<DuelSetup, 'deck'> & {
	deck: [CardState[], CardState[]];
	hand: [CardState[], CardState[]];
	ground: [CardState[], CardState[]];
	grave: [CardState[], CardState[]];
};
