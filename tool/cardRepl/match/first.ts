import {
	createCommand,
	DuelCommand,
	DuelState,
	runCommand,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';

const duel = require('./0001.json');

const A = 'A';
const B = 'B';

export const initialState = duel.state;

export const replay = async () => {
	let state: DuelState = clone(duel.state);
	const commandHistory: Array<DuelCommand[]> = [];

	const runCommands = (commands: DuelCommand[]): void => {
		if (commands.length > 0) {
			commandHistory.push(commands);
		}

		commands.forEach((command: DuelCommand) => {
			state = {
				...state,
				...runCommand({ state, command }),
			};
		});
	};

	const drawCommands = [A, A, A, A, A, B, B, B, B, B].map((owner) => {
		return createCommand.cardDraw({ state, owner })[0];
	});

	runCommands(drawCommands);

	return {
		state,
		history: commandHistory,
	};
};
