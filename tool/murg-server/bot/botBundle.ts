import {
    DuelPlace,
    move,
    runCommand,
    DuelCommand,
    getInitialState,
    DuelState,
    mergeFragmentToState,
    MoveResult,
    DuelCommandBundle,
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';
import { run } from 'package/card/engine/abilities';
import { fetchDuel } from '../handlers/internal';

import { getState } from './getState';



function possibleStates(cards) {
    let pairs = [];
    for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
            pairs.push([cards[i], cards[j]]);
        }
    }
    return pairs;
}



function addMove(curDuel: DuelState, cards, pos1, pos2, isNotFull1, isNotFull2) {

    const currentState = clone(curDuel)
    let allCurMoveBundle = []
    let curMove
    let curMove2
    const runMove = (move: MoveResult) => {
        const { duel: fragment, commandBundles } = move;
        if (fragment) mergeFragmentToState(currentState, fragment);
        return commandBundles
    };


    if (isNotFull1) {
        curMove = runMove(move.summonCard(currentState, {
            from: {
                owner: currentState.secondPlayer.id,
                place: DuelPlace.Hand,
                id: cards[0],
            },
            to: {
                owner: currentState.secondPlayer.id,
                place: DuelPlace.Ground,
                index: pos1,
            },
        }))
        allCurMoveBundle.push(curMove)
    }
    if (isNotFull2) {
        curMove2 = runMove(move.summonCard(currentState, {
            from: {
                owner: currentState.secondPlayer.id,
                place: DuelPlace.Hand,
                id: cards[1],
            },
            to: {
                owner: currentState.secondPlayer.id,
                place: DuelPlace.Ground,
                index: pos2,
            },
        }))
        allCurMoveBundle.push(curMove2)
    }
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

function generateStates(duel: DuelState) {
    console.log("I want to this generate States")
    let allStates = []
    let allMove = []
    const botHand = clone(duel.secondHand)
    //console.log("I summon it", botHand)
    let get2RandomCards = possibleStates(botHand)
    //console.log("Let see what we got here", get2RandomCards) // error here
    for (let i = 0; i < get2RandomCards.length; i++) {
        let flag = true;
        get2RandomCards[i].forEach(element => {
            if (element === undefined) {
                flag = false
            }
        });
        if (flag === true) {
            let stateTemp = clone(duel)
            let allPossibleIndex = getNullIndex(stateTemp.secondGround)
            for (let j = 0; j < allPossibleIndex.length; j++) {
                if (allPossibleIndex[j] === 5 && allPossibleIndex.length === 1) {
                    let [state, move] = addMove(stateTemp, get2RandomCards[i], 5, 6, true, true)
                    allStates.push(state)
                    allMove.push(move)
                    let [state2, move2] = addMove(stateTemp, get2RandomCards[i], 6, 5, true, true)
                    allStates.push(state2)
                    allMove.push(move2)
                    let [state3, move3] = addMove(stateTemp, get2RandomCards[i], 5, 4, true, true)
                    allStates.push(state3)
                    allMove.push(move3)
                    let [state4, move4] = addMove(stateTemp, get2RandomCards[i], 4, 5, true, true)
                    allStates.push(state4)
                    allMove.push(move4)
                }
                else if (allPossibleIndex[j] !== 5 && allPossibleIndex.length === 1) {
                    let [state, move] = addMove(stateTemp, get2RandomCards[i], allPossibleIndex[j], 1, true, false)
                    allStates.push(state)
                    allMove.push(move)
                    let [state2, move2] = addMove(stateTemp, get2RandomCards[i], 1, allPossibleIndex[j], false, true)
                    allStates.push(state2)
                    allMove.push(move2)
                }

                else if (allPossibleIndex[j] !== 5 && allPossibleIndex.length > 1) {
                    let [state, move] = addMove(stateTemp, get2RandomCards[i], allPossibleIndex[j], allPossibleIndex[j + 1], true, true)
                    allStates.push(state)
                    allMove.push(move)
                    let [state2, move2] = addMove(stateTemp, get2RandomCards[i], allPossibleIndex[j + 1], allPossibleIndex[j], true, true)
                    allStates.push(state2)
                    allMove.push(move2)
                }
            }
        }
        //console.log("In bot bundle, for generate move", allMove)

    }
    return [allStates, allMove]
}

const evaluateDuelState = (duelState: DuelState): number => {
    let score = 0;

    for (const cardId of Object.keys(duelState.stateMap)) {
        const card = duelState.stateMap[cardId];
        if (card.place === DuelPlace.Ground) {
            const frontCardId = duelState.firstGround[card.id];
            const backCardId = duelState.secondGround[card.id];
            const frontCard = duelState.stateMap[frontCardId];
            const backCard = duelState.stateMap[backCardId];
            if (!frontCard && !backCard) {
                score += 100;
            }
            score += card.attack + card.defense + card.health;
        }
    }

    score += duelState.firstPlayer.health + duelState.secondPlayer.health;

    return score;
};

function checkWinning(duel: DuelState) {
    if (duel.firstPlayer.health === 0 || duel.secondPlayer.health === 0) {
        return true;
    }
    else {
        return false
    }
}

const minimax = (node: DuelState, depth: number, alpha: number, beta: number, maxState: boolean): number => {
    if (depth === 0 || checkWinning(node)) {
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



export const selectBestMove = (duelId: string, depth: number): DuelCommand[] => {
    let bestScore = -Infinity;
    let bestMove;
    let currentMoveBundle;
    let currentRecord = clone(fetchDuel(duelId));
   // console.log("This is currentRecord hisotryyyyyyyy")
    let childState = clone(getState(duelId, currentRecord.history))
   // console.log("I guessssssss", childState.firstGround, "gsgsgsd", childState.secondGround)
    //console.log(" 1")
    let [botMove, allMove] = generateStates(childState);// check lai
    //console.log("I got here")
    //console.log(botMove)
    //let count = 0;

    for (let j = 0; j < botMove.length; j++) {
        const score = minimax(botMove[j], depth - 1, -Infinity, Infinity, false);
        //count++
        //console.log("I have score here", count)
        if (score > bestScore) {
            bestScore = score;
            currentMoveBundle = allMove[j]
            bestMove = botMove[j];
        }
    }

    // console.log("this is what we got", bestMove.firstGround, "And", bestMove.secondGround)
    // //console.log("2") // chay toi day

    // let payload = {}
    // let turn

    // currentMoveBundle.forEach(moves => {
    //     //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>", move)
    //     moves.forEach(move => {
    //         turn = move.turn
    //     });
    // });
    // payload = {
    //     turn,
    //     group: 'EndTurn',
    //     phase: 'Setup',
    //     phaseOf: 'B',
    //     commands: [ { type: 'DuelMutate', payload: { phase: 'Draw', phaseOf: 'A' } } ]
    // }
    // //console.log("3")
    // currentMoveBundle.push(payload)

    // how to add end turn
    return currentMoveBundle;
};

