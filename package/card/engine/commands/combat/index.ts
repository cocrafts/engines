import { CreateCommandPayload, DuelCommand, DuelPlace } from '../../../types';

import { attack, combat } from './internal';

export const create = (payload: CreateCommandPayload): DuelCommand[] => {
	const commands: DuelCommand[] = [];
	const registerCommand = (i: DuelCommand) => commands.push(i);
	const { snapshot } = payload;
	const { player, ground, setting } = snapshot;
	const [firstPlayer, secondPlayer] = player;
	const [firstGround, secondGround] = ground;

	for (let i = 0; i < setting.groundSize; i += 1) {
		const firstCard = firstGround[i];
		const secondCard = secondGround[i];

		if (firstCard && secondCard) {
			combat(payload, i).forEach(registerCommand);
		} else if (firstCard) {
			attack(payload, [
				DuelPlace.Ground,
				firstCard.id,
				i,
				firstPlayer.id,
			]).forEach(registerCommand);
		} else if (secondCard) {
			attack(payload, [
				DuelPlace.Ground,
				secondCard.id,
				i,
				secondPlayer.id,
			]).forEach(registerCommand);
		}
	}

	return commands;
};

export const combatCommand = {
	create,
};

export default combatCommand;
