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

function get2Cards(cards) { 
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
    let allStates = []
    let allMoveBundle = []
    const botHand = clone(duel.secondHand)
    let get2RandomCards = get2Cards(botHand)
    for (let i = 0; i < get2RandomCards.length; i++) {
        let stateTemp = clone(duel)
        let allPossibleIndex = getNullIndex(stateTemp.secondGround)
        for (let j = 0; j < allPossibleIndex.length; j++) {
            if (allPossibleIndex[j] === 5 && allPossibleIndex.length === 1) {
                let [state, move] = addMove(stateTemp, get2RandomCards[i], 5, 6, true, true)
                allStates.push(state)
                allMoveBundle.push(move)
                let [state2, move2] = addMove(stateTemp, get2RandomCards[i], 6, 5, true, true)
                allStates.push(state2)
                allMoveBundle.push(move2)
                let [state3, move3] = addMove(stateTemp, get2RandomCards[i], 5, 4, true, true)
                allStates.push(state3)
                allMoveBundle.push(move3)
                let [state4, move4] = addMove(stateTemp, get2RandomCards[i], 4, 5, true, true)
                allStates.push(state4)
                allMoveBundle.push(move4)
            }
            else if (allPossibleIndex[j] !== 5 && allPossibleIndex.length === 1) {
                let [state, move] = addMove(stateTemp, get2RandomCards[i], allPossibleIndex[j], 1, true, false)
                allStates.push(state)
                allMoveBundle.push(move)
                let [state2, move2] = addMove(stateTemp, get2RandomCards[i], 1, allPossibleIndex[j], false, true)
                allStates.push(state2)
                allMoveBundle.push(move2)
            }
            else if (allPossibleIndex[j] !== 5 && allPossibleIndex.length > 1) {
                let [state, move] = addMove(stateTemp, get2RandomCards[i], allPossibleIndex[j], allPossibleIndex[j + 1], true, true)
                allStates.push(state)
                allMoveBundle.push(move)
                let [state2, move2] = addMove(stateTemp, get2RandomCards[i], allPossibleIndex[j + 1], allPossibleIndex[j], true, true)
                allStates.push(state2)
                allMoveBundle.push(move2)
            }
        }
    }
    return [allStates, allMoveBundle]
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

export const selectBestMove = (duel: DuelState, depth: number): DuelCommandBundle[] => {
    let bestScore = -Infinity;
    let currentMoveBundle;
    let childState = clone(duel);
    let [botStates, allMoves] = generateStates(childState);

    for (let j = 0; j < botStates.length; j++) {
        const score = minimax(botStates[j], depth - 1, -Infinity, Infinity, false);
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
        commands: [ { type: 'DuelMutate', payload: { phase: 'Draw', phaseOf: 'A' } } ]
    }
    payload.push(payloadTmp)
    currentMoveBundle.push(payload)
    return currentMoveBundle;
};


