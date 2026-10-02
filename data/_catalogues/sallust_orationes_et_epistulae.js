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

ParsedClassicsCollDefs.sallust_orationes_et_epistulae["resource_defs"] = {
  
  // Parsed text

  sallust_orationes_et_epistulae_parsed_text: {
    ...ParsedClassicsResProtos.sallust_parsed_text,
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
