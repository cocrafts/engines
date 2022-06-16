import { FC } from 'react';
import { CardState } from '@cocrafts/card';
import { Box, Text } from 'ink';

import DeckCard from './DeckCard';

interface Props {
	color?: string;
	deck: CardState[];
}

export const CardDeck: FC<Props> = ({ color, deck }) => {
	return (
		<Box
			alignSelf="center"
			justifyContent="center"
			borderStyle="round"
			borderColor="#333333"
		>
			<Text color="#323232"> • </Text>
			{deck.map((item, i) => (
				<DeckCard key={item.id} item={item} color={color} index={i} />
			))}
		</Box>
	);
};

CardDeck.defaultProps = {
	color: 'green',
};

export default CardDeck;
