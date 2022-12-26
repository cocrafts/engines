import { injectCardState } from './utils/card';
import { selectDeck } from './utils/helper';
import {
	CardState,
	DuelConfig,
	DuelPhases,
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

	return {
		version,
		setting,
		firstMover,
		firstPlayer,
		secondPlayer,
	};
};

export const getInitialState = ({
	version,
	setting,
	firstMover,
	firstPlayer,
	secondPlayer,
}: DuelConfig): DuelState => {
	const { map: cardMap } = makeMeta(version);
	const stateMap: Record<string, CardState> = {};
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

	const duel: DuelState = {
		cardMap,
		stateMap,
		setting,
		turn: 0,
		uniqueCardCount: 0,
		phase: DuelPhases.Draw,
		phaseOf: firstMover,
		firstMover,
		firstPlayer: firstPlayerState,
		secondPlayer: secondPlayerState,
		firstDeck: [],
		secondDeck: [],
		firstHand: [],
		secondHand: [],
		firstGround: [],
		secondGround: [],
		firstGrave: [],
		secondGrave: [],
	};

	[firstPlayer, secondPlayer].forEach(({ id: playerId, deck }) => {
		const currentDeck = selectDeck(duel, playerId);

		deck.forEach((cardId) => {
			currentDeck.push(injectCardState(duel, cardMap, cardId).id);
		});
	});

	for (let i = 0; i < setting.groundSize; i += 1) {
		duel.firstGround.push(null);
		duel.secondGround.push(null);
	}

	return duel;
};
