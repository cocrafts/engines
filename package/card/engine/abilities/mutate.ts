import { AbilityRunner, AbilityTargeting, DuelCommand } from '../../types';
import mutateCommand from '../commands/mutate';

export const run: AbilityRunner = ({ snapshot, ability, from }) => {
	const commands: DuelCommand[] = [];
	const registerCommand = (i) => commands.push(i);
	const { targeting } = ability;

	if (targeting === AbilityTargeting.Self) {
		mutateCommand
			.create({
				snapshot,
				from,
				target: from,
				payload: { health: 250 },
			})
			.forEach(registerCommand);
	}

	return commands;
};
