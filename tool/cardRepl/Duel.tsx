import { FC, useState } from 'react';
import { CardState, DuelState } from '@cocrafts/card';
import { Box, Text, useInput } from 'ink';

import Card from './components/Card';
import Deck from './components/Deck';
import Player from './components/Player';
import { initialState } from './state';

const cardHeight = 13;

interface Props {
	game: DuelState;
}

export const Duel: FC<Props> = ({ game }) => {
	const [round, setRound] = useState(0);
	const { player, deck, hand, ground } = game;
	const [firstColor, secondColor] = ['blue', 'red'];
	const [firstPlayer, secondPlayer] = player;
	const [firstDeck, secondDeck] = deck;
	const [startedFirstDeck, startedSecondDeck] = initialState.deck;
	const [firstHand, secondHand] = hand;
	const [firstGround, secondGround] = ground;

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
		<Box flexDirection="column">
			<Player state={secondPlayer} />
			<Box justifyContent="center" height={cardHeight}>
				{secondHand.map((card, i) => (
					<Card color={secondColor} item={card} key={i} />
				))}
			</Box>
			<Deck
				color={secondColor}
				deck={secondDeck as CardState[]}
				startedDeck={startedSecondDeck}
			/>
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
			<Deck
				color={firstColor}
				deck={firstDeck as CardState[]}
				startedDeck={startedFirstDeck}
			/>
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
	);
};

export default Duel;
