import { emptyMoveResult } from '../utils/state';
import { DuelCommandTarget, DuelState, MoveResult } from '../utils/type';

export const summonCard = (
	duel: DuelState,
	target: DuelCommandTarget,
): MoveResult => {
	if (duel.phaseOf !== target.from.owner) return emptyMoveResult;
};
