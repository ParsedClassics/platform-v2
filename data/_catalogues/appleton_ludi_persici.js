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

ParsedClassicsCollDefs.appleton_ludi_persici["resource_defs"] = {
    
  // Reader

  appleton_ludi_persici_reader: {
    library_app_panel_author: "", 
    library_app_selectbox_title: "Appleton R. B. Ludi Persici (1921)",
    library_app_panel_title: "Appleton R. B. Ludi Persici",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "R. B. Appleton. Ludi Persici. 1921. Oxford: Oxford University Press; London: Humphrey Milford.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "reader",
    scanned_source_shortname: "appleton_ludi_persici",
    contents_shortname: "appleton_ludi_persici_contents",
    extra: {},
  }, 
  
  // Lexicons

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
  },
  
}