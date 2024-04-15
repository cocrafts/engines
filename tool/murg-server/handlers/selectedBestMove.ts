import {
	DuelCommandBundle,
	DuelPlace,
	DuelState,
	mergeFragmentToState,
	move,
	MoveResult,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';

function addMove(
	curDuel: DuelState,
	firstCard: string,
	secondCard: string,
	firstPosition: number,
	secondPosition: number,
) {
	const currentState = clone(curDuel);
	const allCurMoveBundle = [];
	const runMove = (move: MoveResult) => {
		const { duel: fragment, commandBundles } = move;
		if (fragment) mergeFragmentToState(currentState, fragment);
		return commandBundles;
	};

	const firstMove = runMove(
		move.summonCard(currentState, {
			from: {
				owner: currentState.secondPlayer.id,
				place: DuelPlace.Hand,
				id: firstCard,
			},
			to: {
				owner: currentState.secondPlayer.id,
				place: DuelPlace.Ground,
				index: firstPosition,
			},
		}),
	);
	allCurMoveBundle.push(firstMove);

	const secondMove = runMove(
		move.summonCard(currentState, {
			from: {
				owner: currentState.secondPlayer.id,
				place: DuelPlace.Hand,
				id: secondCard,
			},
			to: {
				owner: currentState.secondPlayer.id,
				place: DuelPlace.Ground,
				index: secondPosition,
			},
		}),
	);
	allCurMoveBundle.push(secondMove);

	return [currentState, allCurMoveBundle];
}

function getNullIndex(indexPositionGround: string[]): number[] {
	const res: number[] = [];
	if (indexPositionGround[5] === null) {
		res.push(5);
		return res;
	} else {
		for (let i = 0; i < indexPositionGround.length; i++) {
			if (indexPositionGround[i] === null && indexPositionGround[i + 1] != null)
				res.push(i);
			else if (
				indexPositionGround[i] === null &&
				indexPositionGround[i - 1] != null
			)
				res.push(i);
		}
		return res;
	}
}

function isSubarrayExist(array: number[], subarray: number[]): boolean {
	for (let i = 0; i < array.length; i++) {
		if (array[i] !== subarray[0]) {
			continue;
		}

		let isEqual = true;
		for (let j = 0; j < subarray.length; j++) {
			if (array[i + j] !== subarray[j]) {
				isEqual = false;
				break;
			}
		}

		if (isEqual) {
			return true;
		}
	}
	return false;
}

type generateStatesType = {
	allStates: DuelState[];
	allMoveBundle: DuelCommandBundle[];
};

function generateStates(duel: DuelState): generateStatesType {
	const allStates = [];
	const allMoveBundle = [];
	const botHand = clone(duel.secondHand);
	const allPosIndex = getNullIndex(duel.secondGround);
	const allIndexArr = [];
	for (let i = 0; i < botHand.length; i++) {
		for (let j = 0; j < botHand.length; j++) {
			const firstCard = botHand[i].slice(0, 4);
			const secondCard = botHand[j].slice(0, 4);
			if (
				(firstCard !== '9999' && secondCard === '9999') ||
				(firstCard === '9999' && secondCard !== '9999')
			) {
				if (botHand[i] === botHand[j]) {
					continue;
				} else {
					let posArr = [];
					if (allPosIndex.length === 1) {
						posArr = [allPosIndex[0] - 1, allPosIndex[0], allPosIndex[0] + 1];
					} else {
						posArr = [
							allPosIndex[0] - 1,
							allPosIndex[0],
							allPosIndex[1],
							allPosIndex[1] + 1,
						];
					}

					for (let k = 1; k < posArr.length - 1; k++) {
						const stateTemp = clone(duel);
						for (let m = 0; m < posArr.length; m++) {
							if (posArr[m] != null) {
								if (posArr[k] === posArr[m]) {
									continue;
								} else {
									const subarray = [-1, -1, -1, -1];
									const [state, bundle] = addMove(
										stateTemp,
										botHand[i],
										botHand[j],
										posArr[k],
										posArr[m],
									);
									subarray[k] = i;
									subarray[m] = j;
									if (isSubarrayExist(allIndexArr, subarray)) {
										break;
									} else {
										allIndexArr.push(subarray);
										allStates.push(state);
										allMoveBundle.push(bundle);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return { allStates, allMoveBundle };
}

const evaluateDuelState = (duelState: DuelState): number => {
	let score = 0;
	for (let i = 0; i < duelState.secondGround.length; i++) {
		if (
			duelState.firstGround[i] !== null &&
			duelState.secondGround[i] !== null
		) {
			score += 1000;
		}
		if (duelState.secondGround[i]) {
			const card = duelState.stateMap[duelState.secondGround[i]];
			score += card.attack + card.defense + card.health;
		}
	}
	score += duelState.firstPlayer.health + duelState.secondPlayer.health;
	return score;
};

const minimax = (
	node: DuelState,
	depth: number,
	alpha: number,
	beta: number,
	maxState: boolean,
): number => {
	if (depth === 0) {
		return evaluateDuelState(node);
	}

	const { allStates, allMoveBundle } = generateStates(clone(node));
	if (maxState) {
		let maxEva = -Infinity;
		for (let i = 0; i < allStates.length; i++) {
			const childState = allStates[i];
			const eva = minimax(childState, depth - 1, alpha, beta, false);
			maxEva = Math.max(maxEva, eva);
			alpha = Math.max(alpha, maxEva);
			if (beta <= alpha) {
				break;
			}
		}
		return maxEva;
	} else {
		let minEva = +Infinity;
		for (let i = 0; i < node.firstHand.length; i++) {
			const childState = clone(node);
			const eva = minimax(childState, depth - 1, alpha, beta, true);
			minEva = Math.min(minEva, eva);
			beta = Math.min(beta, minEva);
			if (beta <= alpha) {
				break;
			}
		}
		return minEva;
	}
};

export const selectBestMove = (
	duel: DuelState,
	depth: number,
): DuelCommandBundle[] => {
	let bestScore = -Infinity;
	let currentMoveBundle;
	const childState = clone(duel);
	const { allStates: botStates, allMoveBundle: allMoves } =
		generateStates(childState);
	for (let j = 0; j < botStates.length; j++) {
		const score = minimax(botStates[j], depth - 1, -Infinity, Infinity, true);

		if (score > bestScore) {
			bestScore = score;
			currentMoveBundle = allMoves[j];
		}
	}
	const payload = [];
	let turn: string;

	currentMoveBundle.forEach((moves) => {
		moves.forEach((move) => {
			turn = move.turn;
		});
	});
	const payloadTmp = {
		turn,
		group: 'EndTurn',
		phase: 'Setup',
		phaseOf: 'B',
		commands: [
			{ type: 'DuelMutate', payload: { phase: 'Draw', phaseOf: 'A' } },
		],
	};
	payload.push(payloadTmp);
	currentMoveBundle.push(payload);

	return currentMoveBundle;
};
