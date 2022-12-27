import { createCommand } from '../command';
import { troopId } from '../utils/card';
import {
	pickUniqueIds,
	selectDeck,
	selectHand,
	selectPlayer,
} from '../utils/helper';
import {
	createAndMergeBundle,
	createCommandBundle,
	emptyMoveResult,
	runAndMergeBundle,
} from '../utils/state';
import { DuelPhases, DuelPlace, DuelState, MoveResult } from '../utils/type';

export const distributeInitialCards = (duel: DuelState): MoveResult => {
	if (duel.turn > 0) return emptyMoveResult;

	const { setting, firstPlayer, secondPlayer } = duel;
	const firstDeck = selectDeck(duel, firstPlayer.id);
	const secondDeck = selectDeck(duel, secondPlayer.id);
	const firstPicks = pickUniqueIds(firstDeck, setting.initialCardCount);
	const secondPicks = pickUniqueIds(secondDeck, setting.initialCardCount);

	const firstDrawBundle = createCommandBundle(duel);
	const secondDrawBundle = createCommandBundle(
		duel,
		DuelPhases.Draw,
		secondPlayer.id,
	);

	for (let i = 0; i < setting.initialCardCount; i += 1) {
		runAndMergeBundle(
			duel,
			firstDrawBundle,
			createCommand.cardMove({
				owner: firstPlayer.id,
				target: {
					from: {
						owner: firstPlayer.id,
						id: firstPicks[i],
						place: DuelPlace.Deck,
					},
					to: {
						owner: firstPlayer.id,
						place: DuelPlace.Hand,
					},
				},
			}),
		);

		runAndMergeBundle(
			duel,
			secondDrawBundle,
			createCommand.cardMove({
				owner: secondPlayer.id,
				target: {
					from: {
						owner: secondPlayer.id,
						id: secondPicks[i],
						place: DuelPlace.Deck,
					},
					to: {
						owner: secondPlayer.id,
						place: DuelPlace.Hand,
					},
				},
			}),
		);
	}

	const cleanUpBundle = createAndMergeBundle(
		duel,
		createCommand.duelMutate({
			payload: { turn: duel.turn + 1 },
		}),
		{
			phase: DuelPhases.CleanUp,
			phaseOf: secondPlayer.id,
		},
	);

	return {
		duel,
		commandBundles: [firstDrawBundle, secondDrawBundle, cleanUpBundle],
	};
};

export const distributeTurnCards = (duel: DuelState): MoveResult => {
	if (duel.phase !== DuelPhases.Draw) return emptyMoveResult;

	const player = selectPlayer(duel, duel.phaseOf);
	const deck = selectDeck(duel, duel.phaseOf);
	const hand = selectHand(duel, duel.phaseOf);
	const holdingTroopCount = hand.filter((id) => id.startsWith(troopId)).length;
	const deckDrawAmount = Math.min(deck.length, player.perTurnDraw);
	const troopDrawAmount = player.perTurnTroop - holdingTroopCount;
	const cardPicks = pickUniqueIds(deck, deckDrawAmount);
	const turnDistributeBundle = createCommandBundle(duel);

	/* <-- Draw cards, does not exceed number of available card in Deck */
	for (let i = 0; i < deckDrawAmount; i += 1) {
		runAndMergeBundle(
			duel,
			turnDistributeBundle,
			createCommand.cardMove({
				owner: player.id,
				target: {
					from: {
						owner: player.id,
						id: cardPicks[i],
						place: DuelPlace.Deck,
					},
					to: {
						owner: player.id,
						place: DuelPlace.Hand,
					},
				},
			}),
		);
	}

	/* <-- Draw troops, total amount of troop in Hand should be less than perTurnTroop */
	for (let i = 0; i < troopDrawAmount; i++) {
		runAndMergeBundle(
			duel,
			turnDistributeBundle,
			createCommand.cardMove({
				owner: player.id,
				target: {
					from: {
						owner: player.id,
						id: troopId,
						place: DuelPlace.Player,
					},
					to: {
						owner: player.id,
						place: DuelPlace.Hand,
					},
				},
			}),
		);
	}

	runAndMergeBundle(
		duel,
		turnDistributeBundle,
		createCommand.duelMutate({
			payload: { phase: DuelPhases.Setup },
		}),
	);

	return {
		duel,
		commandBundles: [turnDistributeBundle],
	};
};
