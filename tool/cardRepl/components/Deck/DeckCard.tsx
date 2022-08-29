import { FC } from 'react';
import { CardState, CardType } from '@metacraft/engines-under-realm';
import { Box, Text } from 'ink';

interface Props {
	item: CardState;
	index: number;
	color?: string;
}

export const DeckCard: FC<Props> = ({ item, index, color }) => {
	const dimColor = index % 2 === 0;
	const isSpell = item.base.type === CardType.Spell;
	const dotColor = isSpell ? 'green' : '#282828';

	return (
		<Box>
			<Text color={dotColor}> • </Text>
			<Text dimColor={dimColor} color={color}>
				{item.id.substring(2, 4)}
			</Text>
		</Box>
	);
};

DeckCard.defaultProps = {
	color: '#ffffff',
};

export default DeckCard;
