import { FC } from 'react';
import { CardState } from '@cocrafts/card';
import { Box, Text } from 'ink';

import Attribute from './Attribute';

interface Props {
	color?: string;
	item: CardState;
}

export const Card: FC<Props> = ({ color, item }) => {
	return (
		<Box
			width={20}
			flexDirection="column"
			borderStyle="round"
			alignItems="center"
			borderColor="#333333"
		>
			<Text color={color}>{item.id.substring(2, 4)}</Text>
			<Box padding={1} height={9} alignItems="flex-end">
				<Text color="#888888">{item.base.skill?.desc || ''}</Text>
			</Box>
			<Box>
				<Box width="33%" />
				<Box width="34%" justifyContent="center">
					<Text color="#323232">...</Text>
				</Box>
				<Box width="33%" justifyContent="center">
					{!!item.base.cooldown && (
						<Box>
							<Text color="#282828">(</Text>
							<Text color="#666666">{item.base.cooldown}</Text>
							<Text color="#282828">)</Text>
						</Box>
					)}
				</Box>
			</Box>
			<Box>
				<Attribute pair={[item.attack, item.base.attack]} />
				<Attribute pair={[item.defense, item.base.defense]} />
				<Attribute pair={[item.health, item.base.health]} />
			</Box>
		</Box>
	);
};

Card.defaultProps = {
	color: '#ffffff',
};

export default Card;
