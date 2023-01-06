import { FC } from 'react';
import { Box } from 'ink';
import BigText from 'ink-big-text';

interface Props {
	index?: number;
	width: number;
}

export const EmptyCard: FC<Props> = ({ index, width }) => {
	const position = index !== undefined ? String(index) : '?';

	return (
		<Box
			width={width}
			borderColor="#333333"
			borderStyle="round"
			alignItems="center"
			justifyContent="center"
		>
			<BigText text={position} colors={['#20242d', '#20242d']} />
		</Box>
	);
};

export default EmptyCard;
