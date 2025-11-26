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

  // Lexicon

*/

ParsedClassicsCollDefs.collar_new_gradatim["resource_defs"] = {
    
  // Reader

  collar_new_gradatim_reader: {
    collections_page_resource_author: "",
    collections_page_resource_desc: "Collar W. C. The new gradatim (1895)", 
    library_app_selectbox_title: "Collar W. C. The new gradatim (1895)",
    library_app_panel_title: "Collar W. C. The new gradatim",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "W. C. Collar. The new gradatim. 1895. Boston etc.: Ginn and company.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "reader",
    scanned_source_shortname: "collar_new_gradatim",
    contents_shortname: "collar_new_gradatim_contents",
    extra: {},
  }, 
  
  // Lexicon

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
  },

  /*lexicon_graeco_latinum_by_zorell: {
  collections_page_resource_author: "",  
  collections_page_resource_desc: "Greek-Latin lexicon of the NT by F. Zorell (1931)", 
    library_app_selectbox_title: "Greek-Latin lexicon of the NT by F. Zorell (1931)",
    library_app_panel_title: "Lexicon Graecum Novi Testamenti by F. Zorell (1931)",
    library_app_panel_text_from: "Lexicon Graecum Novi Testamenti auctore Francisco Zorell, S.I. Editio altera novis curis retractata.  1931. Parisiis: P. Lethielleux.",
    library_app_panel_note: "",
    scanned_or_typed: "scanned",
    resource_type: "lexicon",
    scanned_source_shortname: "lexicon_graecum_novi_testamenti_zorell",
    contents_shortname: "lexicon_graecum_novi_testamenti_zorell_contents",
    extra: {language: "EL"}
  },*/

  
}