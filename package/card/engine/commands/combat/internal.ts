import { getPlayerOrder } from '@cocrafts/card';

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
		moveCommand
			.create({
				owner: firstPlayer.id,
				snapshot,
				from: firstCI,
				target: [DuelPlace.Grave],
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
		moveCommand
			.create({
				owner: secondPlayer.id,
				snapshot,
				from: secondCI,
				target: [DuelPlace.Grave],
			})
			.forEach(registerCommand);
	}

	return commands;
};

export const attack = (
	{ snapshot }: CreateCommandPayload,
	from: CardIdentifier,
): DuelCommand[] => {
	const commands: DuelCommand[] = [];
	const registerCommand = (i: DuelCommand) => commands.push(i);
	const [, fromId, fromPos, fromPlayer] = from;
	const { player, ground } = snapshot;
	const order = getPlayerOrder(player, fromPlayer);
	const opponentOrder = order === 0 ? 1 : 0;
	const opponent = player[opponentOrder];
	const currentGround = ground[order];
	const currentUnit = currentGround[fromPos];
	if (currentUnit?.id !== fromId) return [];

	mutateCommand
		.create({
			owner: fromPlayer,
			snapshot,
			from,
			target: [DuelPlace.Player, null, null, opponent.id],
			payload: { health: -currentUnit.attack },
		})
		.forEach(registerCommand);

	return commands;
};
