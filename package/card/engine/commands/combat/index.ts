import { CreateCommandPayload, DuelCommand } from '../../../types';

export const create = ({ snapshot }: CreateCommandPayload): DuelCommand[] => {
	const { ground, setting } = snapshot;
	const [firstGround, secondGround] = ground;

	for (let i = 0; i < setting.groundSize; i += 1) {
		const firstCard = firstGround[i];
		const secondCard = secondGround[i];

		if (!!firstCard && !!secondCard) {
			console.log('COMBAT');
		} else if (!!firstCard || !!secondCard) {
			console.log('ATTACK');
		}
	}
};

export const combatCommand = {
	create,
};

export default combatCommand;
