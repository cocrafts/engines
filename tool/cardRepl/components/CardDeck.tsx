import { FC } from 'react';
import { CardState } from '@cocrafts/card';
import { Box, Text } from 'ink';

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
			{deck.map(({ id }, i) => (
				<Box key={id} marginLeft={1}>
					<Text color={i % 2 ? 'gray' : color}>{id.substring(2, 5)}</Text>
				</Box>
			))}
		</Box>
	);
};

CardDeck.defaultProps = {
	color: 'green',
};

export default CardDeck;
