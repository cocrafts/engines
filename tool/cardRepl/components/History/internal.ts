import { CommandType, DuelCommand, DuelPlace } from '@cocrafts/card';

interface CommandInfo {
	id: string;
	icon: string;
	idColor?: string;
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
			result.iconColor = 'magenta';
		}
	} else if (type === CommandType.Mutate) {
		if (targetPlace === DuelPlace.Player) {
			result.id = '';
			result.idColor = '#555555';
		}

		result.iconColor = payload?.health > 0 ? 'green' : 'red';
		result.icon = payload?.health > 0 ? '' : '';
	}

	return result;
};
