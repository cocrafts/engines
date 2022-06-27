import { CommandCreator, DuelIdentifier } from './command';
import { DuelState } from './duel';
import { AbilityAttributes } from './internal';

export enum AbilityType {
	Skill,
	Spell,
	Attachment,
	Trait,
}

export enum AbilityTargeting {
	Player,
	Selected,
	Self,
	Front,
	Allies,
	LeftAlly,
	LeftAllies,
	RightAlly,
	RightAllies,
	LowestHealth,
	HighestHealth,
}

export interface AbilityConfig {
	id: string;
	type: AbilityType;
	attributes: AbilityAttributes;
	targeting?: AbilityTargeting;
	instruction?: string;
	iconUri?: string;
}

export interface AbilityRunnerPayload {
	snapshot: DuelState;
	ability: AbilityConfig;
	from?: DuelIdentifier;
	target?: DuelIdentifier;
}

export type AbilityRunner = CommandCreator<AbilityRunnerPayload>;
