import {
	getInitialState,
	mergeFragmentToState,
	move,
	MoveResult,
	runCommand,
} from '@metacraft/murg-engine';

const { config, history } = require('./duel.json');

const slicedHistory = history.slice(0, 162);
const duel = getInitialState(config);

const runMove = (move: MoveResult) => {
	const { duel: fragment, commandBundles } = move;

	if (fragment) mergeFragmentToState(duel, fragment);
	commandBundles.forEach((bundle) => slicedHistory.push(bundle));
};

for (let i = 0; i < slicedHistory.length; i += 1) {
	const bundle = slicedHistory[i];

	bundle.commands.forEach((command) => {
		mergeFragmentToState(duel, runCommand({ duel, command }));
	});
}

runMove(move.reinforce(duel));

export default {
	config: config,
	history: slicedHistory,
};
