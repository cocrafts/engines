import {
	commandCreators,
	DuelCommand,
	DuelPlace,
	DuelState,
	runCommand,
} from '@cocrafts/card';
import clone from 'lodash/cloneDeep';

import { initialState } from '../internal';

export const replay = async () => {
	let snapshot: DuelState = clone(initialState);
	const commandHistory: Array<DuelCommand[]> = [];

	const runBatch = (batch: DuelCommand[]) => {
		if (batch.length > 0) {
			commandHistory.push(batch);
		}

		batch.forEach((command: DuelCommand) => {
			snapshot = {
				...snapshot,
				...runCommand({ snapshot, command }),
			};
		});
	};

	const progress = () => {
		runBatch(commandCreators.boardSkill({ snapshot }));
		runBatch(commandCreators.boardReinforce({ snapshot }));
		runBatch(commandCreators.boardCombat({ snapshot }));
		runBatch(commandCreators.boardReinforce({ snapshot }));
		runBatch(commandCreators.boardEnd({ snapshot }));
	};

	[
		[
			{
				owner: 'A',
				type: 1,
				from: { place: 0, id: '00770000', position: 38 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'A',
				type: 1,
				from: { place: 0, id: '00010000', position: 0 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'A',
				type: 1,
				from: { place: 0, id: '00540000', position: 22 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'A',
				type: 1,
				from: { place: 0, id: '00400000', position: 14 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'A',
				type: 1,
				from: { place: 0, id: '00450000', position: 15 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'B',
				type: 1,
				from: { place: 0, id: '00790000', position: 38 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'B',
				type: 1,
				from: { place: 0, id: '00220000', position: 11 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'B',
				type: 1,
				from: { place: 0, id: '00570000', position: 22 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'B',
				type: 1,
				from: { place: 0, id: '00040000', position: 2 },
				target: { place: 1 },
			},
		],
		[
			{
				owner: 'B',
				type: 1,
				from: { place: 0, id: '00190000', position: 9 },
				target: { place: 1 },
			},
		],
	].forEach(runBatch);

	runBatch(
		commandCreators.cardMove({
			owner: 'A',
			snapshot,
			from: {
				id: snapshot.hand[0][1].id,
				position: 1,
				place: DuelPlace.Hand,
				owner: 'A',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'A',
			},
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'A',
			snapshot,
			from: {
				id: '9999',
				place: DuelPlace.Player,
				owner: 'A',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'A',
			},
		}),
	);

	return {
		snapshot,
		history: commandHistory,
	};
};
