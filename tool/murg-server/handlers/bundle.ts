import {
	BundleGroup,
	DuelCommandBundle,
	DuelState,
	getInitialState,
	getWinner,
	mergeFragmentToState,
	move,
	MoveResult,
	runCommand,
} from '@metacraft/murg-engine';

import { CommandHandler, DuelCommands } from '../util/type';

import { fetchDuel } from './internal';

export const onIncomingBundle: CommandHandler<DuelCommandBundle[]> = async (
	{ duelId, send },
	incomingBundles,
) => {
	console.log("fgjsngjfnvsnsvsndvjsdnvsnvdisnfvpwern", incomingBundles)
	const duelRecord = fetchDuel(duelId);
	const { config, history } = duelRecord;
	const level = history.length;
	const duel = getInitialState(config);
	console.log("1")
	runBundles(duel, history);
	const autoBundles = fillAndRunBundles(duel, incomingBundles);
	const winner = getWinner(duel);

	autoBundles.forEach((bundle) => history.push(bundle));
	console.log("2")
	await send({ level, bundles: autoBundles });
	console.log("3")
	if (winner) {
		duelRecord.winner = winner;
		await send({ winner }, DuelCommands.GameOver);
	}

	try {
		require('fs').writeFileSync(
			'duel.json',
			JSON.stringify(duelRecord, null, 2),
		);
	} catch (e) {
		console.log(e);
	}
};

export const runBundles = (duel: DuelState, bundles: DuelCommandBundle[]) => {
	bundles.forEach((bundle) => {
		bundle.commands.forEach((command) => {
			mergeFragmentToState(duel, runCommand({ duel, command }));
		});
	});
};

export const fillAndRunBundles = ( // Phần này sẽ xử lý các move của 2 người
	duel: DuelState,
	bundles: DuelCommandBundle[],
) => {
	const responseBundles: DuelCommandBundle[] = [];
	const registerBundle = (bundle: DuelCommandBundle) => {
		if (bundle.commands.length > 0) {
			responseBundles.push(bundle);
			bundle.commands.forEach((command) => {
				mergeFragmentToState(duel, runCommand({ duel, command }));
			});
		}
	};

	const injectMove = ({ duel: fragment, commandBundles }: MoveResult) => {
		if (commandBundles.length > 0) {
			mergeFragmentToState(duel, fragment);
			commandBundles.forEach((bundle) => responseBundles.push(bundle));
		}
	};

	bundles.forEach((bundle) => {
		console.log("I got the bundles here", bundle)
		registerBundle(bundle);

		if (bundle.group === BundleGroup.Summon) { // Các thao tác move ở đây
			injectMove(move.reinforce(duel));
		} else if (bundle.group === BundleGroup.EndTurn) {
			if (bundle.phaseOf === duel.firstPlayer.id) {
				injectMove(move.distributeTurnCards(duel));// chia bài cho thằng B
			} else {
				injectMove(move.preFight(duel));
				injectMove(move.reinforce(duel));
				injectMove(move.fight(duel));
				injectMove(move.reinforce(duel));
				injectMove(move.postFight(duel));
				injectMove(move.reinforce(duel));
				injectMove(move.turnCleanUp(duel));
				injectMove(move.distributeTurnCards(duel));
			}
		}
	});

	return responseBundles;
};
