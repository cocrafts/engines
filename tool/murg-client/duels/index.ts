import {
	DuelPlace,
	getInitialState,
	mergeFragmentToState,
	move,
	MoveResult,
	runCommand,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';
import { selectBestMove } from '../../botTemp/botTest';

const { config, history } = require('./duel.json');

const slicedHistory = history.slice(0, 162);
let duel = getInitialState(config);

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

runMove(
	move.summonCard(duel, {
		from: {
			owner: 'A',
			place: DuelPlace.Hand,
			id: '000070007#26',
		},
		to: {
			owner: 'A',
			place: DuelPlace.Ground,
			index: 5,
		},
	}),
);

runMove(
	move.summonCard(duel, {
		from: {
			owner: 'A',
			place: DuelPlace.Hand,
			id: '999990000#59',
		},
		to: {
			owner: 'A',
			place: DuelPlace.Ground,
			index: 6,
		},
	}),
);

runMove(move.endTurn(duel));
runMove(move.distributeTurnCards(duel));
// let curCommand = selectBestMove(duel, 1)
// mergeFragmentToState(duel, curCommand)
// console.log(duel.secondGround)
let tmp = clone(duel)
duel = selectBestMove(tmp, 1)
console.log("Duel ground is here", duel.firstGround, duel.secondGround)
runMove(move.turnCleanUp(duel));
runMove(move.turnCleanUp(duel));

runMove(
	move.activateChargeSkill(duel, {
		from: {
			owner: 'A',
			place: DuelPlace.Ground,
			id: '000070007#26',
		},
	}),
);
console.log(duel.stateMap['000070007#26']);

runMove(move.reinforce(duel));

export default {
	config: config,
	history: slicedHistory,
};
