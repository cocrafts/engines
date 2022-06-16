import { PlayerStatePair } from '../../types';

export const getPlayerOrder = (players: PlayerStatePair, currentId: string) => {
	return players.findIndex((i) => i.id === currentId);
};
