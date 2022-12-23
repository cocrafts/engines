import {
	Card,
	CardState,
	FragmentType,
	TemplateFragment,
	TemplateStyle,
} from './type';

const colors: Record<string, string> = {
	black: '#000000',
	green: '#066922',
	blue: '#1055BC',
	red: '#AA1D21',
	magenta: '#A61DAA',
};

const keywordStyles: Record<string, TemplateStyle> = {
	Hero: {
		color: colors.blue,
		weight: '600',
	},
	Troop: {
		color: colors.blue,
		weight: '600',
	},
	Troops: {
		color: colors.blue,
		weight: '600',
	},
	Snake: {
		color: colors.blue,
		weight: '600',
	},
	Snakes: {
		color: colors.blue,
		weight: '600',
	},
	Wolf: {
		color: colors.blue,
		weight: '600',
	},
	Wolves: {
		color: colors.blue,
		weight: '600',
	},
	Charge: {
		color: colors.blue,
		weight: '600',
	},
	Shield: {
		color: colors.blue,
		weight: '600',
	},
	Illusion: {
		color: colors.blue,
		weight: '600',
	},
	Trap: {
		color: colors.blue,
		weight: '600',
	},
	Steal: {
		color: colors.magenta,
		weight: '600',
	},
	Lifesteal: {
		color: colors.magenta,
		weight: '600',
	},
	Froze: {
		color: colors.blue,
		weight: '600',
	},
	Seal: {
		color: colors.blue,
		weight: '600',
	},
};

const templateStyles: Record<string, TemplateStyle> = {
	Strong: {
		weight: '600',
	},
	Special: {
		color: colors.magenta,
		weight: '600',
	},
	Type: {
		color: colors.blue,
		weight: '600',
	},
	Buff: {
		color: colors.green,
		weight: '600',
	},
	Danger: {
		color: colors.red,
		weight: '600',
	},
};

export const interpolateTemplate = (text: string) => {
	const template: TemplateFragment[] = [];
	let start = 0;
	let end = 0;

	while (end < text.length) {
		const bracketIndex = text.indexOf('[', end);

		if (bracketIndex >= 0) {
			end = text.indexOf(']', bracketIndex);
			const fragment = text.slice(bracketIndex + 1, end);
			const [key, format] = fragment.split(':');
			const keywordStyle = keywordStyles[key];
			const templateStyle = templateStyles[format];
			const style = keywordStyle || templateStyle || templateStyles.Strong;

			if (start < end) {
				template.push({
					text: text.slice(start, bracketIndex),
					type: FragmentType.TEXT,
				});
			}

			template.push({
				text: key,
				type: keywordStyle ? FragmentType.KEYWORD : FragmentType.TEXT,
				style,
			});

			start = end + 1;
			end = start;
		} else {
			end++;
		}
	}

	if (start < end) {
		template.push({
			text: text.substring(start, end),
			type: FragmentType.TEXT,
		});
	}

	console.log(template);
	return template;
};

export const interpolate = (card: Card): Card => {
	if (!card.skill) return card;
	const template = card.skill.template as never;

	card.skill.template = interpolateTemplate(template);
	return card;
};

export const makeCardState = (
	cardId: string,
	map: Record<string, Card>,
): CardState => {
	const { attribute, skill } = map[cardId.substring(0, 9)];
	const result: CardState = {
		id: cardId,
		attack: attribute.attack,
		health: attribute.health,
		defense: attribute.defense,
	};

	if (skill?.charge) {
		result.charge = skill.charge;
	}

	return result;
};
