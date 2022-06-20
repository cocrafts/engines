import { FC, useState } from 'react';
import { CardState, DuelState } from '@cocrafts/card';
import { Box, Text, useInput } from 'ink';

import Card from './components/Card';
import Deck from './components/Deck';
import GraveYard from './components/GraveYard';
import History from './components/History';
import Player from './components/Player';

const cardHeight = 13;

interface Props {
	game: DuelState;
}

export const Duel: FC<Props> = ({ game }) => {
	const [round, setRound] = useState(0);
	const { player, deck, hand, ground, grave } = game;
	const [firstColor, secondColor] = ['blue', 'yellow'];
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
			<History />
			<Box flexGrow={1} flexDirection="column">
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
					<Text>{round}</Text>
					<Text color="#323232">)</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default Duel;
