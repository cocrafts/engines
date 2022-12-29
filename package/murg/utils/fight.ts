import { createCommand } from '../command';

import { getCard, getCardState } from './card';
import { createCommandResult, getEnemyId, selectPlayer } from './helper';
import {
	Card,
	CardState,
	DuelCommand,
	DuelPlace,
	DuelState,
	ElementalType,
	GenerativeValue,
} from './type';

export const runFightAt = (duel: DuelState, i: number): DuelCommand[] => {
	const { commands, registerCommand } = createCommandResult();
	const { firstGround, secondGround } = duel;
	const firstCardId = firstGround[i];
	const secondCardId = secondGround[i];

	if (firstCardId && secondCardId) {
		cardCombatCommands(duel, firstCardId, secondCardId).forEach(
			registerCommand,
		);
	} else if (firstCardId && !secondCardId) {
		playerAttackCommands(duel, firstCardId).forEach(registerCommand);
	} else if (!firstCardId && secondCardId) {
		playerAttackCommands(duel, secondCardId).forEach(registerCommand);
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

export const getGenerativeDamage = (
	damage: number,
	isCounter: boolean,
	isCountered: boolean,
	factor: number,
): number => {
	if (isCounter) {
		return damage * (1 + factor);
	} else if (isCountered) {
		return damage * (1 - factor);
	} else {
		return damage;
	}
};

export const getDamage = (
	duel: DuelState,
	firstId: string,
	secondId: string,
): GenerativeValue => {
	const firstCard = getCard(duel.cardMap, firstId);
	const secondCard = getCard(duel.cardMap, secondId);
	const firstState = getCardState(duel.stateMap, firstId);
	const isCounter = isDestructive(firstCard, secondCard);
	const isCountered = isDestructive(secondCard, firstCard);
	const enhancedDamage = getGenerativeDamage(
		firstState.attack,
		isCounter,
		isCountered,
		duel.setting.elementalFactor,
	);

	return {
		bare: firstState.attack,
		enhanced: enhancedDamage,
		isCounter,
		isCountered,
	};
};

export const getHealthAfterDamage = (
	{ health, defense }: CardState,
	{ enhanced }: GenerativeValue,
): number => {
	return health - Math.max(0, enhanced - defense);
};

export const getDamagePair = (
	duel: DuelState,
	firstId: string,
	secondId: string,
): [GenerativeValue, GenerativeValue] => {
	return [
		getDamage(duel, firstId, secondId),
		getDamage(duel, secondId, firstId),
	];
};

export const afterHealthCommands = (
	state: CardState,
	health: number,
): DuelCommand[] => {
	if (health > 0) {
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
	}

	return createCommand.cardMove({
		owner: state.owner,
		target: {
			from: {
				owner: state.owner,
				id: state.id,
				place: state.place,
			},
			to: {
				owner: state.owner,
				place: DuelPlace.Grave,
			},
		},
	});
};

export const cardCombatCommands = (
	duel: DuelState,
	firstId: string,
	secondId: string,
) => {
	const { commands, registerCommand } = createCommandResult();
	const [firstDamage, secondDamage] = getDamagePair(duel, firstId, secondId);
	const firstState = getCardState(duel.stateMap, firstId);
	const secondState = getCardState(duel.stateMap, secondId);
	const firstHealthAfter = getHealthAfterDamage(firstState, secondDamage);
	const secondHealthAfter = getHealthAfterDamage(secondState, firstDamage);

	afterHealthCommands(firstState, firstHealthAfter).forEach(registerCommand);
	afterHealthCommands(secondState, secondHealthAfter).forEach(registerCommand);

	return commands;
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
