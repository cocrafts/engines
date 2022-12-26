import { FC } from 'react';
import { DuelState } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

interface Props {
	duel: DuelState;
}

export const Player: FC<Props> = ({ duel }) => {
	const { stateMap } = duel;
	const stateKeys = Object.keys(stateMap);

	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor="#333333"
			flexGrow={1}
			paddingRight={1}
		>
			<Box>
				<Text>Key count: {stateKeys.length}</Text>
			</Box>

			{stateKeys.map((key) => {
				const state = stateMap[key];
				return (
					<Box key={key}>
						<Box width={15}>
							<Text>{key}</Text>
						</Box>
						<Box>
							<Text>{JSON.stringify(state)}</Text>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};

export default Player;
