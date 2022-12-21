import {
	CommandBundle,
	CommandCreator,
	CommandRunner,
	DuelPlace,
} from '../../../utils/type';

export const create: CommandCreator = ({ owner, state }) => {
	return [];
};

export const run: CommandRunner = ({ command, state, payload, target }) => {
	const fromGround = target.from.place === DuelPlace.Ground;
	const toGround = target.to.place === DuelPlace.Ground;
	const toGrave = target.to.place === DuelPlace.Grave;

	if (fromGround && toGround) {
		return state;
	} else if (fromGround && toGrave) {
		return state;
	} else if (toGround) {
		return state;
	}
};

const moveCommand: CommandBundle = {
	create,
};

export default moveCommand;
