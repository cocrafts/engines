import { makeCardState } from '../../utils/card';
import { cloneState } from '../../utils/helper';
import {
	CardState,
	CommandBundle,
	CommandCreator,
	CommandRunner,
	DuelPlace,
	DuelState,
} from '../../utils/type';

export const create: CommandCreator = ({ owner, state }) => {
	return [];
};

const generatedPlaces = [DuelPlace.Player, DuelPlace.Ability];
export const run: CommandRunner = ({ state, target }) => {
	const { map } = state;
	const result: Partial<DuelState> = {};
	const toCardFilter = (i: CardState) => i.id === target.to.id;
	const fromCardFilter = (i: CardState) => i.id === target.from.id;
	const fromAir = generatedPlaces.indexOf(target.from.place) >= 0;
	const fromGround = target.from.place === DuelPlace.Ground;
	const toGround = target.to.place === DuelPlace.Ground;

	if (fromGround && toGround) {
		/* <- Relocation, including swap and steal/borrow */
		if (target.from.owner === target.to.owner) {
			const groundClone = cloneState(state, target.to.owner, DuelPlace.Ground);
			const toIndex = groundClone.state.findIndex(toCardFilter);
			const toCard = groundClone.state[toIndex];
			const fromIndex = groundClone.state.findIndex(fromCardFilter);
			const fromCard = groundClone.state[fromIndex];

			groundClone.state[fromIndex] = toCard;
			groundClone.state[toIndex] = fromCard;

			result[groundClone.key] = groundClone.state;
		} else {
			/* <- TODO: Borrow/steal Unit from enemy */
		}
	} else if (toGround) {
		/* <- Construction/Summon, from non-Ground to Ground */
		const groundClone = cloneState(state, target.to.owner, DuelPlace.Ground);

		if (fromAir) {
			groundClone.state[target.to.index] = makeCardState(map[target.from.id]);

			result[groundClone.key] = groundClone.state;
		} else {
			const fromClone = cloneState(state, target.from.owner, target.from.place);
			const fromIndex = fromClone.state.findIndex(fromCardFilter);
			const fromCard = fromClone.state[fromIndex];

			fromClone.state.splice(fromIndex, 1); /* <- fromClone is non-Ground */
			groundClone.state[target.to.index] = fromCard;

			result[fromClone.key] = fromClone.state;
			result[groundClone.key] = groundClone.state;
		}
	} else if (fromGround) {
		/* <- Destruction, from Ground to non-Ground */
		const toClone = cloneState(state, target.to.owner, target.to.place);
		const groundClone = cloneState(state, target.from.owner, DuelPlace.Ground);
		const fromIndex = groundClone.state.findIndex(fromCardFilter);
		const fromCard = groundClone.state[fromIndex];

		toClone.state.push(fromCard);
		groundClone.state[fromIndex] = null;

		result[toClone.key] = toClone.state;
		result[groundClone.key] = groundClone.state;
	} else {
		/* <-- Generic move, both from and to is non-Ground */
		const toClone = cloneState(state, target.to.owner, target.to.place);

		if (fromAir) {
			toClone.state.push(makeCardState(map[target.from.id]));

			result[toClone.key] = toClone.state;
		} else {
			const fromClone = cloneState(state, target.from.owner, target.from.place);
			const fromIndex = fromClone.state.findIndex(fromCardFilter);
			const fromCard = fromClone.state[fromIndex];

			fromClone.state.splice(fromIndex, 1);
			toClone.state.push(fromCard);

			result[fromClone.key] = fromClone.state;
			result[toClone.key] = toClone.state;
		}
	}

	return result;
};

const moveCommand: CommandBundle = {
	create,
};

export default moveCommand;
