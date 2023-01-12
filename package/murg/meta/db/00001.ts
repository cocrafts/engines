import { interpolate } from '../../utils/card';
import {
	ActivationType,
	Card,
	CardType,
	ClassType,
	InspireSource,
} from '../../utils/type';

const cardList: Card[] = [
	{
		id: '999990000',
		name: 'Troop',
		kind: CardType.Troop,
		rarity: 0,
		class: ClassType.Beast,
		attribute: {
			attack: 20,
			defense: 0,
			health: 40,
		},
		skill: {
			template: 'A proud warrior.',
		},
	},
	{
		id: '999980000',
		name: 'Wolf',
		kind: CardType.Troop,
		rarity: 0,
		class: ClassType.Beast,
		attribute: {
			attack: 20,
			defense: 0,
			health: 20,
		},
		skill: {
			template: 'A ware wolf.',
		},
	},
	{
		id: '999970000',
		name: 'Troop',
		kind: CardType.Troop,
		rarity: 0,
		class: ClassType.Beast,
		attribute: {
			attack: 10,
			defense: 0,
			health: 20,
		},
		skill: {
			template: 'Small snake.',
		},
	},
	/* <-- end of Troop cards */
	{
		id: '00001',
		name: 'The Raven',
		class: ClassType.Assassin,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 30,
		},
		skill: {
			template: 'Destroy first facing [Hero].',
			activation: ActivationType.Summon,
			attribute: {
				id: 'DestroyFacingMinHealth',
				minHealth: 9999,
				unitTypes: [CardType.Hero],
			},
		},
	},
	{
		id: '00002',
		name: 'The Mystic',
		class: ClassType.Assassin,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 60,
		},
		skill: {
			template: "[Gain Attack:Buff] equal to facing enemy's [Defense].",
			activation: ActivationType.Passive,
			passiveAttribute: {
				id: 'GainAttackByEnemyDefense',
			},
		},
	},
	{
		id: '00003',
		name: 'The Shield Breaker',
		class: ClassType.Assassin,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template: 'Permanently [-10 Defense:Danger].',
			activation: ActivationType.Attack,
			attribute: {
				id: 'FrontMutate',
				defense: -10,
			},
		},
	},
	{
		id: '00004',
		name: 'The Stinger',
		class: ClassType.Assassin,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 0,
			health: 20,
		},
		skill: {
			template: "Ignore enemy's [Defense].",
			activation: ActivationType.Passive,
			passiveAttribute: {
				id: 'IgnoreEnemyDefense',
			},
		},
	},
	{
		id: '00005',
		name: 'Vesu Beast',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template: "[Gain Attack:Buff] equal to facing enemy's missing [Health].",
			activation: ActivationType.Passive,
			passiveAttribute: {
				id: 'GainAttackByEnemyMissingHealth',
			},
		},
	},
	{
		id: '00006',
		name: 'Cavalier',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 10,
			health: 60,
		},
		skill: {
			template: '[Destroy:Danger] facing enemy if [30 or less] health.',
			activation: ActivationType.PreFight,
			attribute: {
				id: 'DestroyFacingMinHealth',
				minHealth: 30,
				unitTypes: [CardType.Hero, CardType.Troop],
			},
		},
	},
	{
		id: '00007',
		name: 'Fire Champion',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template:
				'Self buff [+20 Attack:Buff], [+20 Cleaver:Danger] damage in [2] turns.',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
	{
		id: '00008',
		name: 'War Chief',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 0,
			defense: 0,
			health: 90,
		},
		skill: {
			template: '[Deal Damage:Danger] equal to remaining health.',
			activation: ActivationType.Passive,
			passiveAttribute: {
				id: 'GainAttackByRemainingHealth',
			},
		},
	},
	{
		id: '00009',
		name: 'Marcus',
		title: 'The Doom Bringer',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 60,
		},
		skill: {
			template: 'Deal [10 damage:Danger] to random enemy.',
			activation: ActivationType.Charge,
			charge: 1,
			attribute: {
				id: 'RandomEnemyMutate',
				health: -10,
			},
		},
	},
	{
		id: '00010',
		name: 'Nepia',
		title: 'The King Slayer',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 0,
			health: 40,
		},
		skill: {
			template: 'Deal [200% damage:Danger] against [Hero].',
			activation: ActivationType.Passive,
			passiveAttribute: {
				id: 'DamageMultiplier',
				multiplyFactor: 2,
				cardTypes: [CardType.Hero],
			},
		},
	},
	{
		id: '00011',
		name: 'Knight Captain',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 50,
		},
		skill: {
			template: 'Gain [+10 Attack:Buff] on each activated [skill].',
			activation: ActivationType.Inspire,
			inspire: InspireSource.Skill,
			attribute: {
				id: 'SelfMutate',
				attack: 10,
			},
		},
	},
	{
		id: '00012',
		name: 'Brawler',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template: 'Gain [+10 Attack:Buff].',
			activation: ActivationType.Inspire,
			inspire: InspireSource.Death,
			attribute: {
				id: 'SelfMutate',
				attack: 10,
			},
		},
	},
	{
		id: '00013',
		name: 'Legionnaire',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 0,
			health: 40,
		},
		skill: {
			template: 'Deal additional [+20 damage].',
			activation: ActivationType.Glory,
			attribute: {
				id: 'PlayerMutate',
				health: -20,
				isTargetEnemyPlayer: true,
			},
		},
	},
	{
		id: '00014',
		name: 'Head Hunter',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 60,
		},
		skill: {
			template:
				'Stack [+10 Attack:Buff] against same enemy. Reset when facing new enemy.',
			activation: ActivationType.Attack,
		},
	},
	{
		id: '00015',
		name: 'War Hound',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 0,
			health: 60,
		},
		skill: {
			template: 'Double attack.',
			activation: ActivationType.Charge,
			charge: 3,
			attribute: {
				id: 'DamageMultiplier',
				multiplyFactor: 2,
			},
		},
	},
	{
		id: '00016',
		name: 'Paladin',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 50,
			defense: 0,
			health: 70,
		},
		skill: {
			template: 'Ignore [10 Defense:Danger] on hit.',
			activation: ActivationType.Passive,
			passiveAttribute: {
				id: 'IgnoreEnemyDefense',
				defense: 10,
			},
		},
	},
	{
		id: '00017',
		name: 'Knight of Vesu',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 60,
			defense: 0,
			health: 40,
		},
		skill: {
			template:
				'Like the Great Fire, we sweep through the battlefield like an unstoppable force',
		},
	},
	{
		id: '00018',
		name: 'Fire Warrior',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 50,
		},
		skill: {
			template: '[Immune:Special], and gain [+20 Attack:Buff] next turn.',
			activation: ActivationType.Charge,
			charge: 2,
		},
	},
	{
		id: '00019',
		name: 'Destroyer',
		class: ClassType.Knight,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 60,
		},
		skill: {
			template: 'Deal [30 damage:Danger] to [5] front enemies',
			activation: ActivationType.Charge,
			charge: 4,
			attribute: {
				id: 'FrontMutate',
				health: -30,
				radius: 2,
			},
		},
	},
	{
		id: '00020',
		name: 'Infiltrator',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 90,
		},
		skill: {
			template: 'Transform [Damage:Danger] to [Heals:Buff].',
			activation: ActivationType.Charge,
			charge: 4,
		},
	},
	{
		id: '00021',
		name: 'Bjorn Troll',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 20,
			health: 90,
		},
		skill: {
			template:
				'Take extra [10 damage:Danger] against [Assassin:Type] or [Wizard:Type].',
			activation: ActivationType.Passive,
			passiveAttribute: {
				id: 'MutateByClass',
				isTargetEnemy: true,
				classTypes: [ClassType.Assassin, ClassType.Wizard],
				attack: 10,
			},
		},
	},
	{
		id: '00022',
		name: 'Iron Karhu',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template: 'Self heal [+20 Health:Buff].',
			activation: ActivationType.Charge,
			charge: 3,
			attribute: {
				id: 'SelfMutate',
				health: 20,
			},
		},
	},
	{
		id: '00023',
		name: 'Jøtul',
		title: 'Ironside',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 60,
		},
		skill: {
			template:
				'Heal [+10 Health:Buff] for lowest health ally, and deal [10 damage:Danger] to facing enemy.',
			activation: ActivationType.Charge,
			charge: 2,
		},
	},
	{
		id: '00024',
		name: 'Ivar',
		title: 'The Myst',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 0,
			health: 40,
		},
		skill: {
			template: 'Create [10/0/10:Type] [Illusion] on nearest position.',
			activation: ActivationType.Attack,
		},
	},
	{
		id: '00025',
		name: 'Thick Skin',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 10,
			health: 60,
		},
		skill: {
			template: 'Gain [+10 Defense:Buff].',
			activation: ActivationType.Defense,
			attribute: {
				id: 'SelfMutate',
				defense: 10,
			},
		},
	},
	{
		id: '00026',
		name: 'Tyrkir',
		title: 'The Wall',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 80,
		},
		skill: {
			template: '[+20 Defense:Buff] for [2] nearby allies.',
			activation: ActivationType.Banner,
		},
	},
	{
		id: '00027',
		name: 'Frostbite',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 100,
		},
		skill: {
			template: 'Permanently [-10 Attack:Danger] of attacker.',
			activation: ActivationType.Defense,
			attribute: {
				id: 'FrontMutate',
				attack: -10,
			},
		},
	},
	{
		id: '00028',
		name: 'Valkyrie',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 60,
		},
		skill: {
			template: '[Reborn!] (once).',
			activation: ActivationType.Death,
		},
	},
	{
		id: '00029',
		name: 'Ragnar',
		title: 'The Phoenix',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 50,
			defense: 10,
			health: 40,
		},
		skill: {
			template: '[20%:Buff] [Lifesteal].',
			activation: ActivationType.Attack,
			attribute: {
				id: 'SelfMutate',
				health: 10,
			},
		},
	},
	{
		id: '00030',
		name: 'Gladiator',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 50,
		},
		skill: {
			template: '[+1 Defense:Buff] for each missing health.',
			activation: ActivationType.Passive,
			passiveAttribute: {
				id: 'GainDefenseByMissingHealth',
			},
		},
	},
	{
		id: '00031',
		name: 'Bjorn Defender',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 20,
			health: 60,
		},
		skill: {
			template: 'Bjorn mountain is our home, and we protect it with our lives',
		},
	},
	{
		id: '00032',
		name: 'Guild Guardian',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 10,
			defense: 30,
			health: 70,
		},
		skill: {
			template: 'We are shield of the Tanker Guild',
		},
	},
	{
		id: '00033',
		name: 'Dreki',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 10,
			health: 60,
		},
		skill: {
			template:
				'[Toss] highest and lowest health enemies, deal [30 damage:Danger] to each.',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
	{
		id: '00034',
		name: 'Jarl Guardian',
		class: ClassType.Tanker,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 50,
		},
		skill: {
			template:
				'Self buff [Shield] with [20 Defense:Buff], deal [10 Damage:Danger] to 3 front enemies.',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
	{
		id: '00035',
		name: 'Cleric',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 40,
		},
		skill: {
			template: 'Reduce [1] [Charge] for allies, exclude this unit.',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
	{
		id: '00036',
		name: 'Izel',
		title: 'Shadowdancer',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 60,
		},
		skill: {
			template:
				'Heal [+30 Health:Buff] for lowest heath ally, and deal [10 Damage:Danger] to 3 front enemies.',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
	{
		id: '00037',
		name: 'Spellcaster',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 30,
		},
		skill: {
			template:
				'Heal [+20 Health:Buff], deal [20 Damage:Danger] to facing enemy.',
			activation: ActivationType.Charge,
			charge: 2,
		},
	},
	{
		id: '00038',
		name: 'Chipahua',
		title: 'Warcry',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template: '[+10 Attack:Buff] for ally units.',
			activation: ActivationType.Banner,
		},
	},
	{
		id: '00039',
		name: 'Doom Warlock',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 60,
		},
		skill: {
			template:
				'For each unit on the battlefield, deal [10 Damage:Danger] to all enemies.',
			activation: ActivationType.Charge,
			charge: 6,
		},
	},
	{
		id: '00040',
		name: 'Amoxtli',
		title: 'The Silencer',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template: '[Froze] attacker in 1 turn.',
			activation: ActivationType.Defense,
		},
	},
	{
		id: '00041',
		name: 'Healer',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 0,
			health: 40,
		},
		skill: {
			template: 'Heal [+30 Health:Buff] for lowest health ally.',
			activation: ActivationType.Charge,
			charge: 3,
			attribute: {
				id: 'LowestHealthMutate',
				isTargetEnemy: false,
				health: 20,
			},
		},
	},
	{
		id: '00042',
		name: 'Death Dodger',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template: 'Heal [+30 Health:Buff] for lowest health ally [Troop].',
			activation: ActivationType.Charge,
			charge: 2,
		},
	},
	{
		id: '00043',
		name: 'Spell Thief',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 20,
			health: 50,
		},
		skill: {
			template: 'Repeat one activated spell.',
			activation: ActivationType.Charge,
			charge: 2,
		},
	},
	{
		id: '00044',
		name: 'Uqiohn',
		title: 'Backslash',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 60,
		},
		skill: {
			template: 'Deal [10 Damage:Danger] to facing enemy.',
			activation: ActivationType.Inspire,
			inspire: InspireSource.Skill,
			attribute: {
				id: 'FrontMutate',
				health: -10,
			},
		},
	},
	{
		id: '00045',
		name: 'Oxone',
		title: 'The Archmage',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 0,
			health: 60,
		},
		skill: {
			template: 'Deal [20 Damage:Danger] to all units on the battlefield.',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
	{
		id: '00046',
		name: 'Blood Tracer',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 60,
		},
		skill: {
			template:
				'[Toss] lowest health and facing enemy, deal [30 Damage] to each.',
			activation: ActivationType.Summon,
		},
	},
	{
		id: '00047',
		name: 'Sage',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 40,
			defense: 0,
			health: 50,
		},
		skill: {
			template:
				'[Seal] facing enemy, on next turn [Explode], deal [20 Damage:Danger] to 4 nearby enemies.',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
	{
		id: '00048',
		name: 'Slow Death',
		class: ClassType.Wizard,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 40,
		},
		skill: {
			template:
				'[Seal] facing enemy, on next turn [Explode], deal [20 Damage:Danger] to 4 nearby enemies.',
			activation: ActivationType.Charge,
			charge: 2,
		},
	},
	{
		id: '00049',
		name: 'Trapsmith',
		class: ClassType.Summoner,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 40,
		},
		skill: {
			template:
				"Set random [Trap] with [30 Damage:Danger] on enemy's battlefield.",
			activation: ActivationType.Summon,
		},
	},
	{
		id: '00050',
		name: 'Dube',
		title: 'The Twins',
		class: ClassType.Summoner,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 40,
		},
		skill: {
			template: 'Create [Illusion] of this unit, which live in 2 turns.',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
	{
		id: '00051',
		name: 'Impela',
		title: 'The Oath Taker',
		class: ClassType.Summoner,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 70,
		},
		skill: {
			template:
				'[Steal] and buff [+20 Health:Buff], [+20 Attack:Buff] to closest enemy [Troop].',
			activation: ActivationType.Charge,
			charge: 2,
		},
	},
	{
		id: '00052',
		name: 'Unku Shaman',
		class: ClassType.Summoner,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 60,
		},
		skill: {
			template: '[+20 Attack:Buff] for ally [Troops]</span>.',
			activation: ActivationType.Banner,
		},
	},
	{
		id: '00053',
		name: 'Flute Artist',
		class: ClassType.Summoner,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 10,
			defense: 0,
			health: 50,
		},
		skill: {
			template: 'Summon [20/0/10:Type] [Snake:Type] to nearest place.',
			activation: ActivationType.Attack,
		},
	},
	{
		id: '00054',
		name: 'Mind Bender',
		class: ClassType.Summoner,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 40,
		},
		skill: {
			template:
				'[Steal] facing [Troop] if it have [{{minHealth}} or less] Health.',
			activation: ActivationType.PostFight,
			attribute: {
				id: 'UnitStealer',
				minHealth: 20,
				unitTypes: [CardType.Troop],
			},
		},
	},
	{
		id: '00055',
		name: 'Death Whisperer',
		class: ClassType.Summoner,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 30,
			defense: 0,
			health: 50,
		},
		skill: {
			template: '[Steal] facing enemy.',
			activation: ActivationType.Death,
		},
	},
	{
		id: '00056',
		name: 'Kosan',
		title: 'The Beast Master',
		class: ClassType.Summoner,
		kind: CardType.Hero,
		rarity: 0,
		attribute: {
			attack: 20,
			defense: 0,
			health: 40,
		},
		skill: {
			template: '[Summon] two [20/0/20:Type] [Wolves].',
			activation: ActivationType.Charge,
			charge: 3,
		},
	},
];

export default cardList.map(interpolate);
