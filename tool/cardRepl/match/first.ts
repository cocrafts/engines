import {
	CommandHistory,
	DuelState,
	move,
	MoveResult,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';

const duel = require('./0001.json');

export const initialState = duel.state;

export const replay = async () => {
	let snapshot: DuelState = clone(duel.state);
	const commandHistory: CommandHistory = [];

	const runMove = (f: () => MoveResult) => {
		const { state, bundles } = f();

		snapshot = state;
		bundles.forEach((bundle) => commandHistory.push(bundle));
	};

	runMove(() => move.distributeCards(snapshot, 5));

	console.log(commandHistory);
	return {
		state: snapshot,
		history: commandHistory,
	};
};
