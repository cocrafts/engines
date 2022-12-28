import { createCommand } from '../command';

import { getCard, getCardState } from './card';
import { createCommandResult } from './helper';
import { Card, CardState, DuelCommand, DuelState, ElementalType } from './type';

export const runFightAt = (duel: DuelState, i: number): DuelCommand[] => {
	const { commands, registerCommand } = createCommandResult();
	const { firstGround, secondGround } = duel;
	const firstCardId = firstGround[i];
	const firstBase = getCard(duel.cardMap, firstCardId);
	const firstState = getCardState(duel.stateMap, firstCardId);
	const secondCardId = secondGround[i];
	const secondBase = getCard(duel.cardMap, secondCardId);
	const secondState = getCardState(duel.stateMap, secondCardId);
	const firstCard: StatedCard = { ...firstBase, state: firstState };
	const secondCard: StatedCard = { ...secondBase, state: secondState };

	if (firstState && secondState) {
		const { damage, secondDamage } = getDamage(firstCard, secondCard);

		console.log(damage, secondDamage);
		createCommand
			.cardMutate({
				owner: firstState.owner,
				target: {
					to: {
						owner: firstState.owner,
						id: firstState.id,
						place: firstState.place,
					},
				},
				payload: { health: firstState.health - secondDamage },
			})
			.forEach(registerCommand);
		createCommand
			.cardMutate({
				owner: secondState.owner,
				target: {
					to: {
						owner: secondState.owner,
						id: secondState.id,
						place: secondState.place,
					},
				},
				payload: { health: secondState.health - damage },
			})
			.forEach(registerCommand);
	} else if (firstCard && !secondCard) {
		//
	} else if (!firstCard && secondCard) {
		//
	}

	return commands;
};

const generativeCycle: ElementalType[] = [
	ElementalType.Metal,
	ElementalType.Water,
	ElementalType.Wood,
	ElementalType.Fire,
	ElementalType.Earth,
];

const destructiveCycle: ElementalType[] = [
	ElementalType.Metal,
	ElementalType.Wood,
	ElementalType.Earth,
	ElementalType.Water,
	ElementalType.Fire,
];

type StatedCard = Card & {
	state: CardState;
};

export const isGenerative = (
	from: Card | StatedCard,
	to: Card | StatedCard,
) => {
	const fromIndex = generativeCycle.indexOf(from.elemental);
	return generativeCycle[fromIndex + 1] === to.elemental;
};

export const isDestructive = (
	from: Card | StatedCard,
	to: Card | StatedCard,
) => {
	const fromIndex = destructiveCycle.indexOf(from.elemental);
	return destructiveCycle[fromIndex + 1] === to.elemental;
};

export const getDamage = (
	first: StatedCard,
	second: StatedCard,
	destructiveFactor = 1,
) => {
	const { attack, defense } = first.state;
	const { attack: secondAttack, defense: secondDefense } = second.state;
	const factor = isDestructive(first, second) ? destructiveFactor : 1;
	const secondFactor = isDestructive(second, first) ? destructiveFactor : 1;
	const damage = attack - secondDefense;
	const secondDamage = secondAttack - defense;

	return {
		damage: damage * factor,
		secondDamage: secondDamage * secondFactor,
	};
};
