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
  // IMPORTANT!
  // The contents of the first resource of the type "Parsed text" serves as contents of the whole collection

  // External services
  
  // Original texts

  // Concordances

  // Lexicons

  // Translations

  // Commentaries

  // Grammar references

  // Diagram sets

  // Audio
*/

ParsedClassicsCollDefs.homer_odyssey_23["resource_defs"] = {
  // Parsed text
  // IMPORTANT!
  // The contents of the first resource of the type "Parsed text" serves as contents of the whole collection

  homer_odyssey_23_parsed_text: {
		...ParsedClassicsResProtos.homer_odyssey_13_24,
		library_app_panel_title: "Ὀδυσσείας Ψ",
    contents_shortname: "homer_odyssey_23_parsed_text_contents",
	},

  // External services

  morpheus_greek_lemmatizer: {
    ...ParsedClassicsResProtos.morpheus_greek_lemmatizer,
  },

  greek_word_explainer: {
    ...ParsedClassicsResProtos.greek_word_explainer,
  },

  greek_word_study_tool: {
    ...ParsedClassicsResProtos.greek_word_study_tool,
  },
  
  // Original texts

  // Concordances

  // Lexicons

  // Translations

  // Commentaries

  // Grammar references

  // Diagram sets

  // Audio
};
