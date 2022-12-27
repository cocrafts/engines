import { getCardState } from '../utils/card';
import { getFacingIdentifier } from '../utils/ground';
import { SkillRunner } from '../utils/type';

export const runUnitStealer: SkillRunner = (duel, card, state) => {
	const facingIdentifier = getFacingIdentifier(duel, state.owner, state.id);
	const facingState = getCardState(duel.stateMap, facingIdentifier.id);

	console.log('hmm', state, facingState, '<<--');
};
