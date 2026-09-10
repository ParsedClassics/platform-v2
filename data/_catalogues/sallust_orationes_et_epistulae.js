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

ParsedClassicsCollDefs.sallust_orationes_et_epistulae["resource_defs"] = {
  
  // Parsed text

  sallust_orationes_et_epistulae_parsed_text: {
    ...ParsedClassicsResProtos.sallust_parsed_text,
    collections_page_resource_desc: "C. Sallusti Crispi Orationes et epistulae excerptae de Historiis",
		library_app_panel_title: "Orationes et epistulae excerptae de Historiis",
    contents_shortname: "sallust_orationes_et_epistulae_parsed_text_contents",
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

  sallust_orationes_et_epistulae_text_ed_ahlberg: {
    ...ParsedClassicsResProtos.sallust_text_ed_ahlberg,
    library_app_panel_title: "Orationes et epistulae excerptae de Historiis",
    contents_shortname: "sallust_orationes_et_epistulae_text_ed_ahlberg_contents",
  },

  // Lexicon

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
  },

  latin_dictionary_by_white: {
    ...ParsedClassicsResProtos.latin_dictionary_by_white
  },

};
