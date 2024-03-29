import { FC } from 'react';
import { Skill, TemplateFragment } from '@metacraft/murg-engine';
import { Text } from 'ink';

interface Props {
	skill: Skill;
}

export const SkillDesc: FC<Props> = ({ skill }) => {
	const fragments = skill.template as TemplateFragment[];

	return (
		<Text>
			{fragments.map((fragment, i) => {
				return (
					<Text key={i} color={fragment.style?.color || 'gray'}>
						{fragment.text}
					</Text>
				);
			})}
		</Text>
	);
};

export default SkillDesc;
