import { getCardState } from './card';
import {
	combineAttribute,
	extractPassivePair,
	getStateAfterCombat,
} from './fight';
import { getFacingIdentifier } from './ground';
import { getEnemyId, selectGround, selectPlayer } from './helper';
import { Attribute, DuelState, DynamicAttribute, PlayerState } from './type';

export const getDynamicAttribute = (
	duel: DuelState,
	id: string,
): DynamicAttribute => {
	const state = getCardState(duel.stateMap, id);
	const facing = getFacingIdentifier(duel, state?.owner, state?.id);
	const [passive] = extractPassivePair(duel, id, facing?.id);
	const combinedAttribute = combineAttribute(state, passive);

	if (facing?.id) {
		const predictedState = getStateAfterCombat(duel, state.id, facing.id);
		const combinedPredict = combineAttribute(predictedState, passive);

		return {
			base: combinedAttribute,
			predict: combinedPredict,
		};
	}

	return {
		base: combinedAttribute,
		predict: combinedAttribute,
	};
};

export const getPlayerPredict = (
	duel: DuelState,
	playerId: string,
): Attribute => {
	const player = selectPlayer(duel, playerId);
	const result: PlayerState = { ...player };
	const enemyId = getEnemyId(duel, playerId);
	const playerGround = selectGround(duel, playerId);
	const enemyGround = selectGround(duel, enemyId);

	for (let i = 0; i <= playerGround.length; i += 1) {
		const playerUnit = getCardState(duel.stateMap, playerGround[i]);
		const enemyUnit = getCardState(duel.stateMap, enemyGround[i]);

		if (enemyUnit?.id && !playerUnit?.id) {
			const [enemyPassive] = extractPassivePair(duel, enemyUnit.id);
			const combinedState = combineAttribute(enemyUnit, enemyPassive);

			result.health -= combinedState.attack;
		}
	}

	return result;
};
