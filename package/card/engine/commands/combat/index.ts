import { CreateCommandPayload, DuelCommand } from '../../../types';

import { attack, combat } from './internal';

export const create = (payload: CreateCommandPayload): DuelCommand[] => {
	const { snapshot } = payload;
	const { ground, setting } = snapshot;
	const [firstGround, secondGround] = ground;

	for (let i = 0; i < setting.groundSize; i += 1) {
		const firstCard = firstGround[i];
		const secondCard = secondGround[i];

		if (!!firstCard && !!secondCard) {
			return combat(payload, i);
		} else if (!!firstCard || !!secondCard) {
			return attack(payload, i);
		}
	}
};

export const combatCommand = {
	create,
};

export default combatCommand;
