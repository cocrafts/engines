import { createCommand } from '../command';
import { passiveMap } from '../skill';

import { getCard, getCardState } from './card';
import { createCommandResult, getEnemyId, selectPlayer } from './helper';
import {
	Attribute,
	Card,
	CardState,
	DuelCommand,
	DuelState,
	ElementalType,
	PassivePair,
} from './type';

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

export const playerAttackCommands = (duel: DuelState, cardId: string) => {
	const { commands, registerCommand } = createCommandResult();
	const cardState = getCardState(duel.stateMap, cardId);
	const playerId = getEnemyId(duel, cardState.owner);
	const playerState = selectPlayer(duel, playerId);

	createCommand
		.playerMutate({
			owner: playerId,
			payload: { health: playerState.health - cardState.attack },
		})
		.forEach(registerCommand);

	return commands;
};

export const runFightAt = (duel: DuelState, i: number): DuelCommand[] => {
	const { commands, registerCommand } = createCommandResult();
	const { firstGround, secondGround } = duel;
	const firstId = firstGround[i];
	const secondId = secondGround[i];

	if (firstId && secondId) {
		fightCommands(duel, firstId, secondId).forEach(registerCommand);
		fightCommands(duel, secondId, firstId).forEach(registerCommand);
	} else if (firstId && !secondId) {
		playerAttackCommands(duel, firstId).forEach(registerCommand);
	} else if (!firstId && secondId) {
		playerAttackCommands(duel, secondId).forEach(registerCommand);
	}

	return commands;
};

export const fightCommands = (
	duel: DuelState,
	firstId: string,
	secondId: string,
) => {
	const state = getStateAfterCombat(duel, firstId, secondId);

	return createCommand.cardMutate({
		owner: state.owner,
		target: {
			to: {
				owner: state.owner,
				id: state.id,
				place: state.place,
			},
		},
		payload: { health: state.health },
	});
};

export const getStateAfterCombat = (
	duel: DuelState,
	firstId: string,
	secondId: string,
): CardState => {
	const passivePair = extractPassivePair(duel, firstId, secondId);
	const firstCard = getCard(duel.cardMap, firstId);
	const secondCard = getCard(duel.cardMap, secondId);
	const firstState = getCardState(duel.stateMap, firstId);
	const secondState = getCardState(duel.stateMap, secondId);
	const isAttackerCounter = isDestructive(secondCard, firstCard);
	const isAttackerCountered = isDestructive(firstCard, secondCard);
	const firstCombine = combineAttribute(passivePair[0], firstState);
	const secondCombine = combineAttribute(passivePair[1], secondState);
	const enhancedDamage = getGenerativeDamage(
		secondCombine.attack,
		isAttackerCounter,
		isAttackerCountered,
		duel.setting.elementalFactor,
	);
	const damageAfterDefense = Math.max(0, enhancedDamage - firstCombine.defense);

	return {
		...firstState,
		health: firstState.health - damageAfterDefense,
	};
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

export const getGenerativeDamage = (
	damage: number,
	isCounter: boolean,
	isCountered: boolean,
	factor: number,
): number => {
	if (isCounter) {
		return Math.round(damage * (1 + factor));
	} else if (isCountered) {
		return Math.round(damage * (1 - factor));
	} else {
		return Math.round(damage);
	}
};

export const afterHealthCommands = (
	state: CardState,
	health: number,
): DuelCommand[] => {
	return createCommand.cardMutate({
		owner: state.owner,
		target: {
			to: {
				owner: state.owner,
				id: state.id,
				place: state.place,
			},
		},
		payload: { health },
	});
};

export const emptyPassive: Attribute = {
	attack: 0,
	defense: 0,
	health: 0,
};

const emptyPassiveFunc = (): PassivePair => [emptyPassive, emptyPassive];

const extractPassivePair = (
	duel: DuelState,
	firstCardId: string,
	secondCardId: string,
) => {
	const firstCard = getCard(duel.cardMap, firstCardId);
	const firstPassiveId = firstCard?.skill?.passiveAttribute?.id;
	const firstPassiveFunc = passiveMap[firstPassiveId] || emptyPassiveFunc;
	const secondCard = getCard(duel.cardMap, secondCardId);
	const secondPassiveId = secondCard?.skill?.passiveAttribute?.id;
	const secondPassiveFunc = passiveMap[secondPassiveId] || emptyPassiveFunc;

	return crossCombinePassivePair(
		firstPassiveFunc({ duel, cardId: firstCardId }),
		secondPassiveFunc({ duel, cardId: secondCardId }),
	);
};

const crossCombinePassivePair = (
	firstPair: PassivePair,
	secondPair: PassivePair,
): PassivePair => {
	return [
		{
			attack: firstPair[0].attack + secondPair[1].attack,
			defense: firstPair[0].defense + secondPair[1].defense,
			health: firstPair[0].health + secondPair[1].health,
		},
		{
			attack: firstPair[1].attack + secondPair[0].attack,
			defense: firstPair[1].defense + secondPair[0].defense,
			health: firstPair[1].health + secondPair[0].health,
		},
	];
};

const combineAttribute = (first: Attribute, second: Attribute): Attribute => {
	return {
		attack: first.attack + second.attack,
		defense: first.defense + second.defense,
		health: first.health + second.health,
	};
};
