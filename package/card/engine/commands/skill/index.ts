import { CommandCreator, DuelCommand, DuelPlace } from '../../../types';

import { activate } from './internal';

export const create: CommandCreator = (payload) => {
	const commands: DuelCommand[] = [];
	const registerCommand = (i: DuelCommand) => commands.push(i);
	const { snapshot } = payload;
	const { player, ground, setting } = snapshot;
	const [firstPlayer, secondPlayer] = player;
	const [firstGround, secondGround] = ground;

	for (let i = 0; i < setting.groundSize; i += 1) {
		const firstCard = firstGround[i];
		const secondCard = secondGround[i];

		if (firstCard?.cooldown === 1) {
			activate(payload, {
				id: firstCard.id,
				owner: firstPlayer.id,
				place: DuelPlace.Ground,
				position: i,
			}).forEach(registerCommand);
		}

		if (secondCard?.cooldown === 1) {
			activate(payload, {
				id: secondCard.id,
				owner: secondPlayer.id,
				place: DuelPlace.Ground,
				position: i,
			}).forEach(registerCommand);
		}
	}

	return commands;
};

export const skillCommand = {
	create,
};

export default skillCommand;
