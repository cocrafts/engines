import { Card, CardState } from './card';

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

export type PlayerStatePair = [PlayerState, PlayerState];
export type CardStatePair = [CardState[], CardState[]];

export interface DuelSetting {
	handSize: number;
	groundSize: number;
}

export type DuelState = Omit<DuelSetup, 'deck' | 'player'> & {
	cardMap: Record<string, Card>;
	setting: DuelSetting;
	player: PlayerStatePair;
	deck: CardStatePair;
	hand: CardStatePair;
	ground: CardStatePair;
	grave: CardStatePair;
};
