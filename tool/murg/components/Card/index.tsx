import { FC, Fragment } from 'react';
import {
	Card as ICard,
	CardState,
	getElementalDisplay,
	getPlaceDisplay,
} from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

import Attribute from './Attribute';
import EmptyCard from './Empty';
import SkillDesc from './SkillDesc';

interface Props {
	color?: string;
	card?: ICard;
	state?: CardState;
	index?: number;
	width?: number;
}

export const Card: FC<Props> = ({ color, index, card, state, width }) => {
	if (!card?.id) return <EmptyCard width={width} index={index} />;

	return (
		<Box
			width={width}
			flexDirection="column"
			borderStyle="round"
			alignItems="center"
			borderColor="black"
		>
			<Box>
				<Text>
					<Text color="gray">
						{state.owner.substring(0, 1)}
						{index}
					</Text>
					<Text color={color}>•</Text>
					<Text color="gray">{state?.id.substring(10)}!!</Text>
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
					<Text color="gray">{getPlaceDisplay(state.place)}</Text>
				</Box>
				<Box width="34%" justifyContent="center">
					{!!card.skill.charge && (
						<Fragment>
							<Text color="gray"> (</Text>
							<Text color="blue">{state?.charge}</Text>
							<Text color="gray">) </Text>
						</Fragment>
					)}
				</Box>
				<Box width="33%" justifyContent="center">
					<Text color="gray">{getElementalDisplay(card.elemental)}</Text>
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
	color: 'white',
	width: 21,
};

export default Card;
