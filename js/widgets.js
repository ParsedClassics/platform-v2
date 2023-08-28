/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

const ParsedClassicsNavSelects = {

  createTabSelectsContainer: function(tabId) {
    // create tab selectboxes container html
    const containerHtml = `
      <div class="sm__tab-selects-container" id="tab-selects-container-${tabId}"">
        <div class="sm__tab-selects-container-inner">
          <select class="sm-menu-selectbox" id="collections-selectbox-${tabId}">
            <option disabled selected>Collection</option>
          </select>
          <select class="sm-menu-selectbox" id="resources-selectbox-${tabId}">
            <option disabled selected>Resource</option>
          </select>
          <select class="sm-menu-selectbox" id="lines-selectbox-${tabId}">
            <option disabled selected>Line</option>
          </select>
        </div>
      </div>
    `;
    // create tab selectboxes container el
    const container = $(containerHtml);

    // attach function to collections selectbox
    const collectionsSelectbox = container.find(`#collections-selectbox-${tabId}`);
    collectionsSelectbox.bind('change', function() {
      const collectionShortname = this.value;
      const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
      $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
      ParsedClassicsNavSelects.hashSelectCollection(collectionShortname, tabId);
    });

    // attach function to resources selectbox
    const resourcesSelectbox = container.find(`#resources-selectbox-${tabId}`);
    resourcesSelectbox.bind('change', function() {
      const collResPair = this.value;
      const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
      $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
      ParsedClassicsNavSelects.hashSelectResource(collResPair, tabId);
    });

    // attach function to lines selectbox
    const linesSelectbox = container.find(`#lines-selectbox-${tabId}`);
    linesSelectbox.bind('change', function() {
      const collLinePair = this.value;
      const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
      $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
      ParsedClassicsNavSelects.hashSelectLine(collLinePair, tabId);
    });
    
    // get selectded collection shortname and selected resource shortname
    const {collectionShortname, resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(tabId);

    // create collections selectbox options els
    const collSelectboxOptionsEls = ParsedClassicsNavSelects.collectionsSelectboxOptions(collectionShortname);
    // append collection selectbox options els to collection selectbox
    collectionsSelectbox.append(collSelectboxOptionsEls);

    // create resources selectbox options els
    const resSelectboxOptionsEls = ParsedClassicsNavSelects.resourcesSelectboxOptions(collectionShortname, resourceShortname);
    // append resources selectbox options els to resources selectbox and 
    // add data attr to selectbox to indicate collection whose resource shortnames selectbox contains
    resourcesSelectbox.append(resSelectboxOptionsEls).attr('data-collection', collectionShortname);

    // create lines selectbox options els
    const linesSelectboxOptionsEls = ParsedClassicsNavSelects.linesSelectboxOptions(collectionShortname);
    // append lines selectbox options els to lines selectbox
    // add data attr to selectbox to indicate collection whose line indicators selectbox contains
    linesSelectbox.append(linesSelectboxOptionsEls).attr('data-collection', collectionShortname);
    return container;
  },

  collectionsSelectboxOptions: function(collectionShortname) {
    let selectboxOptionsHtml = '';
    // loop through collection sets
    for (const setShortname in ParsedClassicsCollectionSets) {
      // get set definition
      const setDef = ParsedClassicsCollectionSets[setShortname];
      // get set title
      const setTitle = setDef['title_orig_short']; 
      // gett collections shortnames array
      const collectionsShortnamesArr = setDef['collections'];
      // create optgroup's opening tag
      let optgroupHtml = `<optgroup label="${setTitle}">\n`;
      // loop through collections 
      collectionsShortnamesArr.forEach(shortname => {
        // is collection selected?
        const selected = shortname === collectionShortname ? 'selected' : '';
        // get collection's definition
        const collDef = ParsedClassicsCollDefs[shortname];
        // get collections selectbox title
        const collSelectboxname = collDef['collection_selectboxname'];
        // create option's html
        optgroupHtml += `<option value="${shortname}" ${selected}>${collSelectboxname}</option>\n`;
      });
      // create optgroup's closing tag
      optgroupHtml += '</optgroup>\n';
      selectboxOptionsHtml += optgroupHtml;
    }
    // create selectbox options els
    const selectboxOptionsEls = $(selectboxOptionsHtml);
    return selectboxOptionsEls;
  },

  resourcesSelectboxOptions: function(collectionShortname, resourceShortname) {
    // define var
    let selectboxOptionsHtml = '';
    // get collection's definition
    const collDef = ParsedClassicsCollDefs[collectionShortname];
    // get resource definitions
    const resDefs = collDef['resource_defs'];
    // get all resource shortnames
    const resShortnames = Object.keys(resDefs);
    // "New tab" resource should not be shown among selectbox options, so remove its shortname
    const resShortnamesAll = resShortnames.filter(shortname => shortname !== ParsedClassicsAppVars.newTabResourceShortname);
    // loop through resource shortnames
    for (let i = 0; i < resShortnamesAll.length; i++) {
      // get resource definition of current resource
      const resourceDefCurr = resDefs[resShortnamesAll[i]];
      // get resource selectbox title
      const resTitle = resourceDefCurr['library_app_selectbox_title'];
      // get resource type of current resource
      const resTypeCurr = resourceDefCurr['resource_type'];
      // get resource type label
      const resTypeLabel = ParsedClassicsAppVars.resourceTypeLabels[resTypeCurr];
      // get resource definition of previous resource
      const resourceDefPrev = i - 1 >= 0 ? resDefs[resShortnamesAll[i - 1]] : null;
      // get resource type of previous resource
      const resTypePrev = resourceDefPrev ? resourceDefPrev['resource_type'] : null;
      // is resource selected?
      const selected = resShortnamesAll[i] === resourceShortname ? 'selected' : '';
      // create optionn el's html
      const optionElHtml = `<option value="${collectionShortname}|${resShortnamesAll[i]}" ${selected}>${resTitle}</option>\n`;
      // is this the first resource?
      if (i === 0) {
        selectboxOptionsHtml += `<optgroup label="${resTypeLabel}">\n`;
        selectboxOptionsHtml += optionElHtml;
        // is it the only resource?
        if (resShortnamesAll.length === 1) {
          selectboxOptionsHtml += '</optgroup>\n';
        }
      }
      // is this not first and not last resource?
      else if (i > 0 && i < resShortnamesAll.length - 1) {
        if (resTypeCurr !== resTypePrev) {
          selectboxOptionsHtml += '</optgroup>\n';
          selectboxOptionsHtml += `<optgroup label="${resTypeLabel}">\n`; 
        }
        selectboxOptionsHtml += optionElHtml;
      }
      // is this the last resource?
      else if (i === resShortnamesAll.length - 1) {
        if (resTypeCurr !== resTypePrev) {
          selectboxOptionsHtml += '</optgroup>\n';
          selectboxOptionsHtml += `<optgroup label="${resTypeLabel}">\n`; 
        }
        selectboxOptionsHtml += optionElHtml;
        selectboxOptionsHtml += '</optgroup>\n';
      }
    }
    // create selectbox options els
    const selectboxOptionsEls = $(selectboxOptionsHtml);
    return selectboxOptionsEls;
  },

  linesSelectboxOptions: function(collectionShortname) {
    let selectboxOptionsHtml = '';
    // get collection's definition
    const collDef = ParsedClassicsCollDefs[collectionShortname];
    // get collection's contents
    const collContents = collDef['contents'] ?? {};

    // get selected line's number
    const selectedLineIndicator = ParsedClassicsLayout.getLineIndicatorFromUrl(collectionShortname);

    for (let key in collContents) {
      if (key.indexOf('levelstart-') === 0) {
        selectboxOptionsHtml += `<optgroup label="${collContents[key]}">\n`;
      }
      else if (key.indexOf('levelend-') === 0) {
        selectboxOptionsHtml += '</optgroup>\n';
      }
      else {
        // is line selected?
        const selected = selectedLineIndicator === key ? 'selected' : '';
        selectboxOptionsHtml += `<option value="${collectionShortname}|${key}" ${selected}>${collContents[key]}</option>\n`;     
      }
    }
    // create selectbox options els
    const selectboxOptionsEls = $(selectboxOptionsHtml);
    return selectboxOptionsEls;
  },

  hashSelectCollection: function(collectionShortname, tabId) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get layout obj and pointers obj
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    
    // get numerical index of tab
    const tabIndex = ParsedClassicsLayout.getTabIndexFromUrl(tabId);
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
    // get alphabetical index of section and numerical index of pane
    const {sectionIndex, paneIndex} = ParsedClassicsLayout.getSectionAndPaneIndexesFromUrl(paneId);
    // get section layout (array of arrays of collectionShortname|resourceShortname pairs)
    const sectionLayout = layoutObj[sectionIndex];
    // get pane layout (array of collectionShortname|resourceShortname pairs)
    const paneLayout = sectionLayout[paneIndex];
    // change relevant collectionShortname|resourceShortname pair with collection shortname which was selected
    paneLayout.splice(tabIndex, 1, collectionShortname);

    // exists data about collection in pointers object?
    if (typeof pointersObj[collectionShortname] === 'undefined') {
      // add collection key in pointers object
      pointersObj[collectionShortname] = {};
      // save reference in variable
      const collectionPointers = pointersObj[collectionShortname];
      // selected line of just selected collection is "title"
      collectionPointers[ParsedClassicsAppVars.lineMember] = 'title';
    }

    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  hashSelectResource: function(collResPair, tabId) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get layout obj
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];

    // get numerical index of tab
    const tabIndex = ParsedClassicsLayout.getTabIndexFromUrl(tabId);
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
    // get alphabetical index of section and numerical index of pane
    const {sectionIndex, paneIndex} = ParsedClassicsLayout.getSectionAndPaneIndexesFromUrl(paneId);
    // get section layout (array of arrays of collectionShortname|resourceShortname pairs)
    const sectionLayout = layoutObj[sectionIndex];
    // get pane layout (array of collectionShortname|resourceShortname pairs)
    const paneLayout = sectionLayout[paneIndex];
    // change relevant collectionShortname|resourceShortname pair with collection shortname which was selected
    paneLayout.splice(tabIndex, 1, collResPair);

    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  hashSelectLine: function(collLinePair) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get collection shortname
    const collectionShortname = collLinePair.split('|')[0];
    // get resource shortname
    const lineIndicator = collLinePair.split('|')[1];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname];
    // change value of the key "line" with the line indicator which was selected
    collectionPointers[ParsedClassicsAppVars.lineMember] = lineIndicator;

    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  treatActiveTabSelectboxesContainer: function(pane, activeTabId) {
    // get pane's top part el
    const paneTopPart = pane.find(`.${ParsedClassicsAppVars.paneTopPartClass}`);
    // get PANE's selectboxes container
    const paneSelectboxesContainer = paneTopPart.find(`.${ParsedClassicsAppVars.paneSelectsContainerClass}`);
    // get TAB's selectboxes container 
    const tabSelectboxesContainer = paneSelectboxesContainer.find(`#tab-selects-container-${activeTabId}`);
    // get collection shortname and resource shortname from URL
    const {collectionShortname, resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);
    const collResPair = collectionShortname && resourceShortname ? `${collectionShortname}|${resourceShortname}`: '';
    // get selected line's indicator from URL
    const lineIndicator = ParsedClassicsLayout.getLineIndicatorFromUrl(collectionShortname);
    const collLinePair = collectionShortname && lineIndicator ? `${collectionShortname}|${lineIndicator}` : '';

    // I. treat collections' selectbox

    // get collections' selectbox
    const collSelectbox = tabSelectboxesContainer.find(`#collections-selectbox-${activeTabId}`);
    // get value from collections' selectbox
    const collSelectboxValue = collSelectbox.val();
    // is collections' selectbox value not the same as collection shortname from URL?
    if (collectionShortname !== collSelectboxValue) {
      // set collection shortname from URL as the value of collections' selectbox
      const optionToBeSelected = collSelectbox.find(`option[value="${collectionShortname}"]`);
      if (optionToBeSelected.length === 1) {
        collSelectbox.val(collectionShortname);
      }
      else {
        collSelectbox[0].selectedIndex = 0;
      } 
    }

    // II. treat resources' selectbox

    // get resources' selectbox
    const resSelectbox = tabSelectboxesContainer.find(`#resources-selectbox-${activeTabId}`);
    // get value of data-collection attr
    const collShortnameFromDom1 = resSelectbox.attr('data-collection');
    // do we need to create new options els for resources selectbox?
    if (collectionShortname !== collShortnameFromDom1) {
      // create create new options els for resources selectbox
      const resSelectboxOptionsEls = ParsedClassicsNavSelects.resourcesSelectboxOptions(collectionShortname, null);
      // remove old options els 
      resSelectbox.find('optgroup').remove();
      // append new options els and 
      // add data attr to selectbox to indicate collection whose resource shortnames selectbox contains
      resSelectbox.append(resSelectboxOptionsEls).attr('data-collection', collectionShortname);
    }
    // get value from resources' selectbox
    const resSelectboxValue = resSelectbox.val();
    // is resources' selectbox value not the same as resource shortname from URL?
    if (collResPair) {
      if (resSelectboxValue !== collResPair) {
        // set collection|resource shortname pair from URL as the value of resources' selectbox
        const optionToBeSelected = resSelectbox.find(`option[value="${collResPair}"]`);
        if (optionToBeSelected.length === 1) {
          resSelectbox.val(collResPair);
        }
        else {
          resSelectbox[0].selectedIndex = 0;
        }
      }
    }
    else {
      resSelectbox[0].selectedIndex = 0;
    }

    // III. treat lines' selectbox
    
    // get lines' selectbox
    const linesSelectbox = tabSelectboxesContainer.find(`#lines-selectbox-${activeTabId}`);
    // get value of data-collection attr
    const collShortnameFromDom2 = linesSelectbox.attr('data-collection');
    // do we need to create new options els for lines selectbox?
    if (collectionShortname !== collShortnameFromDom2) {
      // create create new options els for lines selectbox
      const linesSelectboxOptionsEls = ParsedClassicsNavSelects.linesSelectboxOptions(collectionShortname);
      // remove old options els 
      const firstOption = linesSelectbox.find('option').first().clone(true);
      linesSelectbox.html('').append(firstOption);
      // append new options els and 
      // add data attr to selectbox to indicate collection whose line indicators selectbox contains
      linesSelectbox.append(linesSelectboxOptionsEls).attr('data-collection', collectionShortname)
    }
    // get value from lines' selectbox
    const linesSelectboxValue = linesSelectbox.val();
    if (collLinePair) {
      const optionToBeSelected = linesSelectbox.find(`option[value="${collLinePair}"]`);
      if (optionToBeSelected.length === 1) {
        linesSelectbox.val(collLinePair);
      }
      else {
        linesSelectbox[0].selectedIndex = 0;
      }
    }
    else {
      linesSelectbox[0].selectedIndex = 0;
    }
    
  },
  
};

