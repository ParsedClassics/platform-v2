/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

var greek_word_explainer_contents = { // MUST have "var" keyword otherwise "greek_word_explainer_contents" inside $.ajax() will be undefined
  
  init_func: function(activeTabId) {

  },

  update_func: function(activeTabId, dataObj) {
    const {collectionShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);

    // get word form from DOM
    const wordDom = dataObj['formDom'];

    // get word form from URL
    let wordForm = ParsedClassicsLayout.getFormFromUrl(collectionShortname);

    // does there occured word form change?
    const wordFormChange = wordForm && wordForm !== wordDom;

    // is refresh needed?
    const refresh = typeof dataObj['refresh'] !== 'undefined' ? dataObj['refresh'] : false;

    if (wordFormChange || refresh) {
      // remove parentheses symbols
      wordForm = wordForm.replace(/([()])/g, '');

      let url = `https://lightandmatter.com/cgi-bin/greek/word_explainer/?word=${wordForm}`;

      // get tab content container inner el
      const tabContentContainerInner = $(`#tab-content-inner-${activeTabId}`);
      // get iframe
      const iframe = tabContentContainerInner.find('iframe');

      // load explanation from Greek Word Explainer
      iframe.attr('src', url);
    }
  },

}
