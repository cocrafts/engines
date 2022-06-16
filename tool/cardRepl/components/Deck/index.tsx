import { FC } from 'react';
import { CardState } from '@cocrafts/card';
import { Box, Text } from 'ink';

import DeckCard from './DeckCard';

interface Props {
	color?: string;
	startedDeck: CardState[];
	deck: CardState[];
}

export const CardDeck: FC<Props> = ({ color, deck, startedDeck }) => {
	return (
		<Box
			alignSelf="center"
			justifyContent="center"
			borderStyle="round"
			borderColor="#333333"
		>
			<Text color="#323232"> • </Text>
			{startedDeck.map((item, i) => {
				const used = deck.findIndex((i) => i.id === item.id) < 0;
				return (
					<DeckCard
						used={used}
						key={item.id}
						item={item}
						index={i}
						color={color}
					/>
				);
			})}
		</Box>
	);
};

CardDeck.defaultProps = {
	color: 'green',
};

export default CardDeck;
