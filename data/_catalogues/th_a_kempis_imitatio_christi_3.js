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

ParsedClassicsCollDefs.th_a_kempis_imitatio_christi_3["resource_defs"] = {

  // Parsed text

  th_a_kempis_imitatio_christi_3_parsed_text: {
		...ParsedClassicsResProtos.th_a_kempis_imitatio_christi_parsed_text,
    library_app_panel_subtitle: "Liber III. De interna consolatione.",
    contents_shortname: "th_a_kempis_imitatio_christi_3_parsed_text_contents",
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

  th_a_kempis_imitatio_christi_3_ed_desbillons: {
    ...ParsedClassicsResProtos.th_a_kempis_imitatio_christi_text_ed_desbillons,
    library_app_panel_title: "De imitatione Christi liber III.",
    contents_shortname: "th_a_kempis_imitatio_christi_3_ed_desbillons_contents",
  },

  // Lexicon

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
  },

  latin_dictionary_by_white: {
    ...ParsedClassicsResProtos.latin_dictionary_by_white
  },

};
