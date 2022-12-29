import { FC, Fragment } from 'react';
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
					<Text color="#333333">
						{state.owner.substring(0, 1)}
						{index}
					</Text>
					<Text color={color}>•</Text>
					<Text color="#333333">{id.substring(10)}</Text>
					<Text color={color}> {card.name}</Text>
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
			<Box>
				<Box width="33%" justifyContent="center">
					<Text color="#323232">{getPlaceDisplay(state.place)}</Text>
				</Box>
				<Box width="34%" justifyContent="center">
					{!!card.skill.charge && (
						<Fragment>
							<Text color="#282828"> (</Text>
							<Text color="blue">{state?.charge}</Text>
							<Text color="#282828">) </Text>
						</Fragment>
					)}
				</Box>
				<Box width="33%" justifyContent="center">
					<Text color="#282828">{getElementalDisplay(card.elemental)}</Text>
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
	width: 21,
};

export default Card;
