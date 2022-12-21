import { makeCardState } from './utils/card';
import { DuelConfig, DuelState, PlayerState } from './utils/type';
import { makeMeta } from './meta';

export const makeDuelState = ({
	version,
	setting,
	firstMover,
	playerConfigs,
}: DuelConfig): DuelState => {
	const { map } = makeMeta(version);

	const [firstState, secondState] = playerConfigs.map((player): PlayerState => {
		return {
			id: player.id,
			attack: 0,
			defense: 0,
			health: setting.playerHealth,
			deck: player.deck.map((cardId) => makeCardState(map[cardId])),
			hand: [],
			ground: [],
			grave: [],
		};
	});

	return {
		map,
		setting,
		round: 1,
		firstMover,
		players: [firstState, secondState],
	};
};
