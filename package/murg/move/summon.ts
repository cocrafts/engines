import { createCommand } from '../command';
import { skillMap } from '../skill';
import { getCard } from '../utils/card';
import { selectPlayer } from '../utils/helper';
import {
	createAndMergeBundle,
	createCommandBundle,
	emptyMoveResult,
	runAndMergeBundle,
	runAndMergeInspireHooks,
} from '../utils/state';
import {
	ActivationType,
	BundleGroup,
	CardType,
	CommandSourceType,
	DuelCommandBundle,
	DuelCommandTarget,
	DuelPlace,
	DuelState,
	MoveResult,
} from '../utils/type';

export const summonCard = (
	duel: DuelState,
	target: DuelCommandTarget,
): MoveResult => {
	const commandBundles: DuelCommandBundle[] = [];
	const cardId = target.from.id;
	const fromOwner = target.from.owner;
	const player = selectPlayer(duel, fromOwner);
	const card = getCard(duel.cardMap, cardId);
	const isOwnerInvalid = fromOwner !== duel.phaseOf;
	const isHeroCard = card.kind === CardType.Hero;
	const isSpellCard = card.kind === CardType.Spell; /* <-- no spell-card yet */
	const isHeroInvalid = isHeroCard && player.perTurnHero <= 0;
	const isSummonActivation = card.skill?.activation === ActivationType.Summon;
	const skillFunc = skillMap[card.skill?.attribute?.id];

	if (isOwnerInvalid || isHeroInvalid || isSpellCard) {
		const errorMessage = getErrorMessage(
			isOwnerInvalid,
			isHeroInvalid,
			isSpellCard,
		);

		console.log(errorMessage);
		return emptyMoveResult;
	}

	const summonBundle = createCommandBundle(duel, BundleGroup.Summon);
	const hookBundle = createCommandBundle(duel, BundleGroup.SkillActivation);

	runAndMergeBundle(
		duel,
		summonBundle,
		createCommand.cardMove({ owner: fromOwner, target }),
	);
	commandBundles.push(summonBundle);

	if (isSummonActivation && skillFunc) {
		const skillCommands = skillFunc({
			duel,
			cardId,
			sourceType: CommandSourceType.SummonSkill,
		});

		if (skillCommands.length > 0) {
			runAndMergeBundle(duel, hookBundle, skillCommands);
			commandBundles.push(hookBundle);
		}
	}

	runAndMergeInspireHooks(duel, hookBundle, [
		...summonBundle.commands,
		...hookBundle.commands,
	]);

	commandBundles.push(
		createAndMergeBundle(
			duel,
			BundleGroup.PlayerUpdate,
			createCommand.playerMutate({
				target: {
					source: {
						type: CommandSourceType.SummonMove,
						owner: fromOwner,
					},
					to: {
						owner: fromOwner,
						place: DuelPlace.Player,
					},
				},
				payload: {
					perTurnHero: player.perTurnHero - (isHeroCard ? 1 : 0),
					perTurnSpell: player.perTurnSpell - (isSpellCard ? 1 : 0),
				},
			}),
		),
	);

	return {
		duel,
		commandBundles,
	};
};

const getErrorMessage = (
	ownerInvalid: boolean,
	heroInvalid: boolean,
	spellInvalid: boolean,
) => {
	if (ownerInvalid) return 'Invalid owner';
	if (heroInvalid) return 'Out of Hero summon slot';
	if (spellInvalid) return 'Out of Spell slot';
};
