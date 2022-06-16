import { getPlayerOrder } from '@cocrafts/card';

import { CommandType, CreateCommandPayload, DuelPlace } from '../../types';

export const create = ({ creator, snapshot }: CreateCommandPayload) => {
	const { player, deck } = snapshot;
	const order = getPlayerOrder(player, creator);
	const currentDeck = deck[order];
	const selectedPosition = Math.floor(Math.random() * currentDeck.length);
	const selectedCard = currentDeck[selectedPosition];

	return {
		creator,
		type: CommandType.Move,
		from: [DuelPlace.Deck, selectedCard.id, selectedPosition],
		target: [DuelPlace.Hand],
	};
};

export const drawCommand = {
	create,
};

export default drawCommand;
