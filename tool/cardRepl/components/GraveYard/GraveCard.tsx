import { FC } from 'react';
import { CardType } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';
import { useSnapshot } from 'valtio';

import { duel } from '../../util';

interface Props {
	id: string;
}

export const GraveCard: FC<Props> = ({ id }) => {
	const { cardMap } = useSnapshot(duel);
	const card = cardMap[id.substring(0, 9)];
	const isSpell = card.kind === CardType.Spell;
	const dotColor = isSpell ? 'green' : '#282828';

	return (
		<Box>
			<Text color={dotColor}> • </Text>
			<Text color="#323232">{id.substring(2, 4)}</Text>
		</Box>
	);
};

export default GraveCard;
