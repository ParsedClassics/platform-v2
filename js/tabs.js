/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

const ParsedClassicsTabs = {
  initTabbar: function (tabbar, activeTabIndex) {
    // init horizontal mouse-wheel scrolling
    tabbar.hScroll(15);
    // get tabs
    const tabs = tabbar.find(`.${ParsedClassicsAppVars.tabClass}`);
    // activate tab
    if (tabs.length > 0) {
      ParsedClassicsTabs.activateTab(null, $(tabs[activeTabIndex]));
    }
    // make tabs of the tabbar sortable
    new Sortable(tabbar[0], {
      group: "shared",
      animation: 150,
      ghostClass: "ghost",
      draggable: `.${ParsedClassicsAppVars.tabClass}`,
      swapThreshold: 0.65,
      direction: "horizontal",
      onStart: function (event) {
        // this needed because of bug in Webkit browsers which when dragging starts retain lasts :hover pseudoclass
        $(tabbar).addClass(ParsedClassicsAppVars.tabbarDragClass);
      },
      onEnd: function (event) {
        // this needed because of bug in Webkit browsers which when dragging starts retain lasts :hover pseudoclass
        $(tabbar).removeClass(ParsedClassicsAppVars.tabbarDragClass);
        // get moved tab
        const tab = $(event.item);
        // get tab id of the moved tab
        const tabId = tab.attr('data-tab-id');
        // get pane from which tab was moved
        let paneFrom = $(event.from);
        while (!paneFrom.hasClass(ParsedClassicsAppVars.paneClass)) {
          paneFrom = paneFrom.parent();
        }
        // get id of the pane from which tab was moved
        const paneFromId = paneFrom.attr('data-pane-id');
        // get tab's index in the pane from which it was moved
        const oldIndex = event.oldDraggableIndex;
        // get pane to which tab was moved
        let paneTo = $(event.to);
        while (!paneTo.hasClass(ParsedClassicsAppVars.paneClass)) {
          paneTo = paneTo.parent();
        }
        // get id of the pane into which tab was moved
        const paneToId = paneTo.attr('data-pane-id');
        // get tab's index in the pane to which it was moved 
        const newIndex = event.newDraggableIndex;
        ParsedClassicsLayout.hashMoveTab(tabId, paneFromId, oldIndex, paneToId, newIndex);
      },
    });
  },

  moveTabBetweenPanes: function(tabId, tabbarTo, paneTopPartTo, paneBottomPartTo, tabIndexNew) {
    // get tab
    const tab = $(`#tab-${tabId}`);
    // get tab content el
    const tabContent = $(`#tab-content-${tabId}`);
    // get tab content inner el
    const tabContentInner = $(`#tab-content-inner-${tabId}`);
    // get tab's selectboxes container
    const tabSlelectboxesContainer = $(`#tab-selects-container-${tabId}`);
    // get pane's id to which we are moving the tab
    const paneToId = paneTopPartTo.parent().attr('data-pane-id');
    // get pane selects container to which tab selects container should be moved
    const paneSelectsSontainerTo = $(`#pane-selects-container-${paneToId}`);

    // does tab already is in the tabbar to which it should be moved?
    const tabInTabbarTo = tabbarTo.find(`#tab-${tabId}`);
    if (tabInTabbarTo.length === 0) {
      // get all tabs from the tabbar into which tab should be moved
      const tabsInTabbarTo = tabbarTo.find(`.${ParsedClassicsAppVars.tabClass}`);
      // move tab into new pane
      if (tabIndexNew === 0) {
        tabbarTo.prepend(tab);
      }
      else {
        const tabBefore = $(tabsInTabbarTo[tabIndexNew - 1]);
        tabBefore.after(tab);
      }
    }

    // move tab content to new pane
    paneBottomPartTo.find(`.${ParsedClassicsAppVars.tabContentClass}`).hide();
    paneBottomPartTo.append(tabContent).show();
    // // restore src of the iframe in tab content of the moved pane (for some reason after moving tab the iframe in it shows the first page of scanned book)
    // const iframeEl = tabContent.find('iframe');
    // // iframe found, so the resource is scanned
    // if (iframeEl.length === 1) {
    //   const iframeSrc = iframeEl.attr('data-src');
    //   if (iframeSrc) {
    //     iframeEl[0].contentWindow.location.replace(iframeSrc);
    //   }
    // }
    // // iframe not found, so the resource is transcribed
    // else {
    //   const pane = $(`#pane-${paneToId}`);
    //   if (pane) {
    //     ParsedClassicsContentContainers.treatActiveTabContentContainer(pane, tabId, true);
    //   }
    // }

    // set "data-reloaded" attr to 'no' in tab content inner el (it will be used by treatZoomsAndReloads function to reload tab contents)
    tabContentInner.attr('data-reloaded', 'no');

    // move tab's selectboxes container to new pane's selectboxes container
    paneSelectsSontainerTo.find(`.${ParsedClassicsAppVars.tabSelectsContainerClass}`).hide();
    paneSelectsSontainerTo.append(tabSlelectboxesContainer).show();
  },

  activateTab: function (event, tab) {
    // get tab if not available as argument
    if (!tab) {
      tab = $(event.target);
      while (!tab.hasClass(ParsedClassicsAppVars.tabClass)) {
        tab = tab.parent();
      }
    }
    // get pane
    let pane = tab;
    while (!pane.hasClass(ParsedClassicsAppVars.paneClass)) {
      pane = pane.parent();
    }
    // get tabbar
    const tabbar = tab.parent();
    // get tabs
    const tabs = tabbar.find(`.${ParsedClassicsAppVars.tabClass}`);
    // remove active class
    tabs.removeClass(ParsedClassicsAppVars.tabActiveClass);
    // ad active class to the tab to be active
    tab.addClass(ParsedClassicsAppVars.tabActiveClass);
    // get tab id
    const tabId = tab.attr('data-tab-id');
    // get bottom part of the pane
    const paneBottomPart = pane.find(`.${ParsedClassicsAppVars.paneBottomPartClass}`);
    // hide all tab content elements
    paneBottomPart.find(`.${ParsedClassicsAppVars.tabContentClass}`).hide();
    // display tab content of the tab to be active
    paneBottomPart.find(`#tab-content-${tabId}`).show();
    // get pane id
    const paneId = pane.attr('data-pane-id');
    // get pane selects container
    const paneSelectsContainer = pane.find(`#pane-selects-container-${paneId}`);
    // hide all tab selects containers inside pane selects container
    paneSelectsContainer.find('.sm__tab-selects-container').hide();
    // show relevant tab selects container
    pane.find(`#tab-selects-container-${tabId}`).show();
    // scroll tab into view
    tabbar.scrollTo(tab, {
      axis: 'x',
      duration: 400,
    });
  },

  createTabHtml: function(id, tabTitle, tag) {
    const tabMarkClass = tag ? ' tab__mark-' + tag : '';
    const newTabHtml = `<div class="${ParsedClassicsAppVars.tabClass}" id="tab-${id}" data-tab-id="${id}" title="${tabTitle}"><div class="tab__mark${tabMarkClass}"></div><div class="tab__inner"><div class="tab__text">${tabTitle}</div></div><div class="tab__close" title="Close tab"><div class="${ParsedClassicsAppVars.tabCloseBtnClass}"><img class="tab__close_img" src="img/close.svg" /></div></div></div>`;
    return newTabHtml;
  },

  createTabContentHtml: function(id) {
    const tabContentHtml = `
      <div class="${ParsedClassicsAppVars.tabContentClass}" id="tab-content-${id}" data-tab-content-id="${id}">
        <div class="${ParsedClassicsAppVars.tabContentInnerClass}" id="tab-content-inner-${id}">
          <h1>${id}</h1>
        </div>
      </div>`;
    return tabContentHtml;
  },

  addTab: function (paneIdOrEl, tabId, tabTitle, index, tag) {
    // create tab id if not available as argument
    if (!tabId) {
      tabId = ParsedClassicsLayout.generateUID();
    }
    // get pane
    let pane, paneId;
    if (typeof paneIdOrEl === 'string') {
      paneId = paneIdOrEl;
      pane = $(`#pane-${paneId}`);
    }
    else {
      pane = paneIdOrEl;
      paneId = pane.attr('data-pane-id');
    }
    // get tabbar el
    const tabbarEl = pane.find(`.${ParsedClassicsAppVars.tabbarClass}`);
    // get all tabs
    const tabs = tabbarEl.find(`.${ParsedClassicsAppVars.tabClass}`);
    // create new tab html
    const newTabHtml = ParsedClassicsTabs.createTabHtml(tabId, tabTitle, tag);
    // create new tab el
    const newTab = $(newTabHtml);
    // onclick tab will be become active tab
    newTab.bind("click", () => ParsedClassicsLayout.hashActivateTab(tabId));
    // click on "Close tab" button wil remove the tab
    newTab.find(`.${ParsedClassicsAppVars.tabCloseBtnClass}`).bind("click", (event) => ParsedClassicsLayout.hashDeleteTab(event, tabId));
    // append new tab to tabbar
    if (index === 0) {
      tabbarEl.prepend(newTab);
    }
    else {
      const tabBefore = $(tabs[index - 1]);
      tabBefore.after(newTab);
    }
    // get top and bottom parts of the pane
    const paneTopPart = pane.find(`.${ParsedClassicsAppVars.paneTopPartClass}`)
    const paneBottomPart = pane.find(`.${ParsedClassicsAppVars.paneBottomPartClass}`);
    // create html of the tab content el
    const tabContentHtml = ParsedClassicsTabs.createTabContentHtml(tabId);
    // create tab content el
    const tabContent = $(tabContentHtml);
    // hide all tab content els
    paneBottomPart.find(`.${ParsedClassicsAppVars.tabContentClass}`).hide();
    // append tab content el into pane bottom part el
    paneBottomPart.append(tabContent);
    // create tab selects container
    const tabSelectsContainer = ParsedClassicsNavSelects.createTabSelectsContainer(tabId);
    // add tab selectbox container into pane selectbox container
    paneTopPart.find(`#pane-selects-container-${paneId}`).append(tabSelectsContainer);
  },

  closeTab: function(tabId) {
    // get tab to be deleted
    const tab = $(`#tab-${tabId}`);
    // get tab content to be deleted
    const tabContent = $(`#tab-content-${tabId}`);
    // delete tab
    tab.remove();
    // delete tab content
    tabContent.remove();
    // get tab selectbox container
    const tabSelectboxContainer = $(`#tab-selects-container-${tabId}`);
    // remove tab selectbox container
    tabSelectboxContainer.remove();
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(tabId);
    // close navigation menu which might be open at the time tab is being closed
    $(`#main-menu-${paneId}`).smartmenus('menuHideAll');
    // hide options container in Tools and menus dropdown
    $(`#pane-options-container-${paneId}`).hide();
  },

  createTabbar: function (paneTopPartEl, paneEl, tabIdsArr, activeTabIndex) {
    // create tabbar html
    const tabbarHtml = `<div class="${ParsedClassicsAppVars.tabbarClass}"></div>`;
    // create tabbar el
    const tabbarEl = $(tabbarHtml);
    // append tabbar el into pane's top part el
    paneTopPartEl.append(tabbarEl);
    // loop through tabbr ids
    for (let i = 0; i < tabIdsArr.length; i++) {
      // get resource shortname of the resource to be loaded into tab
      const {collectionShortname, resourceShortname, tag} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(tabIdsArr[i]);
      // get title of the resource to be used in the tab
      const tabTitle =  ParsedClassicsTabs.createTabTitle(collectionShortname, resourceShortname)
      
      // add tab into tabbar
      ParsedClassicsTabs.addTab(paneEl, tabIdsArr[i], tabTitle, i, tag);
    }
    // initiate tabbar
    ParsedClassicsTabs.initTabbar(tabbarEl, activeTabIndex);
  },

  createTabTitle: function(collectionShortname, resourceShortname) {
    let tabTitle = '';
    if (resourceShortname) {
      const resourceDef = ParsedClassicsData.getResourceDef(collectionShortname, resourceShortname);
      const resourceTitle = resourceDef['library_app_selectbox_title'];
      const collectionDef = ParsedClassicsCollDefs[collectionShortname];
      const collectionTitle = collectionDef['collection_selectboxname'];
      tabTitle = resourceTitle + (collectionTitle ?  ' | ' + collectionTitle : '');
    }
    else {
      const collectionDef = ParsedClassicsCollDefs[collectionShortname];
      const collectionTitle = collectionDef['collection_selectboxname'];
      tabTitle = collectionTitle;
    }
    return tabTitle;
  },

  // based on List of 20 Simple, Distinct Colors by Sasha Trubetskoy https://sashamaps.net/docs/resources/20-colors/
  getColorTagArr: function() {
    return [
      'red', // #e6194B
      'green', // #3cb44b
      'blue', // #4363d8
      'orange', // #f58231
      'purple', // #911eb4
      'cyan', // #42d4f4
      'magenta', // #f032e6
      'olive', // #808000
      'maroon', // #800000
      'brown', // #9A6324
      'yellow', // #ffe119
      'lime', // #bfef45
      'pink', // #fabed4
      'teal', // #469990
      'lavender', // #dcbeff
      'beige', // #fffac8
      'mint', // #aaffc3
      'apricot', // #ffd8b1
      'navy', // #000075
      'black', // #000000
    ];
  },

  getTagClassesArr: function(colorTagArr) {
    const tagClassesArr = [];
    colorTagArr.forEach((el) => tagClassesArr.push('tab__mark-' + el));
    return tagClassesArr;
  },

}; // End of ParsedClassicsTabs script
