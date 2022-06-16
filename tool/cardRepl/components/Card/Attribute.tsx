import { FC } from 'react';
import { Box, Text } from 'ink';

interface Props {
	pair: [number, number];
}

export const Attribute: FC<Props> = ({ pair }) => {
	const color = extractColor(pair);

	return (
		<Box width="33%" justifyContent="center">
			<Text color={color}>{pair[0]}</Text>
		</Box>
	);
};

export default Attribute;

const extractColor = ([current, origin]) => {
	if (current === 0) {
		return 'gray';
	} else if (current === origin) {
		return 'white';
	} else if (current > origin) {
		return 'green';
	} else {
		return 'red';
	}
};
