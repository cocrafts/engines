import { CommandCreator, DuelCommand, DuelPlace } from '../../../types';
import moveCommand from '../../commands/move';
import { reinforceArray } from '../../util';

export const create: CommandCreator = ({ snapshot }) => {
	const commands: DuelCommand[] = [];
	const registerCommand = (i: DuelCommand) => commands.push(i);
	const { player, ground } = snapshot;
	const [firstPlayer, secondPlayer] = player;
	const [firstGround, secondGround] = ground;
	const firstReinforce = reinforceArray(firstGround);
	const secondReinforce = reinforceArray(secondGround);

	for (let i = 0; i < firstReinforce.length; i += 1) {
		const firstCard = firstReinforce[i];
		const secondCard = secondReinforce[i];

		if (firstCard) {
			const lastPos = firstGround.findIndex((o) => o?.id === firstCard.id);

			if (lastPos !== i) {
				moveCommand
					.create({
						snapshot,
						from: {
							id: firstCard.id,
							owner: firstPlayer.id,
							place: DuelPlace.Ground,
							position: lastPos,
						},
						target: {
							id: firstCard.id,
							owner: firstPlayer.id,
							place: DuelPlace.Ground,
							position: i,
						},
					})
					.forEach(registerCommand);
			}
		}

		if (secondCard) {
			const lastPos = secondGround.findIndex((o) => o?.id === secondCard.id);

			if (lastPos !== i) {
				moveCommand
					.create({
						snapshot,
						from: {
							id: secondCard.id,
							owner: secondPlayer.id,
							place: DuelPlace.Ground,
							position: lastPos,
						},
						target: {
							id: secondCard.id,
							owner: secondPlayer.id,
							place: DuelPlace.Ground,
							position: i,
						},
					})
					.forEach(registerCommand);
			}
		}
	}

	return commands;
};

export const reinforceCommand = {
	create,
};

export default reinforceCommand;
