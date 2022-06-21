import { CommandType, DuelCommand, DuelPlace } from '@cocrafts/card';

interface CommandInfo {
	id: string;
	icon: string;
	iconColor?: string;
}

export const getCommandInfo = ({
	type,
	from,
	target,
	payload,
}: DuelCommand): CommandInfo => {
	const [fromPlace, fromId] = from;
	const [targetPlace, targetId] = target;
	const result: CommandInfo = {
		id: targetId?.substring?.(2, 4),
		icon: '',
	};

	/* <--       ﯑ */
	if (type === CommandType.Move) {
		result.id = fromId?.substring?.(2, 4);

		if (fromPlace === DuelPlace.Deck && targetPlace === DuelPlace.Hand) {
			result.icon = '﬷'; /* <- draw */
		} else if (targetPlace === DuelPlace.Ground) {
			result.icon = '﬷';
		} else if (targetPlace === DuelPlace.Grave) {
			result.icon = '';
		}
	} else if (type === CommandType.Mutate) {
		result.icon = payload?.health > 0 ? '' : '';
		result.iconColor = payload?.health > 0 ? 'green' : 'red';
	}

	return result;
};
