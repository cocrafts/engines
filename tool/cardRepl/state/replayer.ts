import {
	commandCreators,
	DuelCommand,
	DuelPlace,
	DuelState,
	runCommand,
} from '@cocrafts/card';
import clone from 'lodash/cloneDeep';

import { initialState } from './internal';
import { drawCommands } from './samples';

export const replay = async () => {
	let snapshot: DuelState = clone(initialState);
	const commandHistory: Array<DuelCommand[]> = [];

	const runBatch = (batch: DuelCommand[]) => {
		commandHistory.push(batch);

		batch.forEach((command: DuelCommand) => {
			snapshot = {
				...snapshot,
				...runCommand({ snapshot, command }),
			};
		});
	};

	// for (let i = 0; i < 10; i += 1) {
	// 	const creator = i < 5 ? 'A' : 'B';
	// 	const drawInstructions = commandCreators.draw({ creator, snapshot });
	//
	// 	runBatch(drawInstructions);
	// 	commandHistory.push(drawInstructions);
	// }

	drawCommands.forEach((batch) => runBatch(batch as never));

	runBatch(
		commandCreators.move({
			owner: 'A',
			snapshot,
			from: {
				id: snapshot.hand[0][1].id,
				position: 1,
				place: DuelPlace.Hand,
			},
			target: {
				place: DuelPlace.Ground,
			},
		}),
	);

	runBatch(
		commandCreators.move({
			owner: 'B',
			snapshot,
			from: {
				id: snapshot.hand[1][1].id,
				position: 1,
				place: DuelPlace.Hand,
			},
			target: {
				place: DuelPlace.Ground,
			},
		}),
	);

	runBatch(commandCreators.combat({ snapshot }));

	return {
		snapshot,
		history: commandHistory,
	};
};
