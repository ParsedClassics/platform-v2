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
  
  // Reader

  // Lexicons

*/

ParsedClassicsCollDefs.maxey_fay_new_latin_primer["resource_defs"] = {
    
  // Reader standalone

  maxey_fay_new_latin_primer_reader: {
    collections_page_resource_author: "",
    collections_page_resource_desc: "Maxey M., Fay M. J. A new Latin primer (1933)", 
    library_app_selectbox_title: "Maxey M., Fay M. J. A new Latin primer (1933)",
    library_app_panel_title: "Maxey M., Fay M. J. A new Latin primer",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "Maxey M., Fay M. J. A new Latin primer. 1933. Boston etc.: D. C. Heath and company.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "reader",
    scanned_source_shortname: "maxey_fay_new_latin_primer",
    contents_shortname: "maxey_fay_new_latin_primer_contents",
    extra: {},
  }, 
  
  // Lexicon standalone

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
    resource_type: "lexicon_standalone",
  },

  
}