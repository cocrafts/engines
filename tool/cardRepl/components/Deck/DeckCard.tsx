import { FC } from 'react';
import { CardState, CardType } from '@cocrafts/card';
import { Box, Text } from 'ink';

interface Props {
	item: CardState;
	index: number;
	used?: boolean;
	color?: string;
}

export const DeckCard: FC<Props> = ({ item, index, used, color }) => {
	const dimColor = index % 2 === 0;
	const isSpell = item.base.type === CardType.Spell;
	const getColor = () => {
		if (used) return '#323232';
		else if (isSpell) return 'magenta';
		return color;
	};

	return (
		<Box>
			<Text dimColor={dimColor} strikethrough={used} color={getColor()}>
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
