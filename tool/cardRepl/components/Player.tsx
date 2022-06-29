import { FC } from 'react';
import { PlayerState } from '@cocrafts/card';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

interface Props {
	state: PlayerState;
}

export const Player: FC<Props> = ({ state }) => {
	return (
		<Box justifyContent="center" alignItems="center">
			<Text>[{state.perTurnHero}]</Text>
			<Gradient name="pastel">
				<BigText text={String(state.health)} />
			</Gradient>
			<Text>[{state.perTurnTroop}]</Text>
		</Box>
	);
};

export default Player;
