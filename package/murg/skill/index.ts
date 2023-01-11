import { SkillIds, SkillRunner } from '../utils/type';

import {
	destroyFacingMinHealth,
	frontMutate,
	lowestHealthAllyMutate,
	randomEnemyMutate,
	selfMutate,
} from './mutate';
import { unitStealer } from './steal';

export const skillMap: Record<SkillIds, SkillRunner> = {
	UnitStealer: unitStealer,
	SelfMutate: selfMutate,
	FrontMutate: frontMutate,
	DestroyFacingMinHealth: destroyFacingMinHealth,
	RandomEnemyMutate: randomEnemyMutate,
	LowestHealthAllyMutate: lowestHealthAllyMutate,
};
