import {
    DuelPlace,
    Card,
    move,
    runCommand,
    DuelCommand,
    getInitialState,
    DuelState,
    mergeFragmentToState,
    MoveResult,
    DuelCommandBundle,
    getCard,
    getCardList,
    getCardState,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';
import { run } from 'package/card/engine/abilities';

function addMove(curDuel: DuelState, card1, card2, pos1, pos2) {

    const currentState = clone(curDuel)
    let allCurMoveBundle = []
    let curMove
    let curMove2
    const runMove = (move: MoveResult) => {
        const { duel: fragment, commandBundles } = move;
        if (fragment) mergeFragmentToState(currentState, fragment);
        return commandBundles
    };



    curMove = runMove(move.summonCard(currentState, {
        from: {
            owner: currentState.secondPlayer.id,
            place: DuelPlace.Hand,
            id: card1,
        },
        to: {
            owner: currentState.secondPlayer.id,
            place: DuelPlace.Ground,
            index: pos1,
        },
    }))
    allCurMoveBundle.push(curMove)

    curMove2 = runMove(move.summonCard(currentState, {
        from: {
            owner: currentState.secondPlayer.id,
            place: DuelPlace.Hand,
            id: card2,
        },
        to: {
            owner: currentState.secondPlayer.id,
            place: DuelPlace.Ground,
            index: pos2,
        },
    }))
    allCurMoveBundle.push(curMove2)

    return [currentState, allCurMoveBundle]
}


function getNullIndex(arr) {
    let res = []
    if (arr[5] === null) {
        res.push(5)
        return res
    }
    else {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === null && arr[i + 1] != null)
                res.push(i)
            else if (arr[i] === null && arr[i - 1] != null)
                res.push(i)
        }
        return res
    }
}

function generateCombinations(arr, r = 2) {
    const combinations = [];

    function helper(tempComb, start) {
        if (tempComb.length === r) {
            combinations.push([...tempComb]);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            tempComb.push(arr[i]);
            helper(tempComb, i + 1);
            tempComb.pop();
        }
    }
    helper([], 0);
    return combinations;
}

function isSubarrayExist(array, subarray) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].length !== subarray.length) {
            continue;
        }

        let isEqual = true;
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] !== subarray[j]) {
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

function generateStates(duel: DuelState) {
    let allStates = []
    let allMoveBundle = []
    const botHand = clone(duel.secondHand)
    let allPosIndex = getNullIndex(duel.secondGround)
    let allIndexArr = []
    for (let i = 0; i < botHand.length; i++) {
        for (let j = 0; j < botHand.length; j++) {
            let firstCard = botHand[i].slice(0, 4)
            let secondCard = botHand[j].slice(0, 4)
            //console.log("First is", firstCard, "Second is", secondCard)
            if((firstCard !== "9999" && secondCard === "9999") || (firstCard === "9999" && secondCard !== "9999")) {
                if (botHand[i] === botHand[j]) {
                    continue;
                }
                else {
                    let posArr = []
                    if (allPosIndex.length === 1) {
                        posArr = [allPosIndex[0] - 1, allPosIndex[0], allPosIndex[0] + 1]
                    }
                    else {
                        posArr = [allPosIndex[0] - 1, allPosIndex[0], allPosIndex[1], allPosIndex[1] + 1]
                    }
    
                    for (let k = 1; k < posArr.length - 1; k++) {
                        let stateTemp = clone(duel)
                        for (let m = 0; m < posArr.length; m++) {
                            if (posArr[m] != null) {
                                if (posArr[k] === posArr[m]) {
                                    continue
                                }
                                else {
                                    let subarray = [-1, -1, -1, -1]
                                    let [state, bundle] = addMove(stateTemp, botHand[i], botHand[j], posArr[k], posArr[m])
                                    subarray[k] = i
                                    subarray[m] = j
                                    if (isSubarrayExist(allIndexArr, subarray)) {
                                        break;
                                    }
                                    else {
                                        allIndexArr.push(subarray)
                                        allStates.push(state)
                                        allMoveBundle.push(bundle)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //break;
        }
    }
    return [allStates, allMoveBundle]
}

const evaluateDuelState = (duelState: DuelState): number => {
    let score = 0;
    for (let i = 0; i < duelState.secondGround.length; i++) {
        if (duelState.firstGround[i] !== null && duelState.secondGround[i] !== null) {
            score += 1000

        }
        if (duelState.secondGround[i]) {
            const card = duelState.stateMap[duelState.secondGround[i]]
            score += card.attack + card.defense + card.health;
        }
    }
    score += duelState.firstPlayer.health + duelState.secondPlayer.health;
    return score;
};


const minimax = (node: DuelState, depth: number, alpha: number, beta: number, maxState: boolean): number => {
    if (depth === 0) {
        return evaluateDuelState(node);
    }

    let [allStates, allMove] = generateStates(clone(node))
    if (maxState) {

        let maxEva = -Infinity;
        for (let i = 0; i < allStates.length; i++) {
            let childState = allStates[i]
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
            let childState = clone(node);
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

export const selectBestMove = (duel: DuelState, depth: number): DuelCommandBundle[] => {
    let bestScore = -Infinity;
    let currentMoveBundle;
    let childState = clone(duel);
    let [botStates, allMoves] = generateStates(childState);
    for (let j = 0; j < botStates.length; j++) {
        const score = minimax(botStates[j], depth - 1, -Infinity, Infinity, true);

        if (score > bestScore) {
            bestScore = score;
            currentMoveBundle = allMoves[j]
        }
    }
    let payload = []
    let turn

    currentMoveBundle.forEach(moves => {
        moves.forEach(move => {
            turn = move.turn
        });
    });
    let payloadTmp = {
        turn,
        group: 'EndTurn',
        phase: 'Setup',
        phaseOf: 'B',
        commands: [{ type: 'DuelMutate', payload: { phase: 'Draw', phaseOf: 'A' } }]
    }
    payload.push(payloadTmp)
    currentMoveBundle.push(payload)

    return currentMoveBundle;
};


