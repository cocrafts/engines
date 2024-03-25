import {
    defaultSetting,
    DuelConfig,
    getInitialState,
    makeMeta,
    DuelState,
    move,
    PlayerConfig,
    DuelCommandBundle,
    mergeFragmentToState,
    runCommand
} from '@metacraft/murg-engine';
import clone from 'lodash/cloneDeep';
import { generateRandomDeck } from '../util/deck';

export const getState = (id: string, history: DuelCommandBundle[], version = '00001'): DuelState => {
    const meta = makeMeta(version);
    const firstPlayer: PlayerConfig = {
        id: 'A',
        deck: generateRandomDeck(meta),
    };
    const secondPlayer: PlayerConfig = {
        id: 'B',
        deck: generateRandomDeck(meta),
    };
    const config: DuelConfig = {
        version,
        setting: defaultSetting,
        firstMover: firstPlayer.id,
        firstPlayer: firstPlayer,
        secondPlayer: secondPlayer,
    };
    const state = getInitialState({
        version,
        setting: config.setting,
        firstMover: firstPlayer.id,
        firstPlayer: config.firstPlayer,
        secondPlayer: config.secondPlayer,
    });

    let { duel, commandBundles } = move.distributeInitialCards(state);
    move.distributeTurnCards(duel).commandBundles.forEach((bundle) => { // không hiểu lắm ?
        commandBundles.push(bundle);
    });

    history.forEach((bundle) => {
        bundle.commands.forEach((command) => {
            mergeFragmentToState(duel, runCommand({ duel, command }));
        });
    });
    // console.log("History la:", history)
    // console.log("1 vài demo", duel.firstGround, "Card cua 2 nguoi choi", duel.firstHand, "Cua nguoi choi b aka Bot", duel.secondHand) // khong the get card
    return duel
};