import { makeCardState } from './utils/card';
import { nanoId } from './utils/helper';
import {
	DuelConfig,
	DuelSetting,
	DuelState,
	PlayerConfig,
	PlayerState,
} from './utils/type';
import { makeMeta } from './meta';

export const defaultSetting: DuelSetting = {
	playerHealth: 250,
	handSize: 9,
	groundSize: 11,
	maxAttachment: 2,
	perTurnHero: 1,
	perTurnTroop: 1,
};

export const makeDuel = (
	[firstPlayer, secondPlayer]: [PlayerConfig, PlayerConfig],
	version = '00001',
	setting = defaultSetting,
) => {
	const firstMover = Math.random() > 0.5 ? firstPlayer.id : secondPlayer.id;
	const makeUniqueId = (id: string) => `${id}#${nanoId()}`;

	const config: DuelConfig = {
		version,
		setting,
		firstMover,
		firstPlayer: {
			id: firstPlayer.id,
			deck: firstPlayer.deck.map(makeUniqueId),
		},
		secondPlayer: {
			id: secondPlayer.id,
			deck: secondPlayer.deck.map(makeUniqueId),
		},
	};

	return {
		config,
		state: getInitialState(config),
	};
};

export const getInitialState = ({
	version,
	setting,
	firstMover,
	firstPlayer,
	secondPlayer,
}: DuelConfig): DuelState => {
	const { map } = makeMeta(version);
	const cardIdToState = (id: string) => makeCardState(id, map);
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
		firstDeck: firstPlayer.deck.map(cardIdToState),
		secondDeck: secondPlayer.deck.map(cardIdToState),
		firstHand: [],
		secondHand: [],
		firstGround: [],
		secondGround: [],
		firstGrave: [],
		secondGrave: [],
	};
};
