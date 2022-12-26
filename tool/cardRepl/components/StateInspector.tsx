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
				const attack = String(state.attack).padStart(3, ' ');
				const defense = String(state.defense).padStart(3, ' ');
				const health = String(state.health).padStart(3, ' ');
				const charge = state.charge ? ` (${state.charge})` : '';

				return (
					<Box key={key}>
						<Box width={15}>
							<Text>{key}</Text>
						</Box>
						<Box>
							<Text color="red">{attack}</Text>
							<Text color="gray"> | </Text>
							<Text>{defense}</Text>
							<Text color="gray"> | </Text>
							<Text color="green">{health}</Text>
							<Text color="blue">{charge}</Text>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};

export default Player;
