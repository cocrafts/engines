import { FC } from 'react';
import { CardState } from '@metacraft/engines-under-realm';
import { Box, Text } from 'ink';

import DeckCard from './DeckCard';

interface Props {
	color?: string;
	cards: CardState[];
}

export const CardDeck: FC<Props> = ({ color, cards }) => {
	return (
		<Box borderStyle="round" borderColor="#333333">
			{cards.map((item, i) => {
				return <DeckCard key={item.id} item={item} index={i} color={color} />;
			})}
			<Text color="#323232"> • </Text>
		</Box>
	);
};

CardDeck.defaultProps = {
	color: 'green',
};

export default CardDeck;
