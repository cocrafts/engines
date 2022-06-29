import {
	commandCreators,
	DuelCommand,
	DuelPlace,
	DuelState,
	runCommand,
	SummonSide,
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
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: snapshot.hand[1][1].id,
				position: 1,
				place: DuelPlace.Hand,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '9999',
				place: DuelPlace.Player,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Right,
		}),
	);

	progress();

	runBatch([
		{
			owner: 'A',
			type: 1,
			from: { id: '00440000', position: 14, place: 0 },
			target: { place: 1 },
		},
		{
			owner: 'B',
			type: 1,
			from: { id: '00340000', position: 14, place: 0 },
			target: { place: 1 },
		},
	]);

	runBatch(
		commandCreators.cardMove({
			owner: 'A',
			snapshot,
			from: {
				id: '0040',
				position: 2,
				place: DuelPlace.Hand,
				owner: 'A',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'A',
			},
			side: SummonSide.Left,
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
			side: SummonSide.Left,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '0034',
				position: 4,
				place: DuelPlace.Hand,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '9999',
				place: DuelPlace.Player,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Left,
		}),
	);

	progress();

	runBatch([
		{
			owner: 'A',
			type: 1,
			from: { id: '00700000', position: 28, place: 0 },
			target: { place: 1 },
		},
		{
			owner: 'B',
			type: 1,
			from: { id: '00580000', position: 19, place: 0 },
			target: { place: 1 },
		},
	]);

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
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'A',
			snapshot,
			from: {
				id: '0044',
				position: 3,
				place: DuelPlace.Hand,
				owner: 'A',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'A',
			},
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '9999',
				place: DuelPlace.Player,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Left,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '0004',
				position: 2,
				place: DuelPlace.Hand,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Left,
		}),
	);

	progress();

	runBatch([
		{
			owner: 'A',
			type: 1,
			from: { id: '00620000', position: 24, place: 0 },
			target: { place: 1 },
		},
		{
			owner: 'B',
			type: 1,
			from: { id: '00070000', position: 3, place: 0 },
			target: { place: 1 },
		},
	]);

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
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'A',
			snapshot,
			from: {
				id: '0045',
				position: 2,
				place: DuelPlace.Hand,
				owner: 'A',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'A',
			},
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '9999',
				place: DuelPlace.Player,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '0007',
				position: 4,
				place: DuelPlace.Hand,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Left,
		}),
	);

	progress();

	runBatch([
		{
			owner: 'A',
			type: 1,
			from: { id: '00250000', position: 7, place: 0 },
			target: { place: 1 },
		},
		{
			owner: 'B',
			type: 1,
			from: { id: '00050000', position: 2, place: 0 },
			target: { place: 1 },
		},
	]);

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
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'A',
			snapshot,
			from: {
				id: '0054',
				position: 1,
				place: DuelPlace.Hand,
				owner: 'A',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'A',
			},
			side: SummonSide.Left,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '9999',
				place: DuelPlace.Player,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Right,
		}),
	);

	runBatch(
		commandCreators.cardMove({
			owner: 'B',
			snapshot,
			from: {
				id: '0019',
				position: 2,
				place: DuelPlace.Hand,
				owner: 'B',
			},
			target: {
				place: DuelPlace.Ground,
				owner: 'B',
			},
			side: SummonSide.Right,
		}),
	);

	progress();
	// runBatch(commandCreators.boardCombat({ snapshot }));
	// runBatch(commandCreators.boardReinforce({ snapshot }));
	// runBatch(commandCreators.boardEnd({ snapshot }));

	// console.log(commandCreators.cardDraw({ owner: 'A', snapshot }));
	// console.log(commandCreators.cardDraw({ owner: 'B', snapshot }));
	// progress();

	return {
		snapshot,
		history: commandHistory,
	};
};
