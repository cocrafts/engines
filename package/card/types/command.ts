import { CardAttributes } from './card';
import { DuelPlace } from './duel';

export enum CommandType {
	Summon /* <- create from nowhere */,
	Move,
	Mutate,
	Dust,
}

export type CardPlace = [source: DuelPlace, id?: string, position?: number];

export interface DuelCommand {
	player: string;
	type: CommandType;
	from?: CardPlace;
	target?: CardPlace;
	payload?: CardAttributes;
}
