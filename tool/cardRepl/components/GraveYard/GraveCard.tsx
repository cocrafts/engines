import { FC } from 'react';
import { CardState, CardType } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';
import { useSnapshot } from 'valtio';

import { state } from '../../util';

interface Props {
	item: CardState;
}

export const GraveCard: FC<Props> = ({ item }) => {
	const { map } = useSnapshot(state);
	const card = map[item.id.substring(0, 9)];
	const isSpell = card.kind === CardType.Spell;
	const dotColor = isSpell ? 'green' : '#282828';

	return (
		<Box>
			<Text color={dotColor}> • </Text>
			<Text color="#323232">{item.id.substring(2, 4)}</Text>
		</Box>
	);
};

export default GraveCard;
