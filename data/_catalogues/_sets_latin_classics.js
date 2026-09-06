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
  
};