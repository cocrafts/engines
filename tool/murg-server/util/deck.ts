import { CardMeta, CardType } from '@metacraft/murg-engine';

export const generateRandomDeck = (meta: CardMeta, size = 36) => {
	const sources = pickSkillReadyCards(meta);
	const maxSize = Math.floor(sources.length / 7);
	const safeSize = Math.min(size, maxSize);
	const results: string[] = [];
	let count = 0;

	while (count < safeSize) {
		const randomIndex = Math.floor(Math.random() * sources.length);
		const randomId = sources[randomIndex];
		const sku = randomId.substring(0, 5);
		const existedCard = results.find((id) => id.startsWith(sku));
		const card = meta.map[randomId];

		if (!existedCard && card.kind !== CardType.Troop) {
			results.push(randomId);
			count++;
		}

		sources.splice(randomIndex, 1);
	}

	return results;
};

const pickSkillReadyCards = ({ map, entities }: CardMeta) => {
	const result = [];

	for (let i = 0; i < entities.length; i += 1) {
		const cardId = entities[i];
		const card = map[cardId];
		const isTroopCard = card.kind === CardType.Troop;
		const isSkillValid =
			card.skill.activation === undefined ||
			card.skill.attribute ||
			card.skill.passiveAttribute;

		if (!isTroopCard && isSkillValid) {
			result.push(cardId);
		}
	}

	return result;
};
