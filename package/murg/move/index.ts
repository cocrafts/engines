import { distributeInitialCards, distributeTurnCards } from './distribute';
import { endTurn } from './duel';
import { summonCard } from './summon';

export const move = {
	distributeInitialCards,
	distributeTurnCards,
	summonCard,
	endTurn,
};
