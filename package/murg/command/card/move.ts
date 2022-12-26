import { getCard } from '../../utils/card';
import {
	cloneState,
	createCommandResult,
	createDuelFragment,
	selectPlayer,
} from '../../utils/helper';
import { injectCardState } from '../../utils/state';
import {
	CardType,
	CommandRunner,
	DuelCommand,
	DuelCommandType,
	DuelPlace,
	StatefulCommand,
} from '../../utils/type';
import playerMutate from '../player/mutate';

export const create: StatefulCommand<'owner' | 'target'> = ({
	duel,
	owner,
	target,
}) => {
	const { commands, registerCommand } = createCommandResult();
	const { cardMap } = duel;
	const player = selectPlayer(duel, owner);
	const card = getCard(cardMap, target.from.id);
	const fromPlayer = target.from.place === DuelPlace.Player;
	const fromHand = target.from.place === DuelPlace.Hand;
	const toGround = target.to.place === DuelPlace.Ground;
	const fromHeroCard = card.kind === CardType.Hero;
	const fromTroopCard = card.kind === CardType.Troop;
	const isHeroSummon = owner && fromHand && toGround && fromHeroCard;
	const isTroopSummon = owner && fromPlayer && toGround && fromTroopCard;
	const moveCommand: DuelCommand = {
		owner,
		type: DuelCommandType.CardMove,
		target,
	};

	if (isHeroSummon) {
		if (player.perTurnDraw > 0) {
			registerCommand(moveCommand);
			playerMutate
				.create({
					duel,
					target: { to: { owner, place: DuelPlace.Player } },
					payload: { perTurnDraw: -1 },
				})
				.forEach(registerCommand);
		}
	} else if (isTroopSummon) {
		if (player.perTurnTroop > 0) {
			registerCommand(moveCommand);
			playerMutate
				.create({
					duel,
					target: { to: { owner, place: DuelPlace.Player } },
					payload: { perTurnTroop: -1 },
				})
				.forEach(registerCommand);
		}
	} else {
		registerCommand(moveCommand);
	}

	return commands;
};

const generatedPlaces = [DuelPlace.Player, DuelPlace.Ability];
export const run: CommandRunner = ({ duel, command: { target } }) => {
	const fragment = createDuelFragment(duel);
	const toCardFilter = (id: string) => id === target.to.id;
	const fromCardFilter = (id: string) => id === target.from.id;
	const fromAir = generatedPlaces.indexOf(target.from.place) >= 0;
	const fromGround = target.from.place === DuelPlace.Ground;
	const toGround = target.to.place === DuelPlace.Ground;

	if (fromGround && toGround) {
		/* <- Relocation, including swap and steal/borrow */
		if (target.from.owner === target.to.owner) {
			const groundClone = cloneState(duel, target.to.owner, DuelPlace.Ground);
			const toIndex = groundClone.state.findIndex(toCardFilter);
			const toCard = groundClone.state[toIndex];
			const fromIndex = groundClone.state.findIndex(fromCardFilter);
			const fromCardId = groundClone.state[fromIndex];

			groundClone.state[fromIndex] = toCard;
			groundClone.state[toIndex] = fromCardId;

			fragment[groundClone.key] = groundClone.state;
		} else {
			/* <- TODO: Borrow/steal Unit from enemy */
		}
	} else if (toGround) {
		/* <- Construction/Summon, from non-Ground to Ground */
		const groundClone = cloneState(duel, target.to.owner, DuelPlace.Ground);

		if (fromAir) {
			groundClone.state[target.to.index] = injectCardState(
				fragment,
				duel.cardMap,
				target.from.id,
			).id;

			fragment[groundClone.key] = groundClone.state;
		} else {
			const fromClone = cloneState(duel, target.from.owner, target.from.place);
			const fromIndex = fromClone.state.findIndex(fromCardFilter);
			const fromCardId = fromClone.state[fromIndex];

			fromClone.state.splice(fromIndex, 1); /* <- fromClone is non-Ground */
			groundClone.state[target.to.index] = fromCardId;

			fragment[fromClone.key] = fromClone.state;
			fragment[groundClone.key] = groundClone.state;
		}
	} else if (fromGround) {
		/* <- Destruction, from Ground to non-Ground */
		const toClone = cloneState(duel, target.to.owner, target.to.place);
		const groundClone = cloneState(duel, target.from.owner, DuelPlace.Ground);
		const fromIndex = groundClone.state.findIndex(fromCardFilter);
		const fromCardId = groundClone.state[fromIndex];

		toClone.state.push(fromCardId);
		groundClone.state[fromIndex] = null;

		fragment[toClone.key] = toClone.state;
		fragment[groundClone.key] = groundClone.state;
	} else {
		/* <-- Generic move, both from and to is non-Ground */
		const toClone = cloneState(duel, target.to.owner, target.to.place);

		if (fromAir) {
			toClone.state.push(
				injectCardState(fragment, duel.cardMap, target.from.id).id,
			);

			fragment[toClone.key] = toClone.state;
		} else {
			const fromClone = cloneState(duel, target.from.owner, target.from.place);
			const fromIndex = fromClone.state.findIndex(fromCardFilter);
			const fromCardId = fromClone.state[fromIndex];

			fromClone.state.splice(fromIndex, 1);
			toClone.state.push(fromCardId);

			fragment[fromClone.key] = fromClone.state;
			fragment[toClone.key] = toClone.state;
		}
	}

	return fragment;
};

export const cardMove = {
	create,
	run,
};

export default cardMove;
