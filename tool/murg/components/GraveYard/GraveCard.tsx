import { FC } from 'react';
import { Card, CardState, CardType } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

interface Props {
	card: Card;
	state: CardState;
}

export const GraveCard: FC<Props> = ({ card, state }) => {
	const isSpell = card.kind === CardType.Spell;
	const dotColor = isSpell ? 'green' : 'black';

	return (
		<Box>
			<Text color={dotColor}> • </Text>
			<Text color="gray">{state?.id.substring(10)}</Text>
		</Box>
	);
};

export default GraveCard;
