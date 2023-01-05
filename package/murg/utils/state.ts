import { runCommand } from '../command';
import { skillMap } from '../skill';

import { getCard } from './card';
import {
	ActivationType,
	BundleGroup,
	DuelCommand,
	DuelCommandBundle,
	DuelPlace,
	DuelState,
	InspireSource,
	MoveResult,
} from './type';

/* This file is a collection of functions that uses to manage states
 * most of the functions are Impure that mutate params, be careful! */

export const mergeFragmentToState = (
	state: DuelState,
	{ stateMap, ...props }: Partial<DuelState>,
): void => {
	Object.keys(props).forEach((key) => {
		if (state[key] !== props[key]) {
			state[key] = props[key];
		}
	});

	if (stateMap) {
		Object.keys(stateMap).forEach((id) => {
			if (state.stateMap[id] !== stateMap[id]) {
				state.stateMap[id] = stateMap[id];
			}
		});
	}
};

export const createCommandBundle = (
	duel: DuelState,
	group: BundleGroup,
): DuelCommandBundle => {
	return {
		turn: duel.turn,
		group,
		phase: duel.phase,
		phaseOf: duel.phaseOf,
		commands: [],
	};
};

export const runAndMergeBundle = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	commands: DuelCommand[],
) => {
	commands.forEach((command) => {
		bundle.commands.push(command);
		mergeFragmentToState(duel, runCommand({ duel, command }));
	});

	return bundle;
};

export const createAndMergeBundle = (
	duel: DuelState,
	group: BundleGroup,
	commands: DuelCommand[],
) => {
	const bundle: DuelCommandBundle = {
		turn: duel.turn,
		group,
		phase: duel.phase,
		phaseOf: duel.phaseOf,
		commands: [],
	};

	return runAndMergeBundle(duel, bundle, commands);
};

export const emptyMoveResult: MoveResult = {
	commandBundles: [],
};

export interface ManualHooks {
	castingCardId?: string;
}

export const runAndMergeHooks = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	recentCommands: DuelCommand[],
	manualHooks?: ManualHooks,
): DuelCommandBundle => {
	const castingCardId = manualHooks?.castingCardId;
	const deathCommands = recentCommands.filter(({ target }) => {
		const fromGround = target?.from?.place === DuelPlace.Ground;
		const toGrave = target?.to?.place === DuelPlace.Grave;

		return fromGround && toGrave;
	});

	for (let i = 0; i < duel.setting.groundSize; i += 1) {
		const firstCardId = duel.firstGround[i];
		const secondCardId = duel.secondGround[i];

		createAndMergeInspireDeath(duel, bundle, deathCommands, firstCardId);
		createAndMergeInspireDeath(duel, bundle, deathCommands, secondCardId);

		if (castingCardId) {
			createAndMergeInspireSkill(duel, bundle, firstCardId, castingCardId);
			createAndMergeInspireSkill(duel, bundle, secondCardId, castingCardId);
		}
	}

	return bundle;
};

export const createAndMergeInspireDeath = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	deathCommands: DuelCommand[],
	cardId: string,
) => {
	if (!cardId) return;

	const card = getCard(duel.cardMap, cardId);
	const skill = card?.skill;
	const isInspireDeath =
		skill?.activation === ActivationType.Inspire &&
		skill?.inspire === InspireSource.Death;

	if (!isInspireDeath) return;

	const skillFunc = skillMap[skill.attribute?.id];

	if (!skillFunc) return;

	deathCommands.forEach((command) => {
		const skillCommands = skillFunc({
			duel,
			cardId,
			fromCommand: command,
		});

		skillCommands.forEach((command) => {
			bundle.commands.push(command);
			mergeFragmentToState(duel, runCommand({ duel, command }));
		});

		if (skillCommands.length > 0) {
			runAndMergeHooks(duel, bundle, skillCommands);
		}
	});
};

export const createAndMergeInspireSkill = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	cardId: string,
	castingCardId: string,
) => {
	if (!cardId) return;

	const card = getCard(duel.cardMap, cardId);
	const castingCard = getCard(duel.cardMap, castingCardId);
	const skill = card?.skill;
	const isInspire = skill?.activation === ActivationType.Inspire;
	const isSkillInspire = skill?.inspire === InspireSource.Skill;
	const isElementalInspire =
		skill?.inspire === (castingCard.elemental as never);
	const isInspired = isSkillInspire || isElementalInspire;
	const skillFunc = skillMap[skill.attribute?.id];

	if (isInspire && isInspired && skillFunc) {
		const skillCommands = skillFunc({
			duel,
			cardId,
			fromCardId: castingCardId,
		});

		skillCommands.forEach((command) => {
			bundle.commands.push(command);
			mergeFragmentToState(duel, runCommand({ duel, command }));
		});
	}
};
