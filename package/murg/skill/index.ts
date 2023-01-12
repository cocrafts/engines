import { SkillIds, SkillRunner } from '../utils/type';

import { damageMultiplier } from './damageMultiplier';
import { destroyFacingMinHealth } from './destroyFacingMinHealth';
import { frontMutate } from './frontMutate';
import { lowestHealthMutate } from './lowestHealthMutate';
import { playerMutate } from './playerMutate';
import { randomEnemyMutate } from './randomEnemyMutate';
import { selfMutate } from './selfMutate';
import { unitStealer } from './unitStealer';

export const skillMap: Record<SkillIds, SkillRunner> = {
	UnitStealer: unitStealer,
	SelfMutate: selfMutate,
	FrontMutate: frontMutate,
	DestroyFacingMinHealth: destroyFacingMinHealth,
	RandomEnemyMutate: randomEnemyMutate,
	LowestHealthMutate: lowestHealthMutate,
	PlayerMutate: playerMutate,
	DamageMultiplier: damageMultiplier,
};
