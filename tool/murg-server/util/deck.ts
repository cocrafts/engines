import { CardMeta, CardType } from '@metacraft/murg-engine';

export const generateRandomDeck = ({ map, entities }: CardMeta, size = 30) => {
	const sources = [...entities];
	const results: string[] = [];
	let count = 0;

	while (count < size) {
		const randomIndex = Math.floor(Math.random() * sources.length);
		const randomId = sources[randomIndex];
		const sku = randomId.substring(0, 5);
		const existedCard = results.find((id) => id.startsWith(sku));
		const card = map[randomId];

		if (!existedCard && card.kind !== CardType.Troop) {
			results.push(randomId);
			count++;
		}

		sources.splice(randomIndex, 1);
	}

	return results;
};
