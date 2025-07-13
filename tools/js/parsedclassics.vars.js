/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
Vars for helper, data and widgets scripts
=====================================================
*/


var ParsedClassicsVars = {
  
  // id of <body> el in site pages
  siteContentId: "pc-site-content"
  // url and cookies
  , cataloguesRelUrl: "../data/catalogues/"
  , contentsRelUrl: "../data/contents/"
  , parsedTextsRelUrl: "../data/resources/parsed_texts/"
  , originalTextsRelUrl: "../data/resources/original_texts/"
	, concordanceRelUrl: "../data/resources/concordance/"
	, lexiconsRelUrl: "../data/resources/lexicons/"
  , translationsRelUrl: "../data/resources/translations/"
	, commentariesRelUrl: "../data/resources/commentaries/"
  , grammarRefsRelUrl: "../data/resources/grammar_references/"
  , diagramsRelUrl: "../data/resources/diagrams/"
  , audioRelUrl: "../data/resources/audio/"
  , audioFilesRelUrl: "../_audio/"
  , hashStringStart: "#catalogue/"
  , hashStringStartDocs: "#/"
  , sectionUrlAndCookieName: "section"
  , collectionUrlAndCookieName: "coll"
  , lineUrlAndCookieName: "line"
	, wordUrlAndCookieName: "word"
  , resourceUrlAndCookieName: "res"
  , lexiconUrlAndCookieName: "lex"
  , lexiconEntryUrlAndCookieName: "entry"
  , enabledResourcesCookieName: "enabled_resources"
  , collSetUrlName: "edition"
  , extraWinUrlName: "win"
  , extraWinUrlVal: "extra"
  , extraWinUrlValConcordance: "conc"
  , contentsUrlName: "cont"
  // panes
  , westPaneContainerId: "pc-west-pane-content"
  , centerPaneContainerId: "pc-center-pane-content-inner"
  , centerPaneContentId: "pc-center-pane-content"
  , parsingSubPaneContainerId: "pc-parsing-subpane-inner"
  // navbar widget
  , collectionsSelectboxId: "pc-collections-selectbox"
  , sectionsSelectboxId: "pc-sections-selectbox"
  , resourcesSelectboxId: "pc-resources-selectbox"
	, resourceTypeAttr: "data-resource-type"
  // modal dialogue
  , closeDialogueButtonClass: "pc-close-dialogue_button"
  , openSettingsDialogueButtonId: "pc-open-options-dialogue_button"
  , dialogueId: "pc-options-dialogue"
  , contentPanelDialogueClass: "pc-content-panel-dialogue"
  , dialogueContentInnerClass: "pc-modal-content-inner"
  , onloadDialogueId: "pc-loading-dialogue"
  , onloadDialogueTimeOut: 2000
  // tabbed panels
  , tabButtonContainerIdArray: ["pc-options-modal-tabbuttons-el"] 
  , tabButtonClass: "pc-tablink" 
  , tabClass: "pc-tab"
  , tabOpenedClass: "pc-silver"
  // selected line
  , lineClassSelectedByDefault: "v-title"
  , selectedLineClass: "selected-verse"
  , verseNumberClass: "line-number"
  , verseClass: "line"
  , verseNumClassPrefix: "v"
  , verseNumClassSeparator: "-"
  , lineNumberAttr: "data-line-number"
  // selected word
	, wordClassSelectedByDefault: "title"
  , wordClass: "word"
  , selectedWordClass: "selected-word"
  , formAttr: "data-form"
  , partOfSpeechAttr: "data-part-of-speech"
  , parsingAttr: "data-parsing"
  , lemmaAttr: "data-lemma"
  , lexiconAttr: "data-lexicon"
  , lexiconEntryAttr: "data-lexicon-entry"
  // inner link
  , innerLinkClass: "inner-link"
  , anchorAttr: "data-anchor"
  // grammar refs
  , grammarBookAttr: "data-grammar"
  , grammarPageAttr: "data-page"
  // concordance
  , concordanceLineNumClass: "concordance-line-number"
  , concordanceLineClassAttr: "data-concordance-line-class"
  , concordanceVerseClass: "concordance-line"
  , concordanceWordClass: "concordance-word"
  , concordanceHeadingClass: "concordance-heading"
  , concordanceEntryClass: "concordance-entry"
  , concordanceLinesButtonClass: "concordance-lines-button"
  , concordanceLinesButtonCollapsedClass: "collapsed"
  , concordanceLinesButtonExpandedClass: "expanded"
  , concordanceLinesListClass: "concordance-lines-list"
  // lexicon
  , lexiconHeadingClass: "lexicon-heading"
  // audio
  , audioPlayerElPrefix: "audioplayer-"
  , audioTextElPrefix: "audioplayer-text-"
  , audioTextfromElPrefix: "text-from-"
  , audioTextLineClass: "line"
  , audioLineStartAttr: "data-start"
  // resource types
  , resourceTypeParsedText: "parsed_text"
  , resourceTypeOriginalText: "original_text"
  , resourceTypeConcordance: "concordance"
  , resourceTypeLexicon: "lexicon"
  , resourceTypeTranslation: "translated_text"
  , resourceTypeCommentary: "commentary"
  , resourceTypeGrammarRefs: "grammar_references"
  , resourceTypeDiagrams: "diagram_set"
  , resourceTypeAudio: "audio_recording"
  , resourceTypeScanned: "scanned"
  , resourceTypeTyped: "typed"
  // content panels
  , contentPanelWrapperClass: "pc-content-panel-wrapper"
  , contentPanelInnerClass: "pc-content-panel-inner"
  , resourcesListPanelId: "pc-resources-list-panel"
  , contentsShortnameAttr: "data-contents-shortname"
  , bookReaderIframeClass: "pc-bookreader"
  , waitForDataTimeout: 500
  //contentsJSON
  , keyStringLevelStart: "levelstart"
  , keyStringLevelEnd: "levelend"
  // custom events
  , eventSectionsSelectboxChange: "sections-selectbox-change"
	, eventSelectedWordChange: "selected-word-change"
  // animation
  , animationSpeed: 400
  // settings forms for data
  , versesOrParagraphsFormName: "pc-show-text-as"
  , versesOrParagraphsCookieName: "pc-show-text-as"
  , versesOrParagraphsRadioName: "show-text-as"
  , cookieValShowVerses: "verses"
  , cookieValShowParagraphs: "paragraphs"
  , showAsVersesClass: "pc-show-verses"
  , showAsParagraphsClass: "pc-show-paragraphs"
  // settings forms interface
  , displayResourcesAtTimeFormName: "pc-resources-at-a-time"
  , displayResourcesAtTimeCookieName: "pc-resources-at-a-time" 
  , displayResourcesAtTimeRadioName: "resources-at-a-time"  
  , valResourcesAtTimeSingle: "single"
  , valResourcesAtTimeCategory: "category"
  , valResourcesAtTimeAll: "all"
  , resourcesAtTimeSingleClass: "pc-resources-at-time-single"
  , resourcesAtTimeCategoryClass: "pc-resources-at-time-category"
  , resourcesAtTimeAllClass: "pc-resources-at-time-all"
  , enableDisableResourcesFormName: "pc-enable-disable-resources"
  , extraWindowsFormName: "pc-resources-in-extra-windows"
  , enableDisableResourcesValChangeInputName: "values_changed"
  , extraWindowsValChangeInputName: "values_changed"
  , enableDisableResourcesCookieName: "pc-enable-disable-resources"
  , extraWindowsCookieName: "pc-resources-in-extra-windows"
  , enableDisableResourcesCheckboxName: "resources-to-load"
  , extraWinFormDivClass: "extra-win-form-div"
  , extraWinFormPostfixOpennow: "_opennow"
  , extraWinFormPostfixOpenonload: "_openonload"
  , extraWinFormInputClassOpennow: "opennow"
  // docs interface
  , docsHeadingLinkId: "docs_heading_link"
  , docsHeadingId: "docs_heading"
  , contentsItemClass: "connav-table-item-text"
  // tools interface
  , inputTextareaId: "pc-textarea-input"
  , inputTextarea2Id: "pc-textarea-input2"
  , inputTextarea3Id: "pc-textarea-input3"
  , inputTextarea4Id: "pc-textarea-input4"
  , outputTextareaId: "pc-textarea-output"
  , loadButtonId: "pc-load-button"
  , loadButton2Id: "pc-load-button2"
  , generateButtonId: "pc-generate-button"
  , checkButtonId: "pc-check-button"
  , appendCodeContainerId: "pc-append-code-container"
  , appendCodeContainer2Id: "pc-append-code-container2"
  , appendCodeContainer3Id: "pc-append-code-container3"
  , languageFormName: "pc-original-text-language"
  , languageRadioName: "original-text-language"
  , languageGreek: "greek"
  , languageLatin: "latin"
  , errorMsgTextElId: "error-msg-text-el"
  , toolsErrorModalId: "pc-tools-error-dialogue"
  // tools data
  , locale: "el"
  , numberNames: ["singular", "dual", "plural"]
  , numberNums: [50, 60, 70]
  , caseNames: ["nominative", "genitive", "dative", "accusative", "vocative"]
  , caseNums: [50, 60, 70, 80, 90]
  , genderNames: ["masculine", "feminine", "neuter"]
  , genderNums: [50, 60, 70]
  , degreeNames: ["positive", "comparative", "superlative"]
  , degreeNums: [50, 60, 70]
  , tensesNames: ["present", "imperfect", "future", "aorist", "perfect", "pluperfect"]
  , tensesNums: [50, 60, 70, 80, 90, 100]
  , verbtypeNames: ["simpleverb", "infinitive", "participle", "verbal"]
  , verbtypeNums: [50, 60, 80, 90]
  , moodNames: ["indicative", "subjunctive", "optative", "imperative"]
  , moodNums: [50, 60, 80, 90]
  , voiceNames: ["active", "middle", "passive"]
  , voiceNums: [50, 60, 80]
  , personNames: ["1st", "2nd", "3rd"]
  , personNums: [50, 60, 70]
  
};