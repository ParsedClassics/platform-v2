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

  // Lexicon standalone

*/

ParsedClassicsCollDefs.latin_lexicons["resource_defs"] = {

  // Lexicon standalone

  elementary_latin_dictionary_by_lewis: {
    ...ParsedClassicsResProtos.elementary_latin_dictionary_by_lewis,
    resource_type: "lexicon_standalone",
  },

	// lexicon_graeco_latinum_by_zorell: {
  //   collections_page_resource_author: "Zorell F.",
  //   collections_page_resource_desc: "Greek-Latin lexicon of the NT", 
  //   library_app_selectbox_title: "2* Greek-Latin lexicon of the NT by F. Zorell (1931)",
  //   library_app_panel_title: "Lexicon Graecum Novi Testamenti by F. Zorell (1931)",
  //   library_app_panel_text_from: "Lexicon Graecum Novi Testamenti auctore Francisco Zorell, S.I. Editio altera novis curis retractata.  1931. Parisiis: P. Lethielleux.",
  //   library_app_panel_note: "",
  //   scanned_or_typed: "scanned",
  //   resource_type: "lexicon_standalone",
  //   scanned_source_shortname: "lexicon_graecum_novi_testamenti_zorell",
  //   contents_shortname: "lexicon_graecum_novi_testamenti_zorell_contents",
  //   extra: {
  //    language: "EL",
  //    difficulty_level: 2,
  //   },
  // },

}