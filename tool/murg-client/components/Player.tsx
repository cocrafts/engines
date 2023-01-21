import { FC } from 'react';
import { PlayerState } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

interface Props {
	color: string;
	state: PlayerState;
}

export const Player: FC<Props> = ({ color, state }) => {
	return (
		<Box justifyContent="center" alignItems="center">
			<Text color="gray">Hero: {state.perTurnHero} (</Text>
			<Text color={color}>{String(state.health)}</Text>
			<Text color="gray">) Spell: {state.perTurnSpell}</Text>
		</Box>
	);
};

export default Player;
