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

ParsedClassicsCollDefs.beresford_douglas_first_greek_reader["resource_defs"] = {

  // Parsed text

  beresford_douglas_first_greek_reader_parsed_text: {
		collections_page_resource_author: "R. A. A. Beresford, R. N. Douglas",
    collections_page_resource_desc: "R. A. A. Beresford, R. N. Douglas. A First Greek Reader (1903)",
		library_app_selectbox_title: "R. A. A. Beresford, R. N. Douglas. A First Greek Reader (1903)", 
		library_app_panel_title: "A First Greek Reader",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "R. A. A. Beresford, R. N. Douglas. A First Greek Reader. 1903. London etc.: Blackie and son.",
    library_app_panel_note: "",
    scanned_or_typed: "typed",
    resource_type: "parsed_text",
		scanned_source_shortname: "beresford_douglas_first_greek_reader",
    contents_shortname: "beresford_douglas_first_greek_reader_parsed_text_contents",
    extra: {
      parsing_via_ext_services: "yes",
      display_paragraph_numbering: 'yes',
      display_pagination: 'no',
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

  beresford_douglas_first_greek_reader_orig_text: {
    collections_page_resource_author: "R. A. A. Beresford, R. N. Douglas",
    collections_page_resource_desc: "R. A. A. Beresford, R. N. Douglas. A First Greek Reader (1903)", 
    library_app_selectbox_title: "R. A. A. Beresford, R. N. Douglas. A First Greek Reader (1903)",
    library_app_panel_title: "A First Greek Reader",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "R. A. A. Beresford, R. N. Douglas. A First Greek Reader. 1903. London etc.: Blackie and son.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "original_text",
    scanned_source_shortname: "beresford_douglas_first_greek_reader",
    contents_shortname: "beresford_douglas_first_greek_reader_orig_text_contents",
    extra: {},
  },

  // Lexicon

};
