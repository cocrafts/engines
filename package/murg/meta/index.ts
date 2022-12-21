import { Card, CardMeta, CardType, ElementalType } from '../utils/type';

import ver00001 from './db/00001';
import { SnakeCard, TroopCard, WolfCard } from './shared';

const metaHash: Record<string, Card[]> = { ver00001 };

export const makeMeta = (version = '00001'): CardMeta => {
	const cards = metaHash[`ver${version}`] || ver00001;
	const entities = [];
	const map = {};

	for (const card of cards) {
		if (card.kind === CardType.Hero) {
			for (let rarityId = 0; rarityId < 1; rarityId += 1) {
				for (let elementalId = 1; elementalId < 8; elementalId += 1) {
					const padRarityId = String(rarityId).padStart(2, '0');
					const padElementalId = String(elementalId).padStart(2, '0');
					const sku = `${card.id}${padRarityId}${padElementalId}`;
					const generatedCard: Card = {
						...card,
						id: sku,
						rarity: rarityId,
						elemental: padElementalId as ElementalType,
					};

					entities.push(sku);
					map[sku] = generatedCard;
				}
			}
		}
	}

	[SnakeCard, TroopCard, WolfCard].forEach((card) => {
		entities.push(card.id);
		map[card.id] = card;
	});

	return { version, entities, map };
};
