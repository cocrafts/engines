import { distributeInitialCards, distributeTurnCards } from './distribute';
import { fight } from './fight';
import { postFight, preFight } from './fightHook';
import { reinforce } from './reinforce';
import { summonCard } from './summon';
import { endTurn } from './turn';

export const move = {
	distributeInitialCards,
	distributeTurnCards,
	summonCard,
	endTurn,
	preFight,
	fight,
	postFight,
	reinforce,
};
