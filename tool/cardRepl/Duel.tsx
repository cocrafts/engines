import { FC } from 'react';
import { CardState, DuelState } from '@cocrafts/card';
import { Box } from 'ink';
import { useSnapshot } from 'valtio';

import Card from './components/Card';
import CardDeck from './components/CardDeck';
import Player from './components/Player';
import { game } from './state';

export const Duel: FC = () => {
	const { player, deck } = useSnapshot<DuelState>(game);
	const [firstColor, secondColor] = ['blue', 'red'];
	const [firstPlayer, secondPlayer] = player;
	const [firstDeck, secondDeck] = deck;

	return (
		<Box flexDirection="column">
			<Player state={secondPlayer} />
			<Box justifyContent="center">
				{secondDeck.slice(11, 15).map((card, i) => (
					<Card color={secondColor} item={card} key={i} />
				))}
			</Box>
			<CardDeck color={secondColor} deck={secondDeck as CardState[]} />
			<Box justifyContent="center">
				{firstDeck.slice(0, 11).map((card, i) => (
					<Card color={secondColor} item={card} key={i} />
				))}
			</Box>
			<Box justifyContent="center">
				{secondDeck.slice(0, 11).map((card, i) => (
					<Card color={firstColor} item={card} key={i} />
				))}
			</Box>
			<CardDeck color={firstColor} deck={firstDeck as CardState[]} />
			<Box justifyContent="center">
				{firstDeck.slice(11, 15).map((card, i) => (
					<Card color={firstColor} item={card} key={i} />
				))}
			</Box>
			<Player state={firstPlayer} />
		</Box>
	);
};

export default Duel;
