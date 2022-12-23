import {
	DuelCommand,
	DuelCommandType,
	DuelPlace,
} from '@metacraft/murg-engine';

interface CommandInfo {
	id: string;
	icon: string;
	idColor?: string;
	iconColor?: string;
}

export const getCommandInfo = ({
	type,
	target: { from, to },
	payload,
}: DuelCommand): CommandInfo => {
	const result: CommandInfo = {
		id: to.id?.substring?.(3, 5),
		icon: '',
	};

	/* <--       ﯑ */
	if (type === DuelCommandType.CardMove) {
		result.id = from.id?.substring?.(3, 5);

		if (from.place === DuelPlace.Deck && to.place === DuelPlace.Hand) {
			result.icon = '﬷'; /* <- draw */
		} else if (to.place === DuelPlace.Ground) {
			result.icon = '﬷';
		} else if (to.place === DuelPlace.Grave) {
			result.icon = '';
			result.iconColor = 'magenta';
		}
	} else if (type === DuelCommandType.PlayerMutate) {
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
