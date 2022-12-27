import { distributeInitialCards, distributeTurnCards } from './distribute';
import { postFight } from './postFight';
import { summonCard } from './summon';
import { endTurn } from './turn';

export const move = {
	distributeInitialCards,
	distributeTurnCards,
	summonCard,
	endTurn,
	postFight,
};
