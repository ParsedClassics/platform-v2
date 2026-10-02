/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

/* 
	Template of collection definition:

  author_orig: "",   
  author_eng: "",
	author_orig_short: "",
	author_eng_short: "",
  collection_selectboxname: "",
  title_orig: "",
  title_eng: "",
	contents_type: "", 
	central_resource: "",
	// resource_defs: {}, // defined in separate files
	catalogue_ignore: {},
	extra: {
		line_display: "",
		difficulty_level: number,
	},
*/

const ParsedClassicsCollProtos = {

	homer_book: {
    author_orig: 'Ὁμήρου',   
    author_eng: 'Homer',
		author_orig_short: 'Ὁμήρου',
		author_eng_short: 'Homer',
		contents_type: "line",
		extra: {
			line_display: 'block',
		},
  },

	homerica_book: {
    author_orig: 'Τὰ Ὁμηρικά',   
    author_eng: 'Homerica',
		author_orig_short: 'Τὰ Ὁμηρικά',
		author_eng_short: 'Homerica',
		contents_type: "line",
		extra: {
			line_display: 'block',
		},
  },

	hesiod_book: {
    author_orig: 'Ἡσιόδου',   
    author_eng: 'Hesiod',
		author_orig_short: 'Ἡσιόδου',
		author_eng_short: 'Hesiod',
		contents_type: "line",
		extra: {
			line_display: 'block',
		},
  },

	nt_book: {
    author_orig: 'Ἡ Καινὴ Διαθήκη',   
    author_eng: 'The New Testament',
		author_orig_short: 'Κ. Δ.',
		author_eng_short: 'N. T.',
		contents_type: "line",
		extra: {},
  },

	sallust_book: {
		author_orig: 'C. Sallusti Crispi',   
    author_eng: 'C. Sallusti Crispi',
		author_orig_short: 'C. Sallusti Crispi',
		author_eng_short: 'C. Sallusti Crispi',
		contents_type: 'line',
		catalogue_ignore: {author_orig: "C.",},
		extra: {
			difficulty_level: 3,
		},
	},

	th_a_kempis_book: {
		author_orig: 'Thomae à Kempis',   
    author_eng: 'Thomas à Kempis',
		author_orig_short: 'Th. à Kempis',
		author_eng_short: 'Th. à Kempis',
		contents_type: 'paragraph',
		catalogue_ignore: {author_orig: "Thomae à"},
		extra: {
			difficulty_level: 3,
		},
	},

};

