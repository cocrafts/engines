import { FC } from 'react';
import { Card, CardType } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

interface Props {
	card: Card;
}

export const GraveCard: FC<Props> = ({ card }) => {
	const isSpell = card.kind === CardType.Spell;
	const dotColor = isSpell ? 'green' : 'black';

	return (
		<Box>
			<Text color={dotColor}> • </Text>
			<Text color="gray">{card?.id.substring(10)}</Text>
		</Box>
	);
};

export default GraveCard;
