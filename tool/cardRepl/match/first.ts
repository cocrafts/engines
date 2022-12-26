import {
	DuelCommandBundle,
	DuelState,
	getInitialState,
	mergeFragmentToState,
	move,
	MoveResult,
	runCommand,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';

const cache = require('./cache.json');

export const initialState = getInitialState(cache.config);

export const replay = async () => {
	const duel: DuelState = clone(initialState);
	const commandHistory: DuelCommandBundle[] = [];

	const runMove = (move: () => MoveResult) => {
		const { duel, commandBundles } = move();

		mergeFragmentToState(duel, duel);
		commandBundles.forEach((bundle) => commandHistory.push(bundle));
	};

	const runCommandBundles = (bundles: DuelCommandBundle[]) => {
		bundles.forEach((bundle) => {
			bundle.commands.forEach((command) => {
				mergeFragmentToState(duel, runCommand({ duel, command }));
			});

			commandHistory.push(bundle);
		});
	};

	// runCommandBundles(require('./distribute.json'));
	runMove(() => move.distributeInitialCards(duel));

	require('fs').writeFileSync(
		'distribute.json',
		JSON.stringify(commandHistory),
	);

	return {
		duel,
		history: commandHistory,
	};
};
