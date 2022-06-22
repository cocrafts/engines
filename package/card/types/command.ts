import { CardAttributes } from './card';
import { DuelPlace, DuelState } from './duel';

export enum CommandType {
	Summon /* <- create from nowhere */,
	Move,
	Mutate,
	Dust,
}

export enum SummonSide {
	Left,
	Right,
}

export type CardIdentifier = [
	source: DuelPlace,
	id?: string,
	position?: number,
	owner?: string,
];

export interface DuelCommand {
	owner?: string;
	type: CommandType;
	from?: CardIdentifier;
	target?: CardIdentifier;
	side?: SummonSide;
	payload?: CardAttributes;
}

export type CreateCommandPayload = Omit<DuelCommand, 'type'> & {
	snapshot: DuelState;
};

export interface RunCommandPayload {
	snapshot: DuelState;
	command: DuelCommand;
}
