import { FC } from 'react';
import { DuelCommand, getPlayerOrder, PlayerStatePair } from '@cocrafts/card';
import { Box, Text } from 'ink';

import { getCommandInfo } from './internal';

interface Props {
	size?: number;
	colors: [string, string];
	players?: PlayerStatePair;
	history: Array<DuelCommand[]>;
}

export const History: FC<Props> = ({ size, players, colors, history }) => {
	return (
		<Box
			width={size}
			flexDirection="column"
			justifyContent="flex-start"
			borderStyle="round"
			borderColor="#323232"
		>
			{history.map((chunk, i) => {
				return (
					<Box
						key={i}
						borderColor="#282828"
						borderStyle="round"
						flexDirection="column"
						alignItems="center"
					>
						{chunk.map((command, z) => {
							const { id, icon, idColor, iconColor } = getCommandInfo(command);
							const order = getPlayerOrder(players, command.owner);
							const playerColor = colors[order];

							return (
								<Box key={z}>
									<Text color={idColor || '#323232'}>{id}</Text>
									<Text color={playerColor}>•</Text>
									<Text color={iconColor || playerColor}>{icon}</Text>
								</Box>
							);
						})}
					</Box>
				);
			})}
		</Box>
	);
};

History.defaultProps = {
	size: 10,
};

export default History;
