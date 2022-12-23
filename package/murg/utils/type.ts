export interface TemplateStyle {
	color?: string;
	size?: number;
	weight?: string;
}

export enum FragmentType {
	TEXT = 'text',
	KEYWORD = 'keyword',
}

export interface TemplateFragment {
	text: string;
	type: string;
	style?: TemplateStyle;
}

export enum ActivationType {
	Summon,
	Death,
	Passive,
	Attack,
	Defense,
	Glory,
	Prefight,
	Postfight,
	Charge,
	Inspire,
	Banner,
}

export enum InspireSource {
	Metal,
	Wood,
	Water,
	Fire,
	Earth,
	Dark,
	Light,
	Summon,
	Death,
	Spell,
	Skill,
}

export interface Skill {
	template: TemplateFragment[] | string;
	charge?: number;
	activation?: ActivationType;
	inspire?: InspireSource;
}

export interface Attribute {
	attack: number;
	health: number;
	defense: number;
	charge?: number;
}

export enum CardType {
	Hero,
	Troop,
	Spell,
}

export enum ClassType {
	Assassin = '01',
	Knight = '02',
	Tanker = '03',
	Wizard = '04',
	Summoner = '05',
	Beast = '06',
}

export enum ElementalType {
	Metal = '01',
	Wood = '02',
	Water = '03',
	Fire = '04',
	Earth = '05',
	Light = '06',
	Dark = '07',
}

export interface Card {
	id: string;
	name: string;
	title?: string;
	kind: CardType;
	rarity: number;
	class: ClassType;
	elemental?: ElementalType;
	attribute?: Attribute;
	skill?: Skill;
}

export interface CardMeta {
	version: string;
	entities: string[];
	map: Record<string, Card>;
}

export enum DuelCommandType {
	CardSummon = 'CardSummon',
	CardMove = 'CardMove',
	CardMutate = 'CardMutate',
	CardDust = 'CardDust',
	PlayerMutate = 'PlayerMutate',
	DuelMutate = 'DuelMutate',
}

export enum DuelPlace {
	Deck = 'Deck',
	Hand = 'Hand',
	Ground = 'Ground',
	Grave = 'Grave',
	Ability = 'Ability',
	Player = 'Player',
}

export type DuelCommandPayload = Partial<Attribute> & {
	gameOver?: boolean;
	round?: number;
	perTurnHero?: number;
	perTurnTroop?: number;
};

export enum TargetSide {
	Left = 'left',
	Right = 'right',
}

export interface BoardTarget {
	place: DuelPlace;
	owner?: string;
	id?: string;
	index?: number;
}

export interface DuelCommandTarget {
	from?: BoardTarget;
	to?: BoardTarget;
}

export interface DuelCommand {
	type: DuelCommandType;
	owner?: string;
	target?: DuelCommandTarget;
	payload?: DuelCommandPayload;
}

export interface DuelSetting {
	playerHealth: number;
	handSize: number;
	groundSize: number;
	maxAttachment: number;
	perTurnHero: number;
	perTurnTroop: number;
}

export interface PlayerConfig {
	id: string;
	deck: string[];
}

export interface DuelConfig {
	version: string;
	setting: DuelSetting;
	firstMover: string;
	firstPlayer: PlayerConfig;
	secondPlayer: PlayerConfig;
}

export type CardState = Attribute & {
	id: string;
};

export type PlayerState = Attribute & {
	id: string;
	perTurnHero: number;
	perTurnTroop: number;
};

export interface DuelState {
	map: Record<string, Card>;
	setting: DuelSetting;
	round: number;
	firstMover: string;
	firstPlayer: PlayerState;
	secondPlayer: PlayerState;
	firstDeck: CardState[];
	secondDeck: CardState[];
	firstHand: CardState[];
	secondHand: CardState[];
	firstGround: CardState[];
	secondGround: CardState[];
	firstGrave: CardState[];
	secondGrave: CardState[];
}

type CommandFields = 'owner' | 'target' | 'payload';

export type StatefulCommand<K extends keyof DuelCommand = CommandFields> = (
	payload: Pick<DuelCommand, K> & { state: DuelState },
) => DuelCommand[];

export type StatelessCommand<K extends keyof DuelCommand = CommandFields> = (
	payload: Pick<DuelCommand, K>,
) => DuelCommand[];

export interface RunCommandPayload {
	state: DuelState;
	command: DuelCommand;
}

export type CommandRunner<T = RunCommandPayload> = (
	payload: T,
) => Partial<DuelState>;

export interface MoveResult {
	state: DuelState;
	commands: DuelCommand[];
}
