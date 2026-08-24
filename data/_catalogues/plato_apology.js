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

ParsedClassicsCollDefs.plato_apology["resource_defs"] = {

  // Parsed text

  plato_apology_parsed_text: {
		collections_page_resource_author: "Πλάτωνος",
    collections_page_resource_desc: "Ἀπολογία Σωκράτους",
		library_app_selectbox_title: "Πλάτωνος Ἀπολογία Σωκράτους", 
		library_app_panel_title: "Ἀπολογία Σωκράτους",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "Platonis opera. Recognovit brevique adnotatione critica instruxit Joannes Burnet. Tomus 1. 1905. Oxonii: E typographeo Clarendoniano.",
    library_app_panel_note: "",
    scanned_or_typed: "typed",
    resource_type: "parsed_text",
		scanned_source_shortname: "platonis_opera_ed_burnet_vol_1",
    contents_shortname: "plato_apology_parsed_text_contents",
    extra: {
      parsing_via_ext_services: "yes",
      display_paragraph_numbering: 'yes',
      display_pagination: 'yes',
    }, 
	},

  // External service

  morpheus_greek_lemmatizer: {
    ...ParsedClassicsResProtos.morpheus_greek_lemmatizer,
  },

  greek_word_explainer: {
    ...ParsedClassicsResProtos.greek_word_explainer,
  },

  greek_word_study_tool: {
    ...ParsedClassicsResProtos.greek_word_study_tool,
  },

  // Original text

  plato_apology_text_ed_burnet: {
    collections_page_resource_author: "",
    collections_page_resource_desc: "ed. by J. Burnet (1905)", 
    library_app_selectbox_title: "Edition by J. Burnet (1905)",
    library_app_panel_title: "Text ed. by J. Burnet (1905)",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "Platonis opera. Recognovit brevique adnotatione critica instruxit Joannes Burnet. Tomus 1. 1905. Oxonii: E typographeo Clarendoniano.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "original_text",
    scanned_source_shortname: "platonis_opera_ed_burnet_vol_1",
    contents_shortname: "plato_apology_text_ed_burnet_contents",
    extra: {},
  }, 

  // Lexicon

};
