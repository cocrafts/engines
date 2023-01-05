import { SkillIds, SkillRunner } from '../utils/type';

import { runSelfMutate } from './mutate';
import { runUnitStealer } from './steal';

export const skillMap: Record<SkillIds, SkillRunner> = {
	UnitStealer: runUnitStealer,
	SelfMutate: runSelfMutate,
};

export default skillMap;
