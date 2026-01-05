/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

var forcellini_latin_lexicon_contents = { // MUST have "var" keyword otherwise "forcellini_latin_lexicon_contents" inside $.ajax() will be undefined
  
  init_func: function(activeTabId) {

  },

  update_func: function(activeTabId, dataObj) {
    const {collectionShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);

    // get lemma from DOM
    const lemmaDom = dataObj['wordDom'];

    // get lemma from URL
    let lemmaUrl = ParsedClassicsLayout.getWordFromUrl(collectionShortname);
    console.log('lemmaUrl', lemmaUrl);

    // does there occured lemma change?
    const lemmaChange = lemmaUrl && lemmaUrl !== lemmaDom;

    // is refresh needed?
    const refresh = typeof dataObj['refresh'] !== 'undefined' ? dataObj['refresh'] : false;

    if (lemmaChange || refresh) {
      // remove parentheses symbols
      lemmaUrl = lemmaUrl.replace(/([()])/g, '');

      // remove macrons 
      lemmaUrl = lemmaUrl.normalize("NFD").replace(/\p{Diacritic}/gu, "");

      let url = `http://lexica.linguax.com/forc2.php?searchedLG=${lemmaUrl}`;

      // get tab content container inner el
      const tabContentContainerInner = $(`#tab-content-inner-${activeTabId}`);
      // get iframe
      const iframe = tabContentContainerInner.find('iframe');

      // load article from Forcellini's Lexicon totius Latinitatis
      iframe.attr('src', url);

    }
  },
};
