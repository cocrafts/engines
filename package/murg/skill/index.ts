import { SkillIds, SkillRunner } from '../utils/type';

import { runFrontMutate, runSelfMutate } from './mutate';
import { runUnitStealer } from './steal';

export const skillMap: Record<SkillIds, SkillRunner> = {
	UnitStealer: runUnitStealer,
	SelfMutate: runSelfMutate,
	FrontMutate: runFrontMutate,
};

export default skillMap;
