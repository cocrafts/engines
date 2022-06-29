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
	if (type === CommandType.CardMove) {
		result.id = from.id?.substring?.(2, 4);

		if (from.place === DuelPlace.Deck && target.place === DuelPlace.Hand) {
			result.icon = '﬷'; /* <- draw */
		} else if (target.place === DuelPlace.Ground) {
			result.icon = '﬷';
		} else if (target.place === DuelPlace.Grave) {
			result.icon = '';
			result.iconColor = 'magenta';
		}
	} else if (type === CommandType.PlayerMutate) {
		console.log(payload);
		if (payload?.health) {
			result.id = '♥';
			result.iconColor = payload.health > 0 ? 'green' : 'red';
			result.icon = payload.health > 0 ? '' : '';
		} else if (payload?.perTurnHero) {
			result.id = '';
			result.iconColor = payload.perTurnHero > 0 ? 'green' : 'red';
			result.icon = payload.perTurnHero > 0 ? '' : '';
		} else if (payload?.perTurnTroop) {
			result.id = '﯑';
			result.iconColor = payload.perTurnTroop > 0 ? 'green' : 'red';
			result.icon = payload.perTurnTroop > 0 ? '' : '';
		} else {
			result.id = '';
		}
	}

	return result;
};
