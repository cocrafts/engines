import { FC } from 'react';
import { Box, Text } from 'ink';

import GraveCard from './GraveCard';

interface Props {
	color?: string;
	cards?: string[];
}

export const GraveYard: FC<Props> = ({ color, cards }) => {
	return (
		<Box alignSelf="center" borderStyle="round" borderColor="#323232">
			{cards.map((id, i) => {
				return <GraveCard id={id} key={i} />;
			})}
			<Text color={color}> • </Text>
		</Box>
	);
};

GraveYard.defaultProps = {
	color: '#323232',
};

export default GraveYard;
