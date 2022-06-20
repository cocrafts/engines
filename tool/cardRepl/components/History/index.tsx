import { FC } from 'react';
import { Box } from 'ink';

interface Props {
	size?: number;
}

export const History: FC<Props> = ({ size }) => {
	return (
		<Box
			width={size}
			flexDirection="column"
			justifyContent="flex-start"
			borderStyle="round"
			borderColor="#323232"
		></Box>
	);
};

History.defaultProps = {
	size: 8,
};

export default History;
