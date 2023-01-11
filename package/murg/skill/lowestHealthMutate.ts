import { createCommand } from '../command';
import { getCard, getCardState } from '../utils/card';
import { createCommandResult, getEnemyId, selectGround } from '../utils/helper';
import { pickLowestHealth } from '../utils/skill';
import { DuelPlace, SkillRunner } from '../utils/type';

interface SkillOptions {
	isTargetEnemy: boolean;
	attack: number;
	defense: number;
	health: number;
}

export const lowestHealthMutate: SkillRunner = ({
	duel,
	cardId,
	sourceType,
}) => {
	const { commands, registerCommand } = createCommandResult();
	const card = getCard(duel.cardMap, cardId);
	const options: SkillOptions = card.skill.attribute as never;
	const state = getCardState(duel.stateMap, cardId);
	const targetedOwner = options.isTargetEnemy
		? getEnemyId(duel, state.owner)
		: state.owner;
	const targetedGround = selectGround(duel, targetedOwner);
	const lowestHeathUnit = pickLowestHealth(duel, targetedGround);

	createCommand
		.cardMutate({
			owner: state.owner,
			target: {
				source: {
					type: sourceType,
					owner: state.owner,
					place: state.place,
					id: state.id,
				},
				to: {
					owner: state.owner,
					place: DuelPlace.Ground,
					id: lowestHeathUnit.id,
				},
			},
			payload: {
				attack: lowestHeathUnit.attack + (options.attack || 0),
				defense: lowestHeathUnit.defense + (options.defense || 0),
				health: lowestHeathUnit.health + (options.health || 0),
			},
		})
		.forEach(registerCommand);

	return commands;
};
