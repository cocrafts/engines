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
	const result: CommandInfo = {
		id: target.id?.substring?.(2, 4),
		icon: '',
	};

	/* <--       ﯑ */
	if (type === CommandType.Move) {
		result.id = from.id?.substring?.(2, 4);

		if (from.place === DuelPlace.Deck && target.place === DuelPlace.Hand) {
			result.icon = '﬷'; /* <- draw */
		} else if (target.place === DuelPlace.Ground) {
			result.icon = '﬷';
		} else if (target.place === DuelPlace.Grave) {
			result.icon = '';
			result.iconColor = 'magenta';
		}
	} else if (type === CommandType.Mutate) {
		if (target.place === DuelPlace.Player) {
			result.id = '';
			result.idColor = '#555555';
		}

		result.iconColor = payload?.health > 0 ? 'green' : 'red';
		result.icon = payload?.health > 0 ? '' : '';
	}

	return result;
};
