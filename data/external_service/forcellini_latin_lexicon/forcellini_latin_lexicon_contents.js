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

      // get tab content container inner el
      const tabContentContainerInner = $(`#tab-content-inner-${activeTabId}`);
      // get loader img container and result container
      const loaderImgContainer = tabContentContainerInner.find('.loader-img-container');
      const resultContainer = tabContentContainerInner.find('.result-container');
      // display loader imgs
      loaderImgContainer.show();
      lemmaUrl = 'stirps';
      // $.ajax({
      //   url: `http://lexica.linguax.com/forc2.php?searchedLG=${lemmaUrl}&group=4294967294`,
      //   method: 'GET',
      //   timeout: 5000,
      //   success: function(response) {
      //     console.log('response', response);
      //   },
      //   error: function(xhr, status, error) {
      //     console.log(error); 
      //   }
      // });

      let word = 'urbs';

      var xhr = new XMLHttpRequest();

      var url = "http://lexica.linguax.com/forc2.php?searchedLG=" + word;

      var formData = new FormData();
      formData.append("msgBtn2", "OK (omnia legi)"); 
      xhr.open("POST", url, false);
      xhr.send(formData);

      xhr.open("GET", url, true);
      xhr.onreadystatechange = parseResponse;
      xhr.send();



    }
  },
};

function parseResponse() {
  if (this.readyState != 4 || this.status != 200) {
    return;
  }
  
  var text = this.responseText;
  console.log('text', text);
}