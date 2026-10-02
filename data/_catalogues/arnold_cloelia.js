/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

/*
Template of resource definition:
see file _res_protos.js

Order of resources by resource type:
see file _res_protos.js
*/

ParsedClassicsCollDefs.arnold_cloelia["resource_defs"] = {

  // Parsed text

  arnold_cloelia_parsed_text: {
		library_app_panel_author: "Eleanor Arnold",
		library_app_selectbox_title: "Arnold E. Cloelia, puella Rōmāna (2016)", 
		library_app_panel_title: "Cloelia, puella Rōmāna",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "Eleanor Arnold. Cloelia, puella Rōmāna. 2016",
    library_app_panel_note: "",
    scanned_or_typed: "typed",
    resource_type: "parsed_text",
		scanned_source_shortname: "arnold_cloelia",
    contents_shortname: "arnold_cloelia_parsed_text_contents",
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

  // forcellini_latin_lexicon: {
  //   ...ParsedClassicsResProtos.forcellini_latin_lexicon,
  // },

  // Original text

  arnold_cloelia_orig_text: {
    library_app_panel_author: "Eleanor Arnold", 
    library_app_selectbox_title: "Arnold E. Cloelia, puella Rōmāna (2016)",
    library_app_panel_title: "Cloelia, puella Rōmāna",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "Eleanor Arnold. Cloelia, puella Rōmāna. 2016",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "original_text",
    scanned_source_shortname: "arnold_cloelia",
    contents_shortname: "arnold_cloelia_orig_text_contents",
    extra: {},
  }, 

  // Lexicon

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
  },

}