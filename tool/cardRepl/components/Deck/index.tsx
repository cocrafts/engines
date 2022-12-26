import { FC } from 'react';
import { DuelState } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';
import { useSnapshot } from 'valtio';

import { duel } from '../../util';

import DeckCard from './DeckCard';

interface Props {
	color?: string;
	cardIds: string[];
}

export const CardDeck: FC<Props> = ({ color, cardIds }) => {
	const { stateMap } = useSnapshot(duel) as DuelState;

	return (
		<Box borderStyle="round" borderColor="#333333">
			{cardIds.map((id, i) => {
				const cardState = stateMap[id];

				return <DeckCard key={id} item={cardState} index={i} color={color} />;
			})}
			<Text color="yellow"> • {cardIds.length} cards </Text>
			<Text color="#323232"> • </Text>
		</Box>
	);
};

CardDeck.defaultProps = {
	color: 'green',
};

export default CardDeck;
