import { SkillIds, SkillRunner } from '../utils/type';

import { runMutate } from './mutate';
import { runUnitStealer } from './steal';

export const skillMap: Record<SkillIds, SkillRunner> = {
	UnitStealer: runUnitStealer,
	Mutate: runMutate,
};

export default skillMap;
