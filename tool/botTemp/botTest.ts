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



function possibleStates(cards) { // bốc 2 lá
    let pairs = [];
    for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
            pairs.push([cards[i], cards[j]]);
        }
    }
    return pairs;
}

function addMove(curDuel: DuelState, cards, pos1, pos2, isNotFull1, isNotFull2) { // Hiện tại chỉ mơiiws thêm move, 2 tham số is not full để kiểm tra nếu trên bàn chỉ còn 1 slot
    
    const currentState = clone(curDuel)

    const runMove = (move: MoveResult) => {
        const { duel: fragment, commandBundles } = move;
    
        if (fragment) mergeFragmentToState(currentState, fragment);
    };
    

    if(isNotFull1) {
        runMove(move.summonCard(currentState, {
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
    }
    if (isNotFull2) {
        runMove(move.summonCard(currentState, {
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
    }
    return currentState
}

function getNullIndex(arr) { // Lấy các index trống trên ground
    let res = []
    if (arr[5] !== null) {
        res.push(5)
        return res
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === null)
            res.push(i)
    }
    return res
}

function generateStates(duel: DuelState) {
    let allStates = []
    let condition = true
    const botHand = clone(duel.secondHand)
    let get2RandomCards = possibleStates(botHand)
    for (let i = 0; i < get2RandomCards.length - 1; i++) {
        let stateTemp = clone(duel)
        let allPossibleIndex = getNullIndex(stateTemp.secondGround)
        for (let j = 0; j < allPossibleIndex.length - 1; j++) {
            if(allPossibleIndex[j] === 5 && allPossibleIndex.length < 1) {
                let state = addMove(stateTemp, get2RandomCards[i], 5, 6, true, true)
                allStates.push(state)
                state = addMove(stateTemp, get2RandomCards[i], 6, 5, true, true)
                allStates.push(state)
                state = addMove(stateTemp, get2RandomCards[i], 5, 4, true, true)
                allStates.push(state)
                state = addMove(stateTemp, get2RandomCards[i], 4, 5, true, true)
                allStates.push(state)
            }
            if (allPossibleIndex.length === 1) {
                let state = addMove(stateTemp, get2RandomCards[i], allPossibleIndex[j], 1, true, false)
                allStates.push(state)
                state = addMove(stateTemp, get2RandomCards[i], 1, allPossibleIndex[j], false, true)
                allStates.push(state)
            }

            else {
                let state = addMove(stateTemp, get2RandomCards[i], j, j + 1, true, true)
                allStates.push(state)
                let state2 = addMove(stateTemp, get2RandomCards[i], j + 1, j, true, true)
                allStates.push(state2)
            }
        }
        condition = false
        if(condition === false) {
            return allStates;
        }
    }
    return allStates
}

const evaluateDuelState = (duelState: DuelState): number => {
    let score = 0;
    

    for (const cardId of Object.keys(duelState.stateMap)) {
        const card = duelState.stateMap[cardId];
        if (card.place === DuelPlace.Ground) {
            // check xem trước mặt quân bài có quân bài khác không, still checking
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
    if(duel.firstPlayer.health === 0 || duel.secondPlayer.health === 0) {
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

    let allStates = generateStates(clone(node))
    if (maxState) {
        let maxEva = -Infinity;
        for (let i = 0; i < allStates.length; i++) {
            let childState = allStates[i]
            const eva = minimax(childState, depth - 1, alpha, beta, false);
            maxEva = Math.max(maxEva, eva);
            alpha = Math.max(alpha, maxEva);
            if (beta <= alpha) {
                break; //pruning
            }
        }
        return maxEva;
    } else { // phaanf nafy vaanx chuaw bieets neen xuwr lys sao
        let minEva = +Infinity;
        for (let i = 0; i < node.firstHand.length; i++) {
            let childState = clone(node);
            const eva = minimax(childState, depth - 1, alpha, beta, true);
            minEva = Math.min(minEva, eva);
            beta = Math.min(beta, minEva);
            if (beta <= alpha) {
                break; //pruning
            }
        }
        return minEva;
    }
};


export const selectBestMove = (duel: DuelState, depth: number): DuelState | undefined => {
    let bestScore = -Infinity;
    let bestMove;
    console.log("Cards in hand", duel.secondHand.length)
    let botHand = clone(duel.secondHand)
    let arrCards = possibleStates(botHand)
    for (let i = 0; i < arrCards.length - 1; i++) {
        console.log(i, "\n")
        let childState = clone(duel);
        const botMove = generateStates(childState);

        for (let j = 0; i < botMove.length - 1; i++) {
            const score = minimax(botMove[j], depth - 1, -Infinity, Infinity, true);
            console.log("The score is", score, i)
            if (score > bestScore) {
                bestScore = score;
                console.log("Best score is", bestScore)
                bestMove = botMove[i];
                console.log("I passed here")
            }
        }
    }
    console.log("did i go here")
    console.log("this is best score", bestScore)
    console.log("This is best move", bestMove.secondGround)
    return bestMove;
};



