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
	player?: [string, string];
	deck?: [string[], string[]];
}

export interface PlayerState {
	id: string;
	health: number;
}

export type DuelState = Omit<DuelSetup, 'deck' | 'player'> & {
	player: [PlayerState, PlayerState];
	deck: [CardState[], CardState[]];
	hand: [CardState[], CardState[]];
	ground: [CardState[], CardState[]];
	grave: [CardState[], CardState[]];
};
