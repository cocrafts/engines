import { AbilityConfig } from './ability';
import { HookType } from './hook';
import { UnitAttributes } from './internal';
import { TraitConfig } from './trait';

export enum CardType {
	Troop,
	Hero,
	Spell,
}

export enum SpellTurn {
	Instant,
	Pre,
	Post,
}

export enum CardClass {
	None,
	Tanker,
	Knight,
	Summoner,
	SpellCaster,
	Assassin,
}

export enum CardElemental {
	None,
	Metal,
	Wood,
	Water,
	Fire,
	Earth,
	Dark,
	Light,
}

export enum CardRarity {
	Common,
	Rare,
	Unique,
	Epic,
	Mythical,
	Legendary,
	Immortal,
}

type RarityPowers = [
	common?: number,
	rare?: number,
	unique?: number,
	epic?: number,
	mythical?: number,
	legendary?: number,
	immortal?: number,
];

export interface CardConfig {
	id: string;
	name?: string;
	quote?: string;
	type?: CardType;
	spellTurn?: SpellTurn;
	class?: CardClass;
	rarity?: CardRarity;
	elemental?: CardElemental;
	attack?: RarityPowers;
	defense?: RarityPowers;
	health?: RarityPowers;
	ability?: AbilityConfig;
	attachments?: string[];
	traits?: {
		[HookType.Summon]?: TraitConfig;
		[HookType.Death]?: TraitConfig;
		[HookType.Glory]?: TraitConfig;
		[HookType.Play]?: TraitConfig;
	};
	skill?: Record<string, string | number> & {
		desc?: string;
	};
	cooldown?: RarityPowers;
	visualUri?: string;
}

export type Card = Omit<
	CardConfig,
	'attack' | 'defense' | 'health' | 'cooldown'
> &
	UnitAttributes;

export type CardState = UnitAttributes & {
	id: string;
	base: Card;
};