const ParsedClassicsMorphology = {

  selectedWordMouseEnter: function(event, parsedTextContainerBottomPart) {
    const wordEl = $(event.target);
    const form = wordEl.attr(ParsedClassicsAppVars.formAttr);
    const partOfSpeech = wordEl.attr(ParsedClassicsAppVars.partOfSpeechAttr);
    const parsing = wordEl.attr(ParsedClassicsAppVars.parsingAttr);
    const lemma = wordEl.attr(ParsedClassicsAppVars.lemmaAttr);
    const parsingHtml = `<strong>${form}</strong> ${lemma}<br> ${partOfSpeech} ${parsing}`;
    parsedTextContainerBottomPart.html(parsingHtml);
  },

  selectedWordMouseLeave: function(parsedTextContainerBottomPart) {
    parsedTextContainerBottomPart.html("");
  },

};

const ParsedClassicsSelectedLine = {
  
  hashSelectLineAndWord: function(event, collectionShortname, container) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname];
    // get line indicator from URL
    const lineIndicatorFromUrl = collectionPointers[ParsedClassicsAppVars.lineMember] ?? null;
    // get lemma from URL
    const lemmaFromUrl = collectionPointers[ParsedClassicsAppVars.wordMember] ?? null;
    // get lexicon resource shortname from URL
    const lexiconInfoFromUrl = collectionPointers[ParsedClassicsAppVars.lexiconMember] ?? null;
    // get lexicon entru number from URL
    const lexiconEntryInfoFromUrl = collectionPointers[ParsedClassicsAppVars.lexiconEntryMember] ?? null;
    // get word position from URL
    const wordPositionFromUrl = collectionPointers[ParsedClassicsAppVars.wordPositionMember] ?? null;

    // get clicked el
    const clickedEl = $(event.target);

    // get word el
    const wordEl = clickedEl.hasClass(ParsedClassicsAppVars.wordClass) ? clickedEl : null;
    
    // get line el
    let lineEl = clickedEl;
    while (!lineEl.hasClass(ParsedClassicsAppVars.lineClass)) {
      lineEl = lineEl.parent();
    }

    // get prevoiusly selected line el
    const lineElPrev = container.find(`.${ParsedClassicsAppVars.selectedLineClass}`);
    //get line number el of prevoiusly selected line
    const lineNumberElPrev = lineElPrev.find(`.${ParsedClassicsAppVars.lineNumberClass}`);
    // get line indicator of prevoiusly selected line
    const lineIndicatorPrevFromDom = lineNumberElPrev.attr(ParsedClassicsAppVars.lineNumberAttr);

    // get line number el
    const lineNumberEl = lineEl.find(`.${ParsedClassicsAppVars.lineNumberClass}`);
    // get line indicator from DOM
    const lineIndicatorFromDom = lineNumberEl.attr(ParsedClassicsAppVars.lineNumberAttr);

    // do we need to change hash json? - wo do not if some el which is nor word el was clicked in the same line
    if (lineIndicatorPrevFromDom === lineIndicatorFromDom && !wordEl) {
      return;
    }

    // get lemma from DOM
    const lemmaFromDom = wordEl ? wordEl.attr(ParsedClassicsAppVars.lemmaAttr) : null;
    // get lexicon info from DOM
    const lexiconInfoFromDom = wordEl && typeof wordEl.attr(ParsedClassicsAppVars.lexiconAttr) !== 'undefined' ? wordEl.attr(ParsedClassicsAppVars.lexiconAttr) : null;
    // get lexicon entry info from DOM
    const lexiconEntryInfoFromDom = wordEl && typeof wordEl.attr(ParsedClassicsAppVars.lexiconEntryAttr) !== 'undefined' ? wordEl.attr(ParsedClassicsAppVars.lexiconEntryAttr) : null;
    // get word position from DOM
    let wordsOfSameLemma = [];
    let wordPositionFromDom = null;
    wordsOfSameLemma = lemmaFromDom ? lineEl.find(`span[${ParsedClassicsAppVars.lemmaAttr}="${lemmaFromDom}"]`): [];
    if (wordsOfSameLemma.length > 1) {
      wordPositionFromDom = wordsOfSameLemma.index(wordEl);
    }

    // update pointers obj
    if (lineIndicatorFromUrl !== lineIndicatorFromDom || lemmaFromUrl !== lemmaFromDom || lexiconInfoFromUrl !== lexiconInfoFromDom || lexiconEntryInfoFromUrl !== lexiconEntryInfoFromDom || wordPositionFromUrl !== wordPositionFromDom) {
      // put new line into pointers obj
      collectionPointers[ParsedClassicsAppVars.lineMember] = lineIndicatorFromDom;
      // put new lemma into pointers obj
      if (lemmaFromDom) {
        collectionPointers[ParsedClassicsAppVars.wordMember] = lemmaFromDom;
      }
      else {
        delete collectionPointers[ParsedClassicsAppVars.wordMember];
      }
      // put new lexicon info into pinters obj
      if (lexiconInfoFromDom) {
        collectionPointers[ParsedClassicsAppVars.lexiconMember] = lexiconInfoFromDom;
      }
      else {
        delete collectionPointers[ParsedClassicsAppVars.lexiconMember];
      }
      if (lexiconEntryInfoFromDom) {
        collectionPointers[ParsedClassicsAppVars.lexiconEntryMember] = lexiconEntryInfoFromDom;
      }
      else {
        delete collectionPointers[ParsedClassicsAppVars.lexiconEntryMember];
      }

      // put new word position into pinters obj
      if (Number.isInteger(wordPositionFromDom) && wordPositionFromDom >= 0) {
        collectionPointers[ParsedClassicsAppVars.wordPositionMember] = wordPositionFromDom;
      }
      else {
        delete collectionPointers[ParsedClassicsAppVars.wordPositionMember];
      }

      // stringify hash json
      const hashJsonString = JSON.stringify(hashJson);
      // push state
      history.pushState(null, "", `#${hashJsonString}`);
      // update layout
      ParsedClassicsLayout.update(hashJson); 
    }

  },

  // for resources of the type "Parsed text"
  treatSelectedLineAndWord: function(parsedTextContainerTopPart, collectionShortname) {  
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname];
    // get line indicator from URL
    const lineIndicatorFromUrl = collectionPointers[ParsedClassicsAppVars.lineMember] ?? null;
    // get lemma from URL
    const lemmaFromUrl = collectionPointers[ParsedClassicsAppVars.wordMember] ?? null;
    // get word position from URL
    const wordPositionFromUrl = collectionPointers[ParsedClassicsAppVars.wordPositionMember] ?? null;
    
    
    // find previous selected line
    const selectedLineEl = parsedTextContainerTopPart.find(`.${ParsedClassicsAppVars.selectedLineClass}`);
    
    // remove class "selected-line" from previously selected line
    selectedLineEl.removeClass(ParsedClassicsAppVars.selectedLineClass);
    // remove class "selected-word" from previously selected word
    const selectedWord = selectedLineEl.find(`.${ParsedClassicsAppVars.selectedWordClass}`);
    selectedWord.removeClass(ParsedClassicsAppVars.selectedWordClass);
    // find currently selected line
    const lineEl = parsedTextContainerTopPart.find(`span[${ParsedClassicsAppVars.lineNumberAttr}="${lineIndicatorFromUrl}"]`).parent();
    // add class "selected-line" to currently selected line
    lineEl.addClass(ParsedClassicsAppVars.selectedLineClass);

    // find currently selected word and add class "selected-word"
    let wordEl = lineEl.find(`span[${ParsedClassicsAppVars.lemmaAttr}="${lemmaFromUrl}"]`);
    if (wordEl.length > 1 && Number.isInteger(wordPositionFromUrl)) {
      wordEl = $(wordEl[wordPositionFromUrl]);
    }
    wordEl.first().addClass(ParsedClassicsAppVars.selectedWordClass);
  },

};

