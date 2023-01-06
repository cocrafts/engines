import { FC } from 'react';
import { DuelState, getCard, getCardState } from '@metacraft/murg-engine';
import { Box } from 'ink';

import Card from './Card';

interface Props {
	duel: DuelState;
	items: string[];
	height: number;
	color: string;
}

export const Player: FC<Props> = ({ duel, items, height, color }) => {
	return (
		<Box justifyContent="center" height={height}>
			{items.map((id, i) => {
				const card = getCard(duel.cardMap, id);
				const state = getCardState(duel.stateMap, id);

				return (
					<Card key={i} index={i} color={color} card={card} state={state} />
				);
			})}
		</Box>
	);
};

export default Player;
