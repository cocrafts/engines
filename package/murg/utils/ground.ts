import { TargetSide } from './type';

interface GroundSize {
	centerIndex: number;
	radius: number;
	total: number;
	left: number;
	right: number;
}

export const addToGround = (
	card: string,
	ground: string[],
	side: TargetSide = TargetSide.Right,
): boolean => {
	const sizes = getGroundSizes(ground);

	if (sizes.total === 0) {
		if (ground[sizes.centerIndex]) return false;

		ground[sizes.centerIndex] = card;
	} else if (side === TargetSide.Left) {
		const unitIndex = sizes.radius - sizes.left - 1;
		if (ground[unitIndex] || sizes.left > sizes.radius) return false;

		ground[unitIndex] = card;
	} else if (side === TargetSide.Right) {
		const unitIndex = sizes.radius + sizes.right + 1;
		if (ground[unitIndex] || sizes.right > sizes.radius) return false;

		ground[unitIndex] = card;
	}

	return true;
};

export const getGroundSizes = (ground: string[]) => {
	const radius = Math.floor(ground.length / 2);
	const size: GroundSize = {
		centerIndex: radius,
		radius,
		total: 0,
		left: 0,
		right: 0,
	};

	for (let i = 0; i < ground.length; i += 1) {
		if (ground[i]) {
			size.total += 1;

			if (i < radius) {
				size.left += 1;
			} else if (i > radius) {
				size.right += 1;
			}
		}
	}

	return size;
};
