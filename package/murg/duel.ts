import { makeCardState } from './utils/card';
import { DuelConfig, DuelState, PlayerState } from './utils/type';
import { makeMeta } from './meta';

export const makeDuelState = ({
	version,
	setting,
	firstMover,
	firstPlayer,
	secondPlayer,
}: DuelConfig): DuelState => {
	const { map } = makeMeta(version);
	const [firstPlayerState, secondPlayerState] = [firstPlayer, secondPlayer].map(
		(player): PlayerState => {
			return {
				id: player.id,
				attack: 0,
				defense: 0,
				health: setting.playerHealth,
				perTurnTroop: setting.perTurnTroop,
				perTurnHero: setting.perTurnHero,
			};
		},
	);

	return {
		map,
		setting,
		round: 1,
		firstMover,
		firstPlayer: firstPlayerState,
		secondPlayer: secondPlayerState,
		firstDeck: firstPlayer.deck.map((cardId) => makeCardState(map[cardId])),
		secondDeck: secondPlayer.deck.map((cardId) => makeCardState(map[cardId])),
		firstHand: [],
		secondHand: [],
		firstGround: [],
		secondGround: [],
		firstGrave: [],
		secondGrave: [],
	};
};
