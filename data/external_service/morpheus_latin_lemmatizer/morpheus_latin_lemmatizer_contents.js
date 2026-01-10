/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

var morpheus_latin_lemmatizer_contents = { // MUST have "var" keyword otherwise "morpheus_greek_lemmatizer_contents" inside $.ajax() will be undefined

  init_func: function(activeTabId) {
    // get tab content container inner el
    const tabContentContainerInner = $(`#tab-content-inner-${activeTabId}`);
    // attach func to lemmas
    tabContentContainerInner.on('click', 'span.word[data-lemma]', morpheus_latin_lemmatizer_contents.hashSelectLemma);
  },

  update_func: function(activeTabId, dataObj) {

    const {collectionShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);

    // get word form from DOM
    const wordDom = dataObj['formDom'];
    
    // get word form from URL
    let wordForm = ParsedClassicsLayout.getFormFromUrl(collectionShortname);

    // // should "word form" from URL be treated as single word or text?
    // const isWord = wordForm.indexOf(' ') === -1 ? true : false;

    // // close dialoge which might be open
    // const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);

    // // if "word form" from URL is not word, let's show error message
    // if (!isWord) {
    //   ParsedClassicsAlertDialogue.openDialogue(paneId, {
    //     heading: 'Error',
    //     message: `String to be analized "${wordForm}" contains space(s).`,
    //   });
    //   return;
    // }

    // does there occured word form change?
    const wordFormChange = wordForm && wordForm !== wordDom;

    // is refresh needed?
    const refresh = typeof dataObj['refresh'] !== 'undefined' ? dataObj['refresh'] : false;

    if (wordFormChange || refresh) {
      // remove parentheses symbols
      wordForm = wordForm.replace(/([()])/g, '');

      // remove macrons 
      wordForm = wordForm.normalize("NFD").replace(/\p{Diacritic}/gu, "");
      
      // get tab content container inner el
      const tabContentContainerInner = $(`#tab-content-inner-${activeTabId}`);
      // get loader img container and result container
      const loaderImgContainer = tabContentContainerInner.find('.loader-img-container');
      const resultContainer = tabContentContainerInner.find('.result-container');
      const topLinksContainer = tabContentContainerInner.find('.top-links');
      // display loader imgs
      loaderImgContainer.show();

      $.ajax({
        url: `https://services.perseids.org/bsp/morphologyservice/analysis/word?lang=lat&engine=morpheuslat&word=${wordForm}`,
        method: 'GET',
        timeout: 5000,
        success: function(response) {

          let body = response.RDF.Annotation.Body;

          // parsing not found? - then display error message
          if (typeof body === 'undefined' || !body) {
            let message = 'Morphological parsing not available.'
            console.log(message);
            let html = `<p>${message}</p>`;
            resultContainer.html(html);
            loaderImgContainer.hide();
            return;
          }
          // is there only one block of parsing?
          if(!Array.isArray(body)) {
            body = [body];
          }
          console.log('body', body);

          const analysis = [];
          for (let i = 0; i < body.length; i++) {
            const inflection = body[i].rest.entry.infl;
            const headword = body[i].rest.entry.dict.hdwd.$;
            const lemma = headword.replace(/[1-9]/g, '');
            const inflectionFormatted = morpheus_latin_lemmatizer_contents.formatInflection(inflection);
            const morphObj = {
              lemma: lemma,
              form: wordForm,
              inflection: inflectionFormatted,
            }
            analysis.push(morphObj);
          }

          let {html, linksStrTop} = morpheus_latin_lemmatizer_contents.generateHtml(analysis, activeTabId);
          resultContainer.html(html);
          topLinksContainer.html(linksStrTop);
          loaderImgContainer.hide();
        },
        error: function(xhr, status, error) {
          console.log(error); 
        }
      });

    }
  },

  formatInflection: function(inflection) {
    
    // is there only one parsing?
    if(!Array.isArray(inflection)) {
      inflection = [inflection];
    }

    const inflectionFormatted = [];
    for(let i = 0; i < inflection.length; i++) {
      let inflectionSingle;
      let pofs = typeof inflection[i].pofs !== 'undefined' && typeof inflection[i].pofs.$ !== 'undefined' ? inflection[i].pofs.$ : '';
      let morph = typeof inflection[i].morph !== 'undefined' && typeof inflection[i].morph.$ !== 'undefined' ? inflection[i].morph.$ : '';
      let tense = typeof inflection[i].tense !== 'undefined' && typeof inflection[i].tense.$ !== 'undefined' ? inflection[i].tense.$ : '';
      let voice = typeof inflection[i].voice !== 'undefined' && typeof inflection[i].voice.$ !== 'undefined' ? inflection[i].voice.$ : '';
      let mood = typeof inflection[i].mood !== 'undefined' && typeof inflection[i].mood.$ !== 'undefined' ? inflection[i].mood.$ : '';
      let dialect = typeof inflection[i].dial !== 'undefined' && typeof inflection[i].dial.$ !== 'undefined' ? inflection[i].dial.$ : '';
      let person = typeof inflection[i].pers !== 'undefined' && typeof inflection[i].pers.$ !== 'undefined' ? `${inflection[i].pers.$} person` : '';
      let number = typeof inflection[i].num !== 'undefined' && typeof inflection[i].num.$ !== 'undefined' ? inflection[i].num.$ : '';
      let gender = typeof inflection[i].gend !== 'undefined' && typeof inflection[i].gend.$ !== 'undefined' ? inflection[i].gend.$ : '';
      let la_case = typeof inflection[i].case !== 'undefined' && typeof inflection[i].case.$ !== 'undefined' ? inflection[i].case.$ : '';
      let degree = typeof inflection[i].comp !== 'undefined' && typeof inflection[i].comp.$ !== 'undefined' ?  inflection[i].comp.$ : '';
      if (pofs === 'verb') {
        if (inflection[i].mood.$ === 'infinitive') {
          inflectionSingle = {
            dialect: dialect,
            inflection: `${pofs} ${tense} ${voice} ${mood}`,
          };
        }
        else {
          inflectionSingle = {
            dialect: dialect,
            inflection: `${pofs} ${tense} ${voice} ${mood} ${person} ${number}`,
          };
        }
      }
      else if (pofs === 'verb participle') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `verb ${tense} ${voice} participle ${la_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'noun') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${la_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'adjective') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${la_case} ${number} ${gender} ${degree}`,
        };
      }
      else if (pofs === 'pronoun') {  
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${person} ${la_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'article') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${la_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'irregular') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${la_case} ${number} ${gender}`,
        };
      }
      else if (morph.indexOf('indeclform') !== -1) {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs}`,
        };
      }
      inflectionFormatted.push(inflectionSingle);
    }

    return inflectionFormatted;
  },

  generateHtml: function(analysis, activeTabId) {
    // get resource shortname
    const {collectionShortname, resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);
    // get arr of link shortnames from local storage
    const local_storage_key = `${resourceShortname}__lemmatizer_links`;
    const selected_by_user = localStorage.getItem(local_storage_key) ? localStorage.getItem(local_storage_key).split('|') : [];

    // get collection's definition
    const collectionDef = ParsedClassicsCollDefs[collectionShortname];
    // get all resource definitions of collection
    const resourceDefsAll = collectionDef['resource_defs'];
    // get resource definition
    const resourceDef = resourceShortname ? resourceDefsAll[resourceShortname] : '';
    // get options's defaults
    const optionsArr = resourceDef['extra']['options']['lemmatizer_links']['defaults']['show_links'];

    // get arr of link shortnames selected by default
    const selected_by_default = [];
    for (let i = 0; i < optionsArr.length; i++) {
      let is_selected = optionsArr[i][2];
      let link_name = optionsArr[i][0];
      if (is_selected) {
        selected_by_default.push(link_name);
      }
    }

    // get arr of links shortnames to be displayed
    const selected_links_arr = selected_by_user.length > 0 ? selected_by_user : selected_by_default;
    
    let linksStrTop = ParsedClassicsLemmatizerLinks.top_links(selected_links_arr, optionsArr);
    
    let html = '';
    //let form;
    for (let i = 0; i < analysis.length; i++) {
      let form = analysis[i]['form'];
      let formStr = `<strong>${form}</strong> `;
      let lemma = analysis[i]['lemma'];
      let lemmaStr = `<span class="word" data-lemma="${lemma}" title="Click to search in collection's dictionaries">${lemma}</span>`;

      let linksStrBottom = ParsedClassicsLemmatizerLinks.bottom_links(selected_links_arr, optionsArr, form, lemma);
      
      let inflection = analysis[i]['inflection'];
      let inflStr = '';
      for (let j = 0; j < inflection.length; j++) {
        if (inflection[j]) {
          let dialect = typeof inflection[j]['dialect'] && inflection[j]['dialect'] ? ` (${inflection[j]['dialect']})` : '';
          inflStr += `<br>${inflection[j]['inflection']}${dialect}`;
        }
      }
      html += form || lemma || inflection ? `<p>${formStr}${lemmaStr}${linksStrBottom}${inflStr}</p>`: '<p>Morphological parsing not available</p>';
    }
    return {html, linksStrTop};
  },

  hashSelectLemma: function(event) {

    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname] ?? {};
    // get lemma from URL
    const lemmaFromUrl = typeof collectionPointers[ParsedClassicsAppVars.wordMember] !== 'undefined' ? collectionPointers[ParsedClassicsAppVars.wordMember] : null;

    // get clicked el
    const wordEl = $(event.target);

    // get lemma from DOM
    const lemmaFromDom = wordEl ? wordEl.attr(ParsedClassicsAppVars.lemmaAttr) : null;

    // update pointers obj
    if (lemmaFromDom && lemmaFromDom !== lemmaFromUrl) {
      
      // put new lemma and word form into pointers obj
      collectionPointers[ParsedClassicsAppVars.wordMember] = lemmaFromDom;
      //collectionPointers[ParsedClassicsAppVars.formMember] = lemmaFromDom;

      // remove from pointers obj all other keys related to word
      delete collectionPointers[ParsedClassicsAppVars.lexiconMember];
      delete collectionPointers[ParsedClassicsAppVars.lexiconEntryMember];
      delete collectionPointers[ParsedClassicsAppVars.wordPositionMember];

      // stringify hash json
      const hashJsonString = JSON.stringify(hashJson);
      // push state
      history.pushState(null, "", `#${hashJsonString}`);
      // update layout
      ParsedClassicsLayout.update(hashJson)
    }

  },

}