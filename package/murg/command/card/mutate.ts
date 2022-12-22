import { cloneState, createCommandResult } from '../../utils/helper';
import {
	CommandBundle,
	CommandCreator,
	CommandRunner,
	DuelCommandType,
} from '../../utils/type';

export const create: CommandCreator = ({ owner, target, payload }) => {
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
	state,
	command: { owner, target, payload },
}) => {
	const toClone = cloneState(state, owner, target.to.place);
	const targetedIndex = toClone.state.findIndex((i) => i.id === target.to.id);
	const targetedCard = toClone.state[targetedIndex];

	Object.keys(payload).forEach((key) => {
		const diff = payload[key] || 0;
		targetedCard[key] = targetedCard[key] + diff;
	});

	return {
		[toClone.key]: toClone.state,
	};
};

export const cardMutate: CommandBundle = {
	create,
	run,
};

export default cardMutate;
