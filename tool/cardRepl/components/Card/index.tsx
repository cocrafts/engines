import { FC } from 'react';
import {
	DuelState,
	getElementalDisplay,
	getPlaceDisplay,
} from '@metacraft/murg-engine';
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
			<Box>
				<Text>
					<Text color="#333333">{index}</Text>
					<Text color={color}>•</Text>
					<Text color="#333333">{id.substring(10)} </Text>
					<Text color={color}>{card.name}</Text>
				</Text>
			</Box>
			<Box
				paddingLeft={1}
				paddingBottom={1}
				paddingRight={1}
				flexGrow={1}
				alignItems="flex-end"
			>
				<SkillDesc skill={card.skill} />
			</Box>
			<Box alignItems="center" marginLeft={1} marginRight={1}>
				<Text color="#323232">
					{getPlaceDisplay(state.place)} {state.owner}
				</Text>
				{!!card.skill.charge && (
					<Box>
						<Text color="#282828"> (</Text>
						<Text color="blue">{state?.charge}</Text>
						<Text color="#282828">) {getElementalDisplay(card.elemental)}</Text>
					</Box>
				)}
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
	width: 22,
};

export default Card;
