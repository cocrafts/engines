import { Effect, EffectMap } from './type';

export const mergeEffects = (first: EffectMap, second: EffectMap) => {
	Object.keys(second).forEach((key) => {
		const existingEffect = first[key];
		const targetEffect: Effect = second[key];

		if (existingEffect) {
			if (targetEffect.id === 'Reborn') {
				mergeReborn(first['Reborn'], second['Reborn']);
			} else if (targetEffect.id === 'Shield') {
				mergeShield(first['Shield'], second['Shield']);
			} else if (targetEffect.id === 'AttributeStack') {
				mergeAttributeStack(first['AttributeStack'], second['AttributeStack']);
			} else if (targetEffect.id === 'ExplodeTimer') {
				mergeExplodeTimer(first['ExplodeTimer'], second['ExplodeTimer']);
			} else {
				mergeCommon(first[key], targetEffect);
			}
		} else {
			first[key] = targetEffect;
		}
	});

	return first;
};

const mergeLife = (first: Effect, second: Effect): number => {
	if (!second.life) return null;
	return (first.life || 0) + second.life;
};

const mergeCommon = (first: Effect, second: Effect): Effect => {
	return {
		id: first.id,
		life: mergeLife(first, second),
	};
};

const mergeReborn = (first: Effect, second: Effect): Effect => {
	return {
		id: first.id,
		life: mergeLife(first, second),
		reborn: {
			count: first.reborn.count + second.reborn.count,
		},
	};
};

const mergeShield = (first: Effect, second: Effect): Effect => {
	return {
		id: first.id,
		life: mergeLife(first, second),
		attribute: second.attribute || first.attribute,
	};
};

const mergeAttributeStack = (first: Effect, second: Effect): Effect => {
	const stackOptions = second.attributeStack.attribute;
	const nextAttribute = { attack: 0, health: 0, defense: 0 };

	if (first.attributeStack.targetId === second.attributeStack.targetId) {
		nextAttribute.attack = first.attribute.attack + stackOptions.attack;
		nextAttribute.defense = first.attribute.defense + stackOptions.defense;
		nextAttribute.health = first.attribute.health + stackOptions.health;
	}

	return {
		id: first.id,
		life: mergeLife(first, second),
		attribute: nextAttribute,
	};
};

const mergeExplodeTimer = (first: Effect, second: Effect): Effect => {
	return {
		id: first.id,
		life: mergeLife(first, second),
		explodeTimer: second.explodeTimer || first.explodeTimer,
	};
};
