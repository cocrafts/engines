import { skillMap } from '../skill';
import { getCard, getCardState } from '../utils/card';
import {
	createAndMergeBundle,
	createCommandBundle,
	emptyMoveResult,
	runAndMergeHooks,
} from '../utils/state';
import {
	ActivationType,
	BundleGroup,
	DuelCommandTarget,
	DuelState,
	MoveResult,
} from '../utils/type';

export const activateChargeSkill = (
	duel: DuelState,
	target: DuelCommandTarget,
): MoveResult => {
	const cardId = target.from.id;
	const card = getCard(duel.cardMap, cardId);
	const state = getCardState(duel.stateMap, cardId);
	const isChargeSkill = card?.skill?.activation === ActivationType.Charge;
	const isChargeValid = state.charge <= 0;

	if (!isChargeSkill || !isChargeValid) return emptyMoveResult;

	const skillFunc = skillMap[card.skill.attribute?.id];
	const skillCommands = skillFunc?.({ duel, cardId, target });
	const skillActivateBundle = createAndMergeBundle(
		duel,
		BundleGroup.SkillActivation,
		skillCommands,
	);

	const hookBundle = createCommandBundle(duel, BundleGroup.SkillActivation);
	runAndMergeHooks(duel, hookBundle, skillCommands);

	return {
		duel,
		commandBundles: [skillActivateBundle, hookBundle],
	};
};
