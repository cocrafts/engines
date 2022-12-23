import { makeCardState } from './utils/card';
import { nanoId } from './utils/helper';
import {
	CardState,
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
	players: [PlayerConfig, PlayerConfig],
	version = '00001',
	setting = defaultSetting,
): { config: DuelConfig; state: DuelState } => {
	const config = makeDuelConfig(players, version, setting);

	return {
		config,
		state: getInitialState(config),
	};
};

export const makeDuelConfig = (
	[firstPlayer, secondPlayer]: [PlayerConfig, PlayerConfig],
	version = '00001',
	setting = defaultSetting,
): DuelConfig => {
	const firstMover = Math.random() > 0.5 ? firstPlayer.id : secondPlayer.id;
	const makeUniqueId = (id: string) => `${id}#${nanoId()}`;

	return {
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
	const firstGround: CardState[] = [];
	const secondGround: CardState[] = [];
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

	for (let i = 0; i < setting.groundSize; i += 1) {
		firstGround.push(null);
		secondGround.push(null);
	}

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
		firstGround: firstGround,
		secondGround: secondGround,
		firstGrave: [],
		secondGrave: [],
	};
};
