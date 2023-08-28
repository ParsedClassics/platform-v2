/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

/* 
	Template of resource description:

  author_orig: "",   
  author_eng: "",
  collection_selectboxname: "",
  collections_page_title_orig: "",
  collections_page_title_eng: "", 
	resource_defs: {}, // defined in separate files
*/

const ParsedClassicsCollProtos = {

  nt_book: {
    author_orig: 'Ἡ Καινὴ Διαθήκη',   
    author_eng: 'The New Testament',
  },

};

const ParsedClassicsCollDefs = {

	new_tab: {
		author_orig: '',   
    author_eng: '',
		collection_selectboxname: '',
		collections_page_title_orig: '',
		collections_page_title_eng: '',
	},
	
	nt_matthew: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Ματθαῖον',
		collections_page_title_orig: 'Τὸ κατὰ Ματθαῖον εὐαγγέλιον',
		collections_page_title_eng: 'The gospel according to Matthew',
	},

	nt_mark: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Μάρκον',
		collections_page_title_orig: 'Τὸ κατὰ Μάρκον εὐαγγέλιον',
		collections_page_title_eng: 'The gospel according to Mark',
	},

	nt_luke: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Λουκᾶν',
		collections_page_title_orig: 'Τὸ κατὰ Λουκᾶν εὐαγγέλιον',
		collections_page_title_eng: 'The gospel according to Luke', 
	},

	nt_john: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Ἰωάννην',
		collections_page_title_orig: 'Τὸ κατὰ Ἰωάννην εὐαγγέλιον',
		collections_page_title_eng: 'The gospel according to John',
	},

	nt_acts: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πράξεις ἀποστόλων',
		collections_page_title_orig: 'Πράξεις τῶν ἁγίων ἀποστόλων',
		collections_page_title_eng: 'Acts of the apostles', 
	},

	nt_james: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰακώβου',
		collections_page_title_orig: 'Ἰακώβου τοῦ ἀποστόλου ἐπιστολὴ καθολική',
		collections_page_title_eng: 'Apostle James\'s catholic epistle', 
	},

	nt_peter_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πέτρου Α΄',
		collections_page_title_orig: 'Πέτρου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ πρώτη',
		collections_page_title_eng: 'Apostle Peter\'s first catholic epistle', 
	},

	nt_peter_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πέτρου B΄',
		collections_page_title_orig: 'Πέτρου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ δευτέρα',
		collections_page_title_eng: 'Apostle Peter\'s second catholic epistle', 
	},

	nt_john_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου Α΄',
		collections_page_title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ πρώτη',
		collections_page_title_eng: 'Apostle John\'s first catholic epistle', 
	},

	nt_john_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου B΄',
		collections_page_title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ δευτέρα',
		collections_page_title_eng: 'Apostle John\'s second catholic epistle', 
	},

	nt_john_3: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου Γ΄',
		collections_page_title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ τρίτη',
		collections_page_title_eng: 'Apostle John\'s third catholic epistle', 
	},

	nt_jude: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰούδα',
		collections_page_title_orig: 'Ἰούδα τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ',
		collections_page_title_eng: 'Apostle Jude\'s catholic epistle', 
	},

	nt_romans: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ῥωμαίους',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ῥωμαίους ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Romans', 
	},

	nt_corinthians_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κορινθίους Α΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κορινθίους ἐπιστολὴ πρώτη',
		collections_page_title_eng: 'Apostle Paul\'s first epistle to Corinthians', 
  	
	},

	nt_corinthians_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κορινθίους B΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κορινθίους ἐπιστολὴ δευτέρα',
		collections_page_title_eng: 'Apostle Paul\'s second epistle to Corinthians', 
	},

	nt_galatians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Γαλάτας',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Γαλάτας ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Galatians', 
	},

	nt_ephesians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ἐφεσίους',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ἐφεσίους ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Ephesians', 
	},

	nt_philippians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Φιλιππησίους',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Φιλιππησίους ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Philippians', 
	},

	nt_colossians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κολοσσαεῖς',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κολοσσαεῖς ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to the Colossians', 
	},

	nt_thessalonians_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Θεσσαλονικεῖς Α΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Θεσσαλονικεῖς ἐπιστολὴ πρώτη',
		collections_page_title_eng: 'Apostle Paul\'s first epistle to Thessalonians', 
	},

	nt_thessalonians_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Θεσσαλονικεῖς B΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Θεσσαλονικεῖς ἐπιστολὴ δευτέρα',
		collections_page_title_eng: 'Apostle Paul\'s second epistle to Thessalonians', 
	},

	nt_hebrews: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ἑβραίους',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ἑβραίους ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Hebrews', 
	},

	nt_timothy_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τιμόθεον Α΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τιμόθεον ἐπιστολὴ πρώτη',
		collections_page_title_eng: 'Apostle Paul\'s first epistle to Timothy', 
	},

	nt_timothy_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τιμόθεον Β΄',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τιμόθεον ἐπιστολὴ δευτέρα',
		collections_page_title_eng: 'Apostle Paul\'s second epistle to Timothy', 
	},

	nt_titus: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τίτον',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τίτον ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Titus', 
	},

	nt_philemon: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Φιλήμονα',
		collections_page_title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Φιλήμονα ἐπιστολή',
		collections_page_title_eng: 'Apostle Paul\'s epistle to Philemon', 
	},

	nt_revelation: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἀποκάλυψις Ἰωάννου',
		collections_page_title_orig: 'Ἀποκάλυψις Ἰωάννου τοῦ θεολόγου',
		collections_page_title_eng: 'Revelation of John the theologian', 
	},

};
