/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

/* 
Template of resource description:

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
*/

/* 
Order of resources by resource type

  // Parsed text
  / IMPORTANT!
  // The contents of the first resource of the type "Parsed text" serves as contents of the whole collection

  // Original texts

  // Concordances

  // Lexicons

  // Translations

  // Commentaries

  // Grammar references

  // Diagram sets

  // Audio
*/

ParsedClassicsCollDefs.new_tab["resource_defs"] = {
  
  new_tab_info: {
    collections_page_resource_desc: "", 
    library_app_selectbox_title: "New tab",
    library_app_panel_title: "",
    library_app_panel_subtitle: "",
    library_app_panel_text_from: "",
    library_app_panel_note: "",
    scanned_or_typed: "typed",
    resource_type: "info_text",
    scanned_source_shortname: "",
    contents_shortname: "",
  },

};
