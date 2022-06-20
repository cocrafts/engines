import {
	CommandType,
	CreateCommandPayload,
	DuelCommand,
	DuelPlace,
} from '../../../types';
import { getPlayerOrder } from '../../util';

export const create = ({
	owner,
	snapshot,
}: CreateCommandPayload): DuelCommand[] => {
	const { player, deck } = snapshot;
	const order = getPlayerOrder(player, owner);
	const currentDeck = deck[order];
	const selectedPosition = Math.floor(Math.random() * currentDeck.length);
	const selectedCard = currentDeck[selectedPosition];

	const drawCommand = {
		owner,
		type: CommandType.Move,
		from: [DuelPlace.Deck, selectedCard.id, selectedPosition],
		target: [DuelPlace.Hand],
	} as DuelCommand;

	return [drawCommand];
};

export const drawCommand = {
	create,
};

export default drawCommand;
