import { FC } from 'react';
import { PlayerState } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

interface Props {
	state: PlayerState;
}

export const Player: FC<Props> = ({ state }) => {
	return (
		<Box justifyContent="center" alignItems="center">
			<Text>[Hero: {state.perTurnHero}]</Text>
			<Gradient name="pastel">
				<BigText text={String(state.health)} />
			</Gradient>
			<Text>[Spell: {state.perTurnSpell}]</Text>
		</Box>
	);
};

export default Player;
