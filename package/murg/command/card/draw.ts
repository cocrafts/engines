import {
	createCommandResult,
	pickUniqueIds,
	selectDeck,
} from '../../utils/helper';
import { DuelCommandType, DuelPlace, StatefulCommand } from '../../utils/type';

export const create: StatefulCommand<'owner' | 'amount'> = ({
	duel,
	owner,
	amount = 1,
}) => {
	const { commands, registerCommand } = createCommandResult();
	const deck = selectDeck(duel, owner);

	pickUniqueIds(deck, amount).forEach((cardId) => {
		registerCommand({
			owner,
			type: DuelCommandType.CardMove,
			target: {
				from: {
					owner,
					id: cardId,
					place: DuelPlace.Deck,
				},
				to: {
					owner,
					place: DuelPlace.Hand,
				},
			},
		});
	});

	return commands;
};

export const drawCommand = {
	create,
};

export default drawCommand;
