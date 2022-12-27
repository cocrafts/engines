import { SkillIds, SkillRunner } from '../utils/type';

import { runUnitStealer } from './steal';

export const skillMap: Record<SkillIds, SkillRunner> = {
	UnitStealer: runUnitStealer,
};

export default skillMap;
