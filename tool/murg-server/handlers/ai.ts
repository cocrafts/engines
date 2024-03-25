import {
    DuelCommandBundle,
    mergeFragmentToState,
    runCommand,
    DuelState,
    DuelCommand,
} from '@metacraft/murg-engine';
import { getInitialState } from '@metacraft/murg-engine';
import {
    CommandPayload,
    CommandResponse,
    Context,
    DuelCommands,
    JwtPayload,
    ResponseSender,
} from '../util/type';
import { CommandHandler } from '../util/type';

import { fetchDuel } from './internal';
import { selectBestMove } from './selectedBestMove';
import { onIncomingBundle } from './bundle';

export const isHumanTurnEnded = (incomingBundles: DuelCommandBundle[]) => {
    const firstBundle = incomingBundles[0];
    return firstBundle?.group === 'EndTurn' && firstBundle?.phaseOf === 'A';
};

export const injectBotMove = (
    duelId,
    incomingBundles,
) => {
    if (isHumanTurnEnded(incomingBundles)) {
        const duelRecord = fetchDuel(duelId);
        const { config, history } = duelRecord;
        const level = history.length;
        const duel = getInitialState(config);
        runBundles(duel, history);
        const botBundle = selectBestMove(duel, 1)
        return botBundle
    }
    return undefined
};

export const runBundles = (duel: DuelState, bundles: DuelCommandBundle[]) => {
    bundles.forEach((bundle) => {
        bundle.commands.forEach((command) => {
            mergeFragmentToState(duel, runCommand({ duel, command }));
        });
    });
};