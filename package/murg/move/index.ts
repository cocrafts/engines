import { cleanUp } from './cleanUp';
import { distributeInitialCards, distributeTurnCards } from './distribute';
import { fight } from './fight';
import { postFight, preFight } from './fightHook';
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
	cleanUp,
};
