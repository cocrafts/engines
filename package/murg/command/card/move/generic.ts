import { makeCardState } from '../../../utils/card';
import { addToGround } from '../../../utils/ground';
import { cloneState, selectState } from '../../../utils/helper';
import { CardState, CommandRunner, DuelPlace } from '../../../utils/type';

export const genericMove: CommandRunner = ({ owner, state, target }) => {
	const { map } = state;
	const targetClone = cloneState(state, owner, target.to.place);
	const isGenerated =
		[DuelPlace.Player, DuelPlace.Ability].indexOf(target.from.place) >= 0;

	if (isGenerated) {
		const targetedCard = makeCardState(map[target.from.id]);
		addToGround(targetedCard, targetClone.state, target.to.side);

		return { [targetClone.key]: targetClone.state };
	} else {
		const fromClone = cloneState(state, owner, target.from.place);
		const selectedCard = fromClone.state.find((i) => i.id === target.from.id);

		if (selectedCard) {
			console.log(selectedCard);
		}

		return {};
	}
};
