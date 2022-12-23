import { FC } from 'react';
import { CardState, CardType } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';
import { useSnapshot } from 'valtio';

import { state } from '../../util';

interface Props {
	item: CardState;
	index: number;
	color?: string;
}

export const DeckCard: FC<Props> = ({ item, index, color }) => {
	const { map } = useSnapshot(state);
	const card = map[item.id.substring(0, 9)];
	const dimColor = index % 2 === 0;
	const isSpell = card.kind === CardType.Spell;
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
