import { DuelCommand, DuelPlace, DuelState, PlayerState } from './type';

export const nanoId = () => {
	return 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export interface CommandResult {
	commands: DuelCommand[];
	registerCommand: (command: DuelCommand) => void;
}

export const createCommandResult = (
	defaults: DuelCommand[] = [],
): CommandResult => {
	return {
		commands: defaults,
		registerCommand: (i) => defaults.push(i),
	};
};

export const createDuelFragment = ({
	uniqueCardCount,
}: DuelState): Partial<DuelState> => {
	return {
		uniqueCardCount,
		stateMap: {},
	};
};

export const selectPlayer = (state: DuelState, owner: string): PlayerState => {
	if (!owner) return;
	if (state.firstPlayer.id === owner) {
		return state.firstPlayer;
	}

	return state.secondPlayer;
};

export interface PlayerClone {
	key: string;
	state: PlayerState;
}

export const clonePlayer = (state: DuelState, owner: string): PlayerClone => {
	const isFirst = state.firstPlayer.id === owner;
	const player = selectPlayer(state, owner);

	return {
		key: isFirst ? 'firstPlayer' : 'secondPlayer',
		state: { ...player },
	};
};

export const selectState = (
	duel: DuelState,
	owner: string,
	source: DuelPlace,
): string[] => {
	if (!owner) return;
	const firstSource = `first${source}`;

	if (duel.firstPlayer.id === owner) {
		return duel[firstSource];
	}

	return duel[`second${source}`];
};

export interface StateClone {
	key: string;
	state: string[];
}

export const cloneState = (
	state: DuelState,
	owner: string,
	source: DuelPlace,
): StateClone => {
	const isFirst = state.firstPlayer.id === owner;
	const firstSource = `first${source}`;
	const secondSource = `second${source}`;
	const selectedState = selectState(state, owner, source) as string[];

	return {
		key: isFirst ? firstSource : secondSource,
		state: [...selectedState],
	};
};

export const selectDeck = (state: DuelState, owner: string): string[] => {
	return selectState(state, owner, DuelPlace.Deck);
};

export const selectHand = (state: DuelState, owner: string): string[] => {
	return selectState(state, owner, DuelPlace.Hand);
};

export const selectGround = (state: DuelState, owner: string): string[] => {
	return selectState(state, owner, DuelPlace.Ground);
};

export const selectGrave = (state: DuelState, owner: string): string[] => {
	return selectState(state, owner, DuelPlace.Grave);
};

export const mergeFragmentToState = (
	state: DuelState,
	fragment: Partial<DuelState>,
): void => {
	[
		'uniqueCardCount',
		'turn',
		'phase',
		'phaseOf',
		'firstMover',
		'firstPlayer',
		'secondPlayer',
		'firstDeck',
		'secondDeck',
		'firstHand',
		'secondHand',
		'firstGround',
		'secondGround',
		'firstGrave',
		'secondGrave',
	].forEach((key) => {
		state[key] = fragment[key] || state[key];
	});

	Object.keys(fragment.stateMap || {}).forEach((id) => {
		state.stateMap[id] = fragment.stateMap[id];
	});
};
