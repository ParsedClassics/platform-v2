/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

/* 
	Template of set description:

	author_orig: "",
	author_eng: "",
	title_orig: "",
	title_eng: "",
	title_orig_short: "",
	catalogue_ignore: {},
	collections: [
		"", 
		"", 
	],
	extra: {
		difficulty_level: number,
	},
*/

ParsedClassicsCollectionSets = {

	sallustius_catilina_jugurtha_orationes: {
		author_orig: "C. Sallusti Crispi",
		author_eng: "Sallust",
		title_orig: 'Catilina; Iugurtha; Orationes et epistulae excerptae de historiis',
		title_eng: 'Catilina; Iugurtha; Orations and epistles from histories',
		title_orig_short: 'C. Sallusti Crispi Catilina; Iugurtha; Orationes et epistulae',
		catalogue_ignore: {author_orig: "C.",},
		collections: [
			'sallust_catilina', 
			'sallust_jugurtha',
			'sallust_orationes_et_epistulae',
		],
		extra: {
			difficulty_level: 3,
		},
	},

	thomae_a_kempis_imitatio_christi: {
		author_orig: "Thomae à Kempis",
		author_eng: "Thomas à Kempis",
		title_orig: 'De imitatione Christi libri IV',
		title_eng: 'De imitatione Christi libri IV',
		title_orig_short: 'Thomae à Kempis De imitatione Christi',
		catalogue_ignore: {author_orig: "Thomae à", title_orig: "De"},
		collections: [
			'th_a_kempis_imitatio_christi_1', 
			//'th_a_kempis_imitatio_christi_2',
			//'th_a_kempis_imitatio_christi_3',
			//'th_a_kempis_imitatio_christi_4',
		],
		extra: {
			difficulty_level: 3,
		},
	},

};

ParsedClassicsCollSetLabels = {

	"ancient--history": {
		"title": "Historia",
		"coll_sets": [
			"sallustius_catilina_jugurtha_orationes",
		],
	},

	"christian_medieval_modern--spiritual_litterature": {
		"title": "Litteratura spiritualis",
		"coll_sets": [
			"thomae_a_kempis_imitatio_christi",
		],
	},
  
};