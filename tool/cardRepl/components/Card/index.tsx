import { FC } from 'react';
import { DuelState, TemplateFragment } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';
import { useSnapshot } from 'valtio';

import { duel } from '../../util';

import Attribute from './Attribute';
import EmptyCard from './Empty';
import SkillDesc from './SkillDesc';

interface Props {
	color?: string;
	id: string;
	index?: number;
	width?: number;
}

export const Card: FC<Props> = ({ color, id, index, width }) => {
	if (!id) return <EmptyCard width={width} index={index} />;

	const { stateMap, cardMap } = useSnapshot(duel) as DuelState;
	const card = cardMap[id.substring(0, 9)];
	const state = stateMap[id];

	return (
		<Box
			width={width}
			flexDirection="column"
			borderStyle="round"
			alignItems="center"
			borderColor="#333333"
		>
			<Text color={color}>
				({id.substring(3, 5)}) {card.name}
			</Text>
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
							<Text color="#666666">{state?.charge}</Text>
							<Text color="#282828">)</Text>
						</Box>
					)}
				</Box>
			</Box>
			<Box>
				<Attribute pair={[state?.attack, card.attribute.attack]} />
				<Attribute pair={[state?.defense, card.attribute.defense]} />
				<Attribute pair={[state?.health, card.attribute.health]} />
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
