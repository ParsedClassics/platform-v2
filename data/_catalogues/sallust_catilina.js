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

ParsedClassicsCollDefs.sallust_catilina["resource_defs"] = {

  // Parsed text

  sallust_catilina_parsed_text: {
    collections_page_resource_author: "C. Sallusti Crispi",
    collections_page_resource_desc: "C. Sallusti Crispi Catilinae coniuratio",
		library_app_selectbox_title: "C. Sallusti Crispi Catilinae coniuratio", 
		library_app_panel_title: "Catilinae coniuratio",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "C. Sallusti Crispi Catilina; Iugurtha; Orationes et epistulae excerptae de historiis. Recognovit Axel W. Ahlberg. Editio maior. 1919. Lipsiae: In aedibus B. G. Teubneri.",
    library_app_panel_note: "",
    scanned_or_typed: "typed",
    resource_type: "parsed_text",
		scanned_source_shortname: "sallustius_catilina_iugurtha",
    contents_shortname: "sallust_catilina_parsed_text_contents",
    extra: {
      parsing_via_ext_services: "yes",
      display_paragraph_numbering: 'no',
      display_pagination: 'no',
    },
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

  sallust_catilina_text_ed_ahlberg: {
    collections_page_resource_author: "C. Sallusti Crispi",
    collections_page_resource_desc: "C. Sallusti Crispi Catilinae coniuratio", 
    library_app_selectbox_title: "C. Sallusti Crispi Catilinae coniuratio",
    library_app_panel_title: "Catilinae coniuratio",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "C. Sallusti Crispi Catilina; Iugurtha; Orationes et epistulae excerptae de historiis. Recognovit Axel W. Ahlberg. Editio maior. 1919. Lipsiae: In aedibus B. G. Teubneri.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "original_text",
    scanned_source_shortname: "sallustius_catilina_iugurtha",
    contents_shortname: "sallust_catilina_text_ed_ahlberg_contents",
    extra: {},
  }, 

  // Lexicon

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
  },

};
