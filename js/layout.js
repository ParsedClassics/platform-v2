/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

const ParsedClassicsLayout = {
  // member to hold all objects returned by Split.js script
  splitters: {},

  /*
    Main functions
  */

  //default first load
  firstLoad: function () {
    const storageJson = ParsedClassicsLayout.getHashJson("localStorage");
    const storageJsonValidation =
      ParsedClassicsLayout.layoutJsonValidate(storageJson);
    const hashJson = storageJsonValidation
      ? storageJson
      : ParsedClassicsLayout.getDefaultHashJson();
    const hashJsonStr = JSON.stringify(hashJson);
    history.replaceState(null, "", `#${hashJsonStr}`);
    ParsedClassicsLayout.update(hashJson);
  },

  // page load after popstate event
  popStateLoad: function () {
    const urlJson = ParsedClassicsLayout.getHashJson("url");
    const urlJsonValidation = ParsedClassicsLayout.layoutJsonValidate(urlJson);
    const hashJson = urlJsonValidation
      ? urlJson
      : ParsedClassicsLayout.getDefaultHashJson();
    urlJsonValidation
      ? ParsedClassicsLayout.update(hashJson)
      : alert("Invalid hash string!");
  },

  /*
    Split manipulation functions
  */

  update: function (hashJson) {
    // get layout obj
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];

    // find which data which is unneded and should be unloaded
    const {collectionsToUnload, resourcesToUnload} = ParsedClassicsData.findDataToUnLoad(layoutObj);
    // unload unneeded data
    ParsedClassicsData.unloadData(collectionsToUnload, resourcesToUnload);

    // find which data which is neded and should be loaded
    const {collectionsToLoad, resourcesToLoad} = ParsedClassicsData.findDataToLoad(layoutObj);

    // load needed data
    const collDataPromises = ParsedClassicsData.loadCollectionsDefs(collectionsToLoad);
    Promise.allSettled(collDataPromises)
      // collections data loaded successfully, so proceed to load resources data
      .then((values) => {

        const resDataPromises = ParsedClassicsData.loadResourcesData(resourcesToLoad, collectionsToLoad);
        Promise.allSettled(resDataPromises)
          .then((values) => {
            // append loaded resources data to APP.loadedResourcesData object
            ParsedClassicsData.appendLoadedResourceData(resourcesToLoad, collectionsToLoad);
            
            // get dimensions obj
            const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];

            // treat container according dimensionsObj
            ParsedClassicsLayout.treatContainer(dimensionsObj);
          })
          // resourcess data loaded unsuccessfully, so display error
          .catch((error) => {
            // This catch block will not be executed
            console.error(error);
          });

      })
      // collections data loaded unsuccessfully, so display error
      .catch((error) => {
        // This catch block will not be executed
        console.error(error);
      });
    
  },

  treatContainer: function (dimensionsObj) {
    // define vars
    const sectionsProcessed = [];

    // get container's splitter obj
    const containerId = `#${ParsedClassicsAppVars.containerId}`;
    ParsedClassicsLayout.splitters[containerId] =
      ParsedClassicsLayout.splitters[containerId] ?? null;

    // remove from DOM unneeded section(s), destroy container's splitter in case of section removal
    const removedSectionIds = ParsedClassicsLayout.removeSections(
      dimensionsObj,
      ParsedClassicsLayout.splitters[containerId]
    );

    // if there are removed sections, destroy splitter obj since it contains obsolete data
    if (
      ParsedClassicsLayout.splitters[containerId] &&
      removedSectionIds.length > 0
    ) {
      ParsedClassicsLayout.splitters[containerId].destroy();
      ParsedClassicsLayout.splitters[containerId] = null;
    }

    // get container
    const container = $(`.${ParsedClassicsAppVars.containerClass}`);

    // loop through dimensions obj
    for (let sectionCode in dimensionsObj) {
      // get data for single section
      const sectionData = dimensionsObj[sectionCode];
      const sectionId = sectionData[0][0];
      const pane1Id = sectionData[1][0];
      const tabIdsArr1 = sectionData[1][2];
      const activeTabIndex1 = sectionData[1][3];
      const pane2Id =
        typeof sectionData[2] !== "undefined" ? sectionData[2][0] : null;
      const tabIdsArr2 = typeof sectionData[2] !== "undefined" ? sectionData[2][2] : null;
      const activeTabIndex2 = typeof sectionData[2] !== "undefined" ? sectionData[2][3] : null;
      // get section
      const section = $(`#section-${sectionId}`);
      // section does not exist in DOM
      if (section.length === 0) {
        // destroy splitter obj
        if (ParsedClassicsLayout.splitters[containerId]) {
          ParsedClassicsLayout.splitters[containerId].destroy();
          ParsedClassicsLayout.splitters[containerId] = null;
        }
        // create new section
        const newSection = ParsedClassicsLayout.createSection(
          sectionId,
          pane1Id,
          pane2Id,
          tabIdsArr1,
          tabIdsArr2,
          activeTabIndex1,
          activeTabIndex2 
        );
        // section is the most left in container
        if (sectionsProcessed.length === 0) {
          container.prepend(newSection);
        }
        // section is not most left in container
        else {
          $(sectionsProcessed[sectionsProcessed.length - 1]).after(newSection);
        }
        //treat new section
        ParsedClassicsLayout.treatSection(newSection, sectionData);
        sectionsProcessed.push(newSection);
      }
      // section exists in DOM
      else if (section.length === 1) {
        // deal with section
        ParsedClassicsLayout.treatSection(section, sectionData);
        sectionsProcessed.push(section);
      }
    }
    // compile splitter params from dimensions obj
    const splitParams =
      ParsedClassicsLayout.getSplitParamsContainer(dimensionsObj);
    if (!ParsedClassicsLayout.splitters[containerId]) {
      // split container along sections and save splitter obj
      ParsedClassicsLayout.splitters[containerId] = Split(...splitParams);
    } else {
      const newDimensions = splitParams[1].sizes;
      ParsedClassicsLayout.splitters[containerId].setSizes(newDimensions);
    }
    ParsedClassicsLayout.treatButtons();
    ParsedClassicsLayout.treatZooms(dimensionsObj);
  },

  removeSections: function (dimensionsObj, splitterObj) {
    // define vars
    let sectionIdsFromDom = [];
    const sectionIdsFromObj = [];
    const removedSectionIds = [];

    // Step 1. find section ids present in DOM
    // i.e. get ids of the sections container splitter knows about
    if (splitterObj) {
      sectionIdsFromDom = splitterObj.getIds()[1];
    }

    // Step 2. find section ids present in dimensions obj
    for (let sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      sectionIdsFromObj.push(`#section-${sectionData[0][0]}`);
    }

    // Step 3. find each section id which present in DOM, but not present in dimensions obj and remove such section
    sectionIdsFromDom.forEach((id) => {
      if (!sectionIdsFromObj.includes(id)) {
        $(id).remove();
        removedSectionIds.push(id);
      }
    });

    return removedSectionIds;
  },

  getSplitParamsContainer: function (dimensionsObj) {
    // define vars
    const sectionIds = [];
    const sectionWidthsPc = [];
    // loop through dimensions obj
    for (let sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      const id = `#section-${sectionData[0][0]}`;
      const widthPc = sectionData[0][1];
      sectionIds.push(id);
      sectionWidthsPc.push(widthPc);
    }
    // create splitter options obj
    const optionsObj = {
      sizes: sectionWidthsPc,
      direction: "horizontal",
      gutterSize: ParsedClassicsAppVars.splitterSize,
      cursor: ParsedClassicsAppVars.horizontalSplitterCursor,
      snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
      onDragEnd: function (dimensions) {
        ParsedClassicsLayout.setDimentionsInContainer(sectionIds, dimensions);
      },
    };
    return [sectionIds, optionsObj];
  },

  setDimentionsInContainer: function (sectionIds, dimensions) {
    //define var
    const dimensionsObjNew = {};

    // get hash json, dimensions obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];

    const sectionCodes = Object.keys(dimensionsObj);
    for (let i = 0; i < sectionCodes.length; i++) {
      const sectionCode = sectionCodes[i];
      const sectionInfo = dimensionsObj[sectionCode];
      const sectionId = `#section-${sectionInfo[0][0]}`;
      for (let j = 0; j < sectionIds.length; j++) {
        if (sectionId === sectionIds[j]) {
          sectionInfo[0][1] = dimensions[j];
          dimensionsObjNew[sectionCode] = sectionInfo;
          break;
        }
      }
    }
    // update hash json
    hashJson[ParsedClassicsAppVars.dimensionsMember] = dimensionsObjNew;
    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  treatSection: function (section, sectionData) {
    // get section's splitter obj
    const sectionId = `#section-${sectionData[0][0]}`;
    const sectionIdStr = sectionData[0][0];
    ParsedClassicsLayout.splitters[sectionId] =
      ParsedClassicsLayout.splitters[sectionId] ?? null;

    // remove from DOM unneeded pane(s), destroy section's splitter in case of pane removal
    const removedPaneIds = ParsedClassicsLayout.removePanes(
      section,
      sectionData,
      ParsedClassicsLayout.splitters[sectionId]
    );

    if (
      ParsedClassicsLayout.splitters[sectionId] &&
      removedPaneIds.length > 0
    ) {
      ParsedClassicsLayout.splitters[sectionId].destroy();
      ParsedClassicsLayout.splitters[sectionId] = null;
    }

    // deal width section data arr
    const pane1Id = sectionData[1][0];
    const tabIdsArr1 = sectionData[1][2];
    const selectedTabIndex1 = sectionData[1][3];
    const pane2Id =
      typeof sectionData[2] !== "undefined" ? sectionData[2][0] : null;
    const tabIdsArr2 = typeof sectionData[2] !== "undefined" ? sectionData[2][2] : null;
    const selectedTabIndex2 = typeof sectionData[2] !== "undefined" ? sectionData[2][3] : null;

    // get panes
    let pane1 = $(`#pane-${pane1Id}`);
    let pane2 = pane2Id ? $(`#pane-${pane2Id}`) : null;

    // top pane does not exist?
    if (pane1.length === 0) {
      // desctroy splitter obj
      if (ParsedClassicsLayout.splitters[sectionId]) {
        ParsedClassicsLayout.splitters[sectionId].destroy();
        ParsedClassicsLayout.splitters[sectionId] = null;
      }
      // create new pane
      const newPane = ParsedClassicsLayout.createPane(sectionIdStr, pane1Id, tabIdsArr1, selectedTabIndex1);
      section.prepend(newPane);
      pane1 = newPane;
    }
    // bottom pane does not exist?
    if (pane2Id && pane2.length === 0) {
      // desctroy splitter obj
      if (ParsedClassicsLayout.splitters[sectionId]) {
        ParsedClassicsLayout.splitters[sectionId].destroy();
        ParsedClassicsLayout.splitters[sectionId] = null;
      }
      // create new pane
      const newPane = ParsedClassicsLayout.createPane(sectionIdStr, pane2Id, tabIdsArr2, selectedTabIndex2);
      section.append(newPane);
      pane2 = newPane;
    }

    // if top pane exists, treat its tabs
    if (pane1.length === 1) {
      ParsedClassicsLayout.treatTabs(pane1, tabIdsArr1, selectedTabIndex1);
    }
    // if bottom pane exists, treat its tabs
    if (pane2Id && pane2.length === 1) {
      ParsedClassicsLayout.treatTabs(pane2, tabIdsArr2, selectedTabIndex2);
    }

    // compile splitter params from section data arr
    const splitParams = ParsedClassicsLayout.getSplitParamsSection(sectionData);
    if (pane2Id && !ParsedClassicsLayout.splitters[sectionId]) {
      // split container along panes and save splitter obj
      ParsedClassicsLayout.splitters[sectionId] = Split(...splitParams);
    } else if (pane2Id && ParsedClassicsLayout.splitters[sectionId]) {
      const newDimensions = splitParams[1].sizes;
      ParsedClassicsLayout.splitters[sectionId].setSizes(newDimensions);
    }
  },

  removePanes: function (section, sectionData, splitterObj) {
    // define vars
    let paneIdsFromDom = [];
    const paneIdsFromObj = [];
    const removedPaneIds = [];

    // Step 1. find pane ids present in DOM
    // i.e. get ids of the panes section splitter knows about or ids of panes directly from DOM
    if (splitterObj) {
      paneIdsFromDom = splitterObj.getIds()[1];
    } else {
      const panes = section.find(`.${ParsedClassicsAppVars.paneClass}`);
      panes.each(function () {
        const id = $(this).attr("id");
        paneIdsFromDom.push(`#${id}`);
      });
    }

    // Step 2. find pane ids present in section data arr
    for (let i = 1; i < sectionData.length; i++) {
      paneIdsFromObj.push(`#pane-${sectionData[i][0]}`);
    }

    // Step 3. find each pane id which present in DOM, but not present in section data arr and remove such pane
    paneIdsFromDom.forEach((id) => {
      if (!paneIdsFromObj.includes(id)) {
        $(id).remove();
        removedPaneIds.push(id);
      }
    });

    return removedPaneIds;
  },

  getSplitParamsSection: function (sectionData) {
    // define vars
    const sectionId = `#section-${sectionData[0][0]}`;
    const paneIds = [];
    const paneWidthsPc = [];
    // loop through section data array
    for (let i = 1; i < sectionData.length; i++) {
      const id = `#pane-${sectionData[i][0]}`;
      const widthPc = sectionData[i][1];
      paneIds.push(id);
      paneWidthsPc.push(widthPc);
    }
    // create splitter option object
    const optionsObj = {
      sizes: paneWidthsPc,
      direction: "vertical",
      gutterSize: ParsedClassicsAppVars.splitterSize,
      cursor: ParsedClassicsAppVars.verticalSplitterCursor,
      snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
      onDragEnd: function (dimensions) {
        ParsedClassicsLayout.setDimentionsInSection(
          sectionId,
          paneIds,
          dimensions
        );
      },
    };
    return [paneIds, optionsObj];
  },

  setDimentionsInSection: function (sectionId, paneIds, dimensions) {
    // get hash json, dimensions obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];

    //define var
    const dimensionsObjNew = { ...dimensionsObj };

    const sectionCodes = Object.keys(dimensionsObj);
    for (let i = 0; i < sectionCodes.length; i++) {
      const sectionCode = sectionCodes[i];
      // get section info array
      const sectionInfo = dimensionsObj[sectionCode];
      // get section id
      const sectionIdFromURL = `#section-${sectionInfo[0][0]}`;
      if (sectionIdFromURL === sectionId && sectionInfo.length === 3) {
        if (
          `#pane-${sectionInfo[1][0]}` === paneIds[0] &&
          `#pane-${sectionInfo[2][0]}` === paneIds[1]
        ) {
          sectionInfo[1][1] = dimensions[0];
          sectionInfo[2][1] = dimensions[1];
          // update dimensions object
          dimensionsObjNew[sectionCode] = sectionInfo;
          break;
        }
      }
    }
    // update hash json
    hashJson[ParsedClassicsAppVars.dimensionsMember] = dimensionsObjNew;
    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  treatTabs: function(pane, tabIdsArr, activeTabIndex) { 
    // get tabbar
    const tabbar = pane.find(`.${ParsedClassicsAppVars.tabbarClass}`);
    // get pane bottom part
    const paneBottomPart = pane.find(`.${ParsedClassicsAppVars.paneBottomPartClass}`);
    // we got array of tab ids from URL
    const tabIdsArrUrl = tabIdsArr;
    // let's get array of tab ids from tab CONTENT ELS in DOM
    const tabIdsArrDom = [];
    let tabContentEls = pane.find(`.${ParsedClassicsAppVars.tabContentClass}`);
    for (let i = 0; i < tabContentEls.length; i++) {
      const id = $(tabContentEls[i]).attr('data-tab-content-id');
      tabIdsArrDom.push(id);
    }
    // let's get array of tab ids from TAB ELS in DOM
    const tabIdsArrDom2 = [];
    let tabEls = tabbar.find(`.${ParsedClassicsAppVars.tabClass}`);
    for (let i = 0; i < tabEls.length; i++) {
      const id = $(tabEls[i]).attr('data-tab-id');
      tabIdsArrDom2.push(id);
    }
    // do tab arrays consist of the same elements?
    let arraysSameMembers = ParsedClassicsLayout.arraysEqual(tabIdsArrUrl, tabIdsArrDom);
    // do tab arrays have the same order of elements
    let arraysSameOrder = ParsedClassicsLayout.arraysEqual(tabIdsArrUrl, tabIdsArrDom2, true);

    // get all tab ids from URL
    let allTabIdsFromURl = [];
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    for (var sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      for (let i = 1; i < sectionData.length; i++) {
        const tabIds = sectionData[i][2];
        allTabIdsFromURl = [...allTabIdsFromURl, ...tabIds];
      }
    }

    // get all tab ids from DOM
    let allTabIdsFromDom = [];
    const allTabContentElsFromDom = $(`.${ParsedClassicsAppVars.tabContentClass}`);
    for (let i = 0; i < allTabContentElsFromDom.length; i++) {
      const id = $(allTabContentElsFromDom[i]).attr('data-tab-content-id');
      allTabIdsFromDom.push(id);
    }

    // find tab ids from DOM pane which are not present in URL in any pane (not present in Url at all)
    const tabIdsFromDom_NotInURl = tabIdsArrDom.filter(tabId => !allTabIdsFromURl.includes(tabId));

    // find tab ids from DOM pane which are present in URL in any pane except current pane
    const tabIdsFromDom_InOtherPaneInUrl = tabIdsArrDom.filter(tabId => allTabIdsFromURl.includes(tabId) && !tabIdsArr.includes(tabId));

    // find tab ids from URL pane which are present in DOM in other panes
    const tabIdsFromURL_InOtherPaneInDom = tabIdsArrUrl.filter(tabId => tabIdsArr.includes(tabId) && !tabIdsArrDom.includes(tabId) && allTabIdsFromDom.includes(tabId));

    // find tab ids from URL pane which are not present in DOM in other panes
    const tabIdsFromURL_NotInDom = tabIdsArrUrl.filter(tabId => tabIdsArr.includes(tabId) && !allTabIdsFromDom.includes(tabId));

    // I. change tab order if needed
    
    // tab ids from URL and tab ids from DOM are the same, but in different order, so let's change tab order in DOM
    if (arraysSameMembers && !arraysSameOrder) {
      for (let i = 0; i < tabIdsArrUrl.length; i++) {
        const tab = $(`#tab-${tabIdsArrUrl[i]}`);
        tabbar.append(tab);
      }
    }

    // II. delete tabs if needed

    // tab ids from URL and tab ids from DOM are not the same and there are in Dom tabs which are not present in Url
    if (!arraysSameMembers && tabIdsFromDom_NotInURl.length > 0) {
      for (let i = 0; i < tabIdsFromDom_NotInURl.length; i++) {
        ParsedClassicsTabs.closeTab(tabIdsFromDom_NotInURl[i]);
      }
    }

    // III. move tabs from current to other panes if needed

    // tab ids from URL and tab ids from DOM are not the same and there are tab ids from pane in DOM which are present in URL in any pane except current pane
    if (!arraysSameMembers && tabIdsFromDom_InOtherPaneInUrl.length > 0) {
      for (let i = 0; i < tabIdsFromDom_InOtherPaneInUrl.length; i++) {
        const tabIdToMove = tabIdsFromDom_InOtherPaneInUrl[i];
        // get id of pane into which tab should be moved
        const paneIdTo = ParsedClassicsLayout.getPaneIdFromUrl(tabIdToMove);
        const paneTo = $(`#pane-${paneIdTo}`)
        const tabbarTo = paneTo.find(`.${ParsedClassicsAppVars.tabbarClass}`);
        const paneBottomPartTo = paneTo.find(`.${ParsedClassicsAppVars.paneBottomPartClass}`);
        const paneTopPartTo = paneTo.find(`.${ParsedClassicsAppVars.paneTopPartClass}`);
        const tabIndexNew = ParsedClassicsLayout.getTabIndexFromUrl(tabIdToMove);
        ParsedClassicsTabs.moveTabBetweenPanes(tabIdToMove, tabbarTo, paneTopPartTo, paneBottomPartTo, tabIndexNew);
      }
    }

    // IV. move tabs from other panes to current pane if needed

    // tab ids from URL and tab ids from DOM are not the same and there are tab ids in URL in current pane which are in DOM in the panes
    if (!arraysSameMembers && tabIdsFromURL_InOtherPaneInDom.length > 0) {
      for (let i = 0; i < tabIdsFromURL_InOtherPaneInDom.length; i++) {
        const tabIdToMove = tabIdsFromURL_InOtherPaneInDom[i];
        const paneTo = pane;
        const tabbarTo = paneTo.find(`.${ParsedClassicsAppVars.tabbarClass}`);
        const paneBottomPartTo = paneTo.find(`.${ParsedClassicsAppVars.paneBottomPartClass}`);
        const paneTopPartTo = paneTo.find(`.${ParsedClassicsAppVars.paneTopPartClass}`);
        const tabIndexNew = ParsedClassicsLayout.getTabIndexFromUrl(tabIdToMove);
        ParsedClassicsTabs.moveTabBetweenPanes(tabIdToMove, tabbarTo, paneTopPartTo, paneBottomPartTo, tabIndexNew);
      }
    }

    // V. Create tabs if needed

    // tab ids from URL and tab ids from DOM are not the same and there are tab ids in URL in current pane which are not in DOM in any pane
    if (!arraysSameMembers && tabIdsFromURL_NotInDom.length > 0) {
      for (let i = 0; i < tabIdsFromURL_NotInDom.length; i++) {
        const paneTo = pane;
        const tabIdToCreate = tabIdsFromURL_NotInDom[i];
        const {collectionShortname, resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(tabIdToCreate);
        // get title of the resource to be used in the tab
        const resourceDef = ParsedClassicsData.getResourceDef(collectionShortname, resourceShortname);
        const resourceTitle = resourceDef['library_app_selectbox_title'];
        const collectionDef = ParsedClassicsCollDefs[collectionShortname];
        const collectionTitle = collectionDef['collection_selectboxname'];
        const tabTitle = resourceTitle + (collectionTitle ?  ' | ' + collectionTitle : '');
        // get index of the tab to be created
        const tabIndexToCreate = ParsedClassicsLayout.getTabIndexFromUrl(tabIdToCreate);
        ParsedClassicsTabs.addTab(paneTo, tabIdToCreate, tabTitle, tabIndexToCreate);
      }
    }
    

    // VI. activate needed tab
    // let's again get array of tab ids from TAB ELS in DOM
    tabIdsArrDom.length = 0;
    tabs = pane.find(`.${ParsedClassicsAppVars.tabClass}`);
    for (let i = 0; i < tabs.length; i++) {
      const id = $(tabs[i]).attr('data-tab-id');
      tabIdsArrDom.push(id);
    }

    //  do tab arrays consist of the same elements?
    arraysSameMembers = ParsedClassicsLayout.arraysEqual(tabIdsArrUrl, tabIdsArrDom);
    // do tab arrays have the same order of elements
    arraysSameOrder = ParsedClassicsLayout.arraysEqual(tabIdsArrUrl, tabIdsArrDom, true);
    if (arraysSameMembers && arraysSameOrder) {
      // get tab to be activated
      const tabToActivate = activeTabIndex > 0 || activeTabIndex === 0 ? $(tabs[activeTabIndex]) : null;

      // change tab's title
      if (tabToActivate) {
        const tabToActivateId = tabToActivate.attr('data-tab-id');
        const {collectionShortname, resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(tabToActivateId);
        const tabTitle = ParsedClassicsTabs.createTabTitle(collectionShortname, resourceShortname);
        tabToActivate.find('.tab__text').text(tabTitle);
        tabToActivate.attr('title', tabTitle);
      }
      // there might be several active tabs in tabbar (after moving of tab)
      const activeTabs = tabs.filter(`.${ParsedClassicsAppVars.tabActiveClass}`);
      // activate needed tab, if such tab exists (there might be no tabs in tabbar)
      if (tabToActivate && tabToActivate.length === 1 && (!tabToActivate.hasClass(ParsedClassicsAppVars.tabActiveClass) || activeTabs.length > 1)) {
        ParsedClassicsTabs.activateTab(null, tabToActivate);
      }
    }

    // VII. treat active tab's selecboxes container
    const activeTabId = activeTabIndex > 0 || activeTabIndex === 0 ? tabIdsArr[activeTabIndex] : null;
    if (activeTabId) {
      ParsedClassicsNavSelects.treatActiveTabSelectboxesContainer(pane, activeTabId);
    }
    

    // VIII. treat active tab's contents container
    if (activeTabId) {
      ParsedClassicsContentContainers.treatActiveTabContentContainer(pane, activeTabId);
    }
    
  },

  treatButtons: function () {
    const sections = $(`.${ParsedClassicsAppVars.sectionClass}`);
    const panes = $(`.${ParsedClassicsAppVars.paneClass}`);
    // if only one pane has left, remove "close pane" button and "maximize pane"
    if (panes.length === 1) {
      $(`.${ParsedClassicsAppVars.closePaneBtnClass}`).hide();
      $(`.${ParsedClassicsAppVars.maximizePaneBtnClass}`).hide();
    }
    // if there are only one or two sections and two panes, make sure "Close pane" buttons are visible
    if (sections.length <= 2 && panes.length === 2) {
      $(`.${ParsedClassicsAppVars.closePaneBtnClass}`).show();
      $(`.${ParsedClassicsAppVars.maximizePaneBtnClass}`).show();
    }
    // if there are two panes in section, remove "Open pane on top" and "Open pane in bottom" buttons from that section
    // if there is one panes in section, make sure "Open pane on top" and "Open pane in bottom" buttons are visible
    for (let i = 0; i < sections.length; i++) {
      const panesInSection = $(sections[i]).find(
        `.${ParsedClassicsAppVars.paneClass}`
      );
      if (panesInSection.length === 2) {
        panesInSection
          .find(`.${ParsedClassicsAppVars.addTopPaneBtnClass}`)
          .hide();
        panesInSection
          .find(`.${ParsedClassicsAppVars.addBottomPaneBtnClass}`)
          .hide();
      } else if (panesInSection.length === 1) {
        panesInSection
          .find(`.${ParsedClassicsAppVars.addTopPaneBtnClass}`)
          .show();
        panesInSection
          .find(`.${ParsedClassicsAppVars.addBottomPaneBtnClass}`)
          .show();
      }
    }
  },

  treatZooms: function (dimensionsObj) {
    let zoomInPaneId = null;
    // get all section codes
    const sectionCodes = Object.keys(dimensionsObj);
    // loop through section codes
    for (let i = 0; i < sectionCodes.length; i++) {
      const sectionCode = sectionCodes[i];
      // get section data
      const sectionData = dimensionsObj[sectionCode];
      // loop through section data
      for (let j = 1; j < sectionData.length; j++) {
        // get pane data
        const paneData = sectionData[j];
        // should pane be maximized?
        if (typeof paneData[4] !== "undefined" && paneData[4] === "max") {
          // get id of the pane to be maximized
          zoomInPaneId = paneData[0];
          break;
        }
      }
      if (zoomInPaneId) {
        break;
      }
    }
    // we have id of the pane to be maximized
    if (zoomInPaneId) {
      const paneToZoomIn = $(`#pane-${zoomInPaneId}`);
      // add class to the pane el
      paneToZoomIn.addClass(ParsedClassicsAppVars.paneMaximizedClass);
      // treat buttons
      paneToZoomIn
        .find(
          `.${ParsedClassicsAppVars.addTopPaneBtnClass}, .${ParsedClassicsAppVars.addRightSectionBtnClass}, .${ParsedClassicsAppVars.addLeftSectionBtnClass}, .${ParsedClassicsAppVars.addBottomPaneBtnClass}, .${ParsedClassicsAppVars.closePaneBtnClass}, .${ParsedClassicsAppVars.maximizePaneBtnClass}`
        )
        .addClass(ParsedClassicsAppVars.layoutBtnHideClass);
      paneToZoomIn
        .find(`.${ParsedClassicsAppVars.minimizePaneBtnClass}`)
        .removeClass(ParsedClassicsAppVars.layoutBtnHideClass);
    }
    // we do not have the pane to be maximized, but perhaps we have the pane to be minimized?
    else {
      const paneToZoomOut = $(`.${ParsedClassicsAppVars.paneMaximizedClass}`);
      paneToZoomOut.removeClass(ParsedClassicsAppVars.paneMaximizedClass);
      // treat buttons
      paneToZoomOut
        .find(
          `.${ParsedClassicsAppVars.addTopPaneBtnClass}, .${ParsedClassicsAppVars.addRightSectionBtnClass}, .${ParsedClassicsAppVars.addLeftSectionBtnClass}, .${ParsedClassicsAppVars.addBottomPaneBtnClass}, .${ParsedClassicsAppVars.closePaneBtnClass}, .${ParsedClassicsAppVars.maximizePaneBtnClass}`
        )
        .removeClass(ParsedClassicsAppVars.layoutBtnHideClass).css('display', 'flex');
      paneToZoomOut
        .find(`.${ParsedClassicsAppVars.minimizePaneBtnClass}`)
        .addClass(ParsedClassicsAppVars.layoutBtnHideClass);
    }
  },

  /*
    Button functions
  */

  hashInsertSection: function (sectionId, position) {
    
    // define vars
    let sectionData;
    const newDimensionsObj = {};
    const newLayoutObj = {};

    // alias for func to generate unique ids
    const id = ParsedClassicsLayout.generateUID;

    // get hash json, dimensions obj and layout obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];

    // loop through dimentions obj and get section data of needed section
    for (var sectionCode in dimensionsObj) {
      sectionData = dimensionsObj[sectionCode];
      if (sectionData[0][0] === sectionId) {
        break;
      }
    }

    // get values of dimensions obj and values of layout obj
    const dimensionsObjVals = Object.values(dimensionsObj);
    const layoutObjVals = Object.values(layoutObj);

    // get index of section code of needed section
    const sectionCodesArr = ParsedClassicsLayout.createSectionCodesArr();
    const index = sectionCodesArr.indexOf(sectionCode);

    // get insertion index of the section to be inserted
    const insertIndex = position === "left" ? index : index + 1;

    // calculate width of the section to be inserted
    const newSectionPcWidth = 100 / (dimensionsObjVals.length + 1);
    // get proportion how much all existing sections should be made smaller to make space for the new section
    const proportion = (100 - newSectionPcWidth) / 100;
    // apply proportion to all sections which are present in DOM
    dimensionsObjVals.forEach((sectionData) => {
      sectionData[0][1] = sectionData[0][1] * proportion;
    });
    // put data about new section among data of other sections
    dimensionsObjVals.splice(insertIndex, 0, [
      [id(), newSectionPcWidth],
      [id(), 100, [id()], 0],
    ]);
    layoutObjVals.splice(insertIndex, 0, [[`${ParsedClassicsAppVars.newTabCollectionShortname}|${ParsedClassicsAppVars.newTabResourceShortname}`]]);
    // put updated info about sections into new dimensions obj
    dimensionsObjVals.forEach((sectionData, i) => {
      const sectionCode = sectionCodesArr[i];
      newDimensionsObj[sectionCode] = sectionData;
    });
    // put updated info about sections into new layout obj
    layoutObjVals.forEach((sectionData, i) => {
      const sectionCode = sectionCodesArr[i];
      newLayoutObj[sectionCode] = sectionData;
    });
    // update hash json
    hashJson[ParsedClassicsAppVars.dimensionsMember] = newDimensionsObj;
    hashJson[ParsedClassicsAppVars.layoutMember] = newLayoutObj;
    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  hashInsertPane: function (sectionId, position) {
    
    // define vars
    let sectionData, layoutData;

    // alias for func to generate unique ids
    const id = ParsedClassicsLayout.generateUID;

    // get hash json, dimensions obj and layout obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];

    // loop through dimensions obj and get section data and layout data of needed section
    for (var sectionCode in dimensionsObj) {
      sectionData = dimensionsObj[sectionCode];
      layoutData = layoutObj[sectionCode];
      if (sectionData[0][0] === sectionId) {
        break;
      }
    }
    // is only one pane in section?
    if (sectionData.length === 2) {
      // generare new id
      const newPaneId = id();
      // get insertion index for dimensions obj
      const index = position === "top" ? 1 : 2;
      // get insertion index for layout obj
      const index2 = position === "top" ? 0 : 1;
      // height og new pane will be 50%
      sectionData[1][1] = 50;
      // update section data
      sectionData.splice(index, 0, [newPaneId, 50, [id()], 0]);
      // update layout data
      layoutData.splice(index2, 0, [`${ParsedClassicsAppVars.newTabCollectionShortname}|${ParsedClassicsAppVars.newTabResourceShortname}`]);
      // update dimensions obj
      dimensionsObj[sectionCode] = sectionData;
      // update layout obj
      layoutObj[sectionCode] = layoutData;
      // update hash json
      hashJson[ParsedClassicsAppVars.dimensionsMember] = dimensionsObj;
      hashJson[ParsedClassicsAppVars.layoutMember] = layoutObj;
      // stringify hash json
      const hashJsonString = JSON.stringify(hashJson);
      // push state
      history.pushState(null, "", `#${hashJsonString}`);
      // update layout
      ParsedClassicsLayout.update(hashJson);
    }
  },

  hashRemovePane: function (sectionId, paneId) {
    
    // get hash json, dimensions obj and layout obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];

    // get section code of the pane which should be removed
    let sectionCode, sectionDimentions, sectionLayout, sectionWidthPc;
    for (const key in dimensionsObj) {
      sectionDimentions = dimensionsObj[key];
      sectionWidthPc = sectionDimentions[0][1];
      sectionLayout = layoutObj[key];
      if (sectionDimentions[0][0] === sectionId) {
        sectionCode = key;
        break;
      }
    }

    if (sectionCode) {
      // get index of the pane which should be removed
      let paneIndex;
      for (let i = 1; i < sectionDimentions.length; i++) {
        if (sectionDimentions[i][0] === paneId) {
          paneIndex = i;
        }
      }

      if (paneIndex) {
        
        // get array of collection|resource shortname pairs from URL
        let collResShortnamePairs = Object.values(layoutObj);
        // flatten array of collection|resource shortname pairs
        collResShortnamePairs = collResShortnamePairs.flat(2);
        
        // remove pane data from section dimensions object
        sectionDimentions.splice(paneIndex, 1);
        // remove pane data from layout object
        let collResPairsRemoved = sectionLayout.splice(paneIndex - 1, 1);
        // get arr of collectionShortname|resourceShortname pairs which were removed
        collResPairsRemoved = collResPairsRemoved.flat();
        
        // if in section dimensions object only info about the section was left
        if (sectionDimentions.length === 1) {
          // (a) remove such section dimentions object from dimentions object
          delete dimensionsObj[sectionCode];
          // (b) remove such section from layout object
          delete layoutObj[sectionCode];
          // (c) recalculate widths of the remaining sections
          const proportion = sectionWidthPc / (100 - sectionWidthPc) + 1;
          let sectionInfo;
          for (const key in dimensionsObj) {
            sectionInfo = dimensionsObj[key];
            sectionInfo[0][1] = sectionInfo[0][1] * proportion;
          }
        }
        // if in sections dimensions object info about one pane was left
        if (sectionDimentions.length === 2) {
          // (a) pane height must be 100%
          sectionDimentions[1][1] = 100;
        }

        // recalculate section codes in dimensions object and in layout object
        const newDimensionsObj = {};
        const newLayoutObj = {};
        const sectionCodesArr = ParsedClassicsLayout.createSectionCodesArr();
        const dimensionsObjVals = Object.values(dimensionsObj);
        dimensionsObjVals.forEach((sectionData, i) => {
          const sectionCode = sectionCodesArr[i];
          newDimensionsObj[sectionCode] = sectionData;
        });
        const layoutObjVals = Object.values(layoutObj);
        layoutObjVals.forEach((sectionData, i) => {
          const sectionCode = sectionCodesArr[i];
          newLayoutObj[sectionCode] = sectionData;
        });

        // remove from pointers object collections which were removed by closing pane 
        const collsToBeRemovedFromPointersObj = ParsedClassicsLayout.findCollsToBeRemovedFromPointersObj(collResShortnamePairs, collResPairsRemoved);
        // deep copy of section pointers data
        const newPointersObj = JSON.parse(JSON.stringify(pointersObj));
        // remove unneeded collections from pointers obj
        collsToBeRemovedFromPointersObj.forEach(collectionShortname => delete newPointersObj[collectionShortname]);

        // update hash json
        hashJson[ParsedClassicsAppVars.dimensionsMember] = newDimensionsObj;
        hashJson[ParsedClassicsAppVars.layoutMember] = newLayoutObj;
        hashJson[ParsedClassicsAppVars.pointersMember] = newPointersObj;
        // stringify hash json
        const hashJsonString = JSON.stringify(hashJson);
        // push state
        history.pushState(null, "", `#${hashJsonString}`);
        // update layout
        ParsedClassicsLayout.update(hashJson);
      }
    }
  },

  hashZoomPane: function (sectionId, paneId, direction) {
    
    // define vars
    let sectionData, sectionDataFound, paneData;

    // get hash json, dimensions obj and layout obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];

    // loop through dimensions obj and get section data and layout data of needed section
    for (var sectionCode in dimensionsObj) {
      sectionData = dimensionsObj[sectionCode];
      if (sectionData[0][0] === sectionId) {
        sectionDataFound = true;
        break;
      }
    }

    if (sectionDataFound) {
      // deep copy of section data
      const sectionDataNew = JSON.parse(JSON.stringify(sectionData));
      // find needed pane
      for (let i = 1; i < sectionDataNew.length; i++) {
        paneData = sectionDataNew[i];
        if (paneData[0] === paneId) {
          // update pane data
          if (direction === "in") {
            paneData[4] = "max";
          } else {
            paneData.splice(4);
          }
          break;
        }
      }
      // update dimensions obj
      dimensionsObj[sectionCode] = sectionDataNew;
      // update hash json
      hashJson[ParsedClassicsAppVars.dimensionsMember] = dimensionsObj;
      // stringify hash json
      const hashJsonString = JSON.stringify(hashJson);
      // push state
      history.pushState(null, "", `#${hashJsonString}`);
      // update layout
      ParsedClassicsLayout.update(hashJson);
    }
  },

  hashActivateTab: function(tabId) {
    // get tab
    const tab = $(`#tab-${tabId}`);
    // is tab already active?
    if (tab.hasClass(ParsedClassicsAppVars.tabActiveClass)) {
      // tab is already active, so nothing to do
      return;
    }

    // get hash json, dimensions obj and layout obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];

    // loop through dimensions obj and get pane data of needed pane
    let paneDataFound = false;
    let sectionDataNew;
    for (var sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      // deep copy of section data
      sectionDataNew = JSON.parse(JSON.stringify(sectionData));
      // find needed pane
      for (let i = 1; i < sectionDataNew.length; i++) {
        const paneData = sectionDataNew[i];
        const tabIdsArr = paneData[2];
        const tabIdIndex = tabIdsArr.indexOf(tabId);
        if (tabIdIndex !== -1) {
          paneData[3] = tabIdIndex;
          paneDataFound = true;
          break;
        }
      }
      if (paneDataFound) {
        break;
      }
    }
    // update dimensions obj
    dimensionsObj[sectionCode] = sectionDataNew;
    // update hash json
    hashJson[ParsedClassicsAppVars.dimensionsMember] = dimensionsObj;
    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  hashDeleteTab: function(event, tabId) {
    // prevent firing of other functions also bound to the same tab when tab is being deleted
    event.stopPropagation();
    // get hash json, dimensions obj and layout obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];

    // loop through dimensions obj and get pane data of needed pane
    let paneDataFound = false;
    let sectionDataNew, 
      sectionLayoutDataNew;
    let collResPairsRemoved = [];
    for (var sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      const sectionLayoutData = layoutObj[sectionCode];
      // deep copy of section data
      sectionDataNew = JSON.parse(JSON.stringify(sectionData));
      // deep copy of section layout data
      sectionLayoutDataNew = JSON.parse(JSON.stringify(sectionLayoutData));
      // find needed pane
      for (let i = 1; i < sectionDataNew.length; i++) {
        // get pane data
        const paneData = sectionDataNew[i];
        // get pane layout data
        const resourceIdsArr = sectionLayoutDataNew[i - 1];
        const tabIdsArr = paneData[2];
        const tabIdIndex = tabIdsArr.indexOf(tabId);
        if (tabIdIndex !== -1) {
          // was the deleted tab the last tab in the tabbar?
          if (tabIdIndex === tabIdsArr.length - 1) {
            // activate the tab which is last after deletion of the last tab
            paneData[3] = tabIdsArr.length - 2
            // in case the last tab in the tabbar was the only tab in the tabbar, prevent the index to be "-1"
            if (paneData[3] < 0) {
              paneData[3] = null;
            }
          }
          else {
            // activate next tab after deleted tab
            paneData[3] = tabIdIndex;
          }
          // remove tabId
          tabIdsArr.splice(tabIdIndex, 1);
          // remove resource id 
          collResPairsRemoved = resourceIdsArr.splice(tabIdIndex, 1);
          // get arr of collectionShortname|resourceShortname pairs which were removed
          collResPairsRemoved = collResPairsRemoved.flat();
          paneDataFound = true;
          break;
        }
      }
      if (paneDataFound) {
        break;
      }
    }

    // get array of collection|resource shortname pairs from URL
    let collResShortnamePairs = Object.values(layoutObj);
    // flatten array of collection|resource shortname pairs
    collResShortnamePairs = collResShortnamePairs.flat(2);
    // remove from pointers object collections which were removed by closing pane 
    const collsToBeRemovedFromPointersObj = ParsedClassicsLayout.findCollsToBeRemovedFromPointersObj(collResShortnamePairs, collResPairsRemoved);
    // deep copy of section pointers data
    const newPointersObj = JSON.parse(JSON.stringify(pointersObj));
    // remove unneeded collections from pointers obj
    collsToBeRemovedFromPointersObj.forEach(collectionShortname => delete newPointersObj[collectionShortname]);

    // update dimensions obj
    dimensionsObj[sectionCode] = sectionDataNew;
    // update layout obj 
    layoutObj[sectionCode] = sectionLayoutDataNew;
    // update hash json
    hashJson[ParsedClassicsAppVars.dimensionsMember] = dimensionsObj;
    hashJson[ParsedClassicsAppVars.layoutMember] = layoutObj;
    hashJson[ParsedClassicsAppVars.pointersMember] = newPointersObj
    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  hashAddTab: function(sectionId, paneId) {
    // define vars
    let sectionData, sectionLayoutData, sectionDataFound, paneData, tabIdsArr, resourceIdsArr;

    // get hash json, dimensions obj and layout obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];


    // loop through dimensions obj and get section data of needed section
    for (var sectionCode in dimensionsObj) {
      sectionData = dimensionsObj[sectionCode];
      sectionLayoutData = layoutObj[sectionCode];
      if (sectionData[0][0] === sectionId) {
        sectionDataFound = true;
        break;
      }
    }

    if (sectionDataFound) {
      // deep copy of section data
      const sectionDataNew = JSON.parse(JSON.stringify(sectionData));
      // deep copy of section layout data
      const sectionLayoutDataNew = JSON.parse(JSON.stringify(sectionLayoutData));
      // find needed pane
      for (let i = 1; i < sectionDataNew.length; i++) {
        // get pane data
        paneData = sectionDataNew[i];
        // get pane layout data
        resourceIdsArr = sectionLayoutDataNew[i - 1];
        if (paneData[0] === paneId) {
          // get array of tab ids
          tabIdsArr = paneData[2];
          // update pane data
          const newTabId = ParsedClassicsLayout.generateUID();
          // and new tab id
          tabIdsArr.push(newTabId);
          // change activated tab's index
          paneData[3] = tabIdsArr.length - 1;
          // update pane layout data
          resourceIdsArr.push(`${ParsedClassicsAppVars.newTabCollectionShortname}|${ParsedClassicsAppVars.newTabResourceShortname}`);
          break;
        }
      }
      // update dimensions obj
      dimensionsObj[sectionCode] = sectionDataNew;
      // update layout obj 
      layoutObj[sectionCode] = sectionLayoutDataNew;
      // update hash json
      hashJson[ParsedClassicsAppVars.dimensionsMember] = dimensionsObj;
      hashJson[ParsedClassicsAppVars.layoutMember] = layoutObj;
      // stringify hash json
      const hashJsonString = JSON.stringify(hashJson);
      // push state
      history.pushState(null, "", `#${hashJsonString}`);
      // update layout
      ParsedClassicsLayout.update(hashJson);
    }
  },

  hashMoveTab: function(tabId, paneFromId, oldIndex, paneToId, newIndex) {
    // define vars
    let sectionDataNew, 
      sectionLayoutDataNew, 
      sectionDataFrom, 
      sectionLayoutDataFrom,
      sectionCodeFrom, 
      paneDataFrom, 
      tabIdsArrFrom,
      resourceIdsArrFrom, 
      sectionDataTo,
      sectionLayoutDataTo,
      sectionCodeTo, 
      paneDataTo,  
      tabIdsArrTo,
      resourceIdsArrTo,
      resourceId;

    // get hash json, dimensions obj and layout obj
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];

    // loop through dimensions obj and get pane data of the pane from which tab was moved
    for (var sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      const sectionLayoutData = layoutObj[sectionCode];
      // deep copy of section dimensions data
      sectionDataNew = JSON.parse(JSON.stringify(sectionData));
      // deep copy of section layout data
      sectionLayoutDataNew = JSON.parse(JSON.stringify(sectionLayoutData));
      // loop through section data
      for (var i = 1; i < sectionDataNew.length; i++) {
        // get pane data
        const paneData = sectionDataNew[i];
        // get pane layout data
        const resourceIdsArr = sectionLayoutDataNew[i - 1];
        if (paneData[0] === paneFromId) {
          // get section dimensions data of the section from which tab was moved
          sectionDataFrom = sectionDataNew;
          // get section layout data of the section from which tab was moved
          sectionLayoutDataFrom = sectionLayoutDataNew;
          // get section code of the section from which tab was moved
          sectionCodeFrom = sectionCode;
          // get pane data of the pane from which tab was moved
          paneDataFrom = paneData;
          // get tab ids array of the pane from which tab was moved
          tabIdsArrFrom = paneData[2];
          // get pane layout data of the pane from which tab was moved
          resourceIdsArrFrom = resourceIdsArr;
          // get resource id
          resourceId = resourceIdsArr[oldIndex];
        }
        if (paneData[0] === paneToId) {
          // get section data of the section to which tab was moved
          sectionDataTo = sectionDataNew;
          // get section layout data of the section to which tab was moved
          sectionLayoutDataTo = sectionLayoutDataNew;
          // get section code of the section to which tab was moved
          sectionCodeTo = sectionCode;
          // get pane data of the pane to which tab was moved
          paneDataTo = paneData;
          // get tab ids array of the pane to which tab was moved
          tabIdsArrTo = paneData[2];
          // get pane layout data of the pane to which tab was moved
          resourceIdsArrTo = resourceIdsArr;
        }
        if (paneDataFrom && paneDataTo) {
          break;
        }
      }
      if (paneDataFrom && paneDataTo) {
        break;
      }
    }

    // was tab moved inside the same pane?
    if (paneFromId === paneToId) {
      // remove tabId from position indicated by old index
      tabIdsArrFrom.splice(oldIndex, 1);
      // put tabId to position indicated by new index
      tabIdsArrFrom.splice(newIndex, 0, tabId);
      // change activated tab's index
      paneDataFrom[3] = newIndex;
      // update dimensions obj
      dimensionsObj[sectionCodeFrom] = sectionDataFrom;
      // remove resource id from position indicated by old index
      resourceIdsArrFrom.splice(oldIndex, 1);
      // put resource id to position indicated by new index
      resourceIdsArrFrom.splice(newIndex, 0, resourceId);
      // update layout obj 
      layoutObj[sectionCodeFrom] = sectionLayoutDataFrom;
    }
    // tab was moved into another pane
    else {
      const isMovedTabLast = oldIndex === tabIdsArrFrom.length - 1;
      // remove tabId from position indicated by old index
      tabIdsArrFrom.splice(oldIndex, 1);
      // remove resource id from position indicated by old index
      resourceIdsArrFrom.splice(oldIndex, 1);
      // change activated tab's index in the tabbar from which tab was moved
      if (isMovedTabLast) {
        paneDataFrom[3] = tabIdsArrFrom.length - 1 > -1 ? tabIdsArrFrom.length - 1 : null;
      }
      else {
        paneDataFrom[3] = oldIndex;
      }
      // put tabId into position indicated by new index
      tabIdsArrTo.splice(newIndex, 0, tabId);
      // put resource id into position indicated by new index
      resourceIdsArrTo.splice(newIndex, 0, resourceId);
      // change activated tab's index in the tabbar to which tab was moved
      paneDataTo[3] = newIndex;
      // update dimensions obj
      dimensionsObj[sectionCodeFrom] = sectionDataFrom;
      dimensionsObj[sectionCodeTo] = sectionDataTo;
      // update layout obj
      layoutObj[sectionCodeFrom] = sectionLayoutDataFrom;
      layoutObj[sectionCodeTo] = sectionLayoutDataTo;
    }

    // update hash json
    hashJson[ParsedClassicsAppVars.dimensionsMember] = dimensionsObj;
    hashJson[ParsedClassicsAppVars.layoutMember] = layoutObj;
    // stringify hash json
    const hashJsonString = JSON.stringify(hashJson);
    // push state
    history.pushState(null, "", `#${hashJsonString}`);
    // update layout
    ParsedClassicsLayout.update(hashJson);
  },

  /*
    HTML creation functions
  */

  // creates section el
  createSection: function (sectionId, pane1Id, pane2Id, tabIdsArr1, tabIdsArr2, activeTabIndex1, activeTabIndex2) {
    // create pane el
    const paneEl = ParsedClassicsLayout.createPane(sectionId, pane1Id, tabIdsArr1, activeTabIndex1);
    // create section html
    const sectionHtml = `
      <div id="section-${sectionId}" class="${ParsedClassicsAppVars.sectionClass}">   
      </div>
    `;
    // create section htnl
    const sectionEl = $(sectionHtml).prepend(paneEl);

    if (pane2Id) {
      const paneEl2 = ParsedClassicsLayout.createPane(sectionId, pane2Id, tabIdsArr2, activeTabIndex2);
      sectionEl.append(paneEl2);
    }

    return sectionEl;
  },

  // creates pane el
  createPane: function (sectionId, paneId, tabIdsArr, activeTabIndex) {
    // create layout buttons
    const layoutButtons = ParsedClassicsLayout.createLayoutButtons(
      sectionId,
      paneId
    );
    // create pane html
    const paneHtml = `
      <div id="pane-${paneId}" data-pane-id="${paneId}" class="${ParsedClassicsAppVars.paneClass}">   
      </div>
    `;
    
    // create alert dialogue el
    const alertDialogue = ParsedClassicsAlertDialogue.createDialogue(paneId);
    // create pane top part
    const paneTopPartHtml = `<div class="${ParsedClassicsAppVars.paneTopPartClass}"></div>`;
    // create pane bottom part
    const paneBottomPartHtml = `<div class="${ParsedClassicsAppVars.paneBottomPartClass}"></div>`;
    // create pane top part
    const paneTopPart = $(paneTopPartHtml);
    // create pane bottom part
    const paneBottomPart = $(paneBottomPartHtml);
    // create pane el
    const paneEl = $(paneHtml).prepend(paneTopPart).append(paneBottomPart).append(alertDialogue);
    //add menu to pane top part
    ParsedClassicsNavigation.createNav(paneTopPart, paneId);
    // add layout buttons to menu
    paneTopPart
      .find(`.${ParsedClassicsAppVars.layoutBtnsContainer}`)
      .prepend(layoutButtons);
    // add tabs
    ParsedClassicsTabs.createTabbar(paneTopPart, paneEl, tabIdsArr, activeTabIndex);
    return paneEl;
  },

  // creates el containing buttons "Add pane to the left", "Add pane on top", "Add pane on bottom", "Add pane to the right", "Delete pane"
  createLayoutButtons: function (sectionId, paneId) {
    // create menu html
    const menuHtml = `
      <div>
        <a title="Add pane to the left" class="sm-menu-button ${ParsedClassicsAppVars.addLeftSectionBtnClass}"><img class="sm-menu-button-img" src="img/chevron-left.svg" /></a>
        <a title="Add pane to the right" class="sm-menu-button ${ParsedClassicsAppVars.addRightSectionBtnClass}"><img class="sm-menu-button-img" src="img/chevron-right.svg" /></a>
        <a title="Add pane on top" class="sm-menu-button ${ParsedClassicsAppVars.addTopPaneBtnClass}"><img class="sm-menu-button-img" src="img/chevron-up.svg" /></a>
        <a title="Add pane on bottom" class="sm-menu-button ${ParsedClassicsAppVars.addBottomPaneBtnClass}"><img class="sm-menu-button-img" src="img/chevron-down.svg" /></a>
        <a title="Close pane" class="sm-menu-button ${ParsedClassicsAppVars.closePaneBtnClass}"><img class="sm-menu-button-img" src="img/x.svg" /></a>
        <a title="Maximize pane" class="sm-menu-button ${ParsedClassicsAppVars.maximizePaneBtnClass}"><img class="sm-menu-button-img" src="img/screen-full.svg" /></a>
        <a title="Minimize pane" class="sm-menu-button ${ParsedClassicsAppVars.minimizePaneBtnClass} ${ParsedClassicsAppVars.layoutBtnHideClass}"><img class="sm-menu-button-img" src="img/screen-normal.svg" /></a>
        <a title="New tab" class="sm-menu-button ${ParsedClassicsAppVars.addTabBtnClass}"><img class="sm-menu-button-img" src="img/plus.svg" /></a>
      </div>
    `;
    // creta menu el
    const menuEl = $(menuHtml);
    // attach to button the function which will insert section to the right of the target section
    menuEl
      .find(`.${ParsedClassicsAppVars.addRightSectionBtnClass}`)
      .bind("click", function () {
        // close navigation menu
        $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
        ParsedClassicsLayout.hashInsertSection(sectionId, "right");
      });
    // attach to button the function which will insert section to the left of the target section
    menuEl
      .find(`.${ParsedClassicsAppVars.addLeftSectionBtnClass}`)
      .bind("click", function () {
        // close navigation menu
        $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
        ParsedClassicsLayout.hashInsertSection(sectionId, "left");
      });
    // attach to button the function which will insert pane to the top of the target pane
    menuEl
      .find(`.${ParsedClassicsAppVars.addTopPaneBtnClass}`)
      .bind("click", function () {
        // close navigation menu
        $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
        ParsedClassicsLayout.hashInsertPane(sectionId, "top");
      });
    // attach to button the function which will insert pane to the bottom of the target pane
    menuEl
      .find(`.${ParsedClassicsAppVars.addBottomPaneBtnClass}`)
      .bind("click", function () {
        // close navigation menu
        $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
        ParsedClassicsLayout.hashInsertPane(sectionId, "bottom");
      });
    // attach to button the function which will remove the pane (and the section in case section contains only one pane)
    menuEl
      .find(`.${ParsedClassicsAppVars.closePaneBtnClass}`)
      .bind("click", function () {
        // remove navigation menu
        $(`#main-menu-${paneId}`).smartmenus("destroy");
        ParsedClassicsLayout.hashRemovePane(sectionId, paneId);
      });
    // attach to button the function which will maximize the pane
    menuEl
      .find(`.${ParsedClassicsAppVars.maximizePaneBtnClass}`)
      .bind("click", function () {
        // close navigation menu
        $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
        ParsedClassicsLayout.hashZoomPane(sectionId, paneId, "in");
      });
    // attach to button the function which will minimize the pane
    menuEl
      .find(`.${ParsedClassicsAppVars.minimizePaneBtnClass}`)
      .bind("click", function () {
        // close navigation menu
        $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
        ParsedClassicsLayout.hashZoomPane(sectionId, paneId, "out");
      });
      // attach to button the function which will add new tab
      menuEl
      .find(`.${ParsedClassicsAppVars.addTabBtnClass}`)
      .bind("click", function () {
        // close navigation menu
        $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
        ParsedClassicsLayout.hashAddTab(sectionId, paneId);
      });

    return menuEl;
  },

  /*
    Utility functions
  */

  generateUID: function () {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    // from https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  },

  // compares arrays consisting of primitive values, to find if arrays have the same elements in any order
  // or to find if arrays have the same elements in the same order
  arraysEqual: function(arr1, arr2, sameOrder) {
    a = [...arr1];
    b = [...arr2];
    if (a.length !== b.length) return false;
    else {
      if (!sameOrder) {
        a.sort();
        b.sort();
      }
      // Comparing each element of your array
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
  },

  objectsEqual: function (a, b) {
    if (Object.getOwnPropertyNames(a).length !== Object.getOwnPropertyNames(b).length) return false;
    for (let prop in a) {
      if (a.hasOwnProperty(prop)) {
        if (b.hasOwnProperty(prop)) {
          if (typeof a[prop] === 'object') {
            if (!objectsEqual(a[prop], b[prop])) return false;
          } else {
            if (a[prop] !== b[prop]) return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  },
  
  // finds in url id of the pane the tab belongs to
  getPaneIdFromUrl: function(tabId) {
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    let paneIdFound = false;
    let paneId = null;
    for (var sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      for (let i = 1; i < sectionData.length; i++) {
        // get pane data
        const paneData = sectionData[i];
        // get pane id
        paneId = paneData[0];
        const tabIdsArr = paneData[2];
        if (tabIdsArr.includes(tabId)) {
          paneIdFound = true;
          break;
        }
      }
      if (paneIdFound) {
        break;
      }
    }
    return paneId;
  },

  getTabIndexFromUrl: function(tabId) {
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    let tabIndexFound = false;
    let tabIndex = null;
    for (var sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      for (let i = 1; i < sectionData.length; i++) {
        // get pane data
        const paneData = sectionData[i];
        // get tab ids
        const tabIds = paneData[2];
        // get tab index
        tabIndex = tabIds.indexOf(tabId);
        if (tabIndex !== -1) {
          tabIndexFound = true;
          break;
        }
      }
      if (tabIndexFound) {
        break;
      }
    }
    return tabIndex;
  },

  getSectionAndPaneIndexesFromUrl: function(paneId) {
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    let sectionIndex = null;
    let paneIndex = null;
    for (var sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      for (let i = 1; i < sectionData.length; i++) {
        // get pane data
        const paneData = sectionData[i];
        // get current pane id
        const paneIdCurr = paneData[0];
        if (paneId === paneIdCurr) {
          paneIndex = i - 1;
          sectionIndex = sectionCode;
          break;
        }
      }
      if (sectionIndex) {
        break;
      }
    }
    return {sectionIndex, paneIndex};
  },

  getLineIndicatorFromUrl: function(collectionShortname) {
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    const collectionPointers = pointersObj[collectionShortname] ?? {};
    const lineIndicator = typeof collectionPointers[ParsedClassicsAppVars.lineMember] !== 'undefined' && collectionPointers[ParsedClassicsAppVars.lineMember] ? collectionPointers[ParsedClassicsAppVars.lineMember] : 'title';
    return lineIndicator;
  },

  getWordFromUrl: function(collectionShortname) {
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    const collectionPointers = pointersObj[collectionShortname] ?? {};
    const word = typeof collectionPointers[ParsedClassicsAppVars.wordMember] !== 'undefined' && collectionPointers[ParsedClassicsAppVars.wordMember] ? collectionPointers[ParsedClassicsAppVars.wordMember] : '';
    return word;
  },

  getLexiconAndEntryFromUrl: function(collectionShortname) {
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const pointersObj = hashJson[ParsedClassicsAppVars.pointersMember];
    const collectionPointers = pointersObj[collectionShortname] ?? {};
    const lexicon = typeof collectionPointers[ParsedClassicsAppVars.lexiconMember] !== 'undefined' && collectionPointers[ParsedClassicsAppVars.lexiconMember] ? collectionPointers[ParsedClassicsAppVars.lexiconMember] : '';
    const lexiconEntry = typeof collectionPointers[ParsedClassicsAppVars.lexiconEntryMember] !== 'undefined' && collectionPointers[ParsedClassicsAppVars.lexiconEntryMember] ? collectionPointers[ParsedClassicsAppVars.lexiconEntryMember] : '';
    return {lexicon, lexiconEntry};
  },

  getCollAndResShortnameFromTabId: function(tabId) {
    const hashJson = ParsedClassicsLayout.getHashJson("url");
    const dimensionsObj = hashJson[ParsedClassicsAppVars.dimensionsMember];
    const layoutObj = hashJson[ParsedClassicsAppVars.layoutMember];
    let tabIndexFound = false;
    let resourceShortname = null;
    let collectionShortname = null;
    for (var sectionCode in dimensionsObj) {
      const sectionData = dimensionsObj[sectionCode];
      const sectionLayoutData = layoutObj[sectionCode];
      for (let i = 1; i < sectionData.length; i++) {
        // get pane data
        const paneData = sectionData[i];
        // get resource data
        const resourceData = sectionLayoutData[i - 1];
        // get tab ids
        const tabIds = paneData[2];
        // get tab index
        tabIndex = tabIds.indexOf(tabId);
        if (tabIndex !== -1) {
          tabIndexFound = true;
          collectionShortname = resourceData[tabIndex].split('|')[0];
          resourceShortname = resourceData[tabIndex].split('|')[1] ?? null;
          break;
        }
      }
      if (tabIndexFound) {
        break;
      }
    }
    return {collectionShortname, resourceShortname};
  },

  findCollsToBeRemovedFromPointersObj: function(collResPairs, collResPairsRemoved) {
    // get array of collectionShortnames whose resources were removed 
    let collsWhoseResourcesRemoved = collResPairsRemoved.map(collResPair => collResPair.split('|')[0]);
    // remove duplicate values
    collsWhoseResourcesRemoved = [...new Set(collsWhoseResourcesRemoved)];

    // get arr of collectionShortname|resourceShortname pairs which are left when some resources were removed
    const collResPairsLeft = [...collResPairs];
    collResPairsRemoved.forEach(item => {
      const index = collResPairsLeft.indexOf(item);
      if (index !== -1) {
        collResPairsLeft.splice(index, 1);
      }
    });

    // get arr of collection shortnames which are left when some resources were removed
    let collsLeft = [...collResPairsLeft];
    collsLeft = collsLeft.map(collResPair => collResPair.split('|')[0]);
    // remove duplicate values
    collsLeft = [...new Set(collsLeft)];

    // get arr of collections to be removed from pointers obj
    const collsToBeRemovedFromPointersObj = [];
    collsWhoseResourcesRemoved.forEach(collShortname => {
      if (collsLeft.indexOf(collShortname) === -1) {
        collsToBeRemovedFromPointersObj.push(collShortname);
      }
    });
    return collsToBeRemovedFromPointersObj;
  },

  // outputs hash json string which encodes default layout, i.e. container containing certain section(s)
  getDefaultHashJson: function () {
    const id = ParsedClassicsLayout.generateUID;
    const tabIdsArr = [id(), id(), id(), id(), id(), id(), id(), id()];
    return {
      L: { 
        a: [["nt_matthew|nt_matthew_parsed_text", "nt_matthew|nt_matthew_text_ed_robinson_pierpont", "nt_matthew|concordance_by_moulton_geden"]], 
        b: [["nt_mark|nt_mark_parsed_text"], ["nt_mark|nt_mark_text_ed_robinson_pierpont"]], 
        c: [["nt_luke|nt_luke_parsed_text"]], 
        d: [["nt_john|nt_john_parsed_text"], ["nt_acts|nt_acts_parsed_text"]] 
      },
      P: {
        nt_matthew: {
          line: "2:1",
        },
        nt_mark: {
          line: "3:5",
        },
        nt_luke: {
          line: "4:7",
        },
        nt_john: {
          line: "5:11",
        },
        nt_acts: {
          line: "11:15",
        },
      },
      D: {
        a: [
          [id(), 25],
          [id(), 100, [tabIdsArr[0], tabIdsArr[1], tabIdsArr[7]], 1],
        ],
        b: [
          [id(), 25],
          [id(), 50, [tabIdsArr[2]], 0],
          [id(), 50, [tabIdsArr[3]], 0],
        ],
        c: [
          [id(), 25],
          [id(), 100, [tabIdsArr[4]], 0],
        ],
        d: [
          [id(), 25],
          [id(), 50, [tabIdsArr[5]], 0],
          [id(), 50, [tabIdsArr[6]], 0],
        ],
      },
    };
  },

  createSectionCodesArr: function () {
    return [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "w",
      "x",
      "y",
      "z",
    ];
  },

  getHashJson: function (from) {
    // get hash json from local storage
    if (from === "localStorage") {
      const storageJsonString = localStorage.getItem(
        ParsedClassicsAppVars.urlHashStorageName
      );
      return ParsedClassicsLayout.stringToJson(storageJsonString);
    }
    // get hash json from URL
    else if (from === "url") {
      const hashJsonString = window.location.hash.replace("#", "");
      return ParsedClassicsLayout.stringToJson(hashJsonString);
    }
    // get hash json from string argument
    else {
      const paramJsonString =
        from.split("#").length === 2 ? from.split("#")[1].trim() : "";
      return ParsedClassicsLayout.stringToJson(paramJsonString);
    }
  },

  // converts json string to json; if json parsing fails, outputs empty object
  stringToJson: function (jsonString) {
    const jsonStringDecoded = decodeURIComponent(jsonString);
    let json = {};
    try {
      json = JSON.parse(jsonStringDecoded);
    } catch (err) {}
    return json;
  },

  // outputs true if object has layout member of the type "object"
  // and dimensions member of the type "object"
  // and there is correspondence between members of layout member and members of dimensions member
  // and members of layout member and members of dimensions member are of needed types
  layoutJsonValidate: function (json) {
    const layoutObj =
      json && typeof json[ParsedClassicsAppVars.layoutMember] === "object"
        ? json[ParsedClassicsAppVars.layoutMember]
        : null;
    const dimensionsObj =
      json && typeof json[ParsedClassicsAppVars.dimensionsMember] === "object"
        ? json[ParsedClassicsAppVars.dimensionsMember]
        : null;
    if (!layoutObj || !dimensionsObj) {
      return false;
    }
    for (let sectionCode in layoutObj) {
      const contentArr =
        layoutObj[sectionCode] instanceof Array ? layoutObj[sectionCode] : null;
      const dimensionsArr =
        dimensionsObj[sectionCode] instanceof Array
          ? dimensionsObj[sectionCode]
          : null;
      // check if both content array and dimensions array are present
      if (!contentArr || !dimensionsArr) {
        return false;
      }
      // check array length
      if (
        !(contentArr.length === 1 && dimensionsArr.length === 2) &&
        !(contentArr.length === 2 && dimensionsArr.length === 3)
      ) {
        return false;
      }
      // check types of content array members
      contentArr.forEach((stringArr) => {
        if (!(stringArr instanceof Array)) {
          return false;
        }
        stringArr.forEach((str) => {
          if (typeof str !== "string") {
            return false;
          }
        });
      });
      // check types of content dimensions members
      dimensionsArr.forEach((dataArr) => {
        if (!(dataArr instanceof Array)) {
          return false;
        }
        if (typeof dataArr[0] !== "string") {
          return false;
        }
        if (
          typeof dataArr[1] !== "number" ||
          dataArr[1] < 0 ||
          dataArr[1] > 100
        ) {
          return false;
        }
      });
    }
    return true;
  },

  layoutJsonSaveInStorage: function() {
    if (!ParsedClassicsAppVars.DEV_MODE) {
      localStorage.setItem(ParsedClassicsAppVars.urlHashStorageName, window.location.hash.replace("#", ""));
    }
  }
};
