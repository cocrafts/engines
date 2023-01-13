import { FC } from 'react';
import { Box, Text } from 'ink';

interface Props {
	pair: [number, number];
}

export const Attribute: FC<Props> = ({ pair }) => {
	const [current, base] = pair;
	const hasDiff = current !== base;
	const diff = Math.abs(current - base);
	const currentIcon = current > base ? '↑' : '↓';
	const baseIcon = current !== base ? ' ' : '';
	const currentColor = extractColor(pair);
	const baseColor = hasDiff ? 'gray' : 'black';

	return (
		<Box width="33%" flexDirection="column" alignItems="center">
			<Text color={currentColor}>
				{current}
				{diff > 0 && currentIcon}
			</Text>
			<Text color={baseColor}>{hasDiff ? `${diff}${baseIcon}` : '.'}</Text>
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
