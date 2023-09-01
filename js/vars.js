/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

const ParsedClassicsAppVars = {
  // Dev mode
  DEV_MODE: true,
  // container
  containerClass: "container",
  containerId: "container",
  // section
  sectionClass: "section",
  // pane
  paneClass: "pane",
  paneMaximizedClass: "pane--maximized",
  paneTopPartClass: "pane__top-part",
  paneBottomPartClass: "pane__bottom-part",
  dialogueCloseBtnClass: "dialogue-close-btn",
  dialogueConfirmBtnClass: "dialogue-confirm-btn",
  dialogueCancelBtnClass: "dialogue-cancel-btn",
  // tabbar and tab
  tabbarClass: "scrollmenu", 
  tabbarDragClass: "scrollmenu--drag",
  tabClass: "tab",
  tabActiveClass: "tab--active",
  tabContentClass: "tab__content",
  tabContentInnerClass: "tab__content-inner",
  tabCloseBtnClass: "tab__close_btn",
  newTabCollectionShortname: "new_tab",
  newTabResourceShortname: "new_tab_info",
  // tab content container
  lineClass: "line",
  selectedLineClass: "selected-line",
  lineNumberClass: "line-number",
  wordClass: "word",
  selectedWordClass: "selected-word",
  innerLinkClass: "inner-link",
  anchorAttr: "data-anchor",
  lineNumberAttr: "data-line-number",
  lemmaAttr: "data-lemma",
  lexiconAttr: "data-lexicon",
  lexiconEntryAttr: "data-lexicon-entry",
  formAttr: "data-form",
  partOfSpeechAttr: "data-part-of-speech",
  parsingAttr: "data-parsing",
  resourceTypeAttr: "data-resource-type",
  collResPairAttr: "data-coll-res-shortname-pair",
  // menu
  layoutBtnsContainer: "sm__layout-buttons",
  addRightSectionBtnClass: "create-right-section",
  addLeftSectionBtnClass: "create-left-section",
  addTopPaneBtnClass: "create-top-pane",
  addBottomPaneBtnClass: "create-bottom-pane",
  maximizePaneBtnClass: "maximize-pane",
  minimizePaneBtnClass: "minimize-pane",
  closePaneBtnClass: "close-pane",
  addTabBtnClass: "add-tab",
  layoutBtnHideClass: "pane-button--hide",
  paneSelectsContainerClass: "sm__pane-selects-container",
  tabSelectsContainerClass: "sm__tab-selects-container",
  // splitter
  horizontalSplitterClass: "gutter-horizontal",
  verticalSplitterClass: "gutter-vertical",
  horizontalSplitterCursor: "ew-resize",
  verticalSplitterCursor: "ns-resize",
  splitterSize: 7,
  splitterSnapOffset: 0,
  // local storage
  urlHashStorageName: "ParsedClassicsApp__urlHash",
  // url
  layoutMember: "L",
  dimensionsMember: "D",
  pointersMember: "P",
  collectionMember: "coll",
  wordMember: "word",
  lineMember: "line",
  lexiconMember: "lexicon",
  lexiconEntryMember: "lexentry",
  wordPositionMember: "wordpos",
  cataloguesDir: "data/_catalogues/",
  parsedTextDir: "data/parsed_text/",
  originalTextDir: "data/original_text/",
  concordanceDir: "data/concordance/",
  lexiconDir: "data/lexicon/",
  translationDir: "data/translation/",
  commentaryDir: "data/commentary/",
  grammarRefsDir: "data/grammar_refs/",
  diagramSetDir: "data/diagram_set/",
  audioRecordingDir: "data/audio_recording/",
  infoTextDir: "data/info_text/",
  // resource
  resourceTypeLabels: {
    parsed_text: "Parsed text",
    original_text: "Original text",
    concordance: "Concordance",
    lexicon: "Lexicon",
    translation: "Translation",
    commentary: "Commentary",
    grammar_refs: "Grammar references",
    diagram_set: "Diagrams",
    audio_recording: "Audio recording",
  },
  // animation
  animationSpeed: 400,
};
