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

export interface CardKeyword {
	value: string;
	explain?: string;
	templateStyle?: TemplateStyle;
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
	template: Array<TemplateFragment> | string;
	charge?: number;
	activation?: ActivationType;
	inspire?: InspireSource;
}

export interface Attribute {
	attack: number;
	health: number;
	defense: number;
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

export interface DuelMeta {
	version: string;
	entities: string[];
	map: Record<string, Card>;
}
