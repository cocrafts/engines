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
	DuelCommandBundle,
	DuelCommandTarget,
	DuelState,
	MoveResult,
} from '../utils/type';

export const activateChargeSkill = (
	duel: DuelState,
	target: DuelCommandTarget,
): MoveResult => {
	const commandBundles: DuelCommandBundle[] = [];
	const cardId = target.from.id;
	const card = getCard(duel.cardMap, cardId);
	const state = getCardState(duel.stateMap, cardId);
	const isChargeSkill = card?.skill?.activation === ActivationType.Charge;
	const isChargeValid = state.charge <= 0;

	if (!isChargeSkill || !isChargeValid) return emptyMoveResult;

	const skillFunc = skillMap[card.skill.attribute?.id];
	const skillCommands = skillFunc?.({ duel, cardId, fromTarget: target }) || [];

	if (skillCommands.length > 0) {
		const skillActivateBundle = createAndMergeBundle(
			duel,
			BundleGroup.SkillActivation,
			skillCommands,
		);

		commandBundles.push(skillActivateBundle);

		const hookBundle = createCommandBundle(duel, BundleGroup.SkillActivation);
		runAndMergeHooks(duel, hookBundle, skillCommands);

		if (hookBundle.commands.length > 0) {
			commandBundles.push(hookBundle);
		}
	}

	return { duel, commandBundles };
};
