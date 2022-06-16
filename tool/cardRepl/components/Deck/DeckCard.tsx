import { FC } from 'react';
import { CardState, CardType } from '@cocrafts/card';
import { Box, Text } from 'ink';

interface Props {
	item: CardState;
	index: number;
	color?: string;
}

export const DeckCard: FC<Props> = ({ item, index, color }) => {
	const dimColor = index % 2 === 0;
	const isSpell = item.base.type === CardType.Spell;

	return (
		<Box>
			<Text dimColor={dimColor} color={isSpell ? 'magenta' : color}>
				{item.id.substring(2, 4)}
			</Text>
			<Text color="#323232"> • </Text>
		</Box>
	);
};

DeckCard.defaultProps = {
	color: '#ffffff',
};

export default DeckCard;
