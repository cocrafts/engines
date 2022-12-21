import { selectDeck } from '../../utils/helper';
import {
	CommandBundle,
	CommandCreator,
	DuelCommand,
	DuelCommandType,
	DuelPlace,
} from '../../utils/type';

export const create: CommandCreator = ({ owner, state }) => {
	const deck = selectDeck(state, owner);
	const randomIndex = Math.floor(Math.random() * deck.length);
	const randomCard = deck[randomIndex];

	const drawCommand: DuelCommand = {
		owner,
		type: DuelCommandType.CardMove,
		target: {
			from: {
				id: randomCard.id,
				place: DuelPlace.Deck,
			},
			to: {
				place: DuelPlace.Hand,
			},
		},
	};

	return [drawCommand];
};

export const drawCommand: CommandBundle = {
	create,
};

export default drawCommand;
