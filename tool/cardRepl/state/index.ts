import {
	commandCreators,
	DuelCommand,
	DuelPlace,
	DuelSetup,
	DuelState,
	fetchGameMeta,
	getInitialSnapshot,
	runCommand,
} from '@cocrafts/card';
import { proxy } from 'valtio';

const rawSetup = `{"version":"jun0422","firstMover":"A", "player": ["A", "B"], "deck":[["00010000","00030000","00040000","00080000","00160000","00190000","00210000","00240000","00250000","00300000","00310000","00320000","00360000","00370000","00390000","00400000","00440000","00450000","00460000","00470000","00480000","00500000","00510000","00540000","00550000","00560000","00570000","00590000","00610000","00620000","00640000","00660000","00670000","00680000","00700000","00710000","00730000","00740000","00770000","00790000"],["00010000","00030000","00040000","00050000","00070000","00090000","00130000","00140000","00150000","00160000","00190000","00220000","00230000","00270000","00280000","00290000","00320000","00340000","00420000","00440000","00450000","00480000","00490000","00570000","00580000","00590000","00600000","00610000","00630000","00640000","00660000","00670000","00680000","00690000","00700000","00720000","00730000","00740000","00790000","00800000"]]}`;
const setup: DuelSetup = JSON.parse(rawSetup);

const defaultMeta = fetchGameMeta('jun0422');
export const initialState: DuelState = getInitialSnapshot(defaultMeta, setup);

export const game = proxy<DuelState>(initialState);

export const runCommands = (commands: DuelCommand[]) => {
	commands.forEach((command) => {
		const changes = runCommand({ snapshot: game, command });

		Object.keys(changes).forEach((key) => {
			game[key] = changes[key];
		});
	});
};

const sleep = (amount: number) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, amount);
	});
};

const replayDuel = async () => {
	const drawCommands = [
		{ creator: 'A', type: 1, from: [0, '00550000', 24], target: [1] },
		{ creator: 'B', type: 1, from: [0, '00220000', 11], target: [1] },
		{ creator: 'A', type: 1, from: [0, '00700000', 33], target: [1] },
		{ creator: 'B', type: 1, from: [0, '00720000', 34], target: [1] },
		{ creator: 'A', type: 1, from: [0, '00670000', 31], target: [1] },
		{ creator: 'B', type: 1, from: [0, '00700000', 33], target: [1] },
		{ creator: 'A', type: 1, from: [0, '00450000', 17], target: [1] },
		{ creator: 'B', type: 1, from: [0, '00290000', 14], target: [1] },
		{ creator: 'A', type: 1, from: [0, '00560000', 23], target: [1] },
		{ creator: 'B', type: 1, from: [0, '00570000', 21], target: [1] },
	];

	for (let i = 0; i < drawCommands.length; i += 1) {
		runCommands([drawCommands[i]] as DuelCommand[]);
		await sleep(200);
	}

	await sleep(500);

	runCommands(
		commandCreators.move({
			creator: 'A',
			snapshot: game,
			from: [DuelPlace.Hand, game.hand[0][0].id, 0],
			target: [DuelPlace.Ground],
		}),
	);

	await sleep(500);

	runCommands(
		commandCreators.move({
			creator: 'B',
			snapshot: game,
			from: [DuelPlace.Hand, game.hand[1][1].id, 1],
			target: [DuelPlace.Ground],
		}),
	);
};

replayDuel();
