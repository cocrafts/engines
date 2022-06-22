import { DuelPlace, DuelState } from './duel';
import { UnitAttributes } from './internal';

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

export interface DuelIdentifier {
	id?: string;
	owner?: string;
	position?: number;
	place: DuelPlace;
}

export interface DuelCommand {
	owner?: string;
	type: CommandType;
	from?: DuelIdentifier;
	target?: DuelIdentifier;
	side?: SummonSide;
	payload?: UnitAttributes;
}

export type CreateCommandPayload = Omit<DuelCommand, 'type'> & {
	snapshot: DuelState;
};

export type CommandCreator<T = CreateCommandPayload> = (
	payload: T,
) => DuelCommand[];

export interface RunCommandPayload {
	snapshot: DuelState;
	command: DuelCommand;
}

export type CommandRunner<T = RunCommandPayload> = (payload: T) => DuelState;
