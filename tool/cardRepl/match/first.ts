import {
	createMove,
	DuelCommand,
	DuelState,
	MoveResult,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';

const duel = require('./0001.json');

export const initialState = duel.state;

export const replay = async () => {
	let snapshot: DuelState = clone(duel.state);
	const commandHistory: Array<DuelCommand[]> = [];

	const runMove = (f: () => MoveResult) => {
		const { state, commands } = f();

		snapshot = state;
		commandHistory.push(commands);
	};

	runMove(() => createMove.distributeCards(snapshot, 5));

	return {
		state: snapshot,
		history: commandHistory,
	};
};