const ParsedClassicsCollDefs = {

	new_tab: {
		author_orig: '',   
    author_eng: '',
		author_orig_short: '',
		author_eng_short: '',
		collection_selectboxname: '',
		title_orig: '',
		title_eng: '',
		contents_type: '',
		central_resource: '',
		extra: {},
	},

	homer_iliad_1: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Α",
		title_orig: "Ἰλιάδος Α",
		title_eng: 'Iliad 1',
		central_resource: 'homer_iliad_1_parsed_text',
	},

	homer_iliad_2: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Β",
		title_orig: "Ἰλιάδος Β",
		title_eng: 'Iliad 2',
		central_resource: 'homer_iliad_2_parsed_text',
	},

	homer_iliad_3: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Γ",
		title_orig: "Ἰλιάδος Γ",
		title_eng: 'Iliad 3',
		central_resource: 'homer_iliad_3_parsed_text',
	},

	homer_iliad_4: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Δ",
		title_orig: "Ἰλιάδος Δ",
		title_eng: 'Iliad 4',
		central_resource: 'homer_iliad_4_parsed_text',
	},

	homer_iliad_5: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ε",
		title_orig: "Ἰλιάδος Ε",
		title_eng: 'Iliad 5',
		central_resource: 'homer_iliad_5_parsed_text',
	},

	homer_iliad_6: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ζ",
		title_orig: "Ἰλιάδος Ζ",
		title_eng: 'Iliad 6',
		central_resource: 'homer_iliad_6_parsed_text',
	},

	homer_iliad_7: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Η",
		title_orig: "Ἰλιάδος Η",
		title_eng: 'Iliad 7',
		central_resource: 'homer_iliad_7_parsed_text',
	},

	homer_iliad_8: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Θ",
		title_orig: "Ἰλιάδος Θ",
		title_eng: 'Iliad 8',
		central_resource: 'homer_iliad_8_parsed_text',
	},

	homer_iliad_9: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ι",
		title_orig: "Ἰλιάδος Ι",
		title_eng: 'Iliad 9',
		central_resource: 'homer_iliad_9_parsed_text',
	},

	homer_iliad_10: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Κ",
		title_orig: "Ἰλιάδος Κ",
		title_eng: 'Iliad 10',
		central_resource: 'homer_iliad_10_parsed_text',
	},

	homer_iliad_11: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Λ",
		title_orig: "Ἰλιάδος Λ",
		title_eng: 'Iliad 11',
		central_resource: 'homer_iliad_11_parsed_text',
	},

	homer_iliad_12: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Μ",
		title_orig: "Ἰλιάδος Μ",
		title_eng: 'Iliad 12',
		central_resource: 'homer_iliad_12_parsed_text',
	},

	homer_iliad_13: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ν",
		title_orig: "Ἰλιάδος Ν",
		title_eng: 'Iliad 13',
		central_resource: 'homer_iliad_13_parsed_text',
	},

	homer_iliad_14: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ξ",
		title_orig: "Ἰλιάδος Ξ",
		title_eng: 'Iliad 14',
		central_resource: 'homer_iliad_14_parsed_text',
	},

	homer_iliad_15: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ο",
		title_orig: "Ἰλιάδος Ο",
		title_eng: 'Iliad 15',
		central_resource: 'homer_iliad_15_parsed_text',
	},

	homer_iliad_16: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Π",
		title_orig: "Ἰλιάδος Π",
		title_eng: 'Iliad 16',
		central_resource: 'homer_iliad_16_parsed_text',
	},

	homer_iliad_17: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ρ",
		title_orig: "Ἰλιάδος Ρ",
		title_eng: 'Iliad 17',
		central_resource: 'homer_iliad_17_parsed_text',
	},

	homer_iliad_18: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Σ",
		title_orig: "Ἰλιάδος Σ",
		title_eng: 'Iliad 18',
		central_resource: 'homer_iliad_18_parsed_text',
	},

	homer_iliad_19: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Τ",
		title_orig: "Ἰλιάδος Τ",
		title_eng: 'Iliad 19',
		central_resource: 'homer_iliad_19_parsed_text',
	},

	homer_iliad_20: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Υ",
		title_orig: "Ἰλιάδος Υ",
		title_eng: 'Iliad 20',
		central_resource: 'homer_iliad_20_parsed_text',
	},

	homer_iliad_21: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Φ",
		title_orig: "Ἰλιάδος Φ",
		title_eng: 'Iliad 21',
		central_resource: 'homer_iliad_21_parsed_text',
	},

	homer_iliad_22: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Χ",
		title_orig: "Ἰλιάδος Χ",
		title_eng: 'Iliad 22',
		central_resource: 'homer_iliad_22_parsed_text',
	},

	homer_iliad_23: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ψ",
		title_orig: "Ἰλιάδος Ψ",
		title_eng: 'Iliad 23',
		central_resource: 'homer_iliad_23_parsed_text',
	},

	homer_iliad_24: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ω",
		title_orig: "Ἰλιάδος Ω",
		title_eng: 'Iliad 24',
		central_resource: 'homer_iliad_24_parsed_text',
	},

	homer_odyssey_1: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Α",
		title_orig: "Ὀδυσσείας Α",
		title_eng: 'Odyssey 1',
		central_resource: 'homer_odyssey_1_parsed_text',
	},

	homer_odyssey_2: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Β",
		title_orig: "Ὀδυσσείας Β",
		title_eng: 'Odyssey 2',
		central_resource: 'homer_odyssey_2_parsed_text',
	},

	homer_odyssey_3: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Γ",
		title_orig: "Ὀδυσσείας Γ",
		title_eng: 'Odyssey 3',
		central_resource: 'homer_odyssey_3_parsed_text',
	},

	homer_odyssey_4: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Δ",
		title_orig: "Ὀδυσσείας Δ",
		title_eng: 'Odyssey 4',
		central_resource: 'homer_odyssey_4_parsed_text',
	},

	homer_odyssey_5: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ε",
		title_orig: "Ὀδυσσείας Ε",
		title_eng: 'Odyssey 5',
		central_resource: 'homer_odyssey_5_parsed_text',
	},

	homer_odyssey_6: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ζ",
		title_orig: "Ὀδυσσείας Ζ",
		title_eng: 'Odyssey 6',
		central_resource: 'homer_odyssey_6_parsed_text',
	},

	homer_odyssey_7: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Η",
		title_orig: "Ὀδυσσείας Η",
		title_eng: 'Odyssey 7',
		central_resource: 'homer_odyssey_7_parsed_text',
	},

	homer_odyssey_8: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Θ",
		title_orig: "Ὀδυσσείας Θ",
		title_eng: 'Odyssey 8',
		central_resource: 'homer_odyssey_8_parsed_text',
	},

	homer_odyssey_9: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ι",
		title_orig: "Ὀδυσσείας Ι",
		title_eng: 'Odyssey 9',
		central_resource: 'homer_odyssey_9_parsed_text',
	},

	homer_odyssey_10: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Κ",
		title_orig: "Ὀδυσσείας Κ",
		title_eng: 'Odyssey 10',
		central_resource: 'homer_odyssey_10_parsed_text',
	},

	homer_odyssey_11: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Λ",
		title_orig: "Ὀδυσσείας Λ",
		title_eng: 'Odyssey 11',
		central_resource: 'homer_odyssey_11_parsed_text',
	},

	homer_odyssey_12: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Μ",
		title_orig: "Ὀδυσσείας Μ",
		title_eng: 'Odyssey 12',
		central_resource: 'homer_odyssey_12_parsed_text',
	},

	homer_odyssey_13: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ν",
		title_orig: "Ὀδυσσείας Ν",
		title_eng: 'Odyssey 13',
		central_resource: 'homer_odyssey_13_parsed_text',
	},

	homer_odyssey_14: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ξ",
		title_orig: "Ὀδυσσείας Ξ",
		title_eng: 'Odyssey 14',
		central_resource: 'homer_odyssey_14_parsed_text',
	},

	homer_odyssey_15: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ο",
		title_orig: "Ὀδυσσείας Ο",
		title_eng: 'Odyssey 15',
		central_resource: 'homer_odyssey_15_parsed_text',
	},

	homer_odyssey_16: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Π",
		title_orig: "Ὀδυσσείας Π",
		title_eng: 'Odyssey 16',
		central_resource: 'homer_odyssey_16_parsed_text',
	},

	homer_odyssey_17: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ρ",
		title_orig: "Ὀδυσσείας Ρ",
		title_eng: 'Odyssey 17',
		central_resource: 'homer_odyssey_17_parsed_text',
	},

	homer_odyssey_18: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Σ",
		title_orig: "Ὀδυσσείας Σ",
		title_eng: 'Odyssey 18',
		central_resource: 'homer_odyssey_18_parsed_text',
	},

	homer_odyssey_19: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Τ",
		title_orig: "Ὀδυσσείας Τ",
		title_eng: 'Odyssey 19',
		central_resource: 'homer_odyssey_19_parsed_text',
	},

	homer_odyssey_20: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Υ",
		title_orig: "Ὀδυσσείας Υ",
		title_eng: 'Odyssey 20',
		central_resource: 'homer_odyssey_20_parsed_text',
	},

	homer_odyssey_21: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Φ",
		title_orig: "Ὀδυσσείας Φ",
		title_eng: 'Odyssey 21',
		central_resource: 'homer_odyssey_21_parsed_text',
	},

	homer_odyssey_22: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Χ",
		title_orig: "Ὀδυσσείας Χ",
		title_eng: 'Odyssey 22',
		central_resource: 'homer_odyssey_22_parsed_text',
	},

	homer_odyssey_23: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ψ",
		title_orig: "Ὀδυσσείας Ψ",
		title_eng: 'Odyssey 23',
		central_resource: 'homer_odyssey_23_parsed_text',
	},

	homer_odyssey_24: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ω",
		title_orig: "Ὀδυσσείας Ω",
		title_eng: 'Odyssey 24',
		central_resource: 'homer_odyssey_24_parsed_text',
	},

	homeric_hymns: {
		...ParsedClassicsCollProtos.homerica_book,
		collection_selectboxname: "Ὁμηρικοὶ ὕμνοι",
		title_orig: "Ὁμηρικοὶ ὕμνοι",
		title_eng: 'Homeric hymns',
		central_resource: 'homeric_hymns_parsed_text',
	},

	hesiod_theogonia: {
		...ParsedClassicsCollProtos.hesiod_book,
		collection_selectboxname: "Ἡσιόδου Θεογονία",
		title_orig: "Θεογονία",
		title_eng: 'Hesiod Theogonia',
		central_resource: 'hesiod_theogonia_parsed_text',
	},

	hesiod_erga_kai_hmerai: {
		...ParsedClassicsCollProtos.hesiod_book,
		collection_selectboxname: "Ἡσιόδου Ἔργα καὶ Ἡμέραι",
		title_orig: "Ἔργα καὶ Ἡμέραι",
		title_eng: 'Hesiod Works and Days',
		central_resource: 'hesiod_erga_kai_hmerai_parsed_text',
	},

	hesiod_aspis: {
		...ParsedClassicsCollProtos.hesiod_book,
		collection_selectboxname: "Ἡσιόδου Ἀσπὶς Ἡρακλέους",
		title_orig: "Ἀσπὶς Ἡρακλέους",
		title_eng: 'Hesiod Shield of Heracles',
		central_resource: 'hesiod_aspis_parsed_text',
	},

	plato_apology: {
		author_orig: 'Πλάτωνος',   
    author_eng: 'Plato',
		author_orig_short: 'Πλάτωνος',
		author_eng_short: 'Plato',
    collection_selectboxname: 'Πλάτωνος Ἀπολογία Σωκράτους',
    title_orig: 'Ἀπολογία Σωκράτους',
    title_eng: 'Apology of Socrates',
		contents_type: 'paragraph',
		central_resource: 'plato_apology_parsed_text',
		catalogue_ignore: {},
		extra: {
			difficulty_level: 3,
		},
	},
	
	nt_matthew: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Ματθαῖον',
		title_orig: 'Τὸ κατὰ Ματθαῖον εὐαγγέλιον',
		title_eng: 'The gospel according to Matthew',
		central_resource: 'nt_matthew_parsed_text',
	},

	nt_mark: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Μάρκον',
		title_orig: 'Τὸ κατὰ Μάρκον εὐαγγέλιον',
		title_eng: 'The gospel according to Mark',
		central_resource: 'nt_mark_parsed_text',
	},

	nt_luke: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Λουκᾶν',
		title_orig: 'Τὸ κατὰ Λουκᾶν εὐαγγέλιον',
		title_eng: 'The gospel according to Luke',
		central_resource: 'nt_luke_parsed_text', 
	},

	nt_john: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Κατὰ Ἰωάννην',
		title_orig: 'Τὸ κατὰ Ἰωάννην εὐαγγέλιον',
		title_eng: 'The gospel according to John',
		central_resource: 'nt_john_parsed_text',
	},

	nt_acts: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πράξεις ἀποστόλων',
		title_orig: 'Πράξεις τῶν ἁγίων ἀποστόλων',
		title_eng: 'Acts of the apostles', 
		central_resource: 'nt_acts_parsed_text',
	},

	nt_james: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰακώβου',
		title_orig: 'Ἰακώβου τοῦ ἀποστόλου ἐπιστολὴ καθολική',
		title_eng: 'Apostle James\'s catholic epistle',
		central_resource: 'nt_james_parsed_text', 
	},

	nt_peter_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πέτρου Α΄',
		title_orig: 'Πέτρου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ πρώτη',
		title_eng: 'Apostle Peter\'s first catholic epistle', 
		central_resource: 'nt_peter_1_parsed_text',
	},

	nt_peter_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πέτρου B΄',
		title_orig: 'Πέτρου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ δευτέρα',
		title_eng: 'Apostle Peter\'s second catholic epistle', 
		central_resource: 'nt_peter_2_parsed_text',
	},

	nt_john_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου Α΄',
		title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ πρώτη',
		title_eng: 'Apostle John\'s first catholic epistle', 
		central_resource: 'nt_john_1_parsed_text',
	},

	nt_john_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου B΄',
		title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ δευτέρα',
		title_eng: 'Apostle John\'s second catholic epistle', 
		central_resource: 'nt_john_2_parsed_text',
	},

	nt_john_3: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰωάννου Γ΄',
		title_orig: 'Ἰωάννου τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ τρίτη',
		title_eng: 'Apostle John\'s third catholic epistle',
		central_resource: 'nt_john_3_parsed_text', 
	},

	nt_jude: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἰούδα',
		title_orig: 'Ἰούδα τοῦ ἀποστόλου ἐπιστολὴ καθολικὴ',
		title_eng: 'Apostle Jude\'s catholic epistle',
		central_resource: 'nt_jude_parsed_text', 
	},

	nt_romans: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ῥωμαίους',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ῥωμαίους ἐπιστολή',
		title_eng: 'Apostle Paul\'s epistle to Romans',
		central_resource: 'nt_romans_parsed_text', 
	},

	nt_corinthians_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κορινθίους Α΄',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κορινθίους ἐπιστολὴ πρώτη',
		title_eng: 'Apostle Paul\'s first epistle to Corinthians', 
  	central_resource: 'nt_corinthians_1_parsed_text',
	},

	nt_corinthians_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κορινθίους B΄',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κορινθίους ἐπιστολὴ δευτέρα',
		title_eng: 'Apostle Paul\'s second epistle to Corinthians', 
		central_resource: 'nt_corinthians_2_parsed_text',
	},

	nt_galatians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Γαλάτας',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Γαλάτας ἐπιστολή',
		title_eng: 'Apostle Paul\'s epistle to Galatians', 
		central_resource: 'nt_galatians_parsed_text',
	},

	nt_ephesians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ἐφεσίους',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ἐφεσίους ἐπιστολή',
		title_eng: 'Apostle Paul\'s epistle to Ephesians', 
		central_resource: 'nt_ephesians_parsed_text',
	},

	nt_philippians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Φιλιππησίους',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Φιλιππησίους ἐπιστολή',
		title_eng: 'Apostle Paul\'s epistle to Philippians',
		central_resource: 'nt_philippians_parsed_text', 
	},

	nt_colossians: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Κολοσσαεῖς',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Κολοσσαεῖς ἐπιστολή',
		title_eng: 'Apostle Paul\'s epistle to the Colossians', 
		central_resource: 'nt_colossians_parsed_text',
	},

	nt_thessalonians_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Θεσσαλονικεῖς Α΄',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Θεσσαλονικεῖς ἐπιστολὴ πρώτη',
		title_eng: 'Apostle Paul\'s first epistle to Thessalonians', 
		central_resource: 'nt_thessalonians_1_parsed_text',
	},

	nt_thessalonians_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Θεσσαλονικεῖς B΄',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Θεσσαλονικεῖς ἐπιστολὴ δευτέρα',
		title_eng: 'Apostle Paul\'s second epistle to Thessalonians',
		central_resource: 'nt_thessalonians_2_parsed_text', 
	},

	nt_hebrews: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Ἑβραίους',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Ἑβραίους ἐπιστολή',
		title_eng: 'Apostle Paul\'s epistle to Hebrews', 
		central_resource: 'nt_hebrews_parsed_text',
	},

	nt_timothy_1: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τιμόθεον Α΄',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τιμόθεον ἐπιστολὴ πρώτη',
		title_eng: 'Apostle Paul\'s first epistle to Timothy',
		central_resource: 'nt_timothy_1_parsed_text', 
	},

	nt_timothy_2: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τιμόθεον Β΄',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τιμόθεον ἐπιστολὴ δευτέρα',
		title_eng: 'Apostle Paul\'s second epistle to Timothy',
		central_resource: 'nt_timothy_2_parsed_text', 
	},

	nt_titus: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Τίτον',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Τίτον ἐπιστολή',
		title_eng: 'Apostle Paul\'s epistle to Titus',
		central_resource: 'nt_titus_parsed_text', 
	},

	nt_philemon: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Πρὸς Φιλήμονα',
		title_orig: 'Παύλου τοῦ ἀποστόλου ἡ πρὸς Φιλήμονα ἐπιστολή',
		title_eng: 'Apostle Paul\'s epistle to Philemon',
		central_resource: 'nt_philemon_parsed_text', 
	},

	nt_revelation: {
		...ParsedClassicsCollProtos.nt_book,
		collection_selectboxname: 'Κ.Δ. Ἀποκάλυψις Ἰωάννου',
		title_orig: 'Ἀποκάλυψις Ἰωάννου τοῦ θεολόγου',
		title_eng: 'Revelation of John the theologian',
		central_resource: 'nt_revelation_parsed_text', 
	},

	appleton_initium: {
		author_orig: 'Reginald B. Appleton',   
    author_eng: 'Reginald B. Appleton',
		author_orig_short: 'Appleton R. B.',
		author_eng_short: 'Appleton R. B.',
    collection_selectboxname: 'Appleton R. B. Initium',
    title_orig: 'Initium',
    title_eng: 'Appleton R. B. Initium',
		contents_type: 'page',
		central_resource: 'appleton_initium_reader',
		catalogue_ignore: {},
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
    title_orig: 'A new Latin primer',
    title_eng: 'A new Latin primer',
		contents_type: 'page',
		central_resource: 'maxey_fay_new_latin_primer_reader',
		catalogue_ignore: {title_orig: 'A'},
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
    title_orig: 'Ludi Persici',
    title_eng: 'Ludi Persici',
		contents_type: 'page',
		central_resource: 'appleton_ludi_persici_reader',
		catalogue_ignore: {},
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
    title_orig: 'The new gradatim',
    title_eng: 'The new gradatim',
		contents_type: 'page',
		central_resource: 'collar_new_gradatim_reader',
		catalogue_ignore: {title_orig: 'The'},
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
    title_orig: 'Cloelia, puella Rōmāna',
    title_eng: 'Cloelia, puella Rōmāna',
		contents_type: 'paragraph',
		central_resource: 'arnold_cloelia_parsed_text',
		catalogue_ignore: {},
		extra: {
			difficulty_level: 2,
		},
	},

	beresford_douglas_first_greek_reader: {
		author_orig: 'R. A. A. Beresford and R. N. Douglas',   
    author_eng: 'R. A. A. Beresford and R. N. Douglas',
		author_orig_short: 'Beresford R. A. A., Douglas R. N.',
		author_eng_short: 'Beresford R. A. A., Douglas R. N.',
    collection_selectboxname: 'First Greek reader',
    title_orig: 'A First Greek reader',
    title_eng: 'A First Greek reader',
		contents_type: 'paragraph',
		central_resource: 'beresford_douglas_first_greek_reader_parsed_text',
		catalogue_ignore: {title_orig: 'A'},
		extra: {
			difficulty_level: 1,
		},
	},

	sallust_catilina: {
		...ParsedClassicsCollProtos.sallust_book,
    collection_selectboxname: 'C. Sallusti Crispi Catilinae coniuratio',
    title_orig: 'Catilinae coniuratio',
    title_eng: 'Catilinae coniuratio',
		central_resource: 'sallust_catilina_parsed_text',
	},

	sallust_jugurtha: {
		...ParsedClassicsCollProtos.sallust_book,
    collection_selectboxname: 'C. Sallusti Crispi Bellum Iugurthinum',
    title_orig: 'Bellum Iugurthinum',
    title_eng: 'Bellum Iugurthinum',
		central_resource: 'sallust_jugurtha_parsed_text',
	},

	sallust_orationes_et_epistulae: {
		...ParsedClassicsCollProtos.sallust_book,
    collection_selectboxname: 'C. Sallusti Crispi Orationes et epistulae',
    title_orig: 'Orationes et epistulae excerptae de Historiis',
    title_eng: 'Orationes et epistulae excerptae de Historiis',
		central_resource: 'sallust_orationes_et_epistulae_parsed_text',
	},

	greek_text_tools: {
		author_orig: '',   
    author_eng: '',
		author_orig_short: '',
		author_eng_short: '',
    collection_selectboxname: 'Greek text tools',
    title_orig: 'Greek text tools',
    title_eng: 'Greek text tools',
		contents_type: 'none',
		central_resource: '',
		extra: {},
	},

	latin_text_tools: {
		author_orig: '',   
    author_eng: '',
		author_orig_short: '',
		author_eng_short: '',
    collection_selectboxname: 'Latin text tools',
    title_orig: 'Latin text tools',
    title_eng: 'Latin text tools',
		contents_type: 'none',
		central_resource: '',
		extra: {},
	},

	th_a_kempis_imitatio_christi_1: {
		...ParsedClassicsCollProtos.th_a_kempis_book,
    collection_selectboxname: 'Th. à Kempis De imitatione Christi liber I',
    title_orig: 'De imitatione Christi liber I',
    title_eng: 'De imitatione Christi liber I',
		central_resource: 'th_a_kempis_imitatio_christi_1_parsed_text',
	},

	th_a_kempis_imitatio_christi_2: {
		...ParsedClassicsCollProtos.th_a_kempis_book,
    collection_selectboxname: 'Th. à Kempis De imitatione Christi liber II',
    title_orig: 'De imitatione Christi liber II',
    title_eng: 'De imitatione Christi liber II',
		central_resource: 'th_a_kempis_imitatio_christi_2_parsed_text',
	},

	th_a_kempis_imitatio_christi_3: {
		...ParsedClassicsCollProtos.th_a_kempis_book,
    collection_selectboxname: 'Th. à Kempis De imitatione Christi liber III',
    title_orig: 'De imitatione Christi liber III',
    title_eng: 'De imitatione Christi liber III',
		central_resource: 'th_a_kempis_imitatio_christi_3_parsed_text',
	},

	th_a_kempis_imitatio_christi_4: {
		...ParsedClassicsCollProtos.th_a_kempis_book,
    collection_selectboxname: 'Th. à Kempis De imitatione Christi liber IV',
    title_orig: 'De imitatione Christi liber IV',
    title_eng: 'De imitatione Christi liber IV',
		central_resource: 'th_a_kempis_imitatio_christi_4_parsed_text',
	},

};
