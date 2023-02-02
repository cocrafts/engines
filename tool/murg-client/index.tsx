import { FC, useEffect, useState } from 'react';
import {
	DuelCommandBundle,
	DuelConfig,
	DuelState,
	getInitialState,
	mergeFragmentToState,
	runCommand,
} from '@metacraft/murg-engine';
import { Box, Text, useInput } from 'ink';

import CardList from './components/CardList';
import Deck from './components/Deck';
import GraveYard from './components/GraveYard';
import Player from './components/Player';
import StateInspector from './components/StateInspector';

const cardHeight = 13;

interface Props {
	config: DuelConfig;
	history?: Array<DuelCommandBundle>;
	renderTime?: number;
}

export const MURG: FC<Props> = ({ config, history, renderTime }) => {
	const [debug, setDebug] = useState(false);
	const [level, setLevel] = useState<number>(history.length);
	const [duel, setDuel] = useState<DuelState>();
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
	} = duel || {};
	const playerColors: [string, string] = ['blue', 'green'];
	const [firstColor, secondColor] = playerColors;

	useEffect(() => {
		const duel = getInitialState(config);
		for (let i = 0; i < level; i += 1) {
			const bundle = history[i];

			bundle.commands.forEach((command) => {
				mergeFragmentToState(duel, runCommand({ duel, command }));
			});
		}

		setDuel(duel);
	}, [level]);

	useInput((input, key) => {
		if (input === 'J') {
			setLevel(0);
		} else if (input === 'j' || key.leftArrow) {
			setLevel(level - 1);
		} else if (input === 'L') {
			setLevel(history.length - 1);
		} else if (input === 'l' || key.rightArrow) {
			setLevel(level + 1);
		} else if (input === 'd') {
			setDebug(!debug);
			return;
		}
	});

	if (!duel?.firstPlayer?.id) {
		return <Text>loading...</Text>;
	}

	return debug ? (
		<StateInspector duel={duel} />
	) : (
		<Box flexGrow={1} flexDirection="column" paddingRight={1}>
			<Player color={firstColor} duel={duel} state={secondPlayer} />
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
					<Player color={firstColor} duel={duel} state={firstPlayer} />
				</Box>
				<Box width={40} alignItems="flex-end" justifyContent="flex-end">
					<Text color="black">[</Text>
					<Text color="gray">Level: {level}, </Text>
					<Text color="gray">
						Turn: {turn} ({phaseOf} {phase})
					</Text>
					<Text color="black">] </Text>
					<Text color="black">{renderTime}ms</Text>
				</Box>
			</Box>
		</Box>
	);
};

MURG.defaultProps = {
	history: [],
};

export default MURG;
