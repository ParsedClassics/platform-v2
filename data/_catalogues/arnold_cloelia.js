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

ParsedClassicsCollDefs.arnold_cloelia["resource_defs"] = {

  // Parsed text

  arnold_cloelia_parsed_text: {
		collections_page_resource_author: "Eleanor Arnold",
    collections_page_resource_desc: "Arnold E. Cloelia, puella Rōmāna (2016)",
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

  // Original text

  arnold_cloelia_orig_text: {
    collections_page_resource_author: "Eleanor Arnold",
    collections_page_resource_desc: "Arnold E. Cloelia, puella Rōmāna (2016)", 
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