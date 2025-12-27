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

  update_func: function(activeTabId) {

    const {collectionShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);
    let wordForm = ParsedClassicsLayout.getFormFromUrl(collectionShortname);

    // remove parentheses symbols
    wordForm = wordForm.replace(/([()])/g, '');

    // remove macrons 
    wordForm = wordForm.normalize("NFD").replace(/\p{Diacritic}/gu, "");

    if (wordForm) {
      // get tab content container inner el
      const tabContentContainerInner = $(`#tab-content-inner-${activeTabId}`);
      // get loader img container and result container
      const loaderImgContainer = tabContentContainerInner.find('.loader-img-container');
      const resultContainer = tabContentContainerInner.find('.result-container');
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
          let parsing;
          let pofs;
          for (let i = 0; i < body.length; i++) {
            const inflection = body[i].rest.entry.infl;
            const headword = body[i].rest.entry.dict.hdwd.$;
            const lemma = headword.replace(/[1-9]/g, '');
            if(typeof body[i].rest.entry.infl[0] !== 'undefined') {
              pofs = body[i].rest.entry.infl[0].pofs.$;
            }
            else {
              pofs = body[i].rest.entry.infl.pofs.$;
            }
            const inflectionFormatted = morpheus_latin_lemmatizer_contents.formatInflection(inflection, pofs);
            const morphObj = {
              lemma: lemma,
              form: wordForm,
              pofs: pofs,
              inflection: inflectionFormatted,
            }
            analysis.push(morphObj);
          }

          let html = morpheus_latin_lemmatizer_contents.generateHtml(analysis);
          resultContainer.html(html);
          loaderImgContainer.hide();
        },
        error: function(xhr, status, error) {
          console.log(error); 
        }
      });




    }
  },

  formatInflection: function(inflection, pofs) {
    
    // is there only one parsing?
    if(!Array.isArray(inflection)) {
      inflection = [inflection];
    }

    const inflectionFormatted = [];
    for(let i = 0; i < inflection.length; i++) {
      let inflectionSingle;
      let morph = typeof inflection[i].morph !== 'undefined' && typeof inflection[i].morph.$ !== 'undefined' ? inflection[i].morph.$ : '';
      let tense = typeof inflection[i].tense !== 'undefined' && typeof inflection[i].tense.$ !== 'undefined' ? inflection[i].tense.$ : '';
      let voice = typeof inflection[i].voice !== 'undefined' && typeof inflection[i].voice.$ !== 'undefined' ? inflection[i].voice.$ : '';
      let mood = typeof inflection[i].mood !== 'undefined' && typeof inflection[i].mood.$ !== 'undefined' ? inflection[i].mood.$ : '';
      let dialect = typeof inflection[i].dial !== 'undefined' && typeof inflection[i].dial.$ !== 'undefined' ? inflection[i].dial.$ : '';
      let person = typeof inflection[i].pers !== 'undefined' && typeof inflection[i].pers.$ !== 'undefined' ? `${inflection[i].pers.$} person` : '';
      let number = typeof inflection[i].num !== 'undefined' && typeof inflection[i].num.$ !== 'undefined' ? inflection[i].num.$ : '';
      let gender = typeof inflection[i].gend !== 'undefined' && typeof inflection[i].gend.$ !== 'undefined' ? inflection[i].gend.$ : '';
      let gr_case = typeof inflection[i].case !== 'undefined' && typeof inflection[i].case.$ !== 'undefined' ? inflection[i].case.$ : '';
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
          inflection: `verb ${tense} ${voice} participle ${gr_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'noun') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${gr_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'adjective') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${gr_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'pronoun') {  
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${person} ${gr_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'article') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${gr_case} ${number} ${gender}`,
        };
      }
      else if (pofs === 'irregular') {
        inflectionSingle = {
          dialect: dialect,
          inflection: `${pofs} ${gr_case} ${number} ${gender}`,
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

  generateHtml: function(analysis) {
    let html = '';
    for (let i = 0; i < analysis.length; i++) {
      let form = analysis[i]['form'];
      let lemma = analysis[i]['lemma'];
      let inflection = analysis[i]['inflection'];
      let inflStr = '';
      for (let j = 0; j < inflection.length; j++) {
        let dialect = inflection[j]['dialect'] ? ` (${inflection[j]['dialect']})` : '';
        inflStr += `<br>${inflection[j]['inflection']}${dialect}`;
      }
      html += form || lemma || inflection ? `<p><strong>${form}</strong> <span class="word" data-lemma="${lemma}" title="Click to search in collection's dictionaries">${lemma}</span>${inflStr}</p>`: '<p>Morphological parsing not available</p>';
    }
    return html;
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