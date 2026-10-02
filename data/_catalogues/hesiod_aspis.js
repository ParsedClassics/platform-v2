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

ParsedClassicsCollDefs.hesiod_aspis["resource_defs"] = {
  // Parsed text
  // IMPORTANT!
  // The contents of the first resource of the type "Parsed text" serves as contents of the whole collection

  hesiod_aspis_parsed_text: {
		...ParsedClassicsResProtos.hesiod_parsed_text,
		library_app_panel_title: "Ἀσπὶς Ἡρακλέους",
    contents_shortname: "hesiod_aspis_parsed_text_contents",
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
