import { PassiveIds, PassiveRunner } from '../utils/type';

import { gainAttackByEnemyDefense } from './gainAttackByEnemyDefense';
import { gainAttackByEnemyMissingHealth } from './gainAttackByEnemyMissingHealth';
import { gainAttackByRemainingHealth } from './gainAttackByRemainingHealth';
import { ignoreEnemyDefense } from './ignoreEnemyDefense';

export const passiveMap: Record<PassiveIds, PassiveRunner> = {
	GainAttackByEnemyDefense: gainAttackByEnemyDefense,
	IgnoreEnemyDefense: ignoreEnemyDefense,
	GainAttackByEnemyMissingHealth: gainAttackByEnemyMissingHealth,
	GainAttackByRemainingHealth: gainAttackByRemainingHealth,
};
