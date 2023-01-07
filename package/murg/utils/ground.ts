import { getEnemyId, selectGround } from './helper';
import { CardIdentifier, DuelPlace, DuelState, TargetSide } from './type';

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

export const getFacingIdentifiers = (
	duel: DuelState,
	owner: string,
	cardId: string,
	radius = 0,
) => {
	const result = [];
	const enemyId = getEnemyId(duel, owner);
	const ground = selectGround(duel, owner);
	const enemyGround = selectGround(duel, enemyId);
	const cardIndex = ground.findIndex((id) => id === cardId);

	result.push({
		id: enemyGround[cardIndex],
		owner: enemyId,
		place: DuelPlace.Ground,
	});

	for (let i = 1; i <= radius; i += 1) {
		result.push({
			id: enemyGround[cardIndex - i],
			owner: enemyId,
			place: DuelPlace.Ground,
		});

		result.push({
			id: enemyGround[cardIndex + i],
			owner: enemyId,
			place: DuelPlace.Ground,
		});
	}

	return result;
};

export const getFacingIdentifier = (
	duel: DuelState,
	owner: string,
	cardId: string,
): CardIdentifier => {
	return getFacingIdentifiers(duel, owner, cardId)[0];
};

export type GroundTraverseFunction = (cardId: string | undefined) => void;

export const groundTraverse = (
	duel: DuelState,
	traverser: GroundTraverseFunction,
) => {
	getTraverseIndexes(duel.firstGround.length).forEach((index) => {
		traverser(duel.firstGround[index]);
		traverser(duel.secondGround[index]);
	});
};

export const getTraverseIndexes = (length: number) => {
	const radius = Math.floor(length / 2);
	const result: number[] = [radius];
	let velocity = 1;

	for (let i = 1; i <= radius; i += 1) {
		result.push(radius + i * velocity);
		velocity *= -1;
		result.push(radius + i * velocity);
		velocity *= -1;
	}

	return result;
};

export const reinforceArray = (cardIds: string[]): string[] => {
	const reinforcedArray = [...cardIds];
	const radius = Math.floor(cardIds.length / 2);
	const leftItems = reinforcedArray.slice(0, radius);
	const rightItems = reinforcedArray.slice(radius);
	const leftWeight = leftItems.filter((i) => !!i).length;
	const rightWeight = rightItems.filter((i) => !!i).length;

	const reinforceLeft = () => {
		const relocate = (offset: number): void => {
			if (!reinforcedArray[offset]) return;

			for (let i = radius; i >= offset; i -= 1) {
				if (!reinforcedArray[i]) {
					reinforcedArray[i] = reinforcedArray[offset];
					reinforcedArray[offset] = null;
				}
			}
		};

		for (let i = radius - 1; i >= 0; i -= 1) {
			relocate(i);
		}
	};

	const reinforceRight = () => {
		const relocate = (offset: number): void => {
			if (!reinforcedArray[offset]) return;

			for (let i = radius; i < offset; i += 1) {
				if (!reinforcedArray[i]) {
					reinforcedArray[i] = reinforcedArray[offset];
					reinforcedArray[offset] = null;
				}
			}
		};

		for (let i = radius + 1; i < reinforcedArray.length; i += 1) {
			relocate(i);
		}
	};

	if (leftWeight > rightWeight) {
		reinforceLeft();
		reinforceRight();
	} else {
		reinforceRight();
		reinforceLeft();
	}

	return reinforcedArray;
};

export const getFirstEmptyLeft = (list: string[]): number => {
	const radius = Math.floor(list.length / 2);

	for (let i = radius; i >= 0; i -= 1) {
		if (!list[i]) return i;
	}
};

export const getFirstEmptyRight = (list: string[]): number => {
	const radius = Math.floor(list.length / 2);

	for (let i = radius; i < list.length; i += 1) {
		if (!list[i]) return i;
	}
};

export const getClosestEmpty = (list: string[]): number => {
	const radius = Math.floor(list.length / 2);
	const leftIndex = getFirstEmptyLeft(list);
	const rightIndex = getFirstEmptyRight(list);
	const leftDistance = radius - leftIndex;
	const rightDistance = rightIndex - radius;

	if (leftDistance > rightDistance) {
		return rightIndex;
	} else {
		return leftIndex;
	}
};
