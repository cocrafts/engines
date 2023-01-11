import { createCommand } from '../command';
import { getCard, getCardState } from '../utils/card';
import { getFacingIdentifiers } from '../utils/ground';
import { createCommandResult } from '../utils/helper';
import { CardType, DuelPlace, SkillRunner } from '../utils/type';

interface BasicAttributes {
	attack: number;
	defense: number;
	health: number;
}

interface FrontMutateAttributes extends BasicAttributes {
	radius?: number;
}

interface DestroyMinHealthAttributes {
	minHealth: number;
	unitTypes: CardType[];
}

export const selfMutate: SkillRunner = ({ duel, cardId, sourceType }) => {
	const { commands, registerCommand } = createCommandResult();
	const card = getCard(duel.cardMap, cardId);
	const state = getCardState(duel.stateMap, cardId);
	const { ...stats }: BasicAttributes = card.skill.attribute as never;

	createCommand
		.cardMutate({
			owner: state.owner,
			target: {
				source: {
					type: sourceType,
					owner: state.owner,
					place: state.place,
					id: state.id,
				},
				to: {
					owner: state.owner,
					place: state.place,
					id: state.id,
				},
			},
			payload: {
				attack: state.attack + (stats.attack || 0),
				defense: state.defense + (stats.defense || 0),
				health: state.health + (stats.health || 0),
			},
		})
		.forEach(registerCommand);

	return commands;
};

export const frontMutate: SkillRunner = ({ duel, cardId, sourceType }) => {
	const { commands, registerCommand } = createCommandResult();
	const card = getCard(duel.cardMap, cardId);
	const state = getCardState(duel.stateMap, cardId);
	const attr: FrontMutateAttributes = card.skill.attribute as never;
	const facingIdentifiers = getFacingIdentifiers(
		duel,
		state.owner,
		state.id,
		attr.radius || 0,
	);

	if (facingIdentifiers.length === 0) return commands;

	facingIdentifiers.forEach((facingIdentifier, index) => {
		const facingState = getCardState(
			duel.stateMap,
			facingIdentifiers[index].id,
		);

		createCommand
			.cardMutate({
				owner: state.owner,
				target: {
					source: {
						type: sourceType,
						owner: state.owner,
						place: state.place,
						id: state.id,
					},
					to: {
						owner: facingIdentifier.owner,
						place: DuelPlace.Ground,
						id: facingIdentifier.id,
					},
				},
				payload: {
					attack: facingState.attack + (attr.attack || 0),
					defense: facingState.defense + (attr.defense || 0),
					health: facingState.health + (attr.health || 0),
				},
			})
			.forEach(registerCommand);
	});

	return commands;
};

export const destroyFacingMinHealth: SkillRunner = ({
	duel,
	cardId,
	sourceType,
}) => {
	const { commands, registerCommand } = createCommandResult();
	const card = getCard(duel.cardMap, cardId);
	const { minHealth, unitTypes }: DestroyMinHealthAttributes = card.skill
		.attribute as never;
	const state = getCardState(duel.stateMap, cardId);
	const [facingIdentifier] = getFacingIdentifiers(
		duel,
		state.owner,
		state.id,
		0,
	);

	if (!facingIdentifier?.id) return commands;

	const facingCard = getCard(duel.cardMap, facingIdentifier.id);
	const facingState = getCardState(duel.stateMap, facingIdentifier.id);
	const isMinHealthValid = facingState.health <= minHealth;
	const isUnitValid = unitTypes.indexOf(facingCard.kind) >= 0;

	if (isMinHealthValid && isUnitValid) {
		createCommand
			.cardMutate({
				owner: state.owner,
				target: {
					source: {
						type: sourceType,
						owner: state.owner,
						place: state.place,
						id: state.id,
					},
					to: {
						owner: facingIdentifier.owner,
						place: DuelPlace.Ground,
						id: facingIdentifier.id,
					},
				},
				payload: {
					health: 0,
				},
			})
			.forEach(registerCommand);
	}

	return commands;
};
