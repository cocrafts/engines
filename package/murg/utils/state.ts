import { runCommand } from '../command';
import { skillMap } from '../skill';

import { getCard } from './card';
import {
	ActivationType,
	BundleGroup,
	CommandSourceType,
	DuelCommand,
	DuelCommandBundle,
	DuelPlace,
	DuelState,
	InspireSource,
	MoveResult,
	SkillRunner,
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

export const runAndMergeHooks = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	recentCommands: DuelCommand[],
): DuelCommandBundle => {
	const deathCommands: DuelCommand[] = [];
	const summonCommands: DuelCommand[] = [];
	const skillCommands: DuelCommand[] = [];

	for (let i = 0; i < recentCommands.length; i += 1) {
		const command = recentCommands[i];
		const { target } = command;
		const fromHand = target?.from?.place === DuelPlace.Hand;
		const fromGround = target?.from?.place === DuelPlace.Ground;
		const toGrave = target?.to?.place === DuelPlace.Grave;
		const toGround = target?.to?.place === DuelPlace.Ground;
		const isDeath = fromGround && toGrave;
		const isSummon = fromHand && toGround;
		const isSourceBySkill = target?.source?.type === CommandSourceType.Skill;

		if (isDeath) {
			deathCommands.push(command);
		}

		if (isSummon) {
			summonCommands.push(command);
		}

		if (isSourceBySkill) {
			skillCommands.push(command);
		}
	}

	for (let i = 0; i < duel.setting.groundSize; i += 1) {
		const firstCardId = duel.firstGround[i];
		const secondCardId = duel.secondGround[i];

		createAndMergeInspireSkill(duel, bundle, skillCommands, firstCardId);
		createAndMergeInspireSkill(duel, bundle, skillCommands, secondCardId);

		createAndMergeInspireSummon(duel, bundle, summonCommands, firstCardId);
		createAndMergeInspireSummon(duel, bundle, summonCommands, secondCardId);

		createAndMergeInspireDeath(duel, bundle, deathCommands, firstCardId);
		createAndMergeInspireDeath(duel, bundle, deathCommands, secondCardId);
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
	const skillFunc = skillMap[skill.attribute?.id];

	if (!isInspireDeath || !skillFunc) return;

	recursiveRunAndMergeInspire(duel, bundle, deathCommands, skillFunc, cardId);
};

export const createAndMergeInspireSummon = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	summonCommands: DuelCommand[],
	cardId: string,
) => {
	if (!cardId) return;

	const card = getCard(duel.cardMap, cardId);
	const skill = card?.skill;
	const isInspireSummon =
		skill?.activation === ActivationType.Inspire &&
		skill?.inspire === InspireSource.Summon;
	const skillFunc = skillMap[skill.attribute?.id];

	if (!isInspireSummon || !skillFunc) return;

	recursiveRunAndMergeInspire(duel, bundle, summonCommands, skillFunc, cardId);
};

export const createAndMergeInspireSkill = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	skillCommands: DuelCommand[],
	cardId: string,
) => {
	if (!cardId) return;

	const card = getCard(duel.cardMap, cardId);
	const skill = card?.skill;
	const isInspire = skill?.activation === ActivationType.Inspire;
	const isSkillInspire = skill?.inspire === InspireSource.Skill;
	const skillFunc = skillMap[skill.attribute?.id];

	if (!isInspire || !skillFunc) return;

	skillCommands.forEach((command) => {
		const fromCardId = command.target?.source?.id;
		const fromCard = getCard(duel.cardMap, fromCardId);
		const isElementalInspire = fromCard?.elemental === (skill.inspire as never);
		const isInspired = isSkillInspire || isElementalInspire;

		if (!isInspired) return;

		const innerSkillCommands = skillFunc({
			duel,
			cardId,
			fromCommand: command,
		});

		innerSkillCommands.forEach((command) => {
			bundle.commands.push(command);
			mergeFragmentToState(duel, runCommand({ duel, command }));
		});

		if (innerSkillCommands.length > 0) {
			runAndMergeHooks(duel, bundle, innerSkillCommands);
		}
	});
};

const recursiveRunAndMergeInspire = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	inspiringCommands: DuelCommand[],
	skillFunc: SkillRunner,
	cardId: string,
) => {
	inspiringCommands.forEach((command) => {
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
