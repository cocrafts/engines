import { Card, CardState } from './card';
import { UnitAttributes } from './internal';

export enum DuelPlace {
	Deck,
	Hand,
	Ground,
	Grave,
	Ability,
	Player,
}

export interface DuelSetup {
	version?: string;
	firstMover?: string;
	player?: [string, string];
	deck?: [string[], string[]];
}

export type PlayerState = UnitAttributes & {
	id: string;
};

export type PlayerStatePair = [PlayerState, PlayerState];
export type CardStatePair = [CardState[], CardState[]];

export interface DuelSetting {
	handSize: number;
	groundSize: number;
	maxAttachment: number;
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
