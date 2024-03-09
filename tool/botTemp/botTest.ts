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
    //console.log("snvnsvonvndsovndsnidu", currentState)
    return [currentState, allCurMoveBundle]
}

function getNullIndex(arr) { // Lấy các index trống trên ground
    let res = []
    if (arr[5] === null) {
        res.push(5)
        return res
    }
    else {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === null && arr[i + 1] != null) // ở đây sẽ có trường hợp arr[-1] là undefined, nhưng mà nó không phải null, nên ta chỉ so sánh != thay vì !==
                res.push(i)
            else if (arr[i] === null && arr[i - 1] != null)
                res.push(i)
        }
        return res
    }
}

function generateStates(duel: DuelState) {
    let allStates = []
    let allMove = []
    const botHand = clone(duel.secondHand)
    let get2RandomCards = possibleStates(botHand)
    //console.log("This is all 2 random Cards", get2RandomCards.length)
    for (let i = 0; i < get2RandomCards.length; i++) {
        let stateTemp = clone(duel)
        let allPossibleIndex = getNullIndex(stateTemp.secondGround)
        for (let j = 0; j < allPossibleIndex.length; j++) {
            if (allPossibleIndex[j] === 5 && allPossibleIndex.length === 1) {
                //console.log("I did go to number 5 with one element")
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
        // if(true){
        //     return allStates;
        // }
    }
    return [allStates, allMove]
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

type Result = {
    bestMove: DuelState;
    currentMoveBundle: DuelCommand;
}

export const selectBestMove = (duel: DuelState, depth: number): Result => {
    let bestScore = -Infinity;
    let bestMove;
    let currentMoveBundle;
    let childState = clone(duel);
    let [botMove, allMove] = generateStates(childState);
    //console.log("this is adnsdvndslknvlsdnvn", allMove[0], "sdkvnvnsnvnsvnvl2", allMove[1], "dsbvsbsbsv3", allMove[2])
    //console.log("The bot Length", botMove.length)
    let count = 0;

    for (let j = 0; j < botMove.length; j++) {
        const score = minimax(botMove[j], depth - 1, -Infinity, Infinity, false);
        count++
        console.log("I have score here", score)
        if (score > bestScore) {
            bestScore = score;
            currentMoveBundle = allMove[j]
            bestMove = botMove[j];
        }
    }
    //console.log("This is commandBundle", JSON.stringify(currentMove[1].commands, null, 2))
    return {bestMove, currentMoveBundle};
};



