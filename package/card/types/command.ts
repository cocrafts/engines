import { CardAttributes } from './card';
import { DuelPlace, DuelState } from './duel';

export enum CommandType {
	Summon /* <- create from nowhere */,
	Move,
	Mutate,
	Dust,
}

export type CardIdentifier = [
	source: DuelPlace,
	id?: string,
	position?: number,
];

export interface DuelCommand {
	creator: string;
	type: CommandType;
	from?: CardIdentifier;
	target?: CardIdentifier;
	payload?: CardAttributes;
}

export type CreateCommandPayload = DuelCommand & {
	snapshot: DuelState;
};

export interface RunCommandPayload {
	snapshot: DuelState;
	command: DuelCommand;
}
