import { FC } from 'react';
import { DuelCommandBundle, PlayerState } from '@metacraft/murg-engine';
import { Box, Text } from 'ink';

import { selectColor } from '../../util';

import { getCommandInfo } from './internal';

interface Props {
	size?: number;
	colors: [string, string];
	players?: [PlayerState, PlayerState];
	history: Array<DuelCommandBundle>;
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
			{history.map(({ commands }, i) => {
				return (
					<Box
						key={i}
						borderColor="#282828"
						borderStyle="round"
						flexDirection="column"
						alignItems="center"
					>
						{commands &&
							commands.map((command, z) => {
								const { id, icon, idColor, iconColor } =
									getCommandInfo(command);
								const playerColor = selectColor(players, colors, command.owner);

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
