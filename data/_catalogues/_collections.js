/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

/* 
	Template of collection description:

  author_orig: "",   
  author_eng: "",
	author_orig_short: "",
	author_eng_short: "",
  collection_selectboxname: "",
  collections_page_title_orig: "",
  collections_page_title_eng: "",
	contents_type: "", 
	central_resource: "",
	resource_defs: {}, // defined in separate files
	extra: {},
*/

const ParsedClassicsCollProtos = {

  nt_book: {
    author_orig: 'Ἡ Καινὴ Διαθήκη',   
    author_eng: 'The New Testament',
		author_orig_short: 'Κ. Δ.',
		author_eng_short: 'N. T.',
		contents_type: "line",
		extra: {},
  },

};

const ParsedClassicsCollDefs = {

	new_tab: {
		author_orig: '',   
    author_eng: '',
		author_orig_short: '',
		author_eng_short: '',
		collection_selectboxname: '',
		collections_page_title_orig: '',
		collections_page_title_eng: '',
		contents_type: '',
		central_resource: '',
		extra: {},
	},
	
	nt_matthew: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Ματθαῖον',
		collections_page_title_orig: 'Τὸ κατὰ Ματθαῖον εὐαγγέλιον',
		collections_page_title_eng: 'The gospel according to Matthew',
		central_resource: 'nt_matthew_parsed_text',
	},

	nt_mark: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Μάρκον',
		collections_page_title_orig: 'Τὸ κατὰ Μάρκον εὐαγγέλιον',
		collections_page_title_eng: 'The gospel according to Mark',
		central_resource: 'nt_mark_parsed_text',
	},

	nt_luke: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Λουκᾶν',
		collections_page_title_orig: 'Τὸ κατὰ Λουκᾶν εὐαγγέλιον',
		collections_page_title_eng: 'The gospel according to Luke',
		central_resource: 'nt_luke_parsed_text', 
	},

	nt_john: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Ἰωάννην',
		collections_page_title_orig: 'Τὸ κατὰ Ἰωάννην εὐαγγέλιον',
		collections_page_title_eng: 'The gospel according to John',
		central_resource: 'nt_john_parsed_text',
	},

	nt_acts: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πράξεις ἀποστόλων',
		collections_page_title_orig: 'Πράξεις τῶν ἁγίων ἀποστόλων',
		collections_page_title_eng: 'Acts of the apostles', 
		central_resource: 'nt_acts_parsed_text',
	},

	nt_james: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰακώβου',
		collections_page_title_orig: 'Ἰακώβου τοῦ ἀποστόλου ἐπιστολὴ καθολική',
		collections_page_title_eng: 'Apostle James\'s catholic epistle',
		central_resource: 'nt_james_parsed_text', 
	},

	nt_peter_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πέτρου Α΄',
		collections_page_title_orig: 'Πέτρου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ πρώτη',
		collections_page_title_eng: 'Apostle Peter\'s first catholic epistle', 
		central_resource: 'nt_peter_1_parsed_text',
	},

	nt_peter_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πέτρου B΄',
		collections_page_title_orig: 'Πέτρου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ δευτέρα',
		collections_page_title_eng: 'Apostle Peter\'s second catholic epistle', 
		central_resource: 'nt_peter_2_parsed_text',
	},

	nt_john_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου Α΄',
		collections_page_title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ πρώτη',
		collections_page_title_eng: 'Apostle John\'s first catholic epistle', 
		central_resource: 'nt_john_1_parsed_text',
	},

	nt_john_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου B΄',
		collections_page_title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ δευτέρα',
		collections_page_title_eng: 'Apostle John\'s second catholic epistle', 
		central_resource: 'nt_john_2_parsed_text',
	},

	nt_john_3: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου Γ΄',
		collections_page_title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ τρίτη',
		collections_page_title_eng: 'Apostle John\'s third catholic epistle',
		central_resource: 'nt_john_3_parsed_text', 
	},

	nt_jude: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰούδα',
		collections_page_title_orig: 'Ἰούδα τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ',
		collections_page_title_eng: 'Apostle Jude\'s catholic epistle',
		central_resource: 'nt_jude_parsed_text', 
	},

	nt_romans: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ῥωμαίους',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ῥωμαίους ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Romans',
		central_resource: 'nt_romans_parsed_text', 
	},

	nt_corinthians_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κορινθίους Α΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κορινθίους ἐπιστολὴ πρώτη',
		collections_page_title_eng: 'Apostle Paul\'s first epistle to Corinthians', 
  	central_resource: 'nt_corinthians_1_parsed_text',
	},

	nt_corinthians_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κορινθίους B΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κορινθίους ἐπιστολὴ δευτέρα',
		collections_page_title_eng: 'Apostle Paul\'s second epistle to Corinthians', 
		central_resource: 'nt_corinthians_2_parsed_text',
	},

	nt_galatians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Γαλάτας',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Γαλάτας ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Galatians', 
		central_resource: 'nt_galatians_parsed_text',
	},

	nt_ephesians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ἐφεσίους',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ἐφεσίους ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Ephesians', 
		central_resource: 'nt_ephesians_parsed_text',
	},

	nt_philippians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Φιλιππησίους',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Φιλιππησίους ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Philippians',
		central_resource: 'nt_philippians_parsed_text', 
	},

	nt_colossians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κολοσσαεῖς',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κολοσσαεῖς ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to the Colossians', 
		central_resource: 'nt_colossians_parsed_text',
	},

	nt_thessalonians_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Θεσσαλονικεῖς Α΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Θεσσαλονικεῖς ἐπιστολὴ πρώτη',
		collections_page_title_eng: 'Apostle Paul\'s first epistle to Thessalonians', 
		central_resource: 'nt_thessalonians_1_parsed_text',
	},

	nt_thessalonians_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Θεσσαλονικεῖς B΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Θεσσαλονικεῖς ἐπιστολὴ δευτέρα',
		collections_page_title_eng: 'Apostle Paul\'s second epistle to Thessalonians',
		central_resource: 'nt_thessalonians_2_parsed_text', 
	},

	nt_hebrews: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ἑβραίους',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ἑβραίους ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Hebrews', 
		central_resource: 'nt_hebrews_parsed_text',
	},

	nt_timothy_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τιμόθεον Α΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τιμόθεον ἐπιστολὴ πρώτη',
		collections_page_title_eng: 'Apostle Paul\'s first epistle to Timothy',
		central_resource: 'nt_timothy_1_parsed_text', 
	},

	nt_timothy_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τιμόθεον Β΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τιμόθεον ἐπιστολὴ δευτέρα',
		collections_page_title_eng: 'Apostle Paul\'s second epistle to Timothy',
		central_resource: 'nt_timothy_2_parsed_text', 
	},

	nt_titus: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τίτον',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τίτον ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Titus',
		central_resource: 'nt_titus_parsed_text', 
	},

	nt_philemon: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Φιλήμονα',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Φιλήμονα ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Philemon',
		central_resource: 'nt_philemon_parsed_text', 
	},

	nt_revelation: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἀποκάλυψις Ἰωάννου',
		collections_page_title_orig: 'Ἀποκάλυψις Ἰωάννου τοῦ θεολόγου',
		collections_page_title_eng: 'Revelation of John the theologian',
		central_resource: 'nt_revelation_parsed_text', 
	},

	appleton_initium: {
		author_orig: 'Reginald. B. Appleton',   
    author_eng: 'Reginald. B. Appleton',
		author_orig_short: 'Appleton R. B.',
		author_eng_short: 'Appleton R. B.',
    collection_selectboxname: 'Appleton R. B. Initium',
    collections_page_title_orig: 'Initium',
    collections_page_title_eng: 'Appleton R. B. Initium',
		contents_type: 'page',
		central_resource: 'appleton_initium_reader',
		extra: {
			difficulty_level: 1,
		},
	},

	maxey_fay_new_latin_primer: {
		author_orig: 'Mima Maxey, Marjorie J. Fay',   
    author_eng: 'Mima Maxey, Marjorie J. Fay',
		author_orig_short: 'Maxey M., Fay M. J.',
		author_eng_short: 'Maxey M., Fay M. J.',
    collection_selectboxname: 'Maxey M., Fay M. J. A new Latin primer',
    collections_page_title_orig: 'A new Latin primer',
    collections_page_title_eng: 'A new Latin primer',
		contents_type: 'page',
		central_resource: 'maxey_fay_new_latin_primer_reader',
		extra: {
			difficulty_level: 1,
		},
	},

	appleton_ludi_persici: {
		author_orig: 'Reginald B. Appleton',   
    author_eng: 'Reginald B. Appleton',
		author_orig_short: 'Appleton R. B.',
		author_eng_short: 'Appleton R. B.',
    collection_selectboxname: 'Appleton R. B. Ludi Persici',
    collections_page_title_orig: 'Ludi Persici',
    collections_page_title_eng: 'Ludi Persici',
		contents_type: 'page',
		central_resource: 'appleton_ludi_persici_reader',
		extra: {
			difficulty_level: 3,
		},
	},

	collar_new_gradatim: {
		author_orig: 'William C. Collar',   
    author_eng: 'William C. Collar',
		author_orig_short: 'Collar W. C.',
		author_eng_short: 'Collar W. C.',
    collection_selectboxname: 'Collar W. C. The new gradatim',
    collections_page_title_orig: 'The new gradatim',
    collections_page_title_eng: 'The new gradatim',
		contents_type: 'page',
		central_resource: 'collar_new_gradatim_reader',
		extra: {
			difficulty_level: 2,
		},
	},

	arnold_cloelia: {
		author_orig: 'Eleanor Arnold',   
    author_eng: 'Eleanor Arnold',
		author_orig_short: 'Arnold E.',
		author_eng_short: 'Arnold E.',
    collection_selectboxname: 'Arnold E. Cloelia, puella Rōmāna',
    collections_page_title_orig: 'Cloelia, puella Rōmāna',
    collections_page_title_eng: 'Cloelia, puella Rōmāna',
		contents_type: 'paragraph',
		central_resource: 'arnold_cloelia_parsed_text',
		extra: {
			difficulty_level: 2,
		},
	},

	greek_lexicons: {
		author_orig: '',   
    author_eng: '',
		author_orig_short: '',
		author_eng_short: '',
    collection_selectboxname: 'Greek lexicons',
    collections_page_title_orig: 'Greek lexicons',
    collections_page_title_eng: 'Greek lexicons',
		contents_type: 'word',
		central_resource: '',
		extra: {},
	},

	latin_lexicons: {
		author_orig: '',   
    author_eng: '',
		author_orig_short: '',
		author_eng_short: '',
    collection_selectboxname: 'Latin lexicons',
    collections_page_title_orig: 'Latin lexicons',
    collections_page_title_eng: 'Latin lexicons',
		contents_type: 'word',
		central_resource: '',
		extra: {},
	},

};
