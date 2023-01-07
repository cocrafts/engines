import { FC } from 'react';
import {
	DuelState,
	extractPassivePair,
	getCard,
	getCardState,
	getFacingIdentifier,
} from '@metacraft/murg-engine';
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
				const facing = getFacingIdentifier(duel, state?.owner, id);
				const passiveAttribute = extractPassivePair(duel, id, facing?.id)[0];

				return (
					<Card
						key={i}
						index={i}
						color={color}
						card={card}
						state={state}
						passiveAttribute={passiveAttribute}
					/>
				);
			})}
		</Box>
	);
};

export default Player;
