import { distributeInitialCards, distributeTurnCards } from './distribute';
import { endTurn } from './duel';
import { summonCard } from './summon';
import { endTurn } from './turn';

export const move = {
	distributeInitialCards,
	distributeTurnCards,
	summonCard,
	endTurn,
};
