/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

/* 
	Template of resource description:

	collections_page_resource_desc: "", 
	library_app_selectbox_title: "",
	library_app_panel_title: "",
	library_app_panel_subtitle: "",
	library_app_panel_text_from: "",
	library_app_panel_note: "",
	scanned_or_typed: "",
  resource_type: "",
	scanned_source_shortname: ""
	contents_shortname: ""
*/

/* 
Order of resources by resource type

  // Parsed text
  // IMPORTANT!
  // The contents of the first resource of the type "Parsed text" serves as contents of the whole collection
  
  // Original texts

  // Concordances

  // Lexicons

  // Translations

  // Commentaries

  // Grammar references

  // Diagram sets

  // Audio
*/

ParsedClassicsCollDefs.nt_revelation["resource_defs"] = {

  // Parsed text
  // IMPORTANT!
  // The contents of the first resource of the type "Parsed text" serves as contents of the whole collection
  
  nt_revelation_parsed_text: {
		...ParsedClassicsResProtos.nt_parsed_text_byzantine,
		library_app_panel_title: "Ἀποκάλυψις Ἰωάννου τοῦ θεολόγου",
    contents_shortname: "nt_revelation_parsed_text_contents",
	},

  // Original texts

  nt_revelation_text_ed_robinson_pierpont: {
		...ParsedClassicsResProtos.nt_text_ed_robinson_pierpont,
		contents_shortname: "nt_revelation_ed_robinson_pierpont_contents",
	},

  nt_revelation_text_ed_antoniadis: {
		...ParsedClassicsResProtos.nt_text_ed_antoniadis,
		contents_shortname: "nt_revelation_ed_antoniadis_contents",
	},

  nt_revelation_text_ed_scrivener: {
		...ParsedClassicsResProtos.nt_text_ed_scrivener,
		contents_shortname: "nt_revelation_ed_scrivener_contents",
	},

  nt_revelation_text_ed_westcott_hort: {
		...ParsedClassicsResProtos.nt_text_ed_westcott_hort,
		contents_shortname: "nt_revelation_ed_westcott_hort_contents",
	},

  nt_revelation_text_ed_nestle_nestle: {
		...ParsedClassicsResProtos.nt_text_ed_nestle_nestle,
		contents_shortname: "nt_revelation_ed_nestle_nestle_contents",
	},

  // Concordances

  concordance_by_moulton_geden: {
    ...ParsedClassicsResProtos.concordance_by_moulton_geden,
  },

  concordance_by_hudson_abbot: {
    ...ParsedClassicsResProtos.concordance_by_hudson_abbot,
  },

  concordance_by_bagster: {
    ...ParsedClassicsResProtos.concordance_by_bagster,
  },

  nt_conc_by_parsedclassics: {
    ...ParsedClassicsResProtos.nt_conc_by_parsedclassics,
  },

  // Lexicons

  lexicon_graeco_latinum_by_grimm: {
    ...ParsedClassicsResProtos.lexicon_graeco_latinum_by_grimm,
  },

  lexicon_graeco_latinum_by_zorell: {
    ...ParsedClassicsResProtos.lexicon_graeco_latinum_by_zorell,
  },

  greek_lexicon_of_nt_by_robinson: {
    ...ParsedClassicsResProtos.greek_lexicon_of_nt_by_robinson,
  },

  greek_lexicon_to_nt_by_green: {
    ...ParsedClassicsResProtos.greek_lexicon_to_nt_by_green,
  },

  griechisch_deutsches_handwoerterbuch_zu_nt_preuschen: {
    ...ParsedClassicsResProtos.griechisch_deutsches_handwoerterbuch_zu_nt_preuschen,
  },

  // Translations

  nt_revelation_tr_EL_vamvas: {
    ...ParsedClassicsResProtos.nt_tr_EL_vamvas,
    contents_shortname: "nt_revelation_tr_EL_vamvas_contents",
  },

  nt_revelation_tr_LA_s_hieronymus: {
    ...ParsedClassicsResProtos.nt_tr_LA_s_hieronymus_vol_2,
    contents_shortname: "nt_revelation_tr_LA_s_hieronymus_contents",
  },

  nt_revelation_tr_LA_beza: {
    ...ParsedClassicsResProtos.nt_tr_LA_beza,
    contents_shortname: "nt_revelation_tr_LA_beza_contents",
  },

  nt_revelation_tr_IT_diodati: {
    ...ParsedClassicsResProtos.nt_tr_IT_diodati,
    contents_shortname: "nt_revelation_tr_IT_diodati_contents",
  },

  nt_revelation_tr_IT_martini: {
    ...ParsedClassicsResProtos.nt_tr_IT_martini,
    contents_shortname: "nt_revelation_tr_IT_martini_contents",
  },

  nt_revelation_tr_FR_ostervald: {
    ...ParsedClassicsResProtos.nt_tr_FR_ostervald,
    contents_shortname: "nt_revelation_tr_FR_ostervald_contents",
  },

  nt_revelation_tr_FR_segond: {
    ...ParsedClassicsResProtos.nt_tr_FR_segond,
    contents_shortname: "nt_revelation_tr_FR_segond_contents",
  },

  nt_revelation_tr_EN_authorised_revised: {
    ...ParsedClassicsResProtos.nt_tr_EN_authorised_revised,
    contents_shortname: "nt_revelation_tr_EN_authorised_revised_contents",
  },

  nt_revelation_tr_EN_young: {
    ...ParsedClassicsResProtos.nt_tr_EN_young,
    contents_shortname: "nt_revelation_tr_EN_young_contents",
  },

  nt_revelation_tr_DE_luther: {
    ...ParsedClassicsResProtos.nt_tr_DE_luther,
    contents_shortname: "nt_revelation_tr_DE_luther_contents",
  },

  nt_revelation_tr_DE_menge: {
    ...ParsedClassicsResProtos.nt_tr_DE_menge,
    contents_shortname: "nt_revelation_tr_DE_menge_contents",
  },

  // Commentaries

  nt_revelation_commentary_by_andreas_of_caesarea: {
    collections_page_resource_desc: "by Andreas of Caesarea (ca. 600)", 
    library_app_selectbox_title: "Commentary by Andreas of Caesarea (ca. 600)",
    library_app_panel_title: "Commentary by Andreas of Caesarea (ca. 600)",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "Ἀνδρέου, ἀρχιεπισκόπου Καισαρείας Καππαδοκίας, καὶ Ἀρέθα, τοῦ μαθητοῦ καὶ διαδόχου αὐτοῦ, τὰ εὑρισκόμενα πάντα. Andreae, Caesareae Cappadociae archiepiscopi, et Arethae, discipuli ejus et successoris, opera omnia. Accurante et denuo recognoscente J.-P. Migne. 1863. Lutetiae Parisiorum: J.-P. Migne.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "commentary",
    scanned_source_shortname: "andreas_et_arethas_opera",
    contents_shortname: "nt_revelation_commentary_by_andreas_of_caesarea_contents",
  },

  nt_revelation_commentary_by_arethas_of_caesarea: {
    collections_page_resource_desc: "by Arethas of Caesarea (ca. 900)", 
    library_app_selectbox_title: "Commentary by Arethas of Caesarea (ca. 900)",
    library_app_panel_title: "Commentary by Arethas of Caesarea (ca. 900)",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "Ἀνδρέου, ἀρχιεπισκόπου Καισαρείας Καππαδοκίας, καὶ Ἀρέθα, τοῦ μαθητοῦ καὶ διαδόχου αὐτοῦ, τὰ εὑρισκόμενα πάντα. Andreae, Caesareae Cappadociae archiepiscopi, et Arethae, discipuli ejus et successoris, opera omnia. Accurante et denuo recognoscente J.-P. Migne. 1863. Lutetiae Parisiorum: J.-P. Migne.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "commentary",
    scanned_source_shortname: "andreas_et_arethas_opera",
    contents_shortname: "nt_revelation_commentary_by_arethas_of_caesarea_contents",
  },

  nt_revelation_commentary_by_theophylactus: {
    ...ParsedClassicsResProtos.nt_commentary_by_theophylactus,
    contents_shortname: "nt_revelation_commentary_by_theophylactus_contents",
  },

  nt_revelation_commentary_by_bengel: {
    ...ParsedClassicsResProtos.nt_commentary_by_bengel,
    contents_shortname: "nt_revelation_commentary_by_bengel_contents",
  },

  nt_revelation_commentary_by_rosenmueller: {
    ...ParsedClassicsResProtos.nt_commentary_by_rosenmueller_vol_5,
    contents_shortname: "nt_revelation_commentary_by_rosenmueller_contents",
  },

  nt_revelation_commentary_by_sales: {
    ...ParsedClassicsResProtos.nt_commentary_by_sales_vol_2,
    contents_shortname: "nt_revelation_commentary_by_sales_contents",
  },

  nt_revelation_commentary_by_drach: {
    ...ParsedClassicsResProtos.nt_commentary_by_fillion_crellier_drach_vol_8,
    contents_shortname: "nt_revelation_commentary_by_drach_contents",
  },

  nt_revelation_commentary_by_nicoll: {
    ...ParsedClassicsResProtos.nt_commentary_by_nicoll_vol_5, 
    contents_shortname: "nt_revelation_commentary_by_nicoll_contents",
  },

  nt_revelation_commentary_by_vincent: {
    ...ParsedClassicsResProtos.nt_commentary_by_vincent_vol_2,
    contents_shortname: "nt_revelation_commentary_by_vincent_contents",
  },

  nt_revelation_commentary_by_meyer: {
    ...ParsedClassicsResProtos.nt_commentary_by_meyer_vol_16, 
    contents_shortname: "nt_revelation_commentary_by_meyer_contents",
  },

  // Grammar references

  nt_revelation_grammar_refs_by_parsedclassics: {
    ...ParsedClassicsResProtos.nt_grammar_refs_by_parsedclassics,
  },

  // Diagram sets

  // Audio

  nt_revelation_audio_by_karvounakis: {
    ...ParsedClassicsResProtos.nt_audio_by_karvounakis,
    contents_shortname: "nt_revelation_audio_by_karvounakis_contents",
  },

  nt_revelation_audio_by_vavylis: {
    ...ParsedClassicsResProtos.nt_audio_by_vavylis,
    contents_shortname: "nt_revelation_audio_by_vavylis_contents",
  }
  
};
