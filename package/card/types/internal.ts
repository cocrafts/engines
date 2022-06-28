export interface UnitAttributes {
	attack?: number;
	defense?: number;
	health?: number;
	cooldown?: number;
}

export type AbilityAttributes = Record<string, number>;

export enum HookType {
	TurnBegin,
	TurnEnd,
	SkillActivated,
	SpellActivated,
	Death,
	AllyDeath,
	EnemyDeath,
	Summon,
	AllySummon,
	EnemySummon,
}
