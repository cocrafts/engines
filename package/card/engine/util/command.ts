import { PlayerStatePair } from '../../types';

export const getPlayerOrder = (players: PlayerStatePair, ownerId: string) => {
	return players.findIndex((i) => i.id === ownerId);
};
