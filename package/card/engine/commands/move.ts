import {
	CommandType,
	CreateCommandPayload,
	DuelCommand,
	DuelPlace,
	DuelState,
	RunCommandPayload,
} from '../../types';
import { cloneDuelSource, getPlayerOrder } from '../util';

export const create = ({
	creator,
	snapshot,
	from,
	target,
}: CreateCommandPayload): DuelCommand[] => {
	const commands: DuelCommand[] = [];
	const { player, hand } = snapshot;
	const order = getPlayerOrder(player, creator);
	const [targetSource] = target;

	commands.push({
		creator,
		type: CommandType.Move,
		from,
		target,
	});

	if (targetSource === DuelPlace.Ground) {
		/* <- Simulate ability */
		commands.push({
			creator,
			type: CommandType.Move,
			from: [DuelPlace.Ability, '0002'],
			target: [DuelPlace.Ground, null, hand[order].length + 1],
		});
	}

	return commands;
};

export const run = ({ snapshot, command }: RunCommandPayload): DuelState => {
	const { player, cardMap } = snapshot;
	const { creator, from, target } = command;
	const order = getPlayerOrder(player, creator);
	const [fromPlace, fromId, fromPos] = from;
	const [targetPlace] = target;
	const targetClone = cloneDuelSource(snapshot, targetPlace);
	const currentTarget = targetClone.source[order];

	if (fromPlace === DuelPlace.Ability) {
		const targetedCard = cardMap[`${fromId}0000`];
		currentTarget.push({ ...targetedCard, base: targetedCard });

		return { [targetClone.key]: targetClone.source as unknown } as DuelState;
	} else {
		const fromClone = cloneDuelSource(snapshot, fromPlace);
		const currentFrom = fromClone.source[order];
		const selectedCard = currentFrom[fromPos];

		currentTarget.push(selectedCard);
		currentFrom.splice(fromPos, 1);

		return {
			[fromClone.key]: fromClone.source as unknown,
			[targetClone.key]: targetClone.source as unknown,
		} as DuelState;
	}
};

export const moveCommand = {
	create,
	run,
};

export default moveCommand;
