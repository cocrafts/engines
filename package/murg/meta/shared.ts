import { Card, CardType, ClassType } from '../utils/type';

export const TroopCard: Card = {
	id: '999990000',
	name: 'Troop',
	kind: CardType.Troop,
	rarity: 0,
	class: ClassType.Beast,
	attribute: {
		attack: 20,
		defense: 0,
		health: 40,
	},
	skill: {
		template: 'A proud warrior.',
	},
};

export const WolfCard: Card = {
	id: '999980000',
	name: 'Troop',
	kind: CardType.Troop,
	rarity: 0,
	class: ClassType.Beast,
	attribute: {
		attack: 20,
		defense: 0,
		health: 20,
	},
	skill: {
		template: 'A ware wolf.',
	},
};

export const SnakeCard: Card = {
	id: '999970000',
	name: 'Troop',
	kind: CardType.Troop,
	rarity: 0,
	class: ClassType.Beast,
	attribute: {
		attack: 10,
		defense: 0,
		health: 20,
	},
	skill: {
		template: 'Small snake.',
	},
};
