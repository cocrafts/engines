export * from './internal';
export * from './replayer';

// const sleep = (amount: number) => {
// 	return new Promise((resolve) => {
// 		setTimeout(() => {
// 			resolve(true);
// 		}, amount);
// 	});
// };
//
// const replayDuel = async () => {
// 	const drawCommands = [
// 		{ creator: 'A', type: 1, from: [0, '00550000', 24], target: [1] },
// 		{ creator: 'B', type: 1, from: [0, '00220000', 11], target: [1] },
// 		{ creator: 'A', type: 1, from: [0, '00700000', 33], target: [1] },
// 		{ creator: 'B', type: 1, from: [0, '00720000', 34], target: [1] },
// 		{ creator: 'A', type: 1, from: [0, '00670000', 31], target: [1] },
// 		{ creator: 'B', type: 1, from: [0, '00700000', 33], target: [1] },
// 		{ creator: 'A', type: 1, from: [0, '00450000', 17], target: [1] },
// 		{ creator: 'B', type: 1, from: [0, '00290000', 14], target: [1] },
// 		{ creator: 'A', type: 1, from: [0, '00560000', 23], target: [1] },
// 		{ creator: 'B', type: 1, from: [0, '00570000', 21], target: [1] },
// 	];
//
// 	for (let i = 0; i < drawCommands.length; i += 1) {
// 		runCommands([drawCommands[i]] as DuelCommand[]);
// 		// await sleep(200);
// 	}
//
// 	// await sleep(500);
// 	runCommands(
// 		commandCreators.move({
// 			creator: 'A',
// 			snapshot: game,
// 			from: [DuelPlace.Hand, game.hand[0][0].id, 0],
// 			target: [DuelPlace.Ground],
// 		}),
// 	);
//
// 	// await sleep(500);
// 	runCommands(
// 		commandCreators.move({
// 			creator: 'B',
// 			snapshot: game,
// 			from: [DuelPlace.Hand, game.hand[1][1].id, 1],
// 			target: [DuelPlace.Ground],
// 		}),
// 	);
// };
//
// replayDuel();
