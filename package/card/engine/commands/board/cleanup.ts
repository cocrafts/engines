/* happen on end turn -> before new turn started */
import {
	CommandCreator,
	DuelCommand,
	DuelIdentifier,
	DuelPlace,
} from '../../../types';
import mutateCommand from '../mutate';

export const create: CommandCreator = ({ snapshot }): DuelCommand[] => {
	const commands: DuelCommand[] = [];
	const registerCommand = (i: DuelCommand) => commands.push(i);
	const { player, ground } = snapshot;
	const [firstPlayer, secondPlayer] = player;
	const [firstGround, secondGround] = ground;

	for (let i = 0; i < firstGround.length; i += 1) {
		const firstCard = firstGround[i];
		const secondCard = secondGround[i];

		if (firstCard && firstCard.cooldown > 1) {
			const identifier: DuelIdentifier = {
				id: firstCard.id,
				owner: firstPlayer.id,
				place: DuelPlace.Ground,
				position: i,
			};

			mutateCommand
				.create({
					snapshot,
					from: identifier,
					target: identifier,
					payload: {
						cooldown: -1,
					},
				})
				.forEach(registerCommand);
		}

		if (secondCard && secondCard.cooldown > 1) {
			const identifier: DuelIdentifier = {
				id: secondCard.id,
				owner: secondPlayer.id,
				place: DuelPlace.Ground,
				position: i,
			};

			mutateCommand
				.create({
					snapshot,
					from: identifier,
					target: identifier,
					payload: {
						cooldown: -1,
					},
				})
				.forEach(registerCommand);
		}
	}

	return commands;
};

export const cleanupCommand = {
	create,
};

export default cleanupCommand;
