import { DuelCommandType, DuelState, RunCommandPayload } from '../utils/type';

import cardDraw from './card/draw';
import cardMove from './card/move';
import cardMutate from './card/mutate';
import duelMutate from './duel/mutate';
import playerMutate from './player/mutate';

export const instruction = {
	duelMutate: duelMutate.create,

	cardDraw: cardDraw.create,
	cardMove: cardMove.create,
	cardMutate: cardMutate.create,

	playerMutate: playerMutate.create,
};

export const runCommand = (payload: RunCommandPayload): Partial<DuelState> => {
	switch (payload.command.type) {
		case DuelCommandType.CardMutate:
			return cardMutate.run(payload);
		case DuelCommandType.CardMove:
			return cardMove.run(payload);
		case DuelCommandType.PlayerMutate:
			return playerMutate.run(payload);
		case DuelCommandType.DuelMutate:
			return duelMutate.run(payload);
		default:
			return payload.state;
	}
};
