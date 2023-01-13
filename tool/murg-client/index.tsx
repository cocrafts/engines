import { FC, useState } from 'react';
import {
	DuelCommandBundle,
	DuelState,
	PlayerState,
} from '@metacraft/murg-engine';
import { Box, Text, useInput } from 'ink';

import CardList from './components/CardList';
import Deck from './components/Deck';
import GraveYard from './components/GraveYard';
import History from './components/History';
import Player from './components/Player';
import StateInspector from './components/StateInspector';

const cardHeight = 13;

interface Props {
	duel: DuelState;
	history?: Array<DuelCommandBundle>;
	renderTime?: number;
}

export const MURG: FC<Props> = ({ duel, history, renderTime }) => {
	const {
		turn,
		phase,
		phaseOf,
		firstPlayer,
		secondPlayer,
		firstDeck,
		secondDeck,
		firstHand,
		secondHand,
		firstGround,
		secondGround,
		firstGrave,
		secondGrave,
	} = duel;
	const [debug, setDebug] = useState(false);
	const players: [PlayerState, PlayerState] = [firstPlayer, secondPlayer];
	const playerColors: [string, string] = ['blue', 'green'];
	const [firstColor, secondColor] = playerColors;

	useInput((input) => {
		if (input === 'd') {
			setDebug(!debug);
		}
	});

	return (
		<Box>
			<History history={history} players={players} colors={playerColors} />
			{debug ? (
				<StateInspector duel={duel} />
			) : (
				<Box flexGrow={1} flexDirection="column" paddingRight={1}>
					<Player state={secondPlayer} />
					<CardList
						duel={duel}
						items={secondHand}
						color={secondColor}
						height={cardHeight}
					/>
					<Box alignSelf="center">
						<GraveYard duel={duel} cards={secondGrave} />
						<Deck duel={duel} color={secondColor} cardIds={secondDeck} />
					</Box>
					<CardList
						duel={duel}
						items={secondGround}
						color={secondColor}
						height={cardHeight + 1}
					/>
					<CardList
						duel={duel}
						items={firstGround}
						color={firstColor}
						height={cardHeight + 1}
					/>
					<Box alignSelf="center">
						<Deck duel={duel} color={firstColor} cardIds={firstDeck} />
						<GraveYard duel={duel} cards={firstGrave} />
					</Box>
					<CardList
						duel={duel}
						items={firstHand}
						color={firstColor}
						height={cardHeight}
					/>
					<Box>
						<Box width={40} />
						<Box flexGrow={1} justifyContent="center">
							<Player state={firstPlayer} />
						</Box>
						<Box width={40} alignItems="flex-end" justifyContent="flex-end">
							<Text color="black">[</Text>
							<Text color="gray">
								Turn: {turn} ({phaseOf} {phase})
							</Text>
							<Text color="black">] </Text>
							<Text color="black">{renderTime}ms</Text>
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

MURG.defaultProps = {
	history: [],
};

export default MURG;
