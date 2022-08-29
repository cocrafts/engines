import { FC, useState } from 'react';
import {
	CardState,
	DuelCommand,
	DuelState,
} from '@metacraft/engines-under-realm';
import { Box, Text, useInput } from 'ink';

import Card from './components/Card';
import Deck from './components/Deck';
import GraveYard from './components/GraveYard';
import History from './components/History';
import Player from './components/Player';

const cardHeight = 13;

interface Props {
	state: DuelState;
	history?: Array<DuelCommand[]>;
}

export const Duel: FC<Props> = ({ state, history }) => {
	const [round, setRound] = useState(0);
	const { player, game, deck, hand, ground, grave } = state;
	const playerColors: [string, string] = ['blue', 'green'];
	const [firstColor, secondColor] = playerColors;
	const [firstPlayer, secondPlayer] = player;
	const [firstDeck, secondDeck] = deck;
	const [firstHand, secondHand] = hand;
	const [firstGround, secondGround] = ground;
	const [firstGrave, secondGrave] = grave;

	useInput((input, key) => {
		if (input === 'r') {
			setRound(0);
		} else if (key.leftArrow) {
			setRound(round - 1);
		} else if (key.rightArrow) {
			setRound(round + 1);
		}
	});

	return (
		<Box>
			<History
				history={extractHistory(history)}
				players={player}
				colors={playerColors}
			/>
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
					<Text>{game.turn}</Text>
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

const extractHistory = (history: Array<DuelCommand[]>, limit = 40) => {
	const result = [];
	let currentSize = 0;

	for (let i = history.length - 1; i >= 0; i -= 1) {
		const batch = history[i];

		if (isHistoryBatch(batch)) {
			result.push(batch);
			currentSize += batch.length;
		}

		if (currentSize >= limit) {
			return result;
		}
	}

	return result.reverse();
};
