import { FC, useState } from 'react';
import {
	DuelCommand,
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
}

export const Duel: FC<Props> = ({ duel, history }) => {
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
							<Text color="#323232">[</Text>
							<Text color="#555555">
								Turn: {turn} ({phaseOf} {phase})
							</Text>
							<Text color="#323232">]</Text>
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

Duel.defaultProps = {
	history: [],
};

export default Duel;

const isHistoryBatch = (batch: DuelCommand[]) => {
	for (let i = 0; i < batch.length; i += 1) {
		if (!batch[i]?.target) return false;
	}

	return true;
};

const extractHistory = (history: Array<DuelCommandBundle>, limit = 40) => {
	const result = [];
	let currentSize = 0;

	for (let i = history.length - 1; i >= 0; i -= 1) {
		const { commands } = history[i];

		if (isHistoryBatch(commands)) {
			result.push(commands);
			currentSize += commands.length;
		}

		if (currentSize >= limit) {
			return result;
		}
	}

	return result.reverse();
};
