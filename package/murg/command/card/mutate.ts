import { getCardState } from '../../utils/card';
import { createCommandResult, createDuelFragment } from '../../utils/helper';
import {
	CommandCreator,
	CommandRunner,
	DuelCommandType,
	DuelPlace,
} from '../../utils/type';

export const create: CommandCreator = ({ owner, target, payload }) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		type: DuelCommandType.CardMutate,
		owner,
		target,
		payload,
	});

	if (payload.health <= 0) {
		registerCommand({
			type: DuelCommandType.CardMove,
			owner,
			target: {
				from: {
					owner: target.to.owner,
					place: target.to.place,
					id: target.to.id,
				},
				to: {
					owner: target.to.owner,
					place: DuelPlace.Grave,
				},
			},
		});
	}

	return commands;
};

export const run: CommandRunner = ({ duel, command: { target, payload } }) => {
	const fragment = createDuelFragment(duel);
	const cardState = getCardState(duel.stateMap, target.to.id);
	const cardStateClone = { ...cardState };

	Object.keys(payload).forEach((key) => {
		const value = payload[key];

		if (isNaN(value)) {
			cardStateClone[key] = value;
		} else {
			cardStateClone[key] = value || 0;
		}
	});

	fragment.stateMap[target.to.id] = cardStateClone;
	return fragment;
};

export const cardMutate = {
	create,
	run,
};

export default cardMutate;
