import { selectDeck } from '../../utils/helper';
import {
	DuelCommand,
	DuelCommandType,
	DuelPlace,
	StatefulCommand,
} from '../../utils/type';

export const create: StatefulCommand<'owner'> = ({ state, owner }) => {
	const deck = selectDeck(state, owner);
	const randomIndex = Math.floor(Math.random() * deck.length);
	const randomCard = deck[randomIndex];

	const drawCommand: DuelCommand = {
		owner,
		type: DuelCommandType.CardMove,
		target: {
			from: {
				owner,
				id: randomCard.id,
				place: DuelPlace.Deck,
			},
			to: {
				owner,
				place: DuelPlace.Hand,
			},
		},
	};

	return [drawCommand];
};

export const drawCommand = {
	create,
};

export default drawCommand;
