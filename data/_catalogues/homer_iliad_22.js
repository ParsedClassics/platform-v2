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

ParsedClassicsCollDefs.homer_iliad_22["resource_defs"] = {
  // Parsed text
  // IMPORTANT!
  // The contents of the first resource of the type "Parsed text" serves as contents of the whole collection

  homer_iliad_22_parsed_text: {
		...ParsedClassicsResProtos.homer_iliad_13_24,
		library_app_panel_title: "Ἰλιάδος Χ",
    contents_shortname: "homer_iliad_22_parsed_text_contents",
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
