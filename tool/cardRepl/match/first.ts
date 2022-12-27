import {
	DuelCommandBundle,
	DuelPlace,
	DuelState,
	getInitialState,
	mergeFragmentToState,
	move,
	MoveResult,
	runCommand,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';

const cache = require('./cache.json');

const redistribute = false;
export const initialState = getInitialState(cache.config);

export const replay = async () => {
	const duel: DuelState = clone(initialState);
	const commandHistory: DuelCommandBundle[] = [];

	const runMove = (move: () => MoveResult) => {
		const { duel: fragment, commandBundles } = move();

		if (fragment) mergeFragmentToState(duel, fragment);
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

	if (redistribute) {
		runMove(() => move.distributeInitialCards(duel));
		require('fs').writeFileSync(
			'distribute.json',
			JSON.stringify(commandHistory),
		);
	} else {
		runCommandBundles(require('./distribute.json'));
	}

	runMove(() => move.distributeTurnCards(duel));

	return {
		duel,
		history: commandHistory,
	};
};
