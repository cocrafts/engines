import { createCommand } from '../command';
import { getCardState } from '../utils/card';
import { getClosestEmpty } from '../utils/ground';
import { createCommandResult, selectGround } from '../utils/helper';
import { DuelPlace, SkillRunner } from '../utils/type';

export const SnakeId = '999970000';

export const summonSnake: SkillRunner = ({ duel, cardId, sourceType }) => {
	const { commands, registerCommand } = createCommandResult();
	const state = getCardState(duel.stateMap, cardId);
	const myGround = selectGround(duel, state.owner);
	const closestIndex = getClosestEmpty(myGround);

	if (!closestIndex) return commands;

	createCommand
		.cardMove({
			target: {
				source: {
					type: sourceType,
					owner: state.owner,
					place: state.place,
					id: state.id,
				},
				from: {
					owner: state.owner,
					place: DuelPlace.Ability,
					id: SnakeId,
				},
				to: {
					owner: state.owner,
					place: state.place,
					index: closestIndex,
				},
			},
		})
		.forEach(registerCommand);

	return commands;
};
