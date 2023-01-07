import { FC } from 'react';
import { DuelState, getCard } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

import GraveCard from './GraveCard';

interface Props {
	duel: DuelState;
	color?: string;
	cards?: string[];
}

export const GraveYard: FC<Props> = ({ duel, cards, color }) => {
	return (
		<Box alignSelf="center" borderStyle="round" borderColor="gray">
			{cards.map((id, i) => {
				const card = getCard(duel.cardMap, id);

				return <GraveCard card={card} key={i} />;
			})}
			<Text color={color}> • </Text>
		</Box>
	);
};

GraveYard.defaultProps = {
	color: 'gray',
};

export default GraveYard;
