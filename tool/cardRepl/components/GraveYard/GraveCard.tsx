import { FC } from 'react';
import { CardState, CardType } from '@cocrafts/card';
import { Box, Text } from 'ink';

interface Props {
	item: CardState;
}

export const GraveCard: FC<Props> = ({ item }) => {
	const isSpell = item.base.type === CardType.Spell;
	const dotColor = isSpell ? 'green' : '#282828';

	return (
		<Box>
			<Text color={dotColor}> • </Text>
			<Text color="#323232">{item.id.substring(2, 4)}</Text>
		</Box>
	);
};

export default GraveCard;
