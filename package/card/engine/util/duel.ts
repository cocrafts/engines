import {
	Card,
	CardState,
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
	const firstPlayer: PlayerState = { id: A, health: initialHealth };
	const secondPlayer: PlayerState = { id: B, health: initialHealth };
	const [firstIdentifiers, secondIdentifiers] = deck;
	const idToCard = (id: string) => cardStateFromId(map, id);
	const firstDeck: CardState[] = firstIdentifiers.map(idToCard);
	const secondDeck: CardState[] = secondIdentifiers.map(idToCard);

	return {
		version,
		firstMover,
		player: [firstPlayer, secondPlayer],
		deck: [firstDeck, secondDeck],
		hand: [[], []],
		ground: [[], []],
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
