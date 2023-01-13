import { nanoId } from '@metacraft/murg-engine';
import express from 'express';
import injectSocket from 'express-ws';
import { sign, verify } from 'jsonwebtoken';

import {
	CommandPayload,
	CommandResponse,
	Context,
	DuelCommands,
	JwtPayload,
	ResponseSender,
} from './util/type';
import { onIncomingBundle, onIncomingConnect } from './handlers';

const app = express();
const socket = injectSocket(app);
const duelClients: Record<string, Array<{ player: string; ws: unknown }>> = {};
const jwtSecret = 'shh!!';

app.ws('/', (ws) => {
	ws.on('message', async (rawData) => {
		try {
			const data: CommandPayload = JSON.parse(rawData);
			const { userId, duelId } = verify(data.jwt, jwtSecret) as JwtPayload;
			const players = duelClients[duelId] || [];
			const findPlayer = (i) => i.player === userId;
			const playerIndex = players.findIndex(findPlayer);
			const send: ResponseSender = async (payload): Promise<void> => {
				const clients = socket.getWss().clients;

				clients.forEach((client) => {
					const response: CommandResponse = {
						command: data.command,
						isMyCommand: client === ws,
						timestamp: new Date().getTime(),
						payload,
					};

					client.send(JSON.stringify(response));
				});
			};
			const context: Context = { duelId, userId, command: data.command, send };

			if (playerIndex === -1) {
				players.push({ player: userId, ws });
				duelClients[duelId] = players;
			}

			if (data.command === DuelCommands.ConnectMatch) {
				await onIncomingConnect(context, data.payload);
			} else if (data.command === DuelCommands.SendBundle) {
				await onIncomingBundle(context, data.payload);
			}
		} catch (e) {
			await ws.send(JSON.stringify({ message: 'error' }));
		}
	});
});

app.listen(3006, () => {
	console.log('Address: localhost:3006');
});

const duelId = nanoId();
const signAndPrintSignature = (userId: string) => {
	const signature = sign({ userId, duelId } as JwtPayload, jwtSecret);

	console.log(`Player ${userId}: `, `http://localhost:7456/?jwt=${signature}`);
};

console.log('Duel:', duelId);
signAndPrintSignature('A');
signAndPrintSignature('B');
