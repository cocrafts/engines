import { runCommand } from '../command';
import skillMap from '../skill';
import { getCard } from '../utils/card';
import { mergeFragmentToState } from '../utils/state';
import {
	ActivationType,
	DuelCommand,
	DuelCommandBundle,
	DuelPlace,
	DuelState,
	InspireSource,
} from '../utils/type';

export const runAndMergeHooks = (
	duel: DuelState,
	bundle: DuelCommandBundle,
	recentCommands: DuelCommand[],
): DuelCommandBundle => {
	const deathCommands = recentCommands.filter(({ target }) => {
		const fromGround = target.from.place === DuelPlace.Ground;
		const toGrave = target.to.place === DuelPlace.Grave;

		return fromGround && toGrave;
	});

	const createAndMergeInspireDeath = (cardId: string) => {
		if (!cardId) return;

		const card = getCard(duel.cardMap, cardId);
		const isInspireDeath =
			card?.skill?.activation === ActivationType.Inspire &&
			card?.skill?.inspire === InspireSource.Death;

		if (!isInspireDeath) return;

		const skillFunc = skillMap[card.skill.attribute?.id];

		deathCommands.forEach((command) => {
			const skillCommands = skillFunc?.({ duel, cardId, command });

			skillCommands.forEach((command) => {
				bundle.commands.push(command);
				mergeFragmentToState(duel, runCommand({ duel, command }));
			});

			if (skillCommands.length > 0) {
				runAndMergeHooks(duel, bundle, skillCommands);
			}
		});
	};

	for (let i = 0; i < duel.setting.groundSize; i += 1) {
		createAndMergeInspireDeath(duel.firstGround[i]);
		createAndMergeInspireDeath(duel.secondGround[i]);
	}

	return bundle;
};
