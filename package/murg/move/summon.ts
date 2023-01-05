import { createCommand } from '../command';
import { getCard } from '../utils/card';
import { selectPlayer } from '../utils/helper';
import {
	createCommandBundle,
	emptyMoveResult,
	runAndMergeBundle,
	runAndMergeHooks,
} from '../utils/state';
import {
	BundleGroup,
	CardType,
	DuelCommandTarget,
	DuelState,
	MoveResult,
} from '../utils/type';

export const summonCard = (
	duel: DuelState,
	target: DuelCommandTarget,
): MoveResult => {
	const summonBundle = createCommandBundle(duel, BundleGroup.Summon);
	const cardId = target.from.id;
	const fromOwner = target.from.owner;
	const player = selectPlayer(duel, fromOwner);
	const card = getCard(duel.cardMap, cardId);
	const isOwnerInvalid = fromOwner !== duel.phaseOf;
	const isHeroCard = card.kind === CardType.Hero;
	const isSpellCard = card.kind === CardType.Spell; /* <-- no spell-card yet */
	const isHeroInvalid = isHeroCard && player.perTurnHero <= 0;

	if (isOwnerInvalid || isHeroInvalid || isSpellCard) {
		const errorMessage = getErrorMessage(
			isOwnerInvalid,
			isHeroInvalid,
			isSpellCard,
		);

		console.log(errorMessage);
		return emptyMoveResult;
	}

	const summonCommands = createCommand.cardMove({ owner: fromOwner, target });
	runAndMergeBundle(duel, summonBundle, summonCommands);
	runAndMergeBundle(
		duel,
		summonBundle,
		createCommand.playerMutate({
			owner: fromOwner,
			payload: {
				perTurnHero: player.perTurnHero - (isHeroCard ? 1 : 0),
				perTurnSpell: player.perTurnSpell - (isSpellCard ? 1 : 0),
			},
		}),
	);

	const hookBundle = createCommandBundle(duel, BundleGroup.SkillActivation);
	runAndMergeHooks(duel, hookBundle, summonCommands);

	return {
		duel,
		commandBundles: [summonBundle],
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
