import { FC } from 'react';
import { DuelState } from '@metacraft/murg-engine';
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
				return <Card key={i} index={i} color={color} duel={duel} id={id} />;
			})}
		</Box>
	);
};

export default Player;
