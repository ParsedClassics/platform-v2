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
		collections_page_resource_author: "Thomae à Kempis",
    collections_page_resource_desc: "De imitatione Christi liber I",
		library_app_selectbox_title: "Text based on edition by F.-J. Desbillons", 
		library_app_panel_title: "De imitatione Christi libri IV",
    library_app_panel_subtitle: "Liber I. Admonitiones ad Vitam spiritualem utiles.",
    library_app_panel_text_from: "Thomae a Kempis De imitatione Christi libri IV. Ad optimarum editionum fidem accurate editi. Editio stereotypa. 1840. Lipsiae: Sumtibus et typis Car. Tauchnitii.",
    library_app_panel_note: "",
    scanned_or_typed: "typed",
    resource_type: "parsed_text",
		scanned_source_shortname: "th_kempis_imitatio_christi_ed_desbillons",
    contents_shortname: "th_a_kempis_imitatio_christi_1_parsed_text_contents",
    extra: {
      parsing_via_ext_services: "yes",
      display_paragraph_numbering: 'yes',
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

  // Lexicon

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
  },

  latin_dictionary_by_white: {
    ...ParsedClassicsResProtos.latin_dictionary_by_white
  },

};
