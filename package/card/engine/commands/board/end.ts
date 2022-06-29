/* happen on end turn -> before new turn started */
import {
	CommandCreator,
	DuelCommand,
	DuelIdentifier,
	DuelPlace,
} from '../../../types';
import cardMutateCommand from '../card/mutate';
import duelMutateCommand from '../duel/mutate';

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

			cardMutateCommand
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

			cardMutateCommand
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

	duelMutateCommand
		.create({ snapshot, payload: { turn: 1 } })
		.forEach(registerCommand);

	return commands;
};

export const endCommand = {
	create,
};

export default endCommand;
