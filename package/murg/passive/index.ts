import { PassiveIds, PassiveRunner } from '../utils/type';

import { gainAttackByEnemyDefense } from './gainAttackByEnemyDefense';
import { ignoreEnemyDefense } from './ignoreEnemyDefense';

export const passiveMap: Record<PassiveIds, PassiveRunner> = {
	GainAttackByEnemyDefense: gainAttackByEnemyDefense,
	IgnoreEnemyDefense: ignoreEnemyDefense,
};
