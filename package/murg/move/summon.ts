import { createCommand } from '../command';
import { getCard } from '../utils/card';
import { selectPlayer } from '../utils/helper';
import {
	createBundle,
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
	const summonBundle = createBundle(duel);
	const fromOwner = target.from.owner;
	const player = selectPlayer(duel, fromOwner);
	const card = getCard(duel.cardMap, target.from.id);
	const isOwnerInvalid = fromOwner === duel.phaseOf;
	const isHeroCard = card.kind === CardType.Hero;
	const isSpellCard = card.kind === CardType.Spell; /* <-- no spell-card yet */
	const isHeroInvalid = isHeroCard && player.perTurnHero <= 0;

	if (isOwnerInvalid || isHeroInvalid || isSpellCard) return emptyMoveResult;

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
