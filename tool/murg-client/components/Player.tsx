import { FC } from 'react';
import {
	DuelState,
	getPlayerPredict,
	PlayerState,
} from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

interface Props {
	color: string;
	duel: DuelState;
	state: PlayerState;
}

export const Player: FC<Props> = ({ color, duel, state }) => {
	const predict = getPlayerPredict(duel, state.id);
	const healthDiff = predict.health - state.health;
	const diffColor = healthDiff > 0 ? 'green' : 'red';

	return (
		<Box justifyContent="center" alignItems="center">
			<Text color="gray">Hero: {state.perTurnHero} </Text>
			<Text color={color}>{String(state.health)}</Text>
			{healthDiff !== 0 && (
				<Text>
					<Text color="black"> (</Text>
					<Text color={diffColor}>{healthDiff}</Text>
					<Text color="black">)</Text>
				</Text>
			)}
			<Text color="gray"> Spell: {state.perTurnSpell}</Text>
		</Box>
	);
};

export default Player;
