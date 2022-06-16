import { FC } from 'react';
import { PlayerState } from '@cocrafts/card';
import { Box } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

interface Props {
	state: PlayerState;
}

export const Player: FC<Props> = ({ state }) => {
	return (
		<Box justifyContent="center">
			<Gradient name="rainbow">
				<BigText text={String(state.health)} />
			</Gradient>
		</Box>
	);
};

export default Player;