const ParsedClassicsInnerLink = {

  innerLinkClick: function(event, tabContentContainerInner, tabId) {
    
  
    // get clicked inner link el
    let innerLinkEl = $(event.target);
  
    // the case some <em> or <span> element inside inner link has been clicked
    if (!innerLinkEl.hasClass(ParsedClassicsAppVars.innerLinkClass)) {
      while (!innerLinkEl.hasClass(ParsedClassicsAppVars.innerLinkClass)) {
        innerLinkEl = innerLinkEl.parent();
      }
    }

    // get "data-anchor" attr, which contains "id" of the anchor el
    const anchorAttr = innerLinkEl.attr(ParsedClassicsAppVars.anchorAttr);

    // get anchor el, meke sure it's unique
    const anchorEl = tabContentContainerInner.find(`#${anchorAttr}`).first();

    // anchor el not found? then nothing to do except to display error message
    if (anchorEl.length != 1) {
      const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
      ParsedClassicsAlertDialogue.openDialogue(paneId, {
        heading: 'Not found',
        message: `The item ${innerLinkEl.text()} was not found.`,
      });
      return;
    }

    // scroll to top anchor el
    tabContentContainerInner.scrollTo(anchorEl, ParsedClassicsAppVars.animationSpeed);
  },

};

const ParsedClassicsAlertDialogue = {

  createDialogue: function(paneId) {
    // create alert dialogue html
    const alertDialogueHtml = ParsedClassicsAlertDialogue.createDialogueHtml(paneId);
    // create alert dialogue 
    const alertDialogue = $(alertDialogueHtml);
    // get close btn
    const closeButton = alertDialogue.find(`.${ParsedClassicsAppVars.dialogueCloseBtnClass}`);
    // bind func to close button
    closeButton.bind('click', () => {
      ParsedClassicsAlertDialogue.closeDialogueWithClick(alertDialogue);
    });
    return alertDialogue;
  },
  
  createDialogueHtml: function(paneId) {
    // create alert dialogue html
    const alertDialogueHtml = `
      <div id="alert-dialogue-${paneId}" class="pc-alert-dialogue">
        <div class="pc-modal-content">
          <div class="header"><div class="header-inner"><div class="header-text">Heading</div></div><div class="dialogue-close"><div class="${ParsedClassicsAppVars.dialogueCloseBtnClass}" title="Close dialogue"><img class="dialogue-close-img" src="img/close.svg" /></div></div></div>
          <div class="message-text pc-container pc-padding-16">
            Item not found
          </div>
        </div>
      </div>
    `;

    return alertDialogueHtml;
  },

  openDialogue: function(paneId, argObj) {
    const heading = argObj.heading;
    const message = argObj.message;

    // get alert dialogue
    const alertDialogue = $(`#alert-dialogue-${paneId}`);
    // insert heading
    alertDialogue.find(`.header-text`).text(heading);
    // insert message
    alertDialogue.find(`.message-text`).text(message);
    // display dialogue
    alertDialogue.show();
  },

  closeDialogueWithClick: function(alertDialogue) {
    alertDialogue.hide();
  },

  closeDialogueWithoutClick: function(paneId) {
    // get alert dialogue
    const alertDialogue = $(`#alert-dialogue-${paneId}`);
    alertDialogue.hide();
  },

};

