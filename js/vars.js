/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

const ParsedClassicsAppVars = {
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
  dialogueCloseBtnOuterClass: "dialogue-close-outer-btn",
  dialogueConfirmBtnClass: "dialogue-confirm-btn",
  dialogueCancelBtnClass: "dialogue-cancel-btn",
  dialogueCancelBtnOuterClass: "dialogue-cancel-outer-btn",
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
  scannedOrTypedAttr: "data-scanned-or-typed",
  // parsed text container
  parsedTextContainerTopPartClass: "parsed-text-split-top",
  parsedTextContainerBottomPartClass: "parsed-text-split-bottom",
  // lexicon container
  lexiconWordHeadingClass: "lexicon-heading",
  // concordance container
  concordanceLinesBtnClass: "concordance-lines-button",
  concordanceLinesBtnCollapsedClass: "collapsed",
  concordanceLinesBtnExpandedClass: "expanded",
  concordanceLinesListClass: "concordance-lines-list",
  concordanceContainerLeftPartClass: "concordance-split-left",
  concordanceContainerLeftPartInnerClass: "concordance-split-left-inner",
  concordanceContainerRightPartClass: "concordance-split-right",
  concordanceDependencyTopPartClass: "concordance-dependency-split-top",
  concordanceDependencyBottomPartClass: "concordance-dependency-split-bottom",
  concordanceWordHeadingClass: "concordance-heading",
  concordanceLineRefBtnClass: "concordance-line-number",
  concordanceLineRefBtnSelectedClass: "selected-concordance-line-number",
  concordanceLineRefAttr: "data-concordance-line-number",
  dependentResourceAttr: "data-dependent-res-shortname",
  // grammar refs container
  grammarRefsContainerLeftPartClass: "grammar-refs-split-left",
  grammarRefsContainerLeftPartInnerClass: "grammar-refs-split-left-inner",
  grammarRefsContainerRightPartClass: "grammar-refs-split-right",
  grammarBookAttr: "data-grammar",
  commentaryBookAttr: "data-commentary",
  grammarPageAttr: "data-page",
  // commentary refs container
  commentaryRefsContainerLeftPartClass: "commentary-refs-split-left",
  commentaryRefsContainerLeftPartInnerClass: "commentary-refs-split-left-inner",
  commentaryRefsContainerRightPartClass: "commentary-refs-split-right",
  commentaryBookAttr: "data-commentary",
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
  sectionSplitMinSizes: [190, 190], // IMPORTANT! each number should be a little bit more than twice bigger than min number for parsed text split in order to avoid situation when section splitter and parsed text splitter obstruct each other
  parsedTextSplitMinSizes: [80, 80], // IMPORTANT! each number should so big, that at least 2 lines should be seen, so that all morphological info be available
  // local storage
  urlHashStorageName: "ParsedClassicsApp__urlHash",
  // url
  layoutMember: "L",
  dimensionsMember: "D",
  pointersMember: "P",
  collectionSetMember: "edition",
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
  commentaryRefsDir: "data/commentary_refs/",
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
    commentary_refs: "Commentary references",
    grammar_refs: "Grammar references",
    diagram_set: "Diagrams",
    audio_recording: "Audio recording",
  },
  // animation
  animationSpeed: 400,
  // application root filename
  rootFileName: "app.html",
};
