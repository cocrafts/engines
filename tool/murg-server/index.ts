import { nanoId } from '@metacraft/murg-engine';
import express from 'express';
import injectSocket from 'express-ws';
import { sign, verify } from 'jsonwebtoken';
import { selectBestMove } from './bot/botBundle';
import { DuelCommandBundle } from '@metacraft/murg-engine';
import {
	CommandPayload,
	CommandResponse,
	Context,
	DuelCommands,
	JwtPayload,
	ResponseSender,
} from './util/type';
import {
	onIncomingBundle,
	onIncomingConnect,
	onInComingHover,
} from './handlers';

const app = express();
const socket = injectSocket(app);
const duelClients: Record<string, Array<{ player: string; ws: unknown }>> = {};
const jwtSecret = 'shh!!';


app.ws('/', (ws) => {
	ws.on('message', async (rawData) => {
		try {
			const data: CommandPayload = JSON.parse(rawData);
			// const newData = data.payload as DuelCommandBundle
			// newData.forEach(element => {
			// 	console.log("Thiss something i know", element.commands)
			// });
			const { userId, duelId } = verify(data.jwt, jwtSecret) as JwtPayload;
			const players = duelClients[duelId] || [];
			const findPlayer = (i) => i.player === userId;
			const playerIndex = players.findIndex(findPlayer);
			const send: ResponseSender = async (payload, command): Promise<void> => {
				const clients = socket.getWss().clients;

				clients.forEach((client) => {
					const response: CommandResponse = {
						command: command || data.command,
						isMyCommand: client === ws,
						timestamp: new Date().getTime(),
						payload,
					};
					//console.log("This is response@#@#$#@", response)
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
			} else if (data.command === DuelCommands.SendBundle) { // cần đổi chỗ này
				await onIncomingBundle(context, data.payload);
				console.log("Checking context and datapayload", context, "datapayload", data.payload)
			} else if (data.command === DuelCommands.CardHover) {
				await onInComingHover(context, data.payload);
			}
			// kiểm tra endturn.

			if (data.payload[0].group === 'EndTurn' && data.payload[0].phaseOf === 'A') {
				//console.log("It went Here!!!!!!!!!!!!!!!!!", data.payload[0].commands) // co vo day
				const botContext: Context = { duelId, userId: 'B', command: DuelCommands.SendBundle, send }
				//console.log("Maybe co chay vo day")// co chay vo day
				let currentMoveBundle = selectBestMove(duelId, 1) // o day loi
				//console.log("This is currentmove", currentMoveBundle) // undefine
				currentMoveBundle.forEach(moves => {
					console.log("Some move is here", botContext, "LALALAALAL", moves)
					onIncomingBundle(context, moves)
				});
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