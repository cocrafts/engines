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
import * as history from './commands';

const redistribute = false;
export const initialState = getInitialState(cache.config);

export const replay = async () => {
	const duel: DuelState = clone(initialState);
	const commandHistory: DuelCommandBundle[] = [];

	const runMove = (move: MoveResult) => {
		const { duel: fragment, commandBundles } = move;

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
		runMove(move.distributeInitialCards(duel));
		require('fs').writeFileSync(
			'distribute.json',
			JSON.stringify(commandHistory),
		);

		runMove(move.distributeTurnCards(duel));
	} else {
		runCommandBundles(history.initialDistribute);
		runCommandBundles(history.drawA1);
		runCommandBundles(history.summonA1Hero);
		runCommandBundles(history.summonA1Troop);
		// runMove(
		// 	move.summonCard(duel, {
		// 		from: {
		// 			owner: duel.secondPlayer.id,
		// 			id: duel.secondHand[1],
		// 			place: DuelPlace.Hand,
		// 		},
		// 		to: {
		// 			owner: duel.secondPlayer.id,
		// 			place: DuelPlace.Ground,
		// 			index: 5,
		// 		},
		// 	}),
		// );
	}

	return {
		duel,
		history: commandHistory,
	};
};

const printMove = (move: MoveResult): void => {
	console.log(JSON.stringify(move.commandBundles));
};
