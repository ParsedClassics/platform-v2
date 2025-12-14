/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

const ParsedClassicsNavSelects = {

  createTabSelectsContainer: function(tabId) {
    // create tab selectboxes container html
    const containerHtml = `
      <div class="sm__tab-selects-container" id="tab-selects-container-${tabId}">
        <span class="menu-heading">Contents</span>
        <div class="sm__tab-selects-container-inner">
          <select class="sm-menu-selectbox" id="collections-selectbox-${tabId}" title="Select collection">
            <option disabled selected>Collection</option>
          </select>
          <select class="sm-menu-selectbox" id="resources-selectbox-${tabId}" title="Select resource">
            <option disabled selected>Resource</option>
          </select>
          <select class="sm-menu-selectbox" id="lines-or-pages-selectbox-${tabId}" title="Select line or page">
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

    // attach function to lines or pages selectbox
    const linesOrPagesSelectbox = container.find(`#lines-or-pages-selectbox-${tabId}`);
    linesOrPagesSelectbox.bind('change', function() {
      const selectboxValue = this.value;
      const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
      $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
      ParsedClassicsNavSelects.hashSelectLineOrParaOrPage(selectboxValue, tabId);
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

    // create lines or paragraphs or pages selectbox options els
    const {selectboxOptionsEls:textItemsSelectboxOptionsEls, titleAttrVal} = ParsedClassicsNavSelects.linesOrParaOrPagesSelectboxOptions(collectionShortname, tabId, linesOrPagesSelectbox);

    // add  selectbox options els to lines or pages selectbox
    // add data attr to selectbox to indicate collection whose line indicators selectbox contains
    linesOrPagesSelectbox.html('').append(textItemsSelectboxOptionsEls).attr('data-collection', collectionShortname);
    if (titleAttrVal) {
      linesOrPagesSelectbox.attr('title', titleAttrVal);
    }
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

  linesOrParaOrPagesSelectboxOptions: function(collectionShortname, tabId, linesOrPagesSelectbox) {
    // get collection's definition
    const collDef = ParsedClassicsCollDefs[collectionShortname];

    // get type of collection contents ("line", "page" or "word" or undefined) 
    const collContentsType = collDef['contents_type'];

    let selectboxOptionsEls;
    let titleAttrVal;
    if (typeof collContentsType === "undefined" || !collContentsType) { 
      // create selectbox option el "Lines or Pages"
      selectboxOptionsEls = ParsedClassicsNavSelects.emptySelectboxOptions();
      titleAttrVal = "Select verse, paragraph or page";
    }
    else if (collContentsType === "line") {
      // create lines selectbox options els
      selectboxOptionsEls = ParsedClassicsNavSelects.linesSelectboxOptions(collectionShortname);
      titleAttrVal = "Select verse";
    }
    else if (collContentsType === "paragraph") {
      // create lines selectbox options els
      selectboxOptionsEls = ParsedClassicsNavSelects.paragraphsSelectboxOptions(collectionShortname);
      titleAttrVal = "Select paragraph";
    }
    else if (collContentsType === "page") { 
      // create pages selectbox options els
      selectboxOptionsEls = ParsedClassicsNavSelects.pagesSelectboxOptions(collectionShortname, tabId, linesOrPagesSelectbox);
      titleAttrVal = "Select page";
    }
    else if (collContentsType === "word") {
      // lines or options selectbox should be hidden
      selectboxOptionsEls = null;
      titleAttrVal = null;
      // hide lines/pages selectbox
      linesOrPagesSelectbox.css('display', 'none');
    }
    return {selectboxOptionsEls, titleAttrVal};
  },

  linesSelectboxOptions: function(collectionShortname) {
    let selectboxOptionsHtml = '<option disabled>Verse</option>';
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

  paragraphsSelectboxOptions: function(collectionShortname) {
    let selectboxOptionsHtml = '<option disabled>Paragraph</option>';
    // get collection's definition
    const collDef = ParsedClassicsCollDefs[collectionShortname];
    // get collection's contents
    const collContents = collDef['contents'] ?? {};

    // get selected paragraph's number
    const selectedParagraphIndicator = ParsedClassicsLayout.getParagraphIndicatorFromUrl(collectionShortname);

    for (let key in collContents) {
      if (key.indexOf('levelstart-') === 0) {
        selectboxOptionsHtml += `<optgroup label="${collContents[key]}">\n`;
      }
      else if (key.indexOf('levelend-') === 0) {
        selectboxOptionsHtml += '</optgroup>\n';
      }
      else {
        // is paragraph selected?
        const selected = selectedParagraphIndicator === key ? 'selected' : '';
        selectboxOptionsHtml += `<option value="${collectionShortname}|${key}" ${selected}>${collContents[key]}</option>\n`;
      }
    }
    // create selectbox options els
    const selectboxOptionsEls = $(selectboxOptionsHtml);
    return selectboxOptionsEls;
  },

  pagesSelectboxOptions: function(collectionShortname, tabId, linesOrPagesSelectbox) {
    let selectboxOptionsHtml = '<option disabled>Page</option>';

    // get collection's definition
    const collDef = ParsedClassicsCollDefs[collectionShortname];

    // is resource selected in this tab?
    const {resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(tabId);

    // selectbox options should be generated only if resource is selected
    if (resourceShortname) {
      // get resource definition
      const resDef = collDef['resource_defs'][resourceShortname];
      // get resource type
      const resourceType = resDef['resource_type'];
      // get loaded resources data for current collection
      const loadedResDataOfCollection = APP.loadedResourcesData[collectionShortname];
      // get loaded data of current resouce
      const loadedDataOfResource = loadedResDataOfCollection[resourceShortname];
      // get contents of the resource
      const resourceContents = loadedDataOfResource['contents'];
      // get selected line's number
      let selectedPageIndicator = ParsedClassicsLayout.getPageIndicatorFromUrl(collectionShortname, tabId); 

      // create selectboxes <option> tags in case resource belongs to type "Reader"
      if (resourceType === 'reader') {
        if (selectedPageIndicator === 'title') {
          selectedPageIndicator = resourceContents.get('title');
        }

        for (let key of resourceContents.keys()) {
          // is page selected?
          if (key !== "title") {
            const selected = selectedPageIndicator === key ? ' selected="selected"' : '';
            selectboxOptionsHtml += `<option value="${key}"${selected}>${key} ${resourceContents.get(key)[1]}</option>\n`;
          }
        }
        // pages selectbox might be previously hidden, so make it visible
        linesOrPagesSelectbox.css('display', 'inline');
      }
      else {
        // hide pages selectbox
        linesOrPagesSelectbox.css('display', 'none');
      }
      
    }

    // create selectbox options els
    const selectboxOptionsEls = $(selectboxOptionsHtml);
    return selectboxOptionsEls;
  },

  emptySelectboxOptions: function() {
    let selectboxOptionsHtml = '<option disabled selected>Verse, paragraph or page</option>';
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
    const collResPairRemoved = paneLayout.splice(tabIndex, 1, collectionShortname);
    // get collection shortname of collectionShortname|resourceShortname pair removed from layout obj
    const collRemoved = collResPairRemoved[0].split('|')[0];
    // get array of collection|resource shortname pairs from URL
    let collResShortnamePairs = Object.values(layoutObj);
    // flatten array of collection|resource shortname pairs
    collResShortnamePairs = collResShortnamePairs.flat(2);
    // get arr of loaded collections
    let collectionsLoaded = [];
    collResShortnamePairs.forEach(collResPair => {
      collectionsLoaded.push(collResPair.split('|')[0]);
    });

    // is collection shortname of collectionShortname|resourceShortname pair removed from layout obj among collections which remain loaded?
    if (!collectionsLoaded.includes(collRemoved)) {
      // remove collection from pointers obj
      delete pointersObj[collRemoved];
    }

    // exists data about collection in pointers object?
    if (typeof pointersObj[collectionShortname] === 'undefined') {
      // add collection key in pointers object
      pointersObj[collectionShortname] = {};
      // save reference in variable
      const collectionPointers = pointersObj[collectionShortname];
      // get collection's definition
      const collDef = ParsedClassicsCollDefs[collectionShortname];
      // get type of collection contents ("lines" or "pages")
      const collContentsType = collDef['contents_type'];
      if (collContentsType === "line") {
        // selected line of just selected collection is "title"
        collectionPointers[ParsedClassicsAppVars.lineMember] = 'title';
      }

    }

    // treat color tags in pointers obj
    ParsedClassicsLayout.hashCollectionsTags(pointersObj);

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
    paneLayout.splice(tabIndex, 1, collResPair);

    // get collection shortname
    const collectionShortname = collResPair.split('|')[0];
    // get resource shortname
    const resourceShortname = collResPair.split('|')[1];
    // get collection's definition
    const collDef = ParsedClassicsCollDefs[collectionShortname];
    // get resource definition
    const resDef = collDef['resource_defs'][resourceShortname];
    // get type of collection contents ("lines" or "pages")
    const collContentsType = collDef['contents_type'];
    // get resource type
    const resType = resDef['resource_type'];
    // selected page of just selected resource is "title"
    if (collContentsType === "page" && resType === 'reader') {
      ParsedClassicsLayout.updatePageNumInPointersObj(pointersObj, collectionShortname, tabId, 'title');
    }

    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  hashSelectLineOrParaOrPage: function(selectboxValue, tabId) {
    // get selectded collection shortname and selected resource shortname
    const {collectionShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(tabId);

    // get collection's definition
    const collDef = ParsedClassicsCollDefs[collectionShortname];

    // get type of collection contents ("lines" or "pages")
    const collContentsType = collDef['contents_type'];

    if (collContentsType === "line") {
      ParsedClassicsNavSelects.hashSelectLine(selectboxValue);
    }
    else if (collContentsType === "paragraph") {
      ParsedClassicsNavSelects.hashSelectParagraph(selectboxValue);
    }
    else if (collContentsType === "page") {
      ParsedClassicsNavSelects.hashSelectPage(selectboxValue, tabId, collectionShortname);
    }
  },

  hashSelectLine: function(collLinePair) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get collection shortname
    const collectionShortname = collLinePair.split('|')[0];
    // get line indicator
    const lineIndicator = collLinePair.split('|')[1];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname];
    // change value of the key "line" with the line indicator which was selected
    collectionPointers[ParsedClassicsAppVars.lineMember] = lineIndicator;
    // delete key "word" from pointers obj
    delete collectionPointers[ParsedClassicsAppVars.wordMember];
    // delete key "wordpos" from pointers obj
    delete collectionPointers[ParsedClassicsAppVars.wordPositionMember];
    // delete key "lexicon" from pointers obj
    delete collectionPointers[ParsedClassicsAppVars.lexiconMember];
    // delete key "lexpos" from pointers obj
    delete collectionPointers[ParsedClassicsAppVars.lexiconEntryMember];

    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  hashSelectParagraph: function(collParaPair) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get collection shortname
    const collectionShortname = collParaPair.split('|')[0];
    // get paragraph indicator
    const paraIndicator = collParaPair.split('|')[1];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname];
    // change value of the key "paragraph" with the line indicator which was selected
    collectionPointers[ParsedClassicsAppVars.paragraphMember] = paraIndicator;

    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  hashSelectPage: function(selectboxValue, tabId, collectionShortname) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // update page number in pointers obj
    ParsedClassicsLayout.updatePageNumInPointersObj(pointersObj, collectionShortname, tabId, selectboxValue);

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
    // get collection's definition
    const collDef = ParsedClassicsCollDefs[collectionShortname];
    // get type of collection contents ("line", "page" or "word" or undefined)
    const collContentsType = collDef['contents_type'];

    let resourceContents;
    let resDef;
    let resource_type;
    if (collectionShortname && resourceShortname) {
      // get resource definition
      resDef = collDef['resource_defs'][resourceShortname];
      // get resource type
      resource_type = resDef['resource_type'];
      // get loaded resources data for current collection
      const loadedResDataOfCollection = APP.loadedResourcesData[collectionShortname];
      // get loaded data of current resouce
      const loadedDataOfResource = loadedResDataOfCollection[resourceShortname];
      // get contents of the resource
      resourceContents = loadedDataOfResource['contents'];
    }
    
    let lineIndicator;
    let collLinePair;
    let paraIndicator;
    let collParaPair;
    let pageIndicator;
    if (collContentsType == 'line') {
      // get selected line's indicator from URL
      lineIndicator = ParsedClassicsLayout.getLineIndicatorFromUrl(collectionShortname);
      // form collection and line indicator pipe delimited str
      collLinePair = collectionShortname && lineIndicator ? `${collectionShortname}|${lineIndicator}` : '';
    }
    else if (collContentsType == 'paragraph') {
      // get selected paragraph's indicator from URL
      paraIndicator = ParsedClassicsLayout.getParagraphIndicatorFromUrl(collectionShortname);
      // form collection and paragraph indicator pipe delimited str
      collParaPair = collectionShortname && paraIndicator ? `${collectionShortname}|${paraIndicator}` : '';
    }
    else if (collContentsType == 'page') {
      // get selected page's indicator from URL
      pageIndicator = ParsedClassicsLayout.getPageIndicatorFromUrl(collectionShortname, activeTabId);
    }

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

    // III. treat lines or pages selectbox
    
    // get lines or pages selectbox
    const linesOrPagesSelectbox = tabSelectboxesContainer.find(`#lines-or-pages-selectbox-${activeTabId}`);
    // get value of data-collection attr
    const collShortnameFromDom2 = linesOrPagesSelectbox.attr('data-collection');
    // get value of data-resource attr
    const resShortnameFromDom2 = linesOrPagesSelectbox.attr('data-resource');
    
    // do we need to create new options els for lines selectbox?
    if (collectionShortname !== collShortnameFromDom2 || (collContentsType == 'page' && resourceShortname != resShortnameFromDom2)) {
      // create new options els for lines or paragraphs or pages selectbox
      const {selectboxOptionsEls:textItemsSelectboxOptionsEls, titleAttrVal} = ParsedClassicsNavSelects.linesOrParaOrPagesSelectboxOptions(collectionShortname, activeTabId, linesOrPagesSelectbox);
      // append new options els 
      linesOrPagesSelectbox.html('').append(textItemsSelectboxOptionsEls);
      // add data attr to selectbox to indicate collection whose contents selectbox contains
      // add data attr to selectbox to indicate resource whose contents selectbox contains
      linesOrPagesSelectbox.attr('data-collection', collectionShortname).attr('data-resource', collectionShortname);
      // add tooltip to selectbox
      if (titleAttrVal) {
        linesOrPagesSelectbox.attr('title', titleAttrVal);
      }
    }
    // get selectbox value to be scrolled to
    let selectboxValue;
    if (collContentsType == 'line') {
      selectboxValue = collLinePair;
    }
    else if (collContentsType == 'paragraph') {
      selectboxValue = collParaPair;
    }
    else if (collContentsType == 'page' && resource_type == 'reader') {
      selectboxValue = pageIndicator;
      if (typeof resourceContents != 'undefined' && pageIndicator === 'title') {
        selectboxValue = resourceContents.get('title');
      }
    }
    // make selected the option el having selectbox value 
    if (selectboxValue) {
      const optionToBeSelected = linesOrPagesSelectbox.find(`option[value="${selectboxValue}"]`);
      if (optionToBeSelected.length === 1) {
        linesOrPagesSelectbox.val(selectboxValue);
      }
      else {
        linesOrPagesSelectbox[0].selectedIndex = 0;
      }
    }
    else {
      linesOrPagesSelectbox[0].selectedIndex = 0;
    }
  },
  
};

const ParsedClassicsOptionsSelects = {
  
  treatActiveTabOptionsContainer: function(activeTabId) {
    // get collection shortname and resource shortname from URL
    const {collectionShortname, resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // get pane options container
    let paneOptionsContainer = $(`#pane-options-container-${paneId}`);
    if (collectionShortname && resourceShortname) {
      // get collection's definition
      const collDef = ParsedClassicsCollDefs[collectionShortname];
      // get resource definition
      const resDef = collDef['resource_defs'][resourceShortname];
      // does resource have options?
      if (typeof resDef != 'undefined' && typeof resDef['extra'] != 'undefined' && typeof resDef['extra']['options'] != 'undefined') {
        // get tab options container
        let tabOptionsContainer = paneOptionsContainer.find(`div.sm__tab-options-container`);
        // create options container inner el
        let tabOptionsContainerInner = $(`<div class="sm__tab-options-container-inner" id="sm__tab-options-container-inner-${activeTabId}"><span class="menu-heading">Options</span></div>`);
        // append options widgets
        const options = resDef['extra']['options'];
        const optionsShortnamesArr = Object.keys(options);
        for (let i = 0; i < optionsShortnamesArr.length; i++) {
          let option_shortname = optionsShortnamesArr[i];
          const defaults = options[option_shortname]['defaults'];
          let widget = ParsedClassicsResourceOptions[option_shortname].widgetHtml(resourceShortname, activeTabId, defaults);
          tabOptionsContainerInner.append(widget);
        }
        tabOptionsContainer.html(tabOptionsContainerInner);
        paneOptionsContainer.show();
      }
      else {
        paneOptionsContainer.hide();
      }
    }
    else {
      paneOptionsContainer.hide();
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
    const parsingHtml = form || lemma || partOfSpeech || parsing ? `<strong>${form}</strong> ${lemma}<br> ${partOfSpeech} ${parsing}`: 'Morphological parsing not available';
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
    const collectionPointers = pointersObj[collectionShortname] ?? {};
    // get line indicator from URL
    const lineIndicatorFromUrl = typeof collectionPointers[ParsedClassicsAppVars.lineMember] !== 'undefined' ? collectionPointers[ParsedClassicsAppVars.lineMember] : null;
    // get lemma from URL
    const lemmaFromUrl = typeof collectionPointers[ParsedClassicsAppVars.wordMember] !== 'undefined' ? collectionPointers[ParsedClassicsAppVars.wordMember] : null;
    // get lexicon resource shortname from URL
    const lexiconInfoFromUrl = typeof collectionPointers[ParsedClassicsAppVars.lexiconMember] !== 'undefined' ? collectionPointers[ParsedClassicsAppVars.lexiconMember] : null;
    // get lexicon entry number from URL
    const lexiconEntryInfoFromUrl = typeof collectionPointers[ParsedClassicsAppVars.lexiconEntryMember] !== 'undefined' ? collectionPointers[ParsedClassicsAppVars.lexiconEntryMember] : null;
    // get word position from URL
    const wordPositionFromUrl = typeof collectionPointers[ParsedClassicsAppVars.wordPositionMember] !== 'undefined' ? collectionPointers[ParsedClassicsAppVars.wordPositionMember] : null;

    // get clicked el
    const clickedEl = $(event.target);

    // get word el
    const wordEl = clickedEl.hasClass(ParsedClassicsAppVars.wordClass) ? clickedEl : null;
    
    // get line el
    let lineEl = clickedEl;
    while (!lineEl.hasClass(ParsedClassicsAppVars.lineClass)) {
      lineEl = lineEl.parent();
    }

    // get previously selected line el
    const lineElPrev = container.find(`.${ParsedClassicsAppVars.selectedLineClass}`);
    //get line number el of prevoiusly selected line
    const lineNumberElPrev = lineElPrev.find(`.${ParsedClassicsAppVars.lineNumberClass}`);
    // get line indicator of previously selected line
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
    // get word form from DOM
    const formFromDom = wordEl ? wordEl.attr(ParsedClassicsAppVars.formAttr) : null;
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
      // put new word form into pointers obj
      if (formFromDom) {
        collectionPointers[ParsedClassicsAppVars.formMember] = formFromDom;
      }
      else {
        delete collectionPointers[ParsedClassicsAppVars.formMember];
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

      // put new word position into pointers obj
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

const ParsedClassicsSelectedParagraph = {

  hashSelectParagraph: function(event, collectionShortname, container) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname] ?? {};
    // get paragraph indicator from URL
    const paraIndicatorFromUrl = typeof collectionPointers[ParsedClassicsAppVars.paragraphMember] !== 'undefined' ? collectionPointers[ParsedClassicsAppVars.paragraphMember] : null;

    // get clicked el
    const clickedEl = $(event.target);

    // get paragraph el
    let paraEl = clickedEl;
    while (paraEl.prop("tagName").toLowerCase() !== 'p' && paraEl[0] !== document.body) {
      paraEl = paraEl.parent();
    }

    // get previously selected paragraph el
    const paraElPrev = container.find(`.${ParsedClassicsAppVars.selectedParagraphClass}`);
    //get paragraph number el of prevoiusly selected paragraph
    const paraNumberElPrev = paraElPrev.find(`.${ParsedClassicsAppVars.paragraphNumberClass}`);
    // get line indicator of previously selected line
    const paraIndicatorPrevFromDom = paraNumberElPrev.attr(ParsedClassicsAppVars.paragraphNumberAttr);

    // get paragraph number el
    const paraNumberEl = paraEl.find(`.${ParsedClassicsAppVars.paragraphNumberClass}`);
    // get paragraph indicator from DOM
    const paraIndicatorFromDom = paraNumberEl.attr(ParsedClassicsAppVars.paragraphNumberAttr);

    // do we need to change hash json? - wo do not if some el was clicked in the same paragraph
    if (paraIndicatorPrevFromDom === paraIndicatorFromDom) {
      return;
    }

    // update pointers obj - put new paragraph indicator into pointers obj
    collectionPointers[ParsedClassicsAppVars.paragraphMember] = paraIndicatorFromDom;

    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  // for resources of the type "Parsed text"
  treatSelectedParagraph: function(parsedTextContainerTopPart, collectionShortname) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname];

    // get paragraph indicator from URL
    const paraIndicatorFromUrl = collectionPointers[ParsedClassicsAppVars.paragraphMember] ?? null;

    // find previous selected paragraph
    const selectedParaEl = parsedTextContainerTopPart.find(`.${ParsedClassicsAppVars.selectedParagraphClass}`);

    // remove class "selected-para" from previously selected line
    selectedParaEl.removeClass(ParsedClassicsAppVars.selectedParagraphClass);

    // find currently selected paragraph
    const paraEl = parsedTextContainerTopPart.find(`span[${ParsedClassicsAppVars.paragraphNumberAttr}="${paraIndicatorFromUrl}"]`).parent().filter('p');
    // add class "selected-para" to currently selected line
    paraEl.addClass(ParsedClassicsAppVars.selectedParagraphClass);
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
      <div id="alert-dialogue-${paneId}" class="pc-dialogue">
        <div class="pc-modal-content">
          <div class="header"><div class="header-inner"><div class="header-text">Heading</div></div><div class="dialogue-close"><div class="${ParsedClassicsAppVars.dialogueCloseBtnOuterClass}"><div class="${ParsedClassicsAppVars.dialogueCloseBtnClass}" title="Close dialogue"><img class="dialogue-close-img" src="img/close.svg" /></div></div></div></div>
          <div class="message-text pc-container pc-padding-16">
            Item not found
          </div>
        </div>
      </div>
    `;

    return alertDialogueHtml;
  },

  openDialogue: function(paneId, argObj, callback) {
    const heading = argObj.heading;
    const message = argObj.message;

    // get alert dialogue
    const alertDialogue = $(`#alert-dialogue-${paneId}`);
    // insert heading
    alertDialogue.find(`.header-text`).text(heading);
    // insert message
    alertDialogue.find(`.message-text`).text(message);
    // get outer close button
    const closeButtonOuter = alertDialogue.find(`.${ParsedClassicsAppVars.dialogueCloseBtnOuterClass}`);
    // unbind click event
    closeButtonOuter.unbind("click");
    if (callback) {
      closeButtonOuter.bind('click', callback);
    }
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

const ParsedClassicsConfirmDialogue = {

  createConfirmDialogue: function(paneId) {
    // create confirm dialogue html
    const confirmDialogueHtml = ParsedClassicsConfirmDialogue.createConfirmDialogueHtml(paneId);
    // create confirm dialogue 
    const confirmDialogue = $(confirmDialogueHtml);
    // get close btn
    const closeButton = confirmDialogue.find(`.${ParsedClassicsAppVars.dialogueCloseBtnClass}`);
    // bind func to close button
    closeButton.bind('click', () => {
      ParsedClassicsConfirmDialogue.closeConfirmDialogueWithClick(confirmDialogue);
    });
    // get cancel button
    const cancelButton = confirmDialogue.find(`.${ParsedClassicsAppVars.dialogueCancelBtnClass}`);
    // bind func to cancel button
    cancelButton.bind('click', () => {
      ParsedClassicsConfirmDialogue.closeConfirmDialogueWithClick(confirmDialogue);
    });

    return confirmDialogue;
  },
  
  createConfirmDialogueHtml: function(paneId) {
    // create alert dialogue html
    const confirmDialogueHtml = `
      <div id="confirm-dialogue-${paneId}" class="pc-dialogue">
        <div class="pc-modal-content">
          <div class="header"><div class="header-inner"><div class="header-text">Confirm</div></div><div class="dialogue-close"><div class="${ParsedClassicsAppVars.dialogueCloseBtnOuterClass}"><div class="${ParsedClassicsAppVars.dialogueCloseBtnClass}" title="Close dialogue"><img class="dialogue-close-img" src="img/close.svg" /></div></div></div></div>
          <div class="message-text pc-container pc-padding-16">
            Confirm
          </div>
          <div class="pc-container pc-padding-bottom-16">
            <button class="dialogue-confirm-btn pc-action-button w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">
              OK
            </button>
            <div class="${ParsedClassicsAppVars.dialogueCancelBtnOuterClass}">
            <button class="dialogue-cancel-btn pc-action-button w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">
              Cancel
            </button>
            </div>
          </div>
        </div>
      </div>
    `;

    return confirmDialogueHtml;
  },

  openConfirmDialogue: function(paneId, argObj, callback, callback2) {
    const heading = argObj.heading;
    const message = argObj.message;

    // get confirm dialogue
    const confirmDialogue = $(`#confirm-dialogue-${paneId}`);
    // insert heading
    confirmDialogue.find(`.header-text`).text(heading);
    // insert message
    confirmDialogue.find(`.message-text`).text(message);
    // get confirm button
    const confirmButton = confirmDialogue.find(`.${ParsedClassicsAppVars.dialogueConfirmBtnClass}`);
    // unbind click event
    confirmButton.unbind("click");
    // bind callback to confirm button
    confirmButton.bind('click', callback);
    // get outer close button
    const closeButtonOuter = confirmDialogue.find(`.${ParsedClassicsAppVars.dialogueCloseBtnOuterClass}`);
    // unbind click event
    closeButtonOuter.unbind("click");
    if (callback2) {
      closeButtonOuter.bind('click', callback2);
    }
    // get outer cancel button
    const cancelButtonOuter = confirmDialogue.find(`.${ParsedClassicsAppVars.dialogueCancelBtnOuterClass}`);
    // unbind click event
    cancelButtonOuter.unbind("click");
    if (callback2) {
      cancelButtonOuter.bind('click', callback2);
    }
    // display dialogue
    confirmDialogue.show();
  },

  closeConfirmDialogueWithClick: function(confirmDialogue) {
    confirmDialogue.hide();
  },

  closeConfirmDialogueWithoutClick: function(paneId) {
    // get confirm dialogue
    const confirmDialogue = $(`#confirm-dialogue-${paneId}`);
    confirmDialogue.hide();
  }

};

ParsedClassicsConcordanceLinesButton = {

  btnClicked: function(event) {
    const button = $(event.target);
    const concordanceLine = button.parent();
    const linesList = concordanceLine.find(`.${ParsedClassicsAppVars.concordanceLinesListClass}`);
    if (button.hasClass(ParsedClassicsAppVars.concordanceLinesBtnCollapsedClass)) {
      button.removeClass(ParsedClassicsAppVars.concordanceLinesBtnCollapsedClass);
      button.addClass(ParsedClassicsAppVars.concordanceLinesBtnExpandedClass);
      linesList.show(ParsedClassicsAppVars.animationSpeed);
      linesList.css('display', 'block');
    }
    else if (button.hasClass(ParsedClassicsAppVars.concordanceLinesBtnExpandedClass)) {
      button.removeClass(ParsedClassicsAppVars.concordanceLinesBtnExpandedClass);
      button.addClass(ParsedClassicsAppVars.concordanceLinesBtnCollapsedClass);
      linesList.hide(ParsedClassicsAppVars.animationSpeed);
    }
  },

};

ParsedClassicsConcordanceLineRefButton = {

  btnClicked: function(event, concordanceContainerLeftPart, dependencyContainerTopPart, resourceShortname, resourceContents, activeTabId) {
    // get previously selected button el
    const buttonPrev = concordanceContainerLeftPart.find(`.${ParsedClassicsAppVars.concordanceLineRefBtnClass}.${ParsedClassicsAppVars.concordanceLineRefBtnSelectedClass}`);
    // get text of previously selected button el
    const buttonPrevText = buttonPrev.text();
    // get text contained in button
    const button = $(event.target);
    // get line number
    const lineIndicator = button.attr(ParsedClassicsAppVars.concordanceLineRefAttr);
    // get button text
    const buttonText = button.text();
    // new button clicked?
    if (buttonPrevText === buttonText) {
      return;
    }
    else {
      // remove selected class from previous button
      buttonPrev.removeClass(ParsedClassicsAppVars.concordanceLineRefBtnSelectedClass);
      // add selected class to currently clicked button
      button.addClass(ParsedClassicsAppVars.concordanceLineRefBtnSelectedClass);
    }
    // get abbreviated title of the book 
    const bookAbbr = buttonText.substring(0, buttonText.indexOf('\xa0'));
    // get shortname of the selected parsed text resource
    const resourceShortnameSelected = resourceContents[bookAbbr];
    // get shortname of the parsed text resource already loaded in container's right part
    const resourceShortnameLoaded = dependencyContainerTopPart.attr(ParsedClassicsAppVars.dependentResourceAttr);
    // get titles obj
    const titlesObj = resourceContents['titles'];
    // get all info about dependent resource
    const dependentResource = titlesObj[resourceShortnameSelected];
    // get data of dependent resource if available
    const dependentResourceData = typeof dependentResource['data'] !== 'undefined' ? dependentResource['data'] : null;
    // should selected dependent resource be loaded into container's right part and its data NOT available?
    if (resourceShortnameSelected !== resourceShortnameLoaded && !dependentResourceData) {
      // get url of the parsed text resource's data file
      const baseUrl = window.location.href.split(ParsedClassicsAppVars.rootFileName)[0];
      const dependentResourceUrl = baseUrl + ParsedClassicsAppVars.concordanceDir + resourceShortname + '/' + resourceShortnameSelected + '.js';
      const promises = [];
      promises.push(ParsedClassicsData.loadJs(dependentResourceUrl));
      Promise.allSettled(promises)
        .then((values) => {
          dependentResource['data'] = window[resourceShortnameSelected];
          delete window[resourceShortnameSelected];
          const dependentResourceHtml = ParsedClassicsConcordanceLineRefButton.createDependentResourceHtml(dependencyContainerTopPart, dependentResource);
          dependencyContainerTopPart.html(dependentResourceHtml);
          ParsedClassicsContentContainers.scrollToLineResourceLoading(dependencyContainerTopPart, lineIndicator, `${resourceShortnameSelected}-${activeTabId}`);
        })
        .catch((error) => {
          // This catch block will not be executed
          console.error(error);
        });
      return;
    }
    // should selected dependent resource be loaded into container's right part and its data IS available? +++++++++++++++++++++++
    else if (resourceShortnameSelected !== resourceShortnameLoaded && dependentResourceData) {
      const dependentResourceHtml = ParsedClassicsConcordanceLineRefButton.createDependentResourceHtml(dependencyContainerTopPart, dependentResource);
      dependencyContainerTopPart.html(dependentResourceHtml);
      ParsedClassicsContentContainers.scrollToLineResourceLoaded(dependencyContainerTopPart, lineIndicator, activeTabId);
      return;
    }
    // selected dependent resource IS ALREADY loaded into container's right part, so we just need to scroll to relevant line ++++++++++++++
    else if (resourceShortnameSelected === resourceShortnameLoaded) {
      ParsedClassicsContentContainers.scrollToLineResourceLoaded(dependencyContainerTopPart, lineIndicator, activeTabId);
      return;
    }
  },

  createDependentResourceHtml: function(dependencyContainerTopPart, dependentResource) {
    const html = `
      <div class="${ParsedClassicsAppVars.lineNumberClass} pc-padding-top-8" ${ParsedClassicsAppVars.lineNumberAttr}="title"></div>
      <h1>${dependentResource['author_orig']}</h1>
      <h1>${dependentResource['library_app_panel_title']}</h1>
      <span class="text-from">Text based on: ${dependentResource['library_app_panel_text_from']}</span>
    `;
    return html + dependentResource['data'];
  },

};

ParsedClassicsRefLink = {

  refLinkClick: function(event, refsContainerRightPart, bookAttrName) {

    // find clicked link 
    const clickedLink = $(event.target);
    
    // find grammar book's resource shortname
    const scannedBook = clickedLink.attr(bookAttrName);
    
    // find grammar book's page
    const bookPage = clickedLink.attr(ParsedClassicsAppVars.grammarPageAttr);

    if (scannedBook && bookPage) {
      // page number of scanned book
      const scannedPageNum = `#page/${bookPage}`;

      // display two or one page of scanned book?
      const pageDisplayMode = localStorage.getItem(scannedBook) ?? "/mode/2up";

      // form new scr for iframe
      const src = `./reader/embedded_bookreader.html?${scannedBook}${scannedPageNum}${pageDisplayMode}`;

      // get iframe
      const iframeEl = refsContainerRightPart.find('iframe');

      // set new "src" attr of the iframe (IMPORTANT! this cannot be done by iframeEl.attr("src", src) because it would add new entry in browser's history)
      iframeEl[0].contentWindow.location.replace(src);
    }
  },

}

ParsedClassicsSelectedLemma = {

  hashSelectLemma: function(event, collectionShortname) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname] ?? {};
    // get lemma from URL
    const lemmaFromUrl = typeof collectionPointers[ParsedClassicsAppVars.wordMember] !== 'undefined' ? collectionPointers[ParsedClassicsAppVars.wordMember] : null;

    // get clicked el
    const clickedEl = $(event.target);

    // get lemma button el 
    let lemmaButtonEl = clickedEl;
    while (!lemmaButtonEl.hasClass('lemma-button')) {
      lemmaButtonEl = lemmaButtonEl.parent();
    }

    // get lemma from DOM
    const lemmaFromDom = lemmaButtonEl.attr(ParsedClassicsAppVars.lemmaAttr);

    if (lemmaFromDom && lemmaFromUrl !== lemmaFromDom) {
      // put new lemma into pointers obj
      collectionPointers[ParsedClassicsAppVars.wordMember] = lemmaFromDom;
    }

    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  treatSelectedLemma: function(container, collectionShortname) {
    // get hash json
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    // get pointers obj
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    // get pointers of current collection
    const collectionPointers = pointersObj[collectionShortname];
    // get lemma from URL
    const lemmaFromUrl = collectionPointers[ParsedClassicsAppVars.wordMember] ?? null;

    // find previous selected lemma button
    const selectedLemmaButton = container.find(`div.${ParsedClassicsAppVars.selectedLemmaClass}`);
    // remove class "selected-lemma" from previously selected lemma button
    selectedLemmaButton.removeClass(ParsedClassicsAppVars.selectedLemmaClass);

    // find currently selected lemma button 
    let currLemmaButton = container.find(`div[${ParsedClassicsAppVars.lemmaAttr}="${lemmaFromUrl}"]`);
    // make sure found lemma button is unique
    currLemmaButton = currLemmaButton.first();
    // add class "selected-lemma"
    currLemmaButton.addClass(ParsedClassicsAppVars.selectedLemmaClass);
    // scrool into view in case lemma button is out of the sight
    if (!currLemmaButton.is(':in-viewport')) {
      container.scrollTo(currLemmaButton, ParsedClassicsAppVars.animationSpeed)
    }
  },

  filterByTyping: function(lemmaInput, tabId) {
    // remove red background search input might have
    lemmaInput.css('background', '');
    // get lemma, trim and put to lowercase
    let lemma = lemmaInput.val().trim().toLowerCase();
    // remove all non-letter chars 
    lemma = lemma.replace(/[^\p{Letter}]/igu, '');
    // normalize lemma, i.e. remove diacritics; from https://stackoverflow.com/questions/23346506/javascript-normalize-accented-greek-characters and https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    lemma = lemma.normalize('NFD').replace(/\p{Diacritic}/gu, "");

    // get lexicon split left inner el
    const lexiconSplitLeftInner = $(`#lexicon-split-left-inner-${tabId}`);

    // search for strings formed from inputted values, starting from longest string 
    // and reducing string by one char from the end
    for (let i = 0; i < lemma.length; i++) {
      const str_to_search = i == 0 ? lemma : lemma.slice(0, i*-1);
      // get first lemma button whose 'data-lemma' attr value matches string entered in search box
      const lemmaButton = $(`div[${ParsedClassicsAppVars.lemmaLowercaseAttr}^="${lemma}"]`).first();
      if (lemmaButton.length === 1) {
        lexiconSplitLeftInner.scrollTo(lemmaButton, 50);
        break;
      }
      // string entered does not match the start of any lemma, so let's show it by turning search input red
      else {
        lemmaInput.css('background', '#ffdddd');
      }
    }
  },

}


ParsedClassicsResourceOptions = {

  text_display_modes: {

    widgetHtml: function(resourceShortname, tabId, defaults) {
      const local_storage_key = `${resourceShortname}__text_display_modes`;
      const default_text_mode = defaults['display_text_as'];
      let text_mode = localStorage.getItem(local_storage_key);
      text_mode = text_mode ?? default_text_mode;
      const tabContentInner = $(`#tab-content-inner-${tabId}`);
      if (text_mode === 'lines') {
        tabContentInner.addClass('show-lines');
        tabContentInner.removeClass('show-paragraphs');
      }
      else if (text_mode === 'paragraphs') {
        tabContentInner.addClass('show-paragraphs');
        tabContentInner.removeClass('show-lines');
      }
      let widget = `
        <select class="sm-menu-selectbox" title="Page display options">
          <option disabled>Text display mode</option>
          <option value="lines"${text_mode == 'lines' ? ' selected' : ''}>Text as lines</option>
          <option value="paragraphs"${text_mode == 'paragraphs' ? ' selected' : ''}>Text as paragraphs</option>
        </select>
      `;
      widget = $(widget);
      widget.on('change', function() {
        const widgetEl = this;
        ParsedClassicsResourceOptions['text_display_modes'].onchange(resourceShortname, tabId, widgetEl);
      });
      return widget;
    },

    onchange: function(resourceShortname, tabId, widgetEl) {
      const selected_mode = $(widgetEl).val();
      const local_storage_key = `${resourceShortname}__text_display_modes`;
      localStorage.setItem(local_storage_key, selected_mode);
      const tabContentInner = $(`#tab-content-inner-${tabId}`);
      const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
      $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
      if (selected_mode === 'lines') {
        tabContentInner.addClass('show-lines');
        tabContentInner.removeClass('show-paragraphs');
      }
      else if (selected_mode === 'paragraphs') {
        tabContentInner.addClass('show-paragraphs');
        tabContentInner.removeClass('show-lines');
      }
    },

  },

  show_hide_lemmas_list: {

    widgetHtml: function(resourceShortname, tabId, defaults) {
      const local_storage_key = `${resourceShortname}__show_hide_lemmas_list`;
      const default_show_lemmas_list = defaults['show_lemmas_list'];
      let show_lemmas_list = localStorage.getItem(local_storage_key) ?? default_show_lemmas_list;
      const tabContentInner = $(`#tab-content-inner-${tabId}`);
      const iframe = tabContentInner.find('iframe.pc-bookreader'); 
      if (show_lemmas_list === 'yes') {
        iframe.css('position', '').css('left', 0);
        // display els which were hidden in order to avois flash of unstyled content
        tabContentInner.find(`div.gutter-horizontal`).css('visibility', 'visible');
        tabContentInner.find(`div.${ParsedClassicsAppVars.lexiconContainerLeftPartClass}`).css('visibility', 'visible');
      }
      else {
        iframe.css('position', 'absolute').css('left', 0);
      }
      let widget = `
        <select class="sm-menu-selectbox" title="Display or hide words list">
          <option disabled>Display or hide words list</option>
          <option value="yes"${show_lemmas_list === 'yes' ? ' selected' : ''}>Display words list</option>
          <option value="no"${show_lemmas_list === 'no' ? ' selected' : ''}>Hide words list</option>
        </select>
      `;
      widget = $(widget);
      widget.on('change', function() {
        const widgetEl = this;
        ParsedClassicsResourceOptions['show_hide_lemmas_list'].onchange(resourceShortname, tabId, widgetEl);
      });
      return widget;
    },

    onchange: function(resourceShortname, tabId, widgetEl) {
      const selected_val = $(widgetEl).val();
      const local_storage_key = `${resourceShortname}__show_hide_lemmas_list`;
      localStorage.setItem(local_storage_key, selected_val);
      const tabContentInner = $(`#tab-content-inner-${tabId}`);
      const iframe = tabContentInner.find('iframe.pc-bookreader');
      const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
      $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
      if (selected_val === 'yes') {
        iframe.css('position', '').css('left', 0);
        // display els which were hidden in order to avois flash of unstyled content
        tabContentInner.find(`div.gutter-horizontal`).css('visibility', 'visible');
        tabContentInner.find(`div.${ParsedClassicsAppVars.lexiconContainerLeftPartClass}`).css('visibility', 'visible');
      }
      else {
        iframe.css('position', 'absolute').css('left', 0);
      }
    },

  },

  show_hide_prosody: {
    
    widgetHtml: function(resourceShortname, tabId, defaults) {
      let widget = `
        <select class="sm-menu-selectbox" title="Prosody display options">
          <option disabled>Prosody</option>
          <option>Show prosody</option>
          <option>Hide prosody</option>
        </select>
      `;
      widget = $(widget);
      widget.on('change', function() {
        ParsedClassicsResourceOptions['show_hide_prosody'].onchange(tabId);
      });
      return widget;
    },

    onchange: function(resourceShortname, tabId, widgetEl) {
    },
  },

}
