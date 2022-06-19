import {
	Card,
	CardState,
	CardStatePair,
	DuelPlace,
	DuelSetting,
	DuelSetup,
	DuelState,
	GameMeta,
	PlayerState,
} from '../../types';

const initialHealth = 2500;

export const getInitialSnapshot = (
	{ version, map }: GameMeta,
	{ player, firstMover, deck }: DuelSetup,
): DuelState => {
	const [A, B] = player;
	const handSize = 9;
	const groundSize = 11;
	const setting: DuelSetting = { handSize, groundSize };
	const firstPlayer: PlayerState = { id: A, health: initialHealth };
	const secondPlayer: PlayerState = { id: B, health: initialHealth };
	const [firstIdentifiers, secondIdentifiers] = deck;
	const idToCard = (id: string) => cardStateFromId(map, id);
	const firstDeck: CardState[] = firstIdentifiers.map(idToCard);
	const secondDeck: CardState[] = secondIdentifiers.map(idToCard);
	const ground: CardStatePair = [[], []];

	for (let i = 0; i < groundSize; i += 1) {
		ground[0].push(null);
		ground[1].push(null);
	}

	return {
		version,
		setting,
		firstMover,
		cardMap: map,
		player: [firstPlayer, secondPlayer],
		deck: [firstDeck, secondDeck],
		hand: [[], []],
		ground,
		grave: [[], []],
	};
};

const cardStateFromId = (
	cardMap: Record<string, Card>,
	id: string,
): CardState => {
	const base: Card = cardMap[id];
	const { attack, defense, health, cooldown } = base;

	return {
		id,
		base,
		attack,
		defense,
		health,
		cooldown,
	};
};

interface CloneDuelResult {
	key: string;
	source: CardStatePair;
}

export const cloneDuelSource = (
	snapshot: DuelState,
	place: DuelPlace,
): CloneDuelResult => {
	const key = placeMap[place];

	return {
		key,
		source: [...snapshot[key]] as CardStatePair,
	};
};

const placeMap = {
	[DuelPlace.Deck]: 'deck',
	[DuelPlace.Hand]: 'hand',
	[DuelPlace.Ground]: 'ground',
	[DuelPlace.Grave]: 'grave',
};
