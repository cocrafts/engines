import { FC } from 'react';
import { Box, Text } from 'ink';

type AttributePair = [origin: number, dynamic: number, predict?: number];

interface Props {
	pair: AttributePair;
}

export const Attribute: FC<Props> = ({ pair }) => {
	const [origin, dynamic, predict] = pair;
	const originDiff = dynamic - origin;
	const predictDiff = predict - dynamic;
	const currentIcon = dynamic > origin ? '↑' : '↓';
	const dynamicColor = extractColor(origin, dynamic);

	return (
		<Box width="33%" flexDirection="column" alignItems="center">
			<Text color={dynamicColor}>
				{dynamic}
				{originDiff > 0 && currentIcon}
			</Text>
			<Text color="gray">{predictDiff !== 0 ? `${predictDiff}` : '.'}</Text>
		</Box>
	);
};

export default Attribute;

const extractColor = (before: number, after: number) => {
	if (before === after) {
		return 'white';
	} else if (before < after) {
		return 'green';
	} else {
		return 'red';
	}
};
