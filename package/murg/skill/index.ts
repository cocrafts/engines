import {
	PassiveIds,
	PassiveRunner,
	SkillIds,
	SkillRunner,
} from '../utils/type';

import { gainAttackByEnemyDefense } from './passive/gainAttackByEnemyDefense';
import { frontMutate, selfMutate } from './mutate';
import { unitStealer } from './steal';

export const skillMap: Record<SkillIds, SkillRunner> = {
	UnitStealer: unitStealer,
	SelfMutate: selfMutate,
	FrontMutate: frontMutate,
};

export const passiveMap: Record<PassiveIds, PassiveRunner> = {
	GainAttackByEnemyDefense: gainAttackByEnemyDefense,
};
