import { createCommand } from '../command';
import { getCard } from '../utils/card';
import { selectPlayer } from '../utils/helper';
import {
	createCommandBundle,
	emptyMoveResult,
	runAndMergeBundle,
} from '../utils/state';
import {
	CardType,
	DuelCommandTarget,
	DuelState,
	MoveResult,
} from '../utils/type';

export const summonCard = (
	duel: DuelState,
	target: DuelCommandTarget,
): MoveResult => {
	const summonBundle = createCommandBundle(duel);
	const fromOwner = target.from.owner;
	const player = selectPlayer(duel, fromOwner);
	const card = getCard(duel.cardMap, target.from.id);
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

	runAndMergeBundle(
		duel,
		summonBundle,
		createCommand.cardMove({
			owner: fromOwner,
			target,
		}),
	);

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
