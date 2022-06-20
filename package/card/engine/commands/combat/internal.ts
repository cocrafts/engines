import {
	CardIdentifier,
	CreateCommandPayload,
	DuelCommand,
	DuelPlace,
} from '../../../types';
import moveCommand from '../move';
import mutateCommand from '../mutate';

export const combat = (
	{ snapshot }: CreateCommandPayload,
	position: number,
): DuelCommand[] => {
	const commands: DuelCommand[] = [];
	const registerCommand = (i: DuelCommand) => commands.push(i);
	const { ground, player } = snapshot;
	const [firstPlayer, secondPlayer] = player;
	const firstCard = ground[0][position];
	const secondCard = ground[1][position];
	const firstHealth = firstCard.health - secondCard.attack;
	const secondHealth = secondCard.health - firstCard.attack;
	const firstCI: CardIdentifier = [DuelPlace.Ground, firstCard.id, position];
	const secondCI: CardIdentifier = [DuelPlace.Ground, secondCard.id, position];

	mutateCommand
		.create({
			owner: firstPlayer.id,
			snapshot,
			from: secondCI,
			target: firstCI,
			payload: { health: -secondCard.attack },
		})
		.forEach(registerCommand);

	if (firstHealth <= 0) {
		const target: CardIdentifier = [DuelPlace.Grave];

		moveCommand
			.create({
				owner: firstPlayer.id,
				snapshot,
				from: firstCI,
				target,
			})
			.forEach(registerCommand);
	}

	mutateCommand
		.create({
			owner: secondPlayer.id,
			snapshot,
			from: firstCI,
			target: secondCI,
			payload: { health: -firstCard.attack },
		})
		.forEach(registerCommand);

	if (secondHealth <= 0) {
		const target: CardIdentifier = [DuelPlace.Grave];

		moveCommand
			.create({
				owner: secondPlayer.id,
				snapshot,
				from: secondCI,
				target,
			})
			.forEach(registerCommand);
	}

	return commands;
};

export const attack = (): DuelCommand[] => {
	return [];
};
