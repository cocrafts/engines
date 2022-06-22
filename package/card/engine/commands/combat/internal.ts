import {
	CreateCommandPayload,
	DuelCommand,
	DuelIdentifier,
	DuelPlace,
} from '../../../types';
import { getPlayerOrder } from '../../util';
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
	const firstCI: DuelIdentifier = {
		id: firstCard.id,
		position,
		place: DuelPlace.Ground,
	};
	const secondCI: DuelIdentifier = {
		id: secondCard.id,
		position,
		place: DuelPlace.Ground,
	};

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
				target: { place: DuelPlace.Grave },
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
				target: { place: DuelPlace.Grave },
			})
			.forEach(registerCommand);
	}

	return commands;
};

export const attack = (
	{ snapshot }: CreateCommandPayload,
	from: DuelIdentifier,
): DuelCommand[] => {
	const commands: DuelCommand[] = [];
	const registerCommand = (i: DuelCommand) => commands.push(i);
	const { player, ground } = snapshot;
	const order = getPlayerOrder(player, from.owner);
	const opponentOrder = order === 0 ? 1 : 0;
	const opponent = player[opponentOrder];
	const currentGround = ground[order];
	const currentUnit = currentGround[from.position];
	if (currentUnit?.id !== from.id) return [];

	mutateCommand
		.create({
			owner: from.owner,
			snapshot,
			from,
			target: { owner: opponent.id, place: DuelPlace.Player },
			payload: { health: -currentUnit.attack },
		})
		.forEach(registerCommand);

	return commands;
};
