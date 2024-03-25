import { CommandHandler, DuelCommands } from '../util/type';

import { fetchDuel } from './internal';

export const onIncomingConnect: CommandHandler = async ({
	userId,
	duelId,
	send,
}) => {
	const context = { userId, duelId };
	const duel = fetchDuel(duelId); //Tạo duel khi có 2 thằng chơi
	await send({ context, duel });// chưa hiểu lắm khúc await send này
	// tìm cách kiểm tra thời gian
	if (duel.winner) {
		await send({ winner: duel.winner }, DuelCommands.GameOver);
	}
};
				