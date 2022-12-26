import {
	cloneState,
	createCommandResult,
	createDuelFragment,
} from '../../utils/helper';
import {
	CommandRunner,
	DuelCommandType,
	StatelessCommand,
} from '../../utils/type';

export const create: StatelessCommand = ({ owner, target, payload }) => {
	const { commands, registerCommand } = createCommandResult();

	registerCommand({
		type: DuelCommandType.CardMutate,
		owner,
		target,
		payload,
	});

	return commands;
};

export const run: CommandRunner = ({
	duel,
	command: { owner, target, payload },
}) => {
	const fragment = createDuelFragment(duel);
	const toClone = cloneState(duel, owner, target.to.place);
	const targetedIndex = toClone.state.findIndex((id) => id === target.to.id);
	const targetedCardId = toClone.state[targetedIndex];
	const targetedState = { ...duel.stateMap[targetedCardId] };

	Object.keys(payload).forEach((key) => {
		const diff = payload[key] || 0;
		targetedState[key] = targetedState[key] + diff;
	});

	fragment.stateMap[targetedCardId] = targetedState;
	return fragment;
};

export const cardMutate = {
	create,
	run,
};

export default cardMutate;
