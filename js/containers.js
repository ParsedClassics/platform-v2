/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/


// this is needed because Firefox browser on reloading the page might incorrectly restore scroll position in active tabs in which "typed" resources are loaded
history.scrollRestoration = "manual";

const ParsedClassicsContentContainers = {
  
  scrollFuncIntervals: {},

  treatActiveTabContentContainer: function (pane, activeTabId) {
    // get pane's bottom part el
    const paneBottomPart = pane.find(`.${ParsedClassicsAppVars.paneBottomPartClass}`);
    // get TAB's content container 
    const tabContentContainer = paneBottomPart.find(`#tab-content-${activeTabId}`);
    // get inner container
    const tabContentContainerInner = tabContentContainer.find(`.${ParsedClassicsAppVars.tabContentInnerClass}`);
    // get collection shortname and resource shortname from URL
    const {collectionShortname, resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);
    
    // generate collectionShortname|resourceShortname pair
    const collResPairUrl = collectionShortname && resourceShortname ? `${collectionShortname}|${resourceShortname}` : collectionShortname;
    // get collectionShortname|resourceShortname pair saved as container's attr
    const collResPairDom = tabContentContainer.attr(ParsedClassicsAppVars.collResPairAttr) ?? '';

    // get line indicator from url
    const lineIndicatorUrl = ParsedClassicsLayout.getLineIndicatorFromUrl(collectionShortname);
    // get line indicator saved as dom attr
    const lineIndicatorDom = tabContentContainer.attr(ParsedClassicsAppVars.lineNumberAttr) ?? '';

    // get lemma from URL
    const wordUrl = ParsedClassicsLayout.getWordFromUrl(collectionShortname);
    // get lemma from DOM
    const wordDom = tabContentContainer.attr(ParsedClassicsAppVars.lemmaAttr) ?? '';

    // get lexicon info and lexicon entry info info from URL 
    const {lexicon: lexiconUrl, lexiconEntry: lexiconEntryUrl} = ParsedClassicsLayout.getLexiconAndEntryFromUrl(collectionShortname);
    // get lexicon info from DOM 
    const lexiconDom = tabContentContainer.attr(ParsedClassicsAppVars.lexiconAttr) ?? '';
    // get lexicon entry info info from DOM 
    const lexiconEntryDom = tabContentContainer.attr(ParsedClassicsAppVars.lexiconEntryAttr) ?? '';

    // get collection's definition
    const collectionDef = ParsedClassicsCollDefs[collectionShortname];
    // get all resource definitions of collection
    const resourceDefsAll = collectionDef['resource_defs'];
    // get resource's definition
    const resourceDef = resourceShortname ? resourceDefsAll[resourceShortname] : '';
    // is resource scanned or typed?
    const scannedOrTyped = resourceDef ? resourceDef['scanned_or_typed'] : '';
    
    // get type of the resource
    const resourceType = resourceDef ? resourceDef['resource_type'] : '';
    // get all resources data of collection
    const resourceDataOfCollection = APP.loadedResourcesData[collectionShortname] ?? '';
    // get resouce data
    const resourceData = resourceDataOfCollection && resourceShortname ? resourceDataOfCollection[resourceShortname].data : '';
    // get resource contents
    const resourceContents = resourceDataOfCollection && resourceShortname ? resourceDataOfCollection[resourceShortname].contents : '';

    // Case I. there is no resource shortname, so we need to display list of resources contained in collection

    if (!resourceShortname  &&  collResPairUrl !== collResPairDom) {
      // update container's attrs
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, 'resources_list', 'typed');
      const resourcesListHtml = ParsedClassicsContentContainers.createAvailableResourcesListHtml(collectionDef, resourceDefsAll);
      tabContentContainer.find(`.${ParsedClassicsAppVars.tabContentInnerClass}`).html(resourcesListHtml);
      return;
    }

    // Case II. resource is "typed" and collectionShortname|resourceShortname pair from URL and that from DOM are identical
    // so we need to scroll to selected line or word

    else if (scannedOrTyped === 'typed' &&  collResPairUrl === collResPairDom) {
      // update container's attrs
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, resourceType, scannedOrTyped);

      switch(resourceType) {
        
        case 'parsed_text':
        const parsedTextContainerTopPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.parsedTextContainerTopPartClass}`);
        // treat selected line and word
        ParsedClassicsSelectedLine.treatSelectedLineAndWord(parsedTextContainerTopPart, collectionShortname);
        // scroll to the selected line
        if (lineIndicatorUrl !== lineIndicatorDom) {
          ParsedClassicsContentContainers.scrollToLineResourceLoaded(parsedTextContainerTopPart, lineIndicatorUrl, activeTabId);
        }
        break;

        case 'lexicon':
          // scroll to selected word 
          if (wordUrl && wordUrl !== wordDom) {
            ParsedClassicsContentContainers.scrollToWordResourceLoaded(tabContentContainerInner, wordUrl, ParsedClassicsAppVars.lexiconWordHeadingClass, activeTabId, resourceShortname, lexiconUrl, lexiconEntryUrl);
          }
          break;

        case 'concordance':
          const concordanceContainerLeftPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.concordanceContainerLeftPartClass}`);
          // scroll to selected word
          if (wordUrl && wordUrl !== wordDom) {
            ParsedClassicsContentContainers.scrollToWordResourceLoaded(concordanceContainerLeftPart, wordUrl, ParsedClassicsAppVars.concordanceWordHeadingClass, activeTabId, resourceShortname, lexiconUrl, lexiconEntryUrl);
          }
          break;

        case 'diagram_set':
          // scroll to the selected line
          if (lineIndicatorUrl !== lineIndicatorDom) {
            ParsedClassicsContentContainers.scrollToLineResourceLoaded(tabContentContainerInner, lineIndicatorUrl, activeTabId);
          }
          break;

      }

      return;
    }

    // Case III. resource is "scanned" and collectionShortname|resourceShortname pair from URL and that from DOM are identical
    // so we need to scroll to selected line which is in certain SCANNED PAGE if line indicator from URL and that from DOM are different +++++++++++++++++++++++++++++++++++

    else if (scannedOrTyped === 'scanned' &&  collResPairUrl === collResPairDom) {
      // update container's attrs ++++++++++++++++++++++++++++++ may be not needed
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, resourceType, scannedOrTyped);
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++













      return;
    }

    // Case IV. resource is "typed", but collectionShortname|resourceShortname pair from URL and that from DOM are different

    else if (scannedOrTyped === 'typed' &&  collResPairUrl !== collResPairDom) {
      // update container's attrs
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, resourceType, scannedOrTyped);
      
      switch(resourceType) {

        case 'info_text': 
          // put html into container 
          tabContentContainerInner.html(resourceData);
          break;

        case 'parsed_text':
          // split container into top part for text and bottom part for morphology  
          const {parsedTextContainerTopPart, parsedTextContainerBottomPart} = ParsedClassicsContentContainers.splitParsedTextContainer(activeTabId, tabContentContainerInner);
          // generate html of parsed text resource and put it into top part of splitted container
          ParsedClassicsContentContainers.createParsedTextResourceHtml(parsedTextContainerTopPart, collectionDef, resourceDef, resourceData);
          // delegate "mouseenter" and "mouseleave" events from els having class "word" to tab's inner content container
          tabContentContainerInner.delegate(`.${ParsedClassicsAppVars.wordClass}`, "mouseenter", (event) => ParsedClassicsMorphology.selectedWordMouseEnter(event, parsedTextContainerBottomPart));
          tabContentContainerInner.delegate(`.${ParsedClassicsAppVars.wordClass}`, "mouseleave", () => ParsedClassicsMorphology.selectedWordMouseLeave(parsedTextContainerBottomPart));
          // delegate "click" event from els having class "line" to tab's inner content container
          tabContentContainerInner.delegate(`.${ParsedClassicsAppVars.lineClass}`, "click", (event) => ParsedClassicsSelectedLine.hashSelectLineAndWord(event, collectionShortname, parsedTextContainerTopPart));
          // treat selected line and word
          ParsedClassicsSelectedLine.treatSelectedLineAndWord(parsedTextContainerTopPart, collectionShortname);
          // scroll to the selected line
          ParsedClassicsContentContainers.scrollToLineResourceLoading(parsedTextContainerTopPart, lineIndicatorUrl, activeTabId);
          break;

        case 'lexicon':
          ParsedClassicsContentContainers.createLexiconResourceHtml(tabContentContainerInner, resourceDef, resourceData);
          // delegate "click" event from els having class "inner-link" to tab's inner content container
          tabContentContainerInner.delegate(`.${ParsedClassicsAppVars.innerLinkClass}`, "click", (event) => ParsedClassicsInnerLink.innerLinkClick(event, tabContentContainerInner, activeTabId));
          // scroll to selected word 
          if (wordUrl) {
            ParsedClassicsContentContainers.scrollToWordResourceLoading(tabContentContainerInner, wordUrl, ParsedClassicsAppVars.lexiconWordHeadingClass, activeTabId, resourceShortname, lexiconUrl, lexiconEntryUrl);
          }
          break;

        case 'concordance':
          // split container into left part for concordance and right part for parsed text
          const {concordanceContainerLeftPart, concordanceContainerRightPart, dependencyContainerTopPart, dependencyContainerBottomPart} = ParsedClassicsContentContainers.splitConcordanceContainer(activeTabId, tabContentContainerInner);
          // generate html of parsed text resource and put it into left part of splitted container
          ParsedClassicsContentContainers.createConcordanceResourceHtml(concordanceContainerLeftPart, collectionDef, resourceDef, resourceData);
          // delegate "click" event from els having class "concordance-lines-button" to left part of splitted container
          concordanceContainerLeftPart.delegate(`.${ParsedClassicsAppVars.concordanceLinesBtnClass}`, 'click', (event) => ParsedClassicsConcordanceLinesButton.btnClicked(event));
          // delegate "click" event from els having class "concordance-line-number" to right part of splitted container
          concordanceContainerLeftPart.delegate(`.${ParsedClassicsAppVars.concordanceLineRefBtnClass}`, 'click', (event) => ParsedClassicsConcordanceLineRefButton.btnClicked(event, concordanceContainerLeftPart, dependencyContainerTopPart, resourceShortname, resourceContents, activeTabId));
          // delegate "mouseenter" and "mouseleave" events from els having class "word" to concodance container's right part
          concordanceContainerRightPart.delegate(`.${ParsedClassicsAppVars.wordClass}`, "mouseenter", (event) => ParsedClassicsMorphology.selectedWordMouseEnter(event, dependencyContainerBottomPart));
          concordanceContainerRightPart.delegate(`.${ParsedClassicsAppVars.wordClass}`, "mouseleave", () => ParsedClassicsMorphology.selectedWordMouseLeave(dependencyContainerBottomPart));
          // scroll to selected word
          if (wordUrl) {
            ParsedClassicsContentContainers.scrollToWordResourceLoading(concordanceContainerLeftPart, wordUrl, ParsedClassicsAppVars.concordanceWordHeadingClass, activeTabId, resourceShortname, lexiconUrl, lexiconEntryUrl);
          }
          break;

        case 'diagram_set':
          // generate html of parsed diagram resource and put it into tab container inner
          ParsedClassicsContentContainers.createDiagramResourceHtml(tabContentContainerInner, collectionDef, resourceDef, resourceData);
          // scroll to the selected line
          ParsedClassicsContentContainers.scrollToLineResourceLoading(tabContentContainerInner, lineIndicatorUrl, activeTabId);
          break;
      

      }
      return;
    }

    // Case V. resource is "scanned" , but collectionShortname|resourceShortname pair from URL and that from DOM are different ++++++++++++++++++++++++
    
    else if (scannedOrTyped === 'scanned' &&  collResPairUrl !== collResPairDom) {
      // update container's attrs ++++++++++++++++++++++++++++++ may be not needed
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, resourceType, scannedOrTyped);


      return;
    }
    
  },

  updateContainerAttrs: function(container, collResPair, lineIndicator, lemma, lexicon, lexiconEntry, resourceType, scannedOrTyped) {
    // save collectionShortname|resourceShortname pair as DOM attr
    container.attr(ParsedClassicsAppVars.collResPairAttr, collResPair);
    // save line indicator as DOM attr
    container.attr(ParsedClassicsAppVars.lineNumberAttr, lineIndicator);
    // save lemma as DOM attr
    container.attr(ParsedClassicsAppVars.lemmaAttr, lemma);
    // save lexicon shortname())s as DOM attr
    container.attr(ParsedClassicsAppVars.lexiconAttr, lexicon);
    // save lexicon entry(ies) positions(s) as DOM attr
    container.attr(ParsedClassicsAppVars.lexiconEntryAttr, lexiconEntry);
    // save resource type as DOM attr in order to apply styles relevant to that resource type
    container.attr(ParsedClassicsAppVars.resourceTypeAttr, resourceType);
    // save scanned or typed value as DOM attr in order to apply relevant styles 
    container.attr(ParsedClassicsAppVars.scannedOrTypedAttr, scannedOrTyped);
  },

  createAvailableResourcesListHtml: function(collectionDef, resourceDefs) { 
    let html = `
      <h1>${collectionDef['author_orig']}</h1>
      <h1>${collectionDef['collections_page_title_orig']}</h1>
      <h2>Resources</h2>
    `;
    
    // get all resource shortnames
    const resShortnamesAll = Object.keys(resourceDefs);
    // loop through resource shortnames
    for (let i = 0; i < resShortnamesAll.length; i++) {
      // get resource definition of current resource
      const resourceDefCurr = resourceDefs[resShortnamesAll[i]];
      // get resource selectbox title
      const resTitle = resourceDefCurr['library_app_selectbox_title'];
      // get resource type of current resource
      const resTypeCurr = resourceDefCurr['resource_type'];
      // get resource type label
      const resTypeLabel = ParsedClassicsAppVars.resourceTypeLabels[resTypeCurr];
      // get resource definition of previous resource
      const resourceDefPrev = i - 1 >= 0 ? resourceDefs[resShortnamesAll[i - 1]] : '';
      // get resource type of previous resource
      const resTypePrev = resourceDefPrev ? resourceDefPrev['resource_type'] : '';
      // create item of the list
      const itemHtml = `${resTitle}<br>\n`;
      // is this the first resource?
      if (i === 0) {
        html += '<div class="pc-padding-bottom-16">\n';
        html += `<span class="pc-resource-list-heading">Type: ${resTypeLabel}</span><br>\n`;
        html += itemHtml;
        // is it the only resource?
        if (resShortnamesAll.length === 1) {
          html += '</div>\n';
        }
      }
      // is this not first and not last resource?
      else if (i > 0 && i < resShortnamesAll.length - 1) {
        if (resTypeCurr !== resTypePrev) {
          html += '</div>\n';
          html += '<div class="pc-padding-bottom-16">\n';
          html += `<span class="pc-resource-list-heading">Type: ${resTypeLabel}</span><br>\n`;
        }
        html += itemHtml;
      }
      // is this the last resource?
      else if (i === resShortnamesAll.length - 1) {
        if (resTypeCurr !== resTypePrev) {
          html += '</div>\n';
          html += '<div class="pc-padding-bottom-16">\n';
          html += `<span class="pc-resource-list-heading">Type: ${resTypeLabel}</span><br>\n`;
        }
        html += itemHtml;
        html += '</div>\n';
      }
    }
    return html;
  },

  splitParsedTextContainer: function(activeTabId, tabContentContainerInner) {
    const splitHtml = `
      <div class="${ParsedClassicsAppVars.parsedTextContainerTopPartClass}" id="parsed-text-split-top-${activeTabId}"></div>
      <div class="${ParsedClassicsAppVars.parsedTextContainerBottomPartClass}" id="parsed-text-split-bottom-${activeTabId}"></div>
    `;
    tabContentContainerInner.html(splitHtml);
    const parsedTextContainerTopPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.parsedTextContainerTopPartClass}`);
    const parsedTextContainerBottomPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.parsedTextContainerBottomPartClass}`);
    Split([parsedTextContainerTopPart[0], parsedTextContainerBottomPart[0]], {
      sizes: [95, 5],
      direction: 'vertical',
      gutterSize: 4,
      minSize: ParsedClassicsAppVars.parsedTextSplitMinSizes,
      snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
      cursor: ParsedClassicsAppVars.verticalSplitterCursor,
    });
    return {parsedTextContainerTopPart, parsedTextContainerBottomPart};
  },
  
  createParsedTextResourceHtml: function(parsedTextContainerTopPart, collectionDef, resourceDef, resourceData) {
    const html = `
      <div class="${ParsedClassicsAppVars.lineNumberClass} pc-padding-top-8" ${ParsedClassicsAppVars.lineNumberAttr}="title"></div>
      <h1>${collectionDef['author_orig']}</h1>
      <h1>${resourceDef['library_app_panel_title']}</h1>
      <span class="text-from">Text based on: ${resourceDef['library_app_panel_text_from']}</span>
    `;
    parsedTextContainerTopPart.html(html + resourceData);
  },

  createLexiconResourceHtml: function(tabContentContainerInner, resourceDef, resourceData) {
    let html = `
      <span class="text-from title">Source: ${resourceDef['library_app_panel_text_from']}</span>
    `;
    if (resourceDef['library_app_panel_note']) {
      html += `
        <span class="text-from">${resourceDef['library_app_panel_note']}</span>
      `;
    }
    tabContentContainerInner.html(html + resourceData);
  },

  createConcordanceResourceHtml: function(concordanceContainerLeftPart, collectionDef, resourceDef, resourceData) {
    let html = `
      <div class="${ParsedClassicsAppVars.lineNumberClass} pc-padding-top-8" ${ParsedClassicsAppVars.lineNumberAttr}="title"></div>
      <h1>${resourceDef['library_app_panel_title']}</h1>
      
    `;
    if (resourceDef['library_app_panel_note']) {
      html += `
        <span class="text-from">${resourceDef['library_app_panel_note']}</span>
      `;
    }
    concordanceContainerLeftPart.html(html + resourceData);
  },

  createDiagramResourceHtml: function(tabContentContainerInner, collectionDef, resourceDef, resourceData) {
    const html = `
      <div class="${ParsedClassicsAppVars.lineNumberClass} pc-padding-top-8" ${ParsedClassicsAppVars.lineNumberAttr}="title"></div>
      <h1>${collectionDef['author_orig']}</h1>
      <h1>${collectionDef['collections_page_title_orig']}<h1>
      <h1>${resourceDef['library_app_panel_title']}</h1>
      <span class="text-from">Text based on: ${resourceDef['library_app_panel_text_from']}</span>
    `;
    tabContentContainerInner.html(html + resourceData);
  },

  splitConcordanceContainer: function(activeTabId, tabContentContainerInner) {
    const splitHtml = `
      <div class="${ParsedClassicsAppVars.concordanceContainerLeftPartClass}" id="concordance-split-left-${activeTabId}"></div>
      <div class="${ParsedClassicsAppVars.concordanceContainerRightPartClass}" id="concordance-split-right-${activeTabId}">
        <div class="${ParsedClassicsAppVars.concordanceDependencyTopPartClass}" id="concordance-dependency-split-top-${activeTabId}"></div>
        <div class="${ParsedClassicsAppVars.concordanceDependencyBottomPartClass}" id="concordance-dependency-split-bottom-${activeTabId}"></div>
      </div>
    `;
    tabContentContainerInner.html(splitHtml);
    const concordanceContainerLeftPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.concordanceContainerLeftPartClass}`);
    const concordanceContainerRightPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.concordanceContainerRightPartClass}`);
    const dependencyContainerTopPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.concordanceDependencyTopPartClass}`);
    const dependencyContainerBottomPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.concordanceDependencyBottomPartClass}`);
    Split([concordanceContainerLeftPart[0], concordanceContainerRightPart[0]], {
      sizes: [50, 50],
      direction: 'horizontal',
      gutterSize: 4,
      minSize: [70, 70],
      snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
      cursor: ParsedClassicsAppVars.horizontalSplitterCursor,
    });
    Split([dependencyContainerTopPart[0], dependencyContainerBottomPart[0]], {
      sizes: [95, 5],
      direction: 'vertical',
      gutterSize: 4,
      minSize: ParsedClassicsAppVars.parsedTextSplitMinSizes,
      snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
      cursor: ParsedClassicsAppVars.verticalSplitterCursor,
    });
    return {concordanceContainerLeftPart, concordanceContainerRightPart, dependencyContainerTopPart, dependencyContainerBottomPart};
  },

  scrollToLineResourceLoading: function(container, lineIndicatorFromUrl, activeTabId) {
    // clear previous interval if such found
    if (ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId]) {
      clearInterval(ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId]);
    }

    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // close alert dialogue that may be open
    ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);
    // close confirm dialogue that may be open 
    ParsedClassicsConfirmDialogue.closeConfirmDialogueWithoutClick(paneId);
    // get id of container to be scrolled 
    const containerId = container.attr('id');
    // initiate interval counter
    let count = 0;
    const maxCount = 20;
    ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId] = setInterval(function(){
      if(count < maxCount){
        // get line to be scrolled
        const lineToScroll = container.find(`.${ParsedClassicsAppVars.lineNumberClass}[${ParsedClassicsAppVars.lineNumberAttr}="${lineIndicatorFromUrl}"]`);
        // find if line to be scrolled is already in DOM
        const renderedLength = lineToScroll.length;
        // find if line to be scrolled is already in viewport, i.e. is already seen
        const inViewportLength = lineToScroll.isInViewport({tolerance: 0, viewport: `#${containerId}`}).length;
        // line to be scrolled is in DOM - let's scroll it into view
        if (renderedLength === 1) {
          container.scrollTo(lineToScroll, ParsedClassicsAppVars.animationSpeed);
          // line to be scrolled is in DOM and in viewport? - let's clear interval
          if (inViewportLength === 1) {
            clearInterval(ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId]);
          }
        }
        // show alert that the line was not found 
        else if (renderedLength === 0 && count === maxCount - 1) {
          ParsedClassicsAlertDialogue.openDialogue(paneId, {
            heading: 'Not found',
            message: `The line ${lineIndicatorFromUrl} was not found.`,
          });
        }
        count++;
      }
    }, 50); 
  
  },

  scrollToLineResourceLoaded: function(container, lineIndicatorFromUrl, activeTabId) {
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // close alert dialogue that may be open
    ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);
    // close confirm dialogue that may be open 
    ParsedClassicsConfirmDialogue.closeConfirmDialogueWithoutClick(paneId);
    // get id of container to be scrolled 
    const containerId = container.attr('id');
    // get line to be scrolled
    const lineToScroll = container.find(`.${ParsedClassicsAppVars.lineNumberClass}[${ParsedClassicsAppVars.lineNumberAttr}="${lineIndicatorFromUrl}"]`);
    // find if ther is only one el in DOM
    const renderedLength = lineToScroll.length;
    // find if line to be scrolled is already in viewport, i.e. is already seen
    const inViewportLength = lineToScroll.isInViewport({tolerance: 0, viewport: `#${containerId}`}).length;
    // line to be scrolled is in DOM - let's scroll it into view
    if (renderedLength === 1 && inViewportLength === 0) {
      container.scrollTo(lineToScroll, ParsedClassicsAppVars.animationSpeed);
    }
    else if (renderedLength === 0) {
      ParsedClassicsAlertDialogue.openDialogue(paneId, {
        heading: 'Not found',
        message: `The line ${lineIndicatorFromUrl} was not found.`,
      });
    }
  },

  scrollToWordResourceLoading: function(container, lemma, headingClass, activeTabId, resourceShortname, lexicon, lexiconEntry) {
    // clear previous interval if such found
    if (ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId]) {
      clearInterval(ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId]);
    }
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // close alert dialogue that may be open
    ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);
    // close confirm dialogue that may be open 
    ParsedClassicsConfirmDialogue.closeConfirmDialogueWithoutClick(paneId);
    // escape braces in lemma
    let lemmaEscaped = lemma.replace("(", "\\(");
    lemmaEscaped = lemmaEscaped.replace(")", "\\)");

    // get id of container to be scrolled 
    const containerId = container.attr('id');

    // convert lexicon shortname string into array
    const lexiconArr = lexicon ? lexicon.split("|") : [];
    // convert lexicon entry order number string into array
    const lexiconEntryArr = lexiconEntry ? lexiconEntry.split("|") : [];
    // is current resource in lexicon array?
    const lexiconIndex = $.inArray(resourceShortname, lexiconArr);
    // is there lexicon entry number at the same index as lexicon in lexicon array?
    let lexiconEntryNum;
    if (typeof lexiconEntryArr[lexiconIndex] != "undefined") {
      lexiconEntryNum = lexiconEntryArr[lexiconIndex];
    }
    // if there is not, the first entry will be loaded
    else {
      lexiconEntryNum = 1;
    }

    // initiate interval counter
    let count = 0;
    const maxCount = 20;
    ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId] = setInterval(function(){
      if(count < maxCount){
        // get el to be scrolled
        let elToBeScrolled = container.find(`.${headingClass}`).filter("[" + ParsedClassicsAppVars.lemmaAttr + "=" + lemmaEscaped + "]");	
        // find if el to be scrolled is already in DOM
        const renderedLength = elToBeScrolled.length;
        // find if el to be scrolled is already in viewport, i.e. is already seen
        const inViewportLength = elToBeScrolled.isInViewport({tolerance: 0, viewport: `#${containerId}`}).length;
        // elto be scrolled is in DOM, but not in viewport? - let's scroll it into view
        if (renderedLength === 1) {
          container.scrollTo(elToBeScrolled, ParsedClassicsAppVars.animationSpeed); 
          // el to be scrolled is in DOM and in viewport? - let's clear interval
          if (inViewportLength === 1) {
            clearInterval(ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId]);
          }
        }
        // two or more words having the same lemma were found
        else if (renderedLength > 1) {
          // get word entry to be scrolled
          elToBeScrolled = $(elToBeScrolled.get(lexiconEntryNum - 1));
          // find if el to be scrolled is already in viewport, i.e. is already seen
          const inViewportLength = elToBeScrolled.isInViewport({tolerance: 0, viewport: `#${containerId}`}).length;
          // scroll it to top
          container.scrollTo(elToBeScrolled, ParsedClassicsAppVars.animationSpeed);
          if (inViewportLength === 1) {
            // clear interval
            clearInterval(ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId]);
          }
        }
        // show alert that the word was not found 
        else if (renderedLength === 0 && count === maxCount - 1) {
          ParsedClassicsAlertDialogue.openDialogue(paneId, {
            heading: 'Not found',
            message: `The word ${lemma} was not found.`,
          });
        } 
        count++;
      }
    }, 50);
  },

  scrollToWordResourceLoaded: function(container, lemma, headingClass, activeTabId, resourceShortname, lexicon, lexiconEntry) {
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // close alert dialogue that may be open
    ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);
    // close confirm dialogue that may be open 
    ParsedClassicsConfirmDialogue.closeConfirmDialogueWithoutClick(paneId);
    // escape braces in lemma
    let lemmaEscaped = lemma.replace("(", "\\(");
    lemmaEscaped = lemmaEscaped.replace(")", "\\)");

    // get id of container to be scrolled 
    const containerId = container.attr('id');

    // convert lexicon shortname string into array
    const lexiconArr = lexicon ? lexicon.split("|") : [];
    // convert lexicon entry order number string into array
    const lexiconEntryArr = lexiconEntry ? lexiconEntry.split("|") : [];
    // is current resource in lexicon array?
    const lexiconIndex = $.inArray(resourceShortname, lexiconArr);
    // is there lexicon entry number at the same index as lexicon in lexicon array?
    let lexiconEntryNum;
    if (typeof lexiconEntryArr[lexiconIndex] != "undefined") {
      lexiconEntryNum = lexiconEntryArr[lexiconIndex];
    }
    // if there is not, the first entry will be loaded
    else {
      lexiconEntryNum = 1;
    }

    // get el to be scrolled
    let elToBeScrolled = container.find(`.${headingClass}`).filter("[" + ParsedClassicsAppVars.lemmaAttr + "=" + lemmaEscaped + "]");	
    // find number of els in DOM
    const renderedLength = elToBeScrolled.length;
    // one el to be scrolled is in DOM
    if (renderedLength === 1) {
      // scroll it to top
      container.scrollTo(elToBeScrolled, ParsedClassicsAppVars.animationSpeed);
    }
    // two or more words having the same lemma were found
    else if (renderedLength > 1) {
      // get word entry to be scrolled
      elToBeScrolled = $(elToBeScrolled.get(lexiconEntryNum - 1));
      // scroll it to top
      container.scrollTo(elToBeScrolled, ParsedClassicsAppVars.animationSpeed);
    }
    // show alert that the word was not found
    else if (renderedLength === 0) {
      ParsedClassicsAlertDialogue.openDialogue(paneId, {
        heading: 'Not found',
        message: `The word ${lemma} was not found.`,
      });
    }
  },

};
