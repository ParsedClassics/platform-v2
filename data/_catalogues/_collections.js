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

	homer_iliad_1: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Α",
		collections_page_title_orig: "Ἰλιάδος Α",
		collections_page_title_eng: 'Iliad 1',
		central_resource: 'homer_iliad_1_parsed_text',
	},

	homer_iliad_2: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Β",
		collections_page_title_orig: "Ἰλιάδος Β",
		collections_page_title_eng: 'Iliad 2',
		central_resource: 'homer_iliad_2_parsed_text',
	},

	homer_iliad_3: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Γ",
		collections_page_title_orig: "Ἰλιάδος Γ",
		collections_page_title_eng: 'Iliad 3',
		central_resource: 'homer_iliad_3_parsed_text',
	},

	homer_iliad_4: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Δ",
		collections_page_title_orig: "Ἰλιάδος Δ",
		collections_page_title_eng: 'Iliad 4',
		central_resource: 'homer_iliad_4_parsed_text',
	},

	homer_iliad_5: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ε",
		collections_page_title_orig: "Ἰλιάδος Ε",
		collections_page_title_eng: 'Iliad 5',
		central_resource: 'homer_iliad_5_parsed_text',
	},

	homer_iliad_6: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ζ",
		collections_page_title_orig: "Ἰλιάδος Ζ",
		collections_page_title_eng: 'Iliad 6',
		central_resource: 'homer_iliad_6_parsed_text',
	},

	homer_iliad_7: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Η",
		collections_page_title_orig: "Ἰλιάδος Η",
		collections_page_title_eng: 'Iliad 7',
		central_resource: 'homer_iliad_7_parsed_text',
	},

	homer_iliad_8: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Θ",
		collections_page_title_orig: "Ἰλιάδος Θ",
		collections_page_title_eng: 'Iliad 8',
		central_resource: 'homer_iliad_8_parsed_text',
	},

	homer_iliad_9: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ι",
		collections_page_title_orig: "Ἰλιάδος Ι",
		collections_page_title_eng: 'Iliad 9',
		central_resource: 'homer_iliad_9_parsed_text',
	},

	homer_iliad_10: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Κ",
		collections_page_title_orig: "Ἰλιάδος Κ",
		collections_page_title_eng: 'Iliad 10',
		central_resource: 'homer_iliad_10_parsed_text',
	},

	homer_iliad_11: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Λ",
		collections_page_title_orig: "Ἰλιάδος Λ",
		collections_page_title_eng: 'Iliad 11',
		central_resource: 'homer_iliad_11_parsed_text',
	},

	homer_iliad_12: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Μ",
		collections_page_title_orig: "Ἰλιάδος Μ",
		collections_page_title_eng: 'Iliad 12',
		central_resource: 'homer_iliad_12_parsed_text',
	},

	homer_iliad_13: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ν",
		collections_page_title_orig: "Ἰλιάδος Ν",
		collections_page_title_eng: 'Iliad 13',
		central_resource: 'homer_iliad_13_parsed_text',
	},

	homer_iliad_14: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ξ",
		collections_page_title_orig: "Ἰλιάδος Ξ",
		collections_page_title_eng: 'Iliad 14',
		central_resource: 'homer_iliad_14_parsed_text',
	},

	homer_iliad_15: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ο",
		collections_page_title_orig: "Ἰλιάδος Ο",
		collections_page_title_eng: 'Iliad 15',
		central_resource: 'homer_iliad_15_parsed_text',
	},

	homer_iliad_16: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Π",
		collections_page_title_orig: "Ἰλιάδος Π",
		collections_page_title_eng: 'Iliad 16',
		central_resource: 'homer_iliad_16_parsed_text',
	},

	homer_iliad_17: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ρ",
		collections_page_title_orig: "Ἰλιάδος Ρ",
		collections_page_title_eng: 'Iliad 17',
		central_resource: 'homer_iliad_17_parsed_text',
	},

	homer_iliad_18: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Σ",
		collections_page_title_orig: "Ἰλιάδος Σ",
		collections_page_title_eng: 'Iliad 18',
		central_resource: 'homer_iliad_18_parsed_text',
	},

	homer_iliad_19: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Τ",
		collections_page_title_orig: "Ἰλιάδος Τ",
		collections_page_title_eng: 'Iliad 19',
		central_resource: 'homer_iliad_19_parsed_text',
	},

	homer_iliad_20: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Υ",
		collections_page_title_orig: "Ἰλιάδος Υ",
		collections_page_title_eng: 'Iliad 20',
		central_resource: 'homer_iliad_20_parsed_text',
	},

	homer_iliad_21: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Φ",
		collections_page_title_orig: "Ἰλιάδος Φ",
		collections_page_title_eng: 'Iliad 21',
		central_resource: 'homer_iliad_21_parsed_text',
	},

	homer_iliad_22: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Χ",
		collections_page_title_orig: "Ἰλιάδος Χ",
		collections_page_title_eng: 'Iliad 22',
		central_resource: 'homer_iliad_22_parsed_text',
	},

	homer_iliad_23: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ψ",
		collections_page_title_orig: "Ἰλιάδος Ψ",
		collections_page_title_eng: 'Iliad 23',
		central_resource: 'homer_iliad_23_parsed_text',
	},

	homer_iliad_24: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ἰλιάδος Ω",
		collections_page_title_orig: "Ἰλιάδος Ω",
		collections_page_title_eng: 'Iliad 24',
		central_resource: 'homer_iliad_24_parsed_text',
	},

	homer_odyssey_1: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Α",
		collections_page_title_orig: "Ὀδυσσείας Α",
		collections_page_title_eng: 'Odyssey 1',
		central_resource: 'homer_odyssey_1_parsed_text',
	},

	homer_odyssey_2: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Β",
		collections_page_title_orig: "Ὀδυσσείας Β",
		collections_page_title_eng: 'Odyssey 2',
		central_resource: 'homer_odyssey_2_parsed_text',
	},

	homer_odyssey_3: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Γ",
		collections_page_title_orig: "Ὀδυσσείας Γ",
		collections_page_title_eng: 'Odyssey 3',
		central_resource: 'homer_odyssey_3_parsed_text',
	},

	homer_odyssey_4: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Δ",
		collections_page_title_orig: "Ὀδυσσείας Δ",
		collections_page_title_eng: 'Odyssey 4',
		central_resource: 'homer_odyssey_4_parsed_text',
	},

	homer_odyssey_5: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ε",
		collections_page_title_orig: "Ὀδυσσείας Ε",
		collections_page_title_eng: 'Odyssey 5',
		central_resource: 'homer_odyssey_5_parsed_text',
	},

	homer_odyssey_6: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ζ",
		collections_page_title_orig: "Ὀδυσσείας Ζ",
		collections_page_title_eng: 'Odyssey 6',
		central_resource: 'homer_odyssey_6_parsed_text',
	},

	homer_odyssey_7: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Η",
		collections_page_title_orig: "Ὀδυσσείας Η",
		collections_page_title_eng: 'Odyssey 7',
		central_resource: 'homer_odyssey_7_parsed_text',
	},

	homer_odyssey_8: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Θ",
		collections_page_title_orig: "Ὀδυσσείας Θ",
		collections_page_title_eng: 'Odyssey 8',
		central_resource: 'homer_odyssey_8_parsed_text',
	},

	homer_odyssey_9: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ι",
		collections_page_title_orig: "Ὀδυσσείας Ι",
		collections_page_title_eng: 'Odyssey 9',
		central_resource: 'homer_odyssey_9_parsed_text',
	},

	homer_odyssey_10: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Κ",
		collections_page_title_orig: "Ὀδυσσείας Κ",
		collections_page_title_eng: 'Odyssey 10',
		central_resource: 'homer_odyssey_10_parsed_text',
	},

	homer_odyssey_11: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Λ",
		collections_page_title_orig: "Ὀδυσσείας Λ",
		collections_page_title_eng: 'Odyssey 11',
		central_resource: 'homer_odyssey_11_parsed_text',
	},

	homer_odyssey_12: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Μ",
		collections_page_title_orig: "Ὀδυσσείας Μ",
		collections_page_title_eng: 'Odyssey 12',
		central_resource: 'homer_odyssey_12_parsed_text',
	},

	homer_odyssey_13: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ν",
		collections_page_title_orig: "Ὀδυσσείας Ν",
		collections_page_title_eng: 'Odyssey 13',
		central_resource: 'homer_odyssey_13_parsed_text',
	},

	homer_odyssey_14: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ξ",
		collections_page_title_orig: "Ὀδυσσείας Ξ",
		collections_page_title_eng: 'Odyssey 14',
		central_resource: 'homer_odyssey_14_parsed_text',
	},

	homer_odyssey_15: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ο",
		collections_page_title_orig: "Ὀδυσσείας Ο",
		collections_page_title_eng: 'Odyssey 15',
		central_resource: 'homer_odyssey_15_parsed_text',
	},

	homer_odyssey_16: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Π",
		collections_page_title_orig: "Ὀδυσσείας Π",
		collections_page_title_eng: 'Odyssey 16',
		central_resource: 'homer_odyssey_16_parsed_text',
	},

	homer_odyssey_17: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ρ",
		collections_page_title_orig: "Ὀδυσσείας Ρ",
		collections_page_title_eng: 'Odyssey 17',
		central_resource: 'homer_odyssey_17_parsed_text',
	},

	homer_odyssey_18: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Σ",
		collections_page_title_orig: "Ὀδυσσείας Σ",
		collections_page_title_eng: 'Odyssey 18',
		central_resource: 'homer_odyssey_18_parsed_text',
	},

	homer_odyssey_19: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Τ",
		collections_page_title_orig: "Ὀδυσσείας Τ",
		collections_page_title_eng: 'Odyssey 19',
		central_resource: 'homer_odyssey_19_parsed_text',
	},

	homer_odyssey_20: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Υ",
		collections_page_title_orig: "Ὀδυσσείας Υ",
		collections_page_title_eng: 'Odyssey 20',
		central_resource: 'homer_odyssey_20_parsed_text',
	},

	homer_odyssey_21: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Φ",
		collections_page_title_orig: "Ὀδυσσείας Φ",
		collections_page_title_eng: 'Odyssey 21',
		central_resource: 'homer_odyssey_21_parsed_text',
	},

	homer_odyssey_22: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Χ",
		collections_page_title_orig: "Ὀδυσσείας Χ",
		collections_page_title_eng: 'Odyssey 22',
		central_resource: 'homer_odyssey_22_parsed_text',
	},

	homer_odyssey_23: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ψ",
		collections_page_title_orig: "Ὀδυσσείας Ψ",
		collections_page_title_eng: 'Odyssey 23',
		central_resource: 'homer_odyssey_23_parsed_text',
	},

	homer_odyssey_24: {
		...ParsedClassicsCollProtos.homer_book,
		collection_selectboxname: "Ὁμήρου Ὀδυσσείας Ω",
		collections_page_title_orig: "Ὀδυσσείας Ω",
		collections_page_title_eng: 'Odyssey 24',
		central_resource: 'homer_odyssey_24_parsed_text',
	},

	homeric_hymns: {
		...ParsedClassicsCollProtos.homerica_book,
		collection_selectboxname: "Ὁμηρικοὶ ὕμνοι",
		collections_page_title_orig: "Ὁμηρικοὶ ὕμνοι",
		collections_page_title_eng: 'Homeric hymns',
		central_resource: 'homeric_hymns_parsed_text',
	},

	hesiod_theogonia: {
		...ParsedClassicsCollProtos.hesiod_book,
		collection_selectboxname: "Ἡσιόδου Θεογονία",
		collections_page_title_orig: "Θεογονία",
		collections_page_title_eng: 'Hesiod Theogonia',
		central_resource: 'hesiod_theogonia_parsed_text',
	},

	hesiod_erga_kai_hmerai: {
		...ParsedClassicsCollProtos.hesiod_book,
		collection_selectboxname: "Ἡσιόδου Ἔργα καὶ Ἡμέραι",
		collections_page_title_orig: "Ἔργα καὶ Ἡμέραι",
		collections_page_title_eng: 'Hesiod Works and Days',
		central_resource: 'hesiod_erga_kai_hmerai_parsed_text',
	},

	hesiod_aspis: {
		...ParsedClassicsCollProtos.hesiod_book,
		collection_selectboxname: "Ἡσιόδου Ἀσπὶς Ἡρακλέους",
		collections_page_title_orig: "Ἀσπὶς Ἡρακλέους",
		collections_page_title_eng: 'Hesiod Shield of Heracles',
		central_resource: 'hesiod_aspis_parsed_text',
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

	beresford_douglas_first_greek_reader: {
		author_orig: 'R. A. A. Beresford and R. N. Douglas',   
    author_eng: 'R. A. A. Beresford and R. N. Douglas',
		author_orig_short: 'Beresford R. A. A., Douglas R. N.',
		author_eng_short: 'Beresford R. A. A., Douglas R. N.',
    collection_selectboxname: 'First Greek reader',
    collections_page_title_orig: 'A First Greek reader',
    collections_page_title_eng: 'A First Greek reader',
		contents_type: 'paragraph',
		central_resource: 'beresford_douglas_first_greek_reader_parsed_text',
		extra: {
			difficulty_level: 1,
		},
	},

	greek_text_tools: {
		author_orig: '',   
    author_eng: '',
		author_orig_short: '',
		author_eng_short: '',
    collection_selectboxname: 'Greek text tools',
    collections_page_title_orig: 'Greek text tools',
    collections_page_title_eng: 'Greek text tools',
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
    collections_page_title_orig: 'Latin text tools',
    collections_page_title_eng: 'Latin text tools',
		contents_type: 'none',
		central_resource: '',
		extra: {},
	},

};
