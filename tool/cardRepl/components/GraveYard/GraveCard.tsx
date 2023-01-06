import { FC } from 'react';
import { Card, CardType } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

interface Props {
	card: Card;
}

export const GraveCard: FC<Props> = ({ card }) => {
	const isSpell = card.kind === CardType.Spell;
	const dotColor = isSpell ? 'green' : '#282828';

	return (
		<Box>
			<Text color={dotColor}> • </Text>
			<Text color="#323232">{card?.id.substring(2, 4)}</Text>
		</Box>
	);
};

export default GraveCard;
