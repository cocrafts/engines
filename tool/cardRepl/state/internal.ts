import {
	DuelCommand,
	DuelSetup,
	DuelState,
	fetchGameMeta,
	getInitialSnapshot,
	runCommand,
} from '@cocrafts/card';
import clone from 'lodash/cloneDeep';

const setup: DuelSetup = {
	version: 'jun0422',
	setting: {
		handSize: 9,
		groundSize: 11,
		maxAttachment: 2,
		perTurnHero: 1,
		perTurnTroop: 1,
	},
	firstMover: 'A',
	player: ['A', 'B'],
	deck: [
		[
			'00010000',
			'00030000',
			'00040000',
			'00080000',
			'00160000',
			'00190000',
			'00210000',
			'00240000',
			'00250000',
			'00300000',
			'00310000',
			'00320000',
			'00360000',
			'00370000',
			'00390000',
			'00400000',
			'00440000',
			'00450000',
			'00460000',
			'00470000',
			'00480000',
			'00500000',
			'00510000',
			'00540000',
			'00550000',
			'00560000',
			'00570000',
			'00590000',
			'00610000',
			'00620000',
			'00640000',
			'00660000',
			'00670000',
			'00680000',
			'00700000',
			'00710000',
			'00730000',
			'00740000',
			'00770000',
			'00790000',
		],
		[
			'00010000',
			'00030000',
			'00040000',
			'00050000',
			'00070000',
			'00090000',
			'00130000',
			'00140000',
			'00150000',
			'00160000',
			'00190000',
			'00220000',
			'00230000',
			'00270000',
			'00280000',
			'00290000',
			'00320000',
			'00340000',
			'00420000',
			'00440000',
			'00450000',
			'00480000',
			'00490000',
			'00570000',
			'00580000',
			'00590000',
			'00600000',
			'00610000',
			'00630000',
			'00640000',
			'00660000',
			'00670000',
			'00680000',
			'00690000',
			'00700000',
			'00720000',
			'00730000',
			'00740000',
			'00790000',
			'00800000',
		],
	],
};

const defaultMeta = fetchGameMeta('jun0422');
export const initialState: DuelState = getInitialSnapshot(defaultMeta, setup);

const listeners = [];
export const game: DuelState = clone(initialState);

export const subscribe = (callback: (state: DuelState) => void) => {
	listeners.push(callback);
};

export const broadcast = () => {
	listeners.forEach((callback) => callback?.(game));
};

export const runCommands = (commands: DuelCommand[]) => {
	commands.forEach((command) => {
		const changes = runCommand({ snapshot: game, command });

		Object.keys(changes).forEach((key) => {
			game[key] = changes[key];
		});

		listeners.forEach((callback) => callback?.(game));
	});
};
