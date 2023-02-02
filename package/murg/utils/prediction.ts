import { getCardState } from './card';
import {
	combineAttribute,
	extractPassivePair,
	getStateAfterCombat,
} from './fight';
import { getFacingIdentifier } from './ground';
import { DuelState, DynamicAttribute } from './type';

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
