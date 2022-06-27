import { AbilityRunner } from '../../types';

import { run as mutate } from './mutate';

export const run: AbilityRunner = (payload) => {
	switch (payload?.ability?.id) {
		case 'mutate':
			return mutate(payload);
		default:
			return [];
	}
};
