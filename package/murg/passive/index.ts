import { PassiveIds, PassiveRunner } from '../utils/type';

import { gainAttackByEnemyDefense } from './gainAttackByEnemyDefense';

export const passiveMap: Record<PassiveIds, PassiveRunner> = {
	GainAttackByEnemyDefense: gainAttackByEnemyDefense,
};
