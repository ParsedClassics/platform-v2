/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

/* 
	Template of resource description:

  collections_page_resource_author: "",
	collections_page_resource_desc: "", 
	library_app_selectbox_title: "",
	library_app_panel_title: "",
	library_app_panel_subtitle: "",
	library_app_panel_text_from: "",
	library_app_panel_note: "",
	scanned_or_typed: "",
  resource_type: "",
	scanned_source_shortname: "",
	contents_shortname: "",
  extra: {},
*/

/* 
Order of resources by resource type
  
  // Parsed text

  // External service

  // Original text

  // Lexicon

*/

ParsedClassicsCollDefs.th_a_kempis_imitatio_christi_1["resource_defs"] = {

  // Parsed text

  th_a_kempis_imitatio_christi_1_parsed_text: {
		...ParsedClassicsResProtos.th_a_kempis_imitatio_christi_parsed_text,
    collections_page_resource_desc: "De imitatione Christi liber I",
    library_app_panel_subtitle: "Liber I. Admonitiones ad Vitam spiritualem utiles.",
    contents_shortname: "th_a_kempis_imitatio_christi_1_parsed_text_contents",
	},

  // External service

  morpheus_latin_lemmatizer: {
    ...ParsedClassicsResProtos.morpheus_latin_lemmatizer,
  },

  whitakers_words_lemmatizer: {
    ...ParsedClassicsResProtos.whitakers_words_lemmatizer,
  },

  latin_word_study_tool: {
    ...ParsedClassicsResProtos.latin_word_study_tool,
  },

  // Original text

  th_a_kempis_imitatio_christi_1_ed_desbillons: {
    ...ParsedClassicsResProtos.th_a_kempis_imitatio_christi_text_ed_desbillons,
    library_app_panel_title: "De imitatione Christi liber I.",
    contents_shortname: "th_a_kempis_imitatio_christi_1_ed_desbillons_contents",
  },

  // Lexicon

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
  },

  latin_dictionary_by_white: {
    ...ParsedClassicsResProtos.latin_dictionary_by_white
  },

};
