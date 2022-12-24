import { FC } from 'react';
import {
	CardState,
	DuelCommand,
	DuelCommandBundle,
	DuelState,
	PlayerState,
} from '@metacraft/murg-engine';
import { Box, Text } from 'ink';
import { useSnapshot } from 'valtio';

import Card from './components/Card';
import Deck from './components/Deck';
import GraveYard from './components/GraveYard';
import History from './components/History';
import Player from './components/Player';
import { state } from './util';

const cardHeight = 13;

interface Props {
	state: DuelState;
	history?: Array<DuelCommandBundle>;
}

export const Duel: FC<Props> = ({ history }) => {
	const {
		turn,
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
	} = useSnapshot(state) as DuelState;

	const players: [PlayerState, PlayerState] = [firstPlayer, secondPlayer];
	const playerColors: [string, string] = ['blue', 'green'];
	const [firstColor, secondColor] = playerColors;

	return (
		<Box>
			<History history={history} players={players} colors={playerColors} />
			<Box flexGrow={1} flexDirection="column" paddingRight={1}>
				<Player state={secondPlayer} />
				<Box justifyContent="center" height={cardHeight}>
					{secondHand.map((card, i) => (
						<Card color={secondColor} item={card} key={i} />
					))}
				</Box>
				<Box alignSelf="center">
					<GraveYard cards={secondGrave} />
					<Deck color={secondColor} cards={secondDeck as CardState[]} />
				</Box>
				<Box justifyContent="center" height={cardHeight}>
					{secondGround.map((card, i) => (
						<Card color={secondColor} item={card} key={i} index={i} />
					))}
				</Box>
				<Box justifyContent="center" height={cardHeight}>
					{firstGround.map((card, i) => (
						<Card color={firstColor} item={card} key={i} index={i} />
					))}
				</Box>
				<Box alignSelf="center">
					<Deck color={firstColor} cards={firstDeck as CardState[]} />
					<GraveYard cards={firstGrave} />
				</Box>
				<Box justifyContent="center" height={cardHeight}>
					{firstHand.map((card, i) => (
						<Card color={firstColor} item={card} key={i} />
					))}
				</Box>
				<Player state={firstPlayer} />
				<Box justifyContent="center">
					<Text color="#323232">(</Text>
					<Text>{turn}</Text>
					<Text color="#323232">)</Text>
				</Box>
			</Box>
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
