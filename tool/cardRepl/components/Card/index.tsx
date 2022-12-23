import { FC } from 'react';
import { CardState, DuelState, TemplateFragment } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';
import { useSnapshot } from 'valtio';

import { state } from '../../util';

import Attribute from './Attribute';
import EmptyCard from './Empty';
import SkillDesc from './SkillDesc';

interface Props {
	color?: string;
	item: CardState;
	index?: number;
	width?: number;
}

export const Card: FC<Props> = ({ color, item, index, width }) => {
	const { map } = useSnapshot(state) as DuelState;
	const card = map[item?.id.substring(0, 9)];

	if (!item?.id) {
		return <EmptyCard width={width} index={index} />;
	}

	return (
		<Box
			width={width}
			flexDirection="column"
			borderStyle="round"
			alignItems="center"
			borderColor="#333333"
		>
			<Text color={color}>{card.name || item.id.substring(2, 4)}</Text>
			<Box
				paddingLeft={1}
				paddingBottom={1}
				paddingRight={1}
				flexGrow={1}
				alignItems="flex-end"
			>
				<SkillDesc skill={card.skill} />
			</Box>
			<Box>
				<Box width="33%" />
				<Box width="34%" justifyContent="center">
					<Text color="#323232">...</Text>
				</Box>
				<Box width="33%" justifyContent="center">
					{!!card.skill.charge && (
						<Box>
							<Text color="#282828">(</Text>
							<Text color="#666666">{item?.charge}</Text>
							<Text color="#282828">)</Text>
						</Box>
					)}
				</Box>
			</Box>
			<Box>
				<Attribute pair={[item?.attack, card.attribute.attack]} />
				<Attribute pair={[item?.defense, card.attribute.defense]} />
				<Attribute pair={[item?.health, card.attribute.health]} />
			</Box>
		</Box>
	);
};

Card.defaultProps = {
	color: '#ffffff',
	width: 20,
};

export default Card;

export const extractSkillTemplate = (template: TemplateFragment[] | string) => {
	if (typeof template === 'string') return template;
	return template.map((i) => i.text).join('');
};
