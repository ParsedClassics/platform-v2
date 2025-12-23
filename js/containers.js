/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/


// this is needed because Firefox browser on reloading the page might incorrectly restore scroll position in active tabs in which "typed" resources are loaded
history.scrollRestoration = "manual";

const ParsedClassicsContentContainers = {
  
  scrollFuncIntervals: {},

  treatActiveTabContentContainer: function (pane, activeTabId, refresh) {
    // get pane's bottom part el
    const paneBottomPart = pane.find(`.${ParsedClassicsAppVars.paneBottomPartClass}`);
    // get TAB's content container 
    const tabContentContainer = paneBottomPart.find(`#tab-content-${activeTabId}`);
    // get inner container
    const tabContentContainerInner = tabContentContainer.find(`.${ParsedClassicsAppVars.tabContentInnerClass}`);
    // get collection shortname and resource shortname from URL
    const {collectionShortname, resourceShortname} = ParsedClassicsLayout.getCollAndResShortnameFromTabId(activeTabId);

    // get collection's definition
    const collectionDef = ParsedClassicsCollDefs[collectionShortname];
    // get all resource definitions of collection
    const resourceDefsAll = collectionDef['resource_defs'];
    // get resource's definition
    const resourceDef = resourceShortname ? resourceDefsAll[resourceShortname] : '';
    // is resource scanned or typed?
    const scannedOrTyped = resourceDef ? resourceDef['scanned_or_typed'] : '';
    // is contents line, paragraph or page based?
    const contentsType = collectionDef['contents_type'];
    
    // get type of the resource
    const resourceType = resourceDef ? resourceDef['resource_type'] : '';
    // get all resources data of collection
    const resourceDataOfCollection = APP.loadedResourcesData[collectionShortname] ?? '';
    // get resouce data
    const resourceData = resourceDataOfCollection && resourceShortname ? resourceDataOfCollection[resourceShortname].data : '';
    // get resource contents
    const resourceContents = resourceDataOfCollection && resourceShortname ? resourceDataOfCollection[resourceShortname].contents : '';
    
    // generate collectionShortname|resourceShortname pair
    const collResPairUrl = collectionShortname && resourceShortname ? `${collectionShortname}|${resourceShortname}` : collectionShortname;
    // get collectionShortname|resourceShortname pair saved as container's attr
    const collResPairDom = tabContentContainer.attr(ParsedClassicsAppVars.collResPairAttr) ?? '';

    // get page indicator from url
    let pageUrl = ParsedClassicsLayout.getPageIndicatorFromUrl(collectionShortname, activeTabId);
    // get page indicator saved as dom attr
    let pageDom = tabContentContainer.attr(ParsedClassicsAppVars.pageAttr) ?? '';

    // get line indicator from url
    const lineIndicatorUrl = ParsedClassicsLayout.getLineIndicatorFromUrl(collectionShortname);
    // get line indicator saved as dom attr
    const lineIndicatorDom = tabContentContainer.attr(ParsedClassicsAppVars.lineNumberAttr) ?? '';

    // get paragraph indicator from url
    const paragraphIndicatorUrl = ParsedClassicsLayout.getParagraphIndicatorFromUrl(collectionShortname);
    // get paragraph indicator saved as dom attr
    const paragraphIndicatorDom = tabContentContainer.attr(ParsedClassicsAppVars.paragraphNumberAttr) ?? '';

    // get lemma from URL
    const wordUrl = ParsedClassicsLayout.getWordFromUrl(collectionShortname) ?? '';
    // get lemma from DOM
    const wordDom = tabContentContainer.attr(ParsedClassicsAppVars.lemmaAttr) ?? '';

    // get word form from URL
    const formUrl = ParsedClassicsLayout.getFormFromUrl(collectionShortname) ?? '';
    // get word form from DOM
    const formDom = tabContentContainer.attr(ParsedClassicsAppVars.formAttr) ?? '';

    // get lexicon info and lexicon entry info info from URL 
    const {lexicon: lexiconUrl, lexiconEntry: lexiconEntryUrl} = ParsedClassicsLayout.getLexiconAndEntryFromUrl(collectionShortname);
    // get lexicon info from DOM 
    const lexiconDom = tabContentContainer.attr(ParsedClassicsAppVars.lexiconAttr) ?? '';
    // get lexicon entry info info from DOM 
    const lexiconEntryDom = tabContentContainer.attr(ParsedClassicsAppVars.lexiconEntryAttr) ?? '';

    // Case I. there is no resource shortname, so we need to display list of resources contained in collection

    if (!resourceShortname  &&  collResPairUrl !== collResPairDom) {
      // update container's attrs
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, 'resources_list', 'typed', paragraphIndicatorUrl, pageUrl, formUrl);
      // create html of available resources
      const resourcesListHtml = ParsedClassicsContentContainers.createAvailableResourcesListHtml(collectionDef, resourceDefsAll);
      // update container's html
      const tabContentInnerEl = tabContentContainer.find(`.${ParsedClassicsAppVars.tabContentInnerClass}`);
      tabContentInnerEl.html(resourcesListHtml);
      // make sure scroll position is not retained from content loaded earlier
      tabContentInnerEl[0].scrollTop = 0;

      return;
    }

    // Case II. resource is "typed" and collectionShortname|resourceShortname pair from URL and that from DOM are identical
    // so we need to scroll to selected line or word

    else if (scannedOrTyped === 'typed' &&  collResPairUrl === collResPairDom) {

      // update container's attrs
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, resourceType, scannedOrTyped, paragraphIndicatorUrl, pageUrl, formUrl);

      switch(resourceType) {
        
        case 'parsed_text':
        const parsedTextContainerTopPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.parsedTextContainerTopPartClass}`);
        if (contentsType === 'line') {
          // treat selected line and word
          ParsedClassicsSelectedLine.treatSelectedLineAndWord(parsedTextContainerTopPart, collectionShortname);
          // scroll to selected line
          if (lineIndicatorUrl !== lineIndicatorDom || refresh) { // commented out because of the bug typed text scrolling to top after tab's move to other pane
            ParsedClassicsContentContainers.scrollToLineResourceLoaded(parsedTextContainerTopPart, lineIndicatorUrl, activeTabId);
          }
        }
        else if (contentsType === 'paragraph') {
          // treat selected paragraph 
            ParsedClassicsSelectedParagraph.treatSelectedParagraph(parsedTextContainerTopPart, collectionShortname);
          // scroll to selected paragraph
          if (paragraphIndicatorUrl !== paragraphIndicatorDom || refresh) {
            ParsedClassicsContentContainers.scrollToParaResourceLoaded(parsedTextContainerTopPart, paragraphIndicatorUrl, activeTabId);
          }
        }
        break;

        case 'lexicon':
          // scroll to selected word 
          if (wordUrl && wordUrl !== wordDom || refresh) { // commented out because of the bug typed text scrolling to top after tab's move to other pane
            ParsedClassicsContentContainers.scrollToWordResourceLoaded(tabContentContainerInner, wordUrl, ParsedClassicsAppVars.lexiconWordHeadingClass, activeTabId, resourceShortname, lexiconUrl, lexiconEntryUrl);
          }
          break;

        case 'concordance':
          const concordanceContainerLeftPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.concordanceContainerLeftPartInnerClass}`);
          // scroll to selected word
          if (wordUrl && wordUrl !== wordDom || refresh) { // commented out because of the bug typed text scrolling to top after tab's move to other pane
            ParsedClassicsContentContainers.scrollToWordResourceLoaded(concordanceContainerLeftPart, wordUrl, ParsedClassicsAppVars.concordanceWordHeadingClass, activeTabId, resourceShortname, lexiconUrl, lexiconEntryUrl);
          }
          break;

        case 'commentary_refs':
          const commentaryRefsContainerLeftPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.commentaryRefsContainerLeftPartInnerClass}`);
          // scroll to the selected line
          if (lineIndicatorUrl !== lineIndicatorDom || refresh) { // commented out because of the bug typed text scrolling to top after tab's move to other pane
            ParsedClassicsContentContainers.scrollToLineResourceLoaded(commentaryRefsContainerLeftPart, lineIndicatorUrl, activeTabId);
          }
          break;

        case 'grammar_refs':
          const grammarRefsContainerLeftPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.grammarRefsContainerLeftPartInnerClass}`);
          // scroll to the selected line
          if (lineIndicatorUrl !== lineIndicatorDom || refresh) { // commented out because of the bug typed text scrolling to top after tab's move to other pane
            ParsedClassicsContentContainers.scrollToLineResourceLoaded(grammarRefsContainerLeftPart, lineIndicatorUrl, activeTabId);
          }
          break;

        case 'diagram_set':
          // scroll to the selected line
          if (lineIndicatorUrl !== lineIndicatorDom || refresh) { // commented out because of the bug typed text scrolling to top after tab's move to other pane
            ParsedClassicsContentContainers.scrollToLineResourceLoaded(tabContentContainerInner, lineIndicatorUrl, activeTabId);
          }
          break;

        case 'audio_recording':
          // jump to audio time of selected line  
          if (lineIndicatorUrl !== lineIndicatorDom || refresh) { // commented out because of the bug typed text scrolling to top after tab's move to other pane
            const audioEl = tabContentContainerInner.find('audio').first()[0];
            const activeAudioLine = tabContentContainerInner.find('div.active');
            // we need to remove class 'active' from audio text in order to scroll this line to the view, because after moving tab to other pane, audio ta's content is being scrolled to the top
            activeAudioLine.removeClass('active');
            ParsedClassicsContentContainers.jumpToAudioTime(lineIndicatorUrl, collectionShortname, resourceShortname, audioEl, activeTabId);
          }
          break;

        case 'external_service':
          if (formUrl && formUrl !== formDom || refresh) {
            // get service's update function
            const updateFunction = resourceContents.update_func;
            // run update function
            updateFunction(activeTabId);
          }
          break;
      }

      return;
    }

    // Case III. resource is "scanned" and collectionShortname|resourceShortname pair from URL and that from DOM are identical
    // so we need to scroll to selected line which is in certain SCANNED PAGE if line indicator from URL and that from DOM are different 
    // or to scroll to selected word which is in certain SCANNED PAGE if word from URL and that from DOM are different
    // or to scroll to selected page which is in certain SCANNED PAGE if page from URL and that from DOM are different

    else if (scannedOrTyped === 'scanned' &&  collResPairUrl === collResPairDom) {
      // update container's attrs 
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, resourceType, scannedOrTyped, paragraphIndicatorUrl, pageUrl, formUrl);
      // selected line was changed?
      if (contentsType === 'line' && lineIndicatorUrl !== lineIndicatorDom) { 
        if (resourceType === 'original_text' || resourceType === 'translation' || resourceType === 'commentary') {
          // get iframe el
          const iframeEl = tabContentContainerInner.find('.pc-bookreader');
          // browse scanned resource in the iframe to selected line
          ParsedClassicsContentContainers.browseToSelectedLine(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, lineIndicatorUrl);
        }
      }
      else if (contentsType === 'paragraph' && paragraphIndicatorUrl !== paragraphIndicatorDom) {
        if (resourceType === 'original_text') {
          // get iframe el
          const iframeEl = tabContentContainerInner.find('.pc-bookreader');
          // browse scanned resource in the iframe to selected paragraph
          ParsedClassicsContentContainers.browseToSelectedLine(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, paragraphIndicatorUrl);
        }
      }
      // selected word was changed?
      if (wordUrl !== wordDom) {
        const iframeEl = tabContentContainerInner.find('.pc-bookreader');
        if (resourceType === 'concordance' || resourceType === 'lexicon') {
          // browse scanned resource in the iframe to selected word
          ParsedClassicsContentContainers.browseToSelectedWord(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, wordUrl);
        }
        if (resourceType === 'lexicon') {
          const lexiconContainerLeftPartInner = tabContentContainerInner.find(`.${ParsedClassicsAppVars.lexiconContainerLeftPartInnerClass}`);
          // find selected lemma ans scroll it into view
          ParsedClassicsSelectedLemma.treatSelectedLemma(lexiconContainerLeftPartInner, collectionShortname);
        }
      }
      // selected page was changed? 
      if (pageUrl !== pageDom) {
        const iframeEl = tabContentContainerInner.find('.pc-bookreader');
        if (resourceType === 'reader') {
          // browse scanned resource in the iframe to selected page
          ParsedClassicsContentContainers.browseToSelectedPage(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, pageUrl);
        }
      }

      return;
    }

    // Case IV. resource is "typed", but collectionShortname|resourceShortname pair from URL and that from DOM are different

    else if (scannedOrTyped === 'typed' &&  collResPairUrl !== collResPairDom) {

      // update container's attrs
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, resourceType, scannedOrTyped, paragraphIndicatorUrl, pageUrl, formUrl);
      
      switch(resourceType) {

        case 'info_text': 
          // put html into container 
          tabContentContainerInner.html(resourceData);
          break;

        case 'parsed_text':
          // is parsing done via external services?
          const parsing_external = typeof resourceDef['extra']['parsing_via_ext_services'] !== 'undefined' ? resourceDef['extra']['parsing_via_ext_services'] : '';
          // split container if needed into top part for text and bottom part for morphology  
          var {parsedTextContainerTopPart, parsedTextContainerBottomPart} = ParsedClassicsContentContainers.splitParsedTextContainer(activeTabId, tabContentContainerInner, parsing_external);
          // generate html of parsed text resource and put it into top part of splitted container
          ParsedClassicsContentContainers.createParsedTextResourceHtml(parsedTextContainerTopPart, collectionDef, resourceDef, resourceData);
          // undelegate "mouseenter", "mouseleave" and "click" events
          tabContentContainerInner.undelegate("mouseenter");
          tabContentContainerInner.undelegate("mouseleave");
          tabContentContainerInner.undelegate("click");
          if (contentsType === 'line') {
            // delegate "mouseenter" and "mouseleave" events from els having class "word" to tab's inner content container
            tabContentContainerInner.delegate(`.${ParsedClassicsAppVars.wordClass}`, "mouseenter", (event) => ParsedClassicsMorphology.selectedWordMouseEnter(event, parsedTextContainerBottomPart));
            tabContentContainerInner.delegate(`.${ParsedClassicsAppVars.wordClass}`, "mouseleave", () => ParsedClassicsMorphology.selectedWordMouseLeave(parsedTextContainerBottomPart));
            // delegate "click" event from els having class "line" to tab's inner content container
            tabContentContainerInner.delegate(`.${ParsedClassicsAppVars.lineClass}`, "click", (event) => ParsedClassicsSelectedLine.hashSelectLineAndWord(event, collectionShortname, parsedTextContainerTopPart));
            if (parsing_external === 'yes') {
              // add event to catch text selection
              tabContentContainerInner.on('mouseup', (event) => ParsedClassicsSelectedText.hashSelectWordOrText(event, collectionShortname));
            }
            // treat selected line and word
            ParsedClassicsSelectedLine.treatSelectedLineAndWord(parsedTextContainerTopPart, collectionShortname);
            // scroll to the selected line
            ParsedClassicsContentContainers.scrollToLineResourceLoading(parsedTextContainerTopPart, lineIndicatorUrl, activeTabId);
          }
          else if (contentsType === 'paragraph') {
            // delegate "click" event from <p> els to tab's inner content container
            tabContentContainerInner.delegate(`p`, "click", (event) => ParsedClassicsSelectedParagraph.hashSelectParagraph(event, collectionShortname, parsedTextContainerTopPart));
            if (parsing_external === 'yes') {
              // add event to catch text selection
              tabContentContainerInner.on('mouseup', (event) => ParsedClassicsSelectedText.hashSelectWordOrText(event, collectionShortname));
            }
            // treat selected paragraph 
            ParsedClassicsSelectedParagraph.treatSelectedParagraph(parsedTextContainerTopPart, collectionShortname);
            // scroll to the selected paragraph 
            ParsedClassicsContentContainers.scrollToParaResourceLoading(parsedTextContainerTopPart, paragraphIndicatorUrl, activeTabId);
          }
          
          break;

        case 'lexicon':
          ParsedClassicsContentContainers.createLexiconTypedResourceHtml(tabContentContainerInner, resourceDef, resourceData);
          // delegate "click" event from els having class "inner-link" to tab's inner content container
          tabContentContainerInner.undelegate("click");
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
          concordanceContainerLeftPart.undelegate('click');
          concordanceContainerLeftPart.delegate(`.${ParsedClassicsAppVars.concordanceLinesBtnClass}`, 'click', (event) => ParsedClassicsConcordanceLinesButton.btnClicked(event));
          // delegate "click" event from els having class "concordance-line-number" to left part of splitted container
          concordanceContainerLeftPart.delegate(`.${ParsedClassicsAppVars.concordanceLineRefBtnClass}`, 'click', (event) => ParsedClassicsConcordanceLineRefButton.btnClicked(event, concordanceContainerLeftPart, dependencyContainerTopPart, resourceShortname, resourceContents, activeTabId));
          // delegate "mouseenter" and "mouseleave" events from els having class "word" to concodance container's right part
          concordanceContainerLeftPart.undelegate("mouseenter");
          concordanceContainerRightPart.delegate(`.${ParsedClassicsAppVars.wordClass}`, "mouseenter", (event) => ParsedClassicsMorphology.selectedWordMouseEnter(event, dependencyContainerBottomPart));
          concordanceContainerLeftPart.undelegate("mouseleave");
          concordanceContainerRightPart.delegate(`.${ParsedClassicsAppVars.wordClass}`, "mouseleave", () => ParsedClassicsMorphology.selectedWordMouseLeave(dependencyContainerBottomPart));
          // scroll to selected word
          if (wordUrl) {
            const concordanceContainerLeftPartInner = concordanceContainerLeftPart.find(`.${ParsedClassicsAppVars.concordanceContainerLeftPartInnerClass}`);
            ParsedClassicsContentContainers.scrollToWordResourceLoading(concordanceContainerLeftPartInner, wordUrl, ParsedClassicsAppVars.concordanceWordHeadingClass, activeTabId, resourceShortname, lexiconUrl, lexiconEntryUrl);
          }
          break;

        case 'commentary_refs':
          // split container into left part for commentary references and right part for displaying scanned book
          const {commentaryRefsContainerLeftPart, commentaryRefsContainerRightPart} = ParsedClassicsContentContainers.splitCommentaryRefsContainer(activeTabId, tabContentContainerInner);
          // generate html of grammar refs text resource and put it into left part of splitted container
          ParsedClassicsContentContainers.createCommentaryRefsResourceHtml(commentaryRefsContainerLeftPart, collectionDef, resourceDef, resourceData);
          // delegate "click" event from <a> els to left part of splitted container
          commentaryRefsContainerLeftPart.delegate('a', 'click', (event) => ParsedClassicsRefLink.refLinkClick(event, commentaryRefsContainerRightPart, ParsedClassicsAppVars.commentaryBookAttr));
          // scroll to the selected line
          const commentaryRefsContainerLeftPartInner = commentaryRefsContainerLeftPart.find(`.${ParsedClassicsAppVars.commentaryRefsContainerLeftPartInnerClass}`);
          ParsedClassicsContentContainers.scrollToLineResourceLoading(commentaryRefsContainerLeftPartInner, lineIndicatorUrl, activeTabId);
          break;

        case 'grammar_refs':
          // split container into left part for grammar references and right part for displaying scanned book
          const {grammarRefsContainerLeftPart, grammarRefsContainerRightPart} = ParsedClassicsContentContainers.splitGrammarRefsContainer(activeTabId, tabContentContainerInner);
          // generate html of grammar refs text resource and put it into left part of splitted container
          ParsedClassicsContentContainers.createGrammarRefsResourceHtml(grammarRefsContainerLeftPart, collectionDef, resourceDef, resourceData);
          // delegate "click" event from <a> els to left part of splitted container
          grammarRefsContainerLeftPart.delegate('a', 'click', (event) => ParsedClassicsRefLink.refLinkClick(event, grammarRefsContainerRightPart, ParsedClassicsAppVars.grammarBookAttr));
          // scroll to the selected line
          const grammarRefsContainerLeftPartInner = grammarRefsContainerLeftPart.find(`.${ParsedClassicsAppVars.grammarRefsContainerLeftPartInnerClass}`);
          ParsedClassicsContentContainers.scrollToLineResourceLoading(grammarRefsContainerLeftPartInner, lineIndicatorUrl, activeTabId);
          break;

        case 'diagram_set':
          // generate html of parsed diagram resource and put it into tab container inner
          ParsedClassicsContentContainers.createDiagramResourceHtml(tabContentContainerInner, collectionDef, resourceDef, resourceData);
          // scroll to the selected line
          ParsedClassicsContentContainers.scrollToLineResourceLoading(tabContentContainerInner, lineIndicatorUrl, activeTabId);
          break;
          
        case 'audio_recording':
          // generate html of audio resource
          const {audioEl, headerEl, audioContainerBottomEl} = ParsedClassicsContentContainers.createAudioResourceHtml(tabContentContainerInner, collectionDef, resourceShortname, resourceDef, resourceData);
          // detach resource header in order not to be reshaped by audio-text sync script
          $(headerEl).detach();
          // reshape html of audio resource by audio-text sync script
          new RabbitLyrics({
            element: audioContainerBottomEl,
            mediaElement: audioEl,
          });
          // reattach resource header 
          audioContainerBottomEl.prepend(headerEl);
          // detach first line and put in in container's top in order to be able to scroll to the title
          const firstLine = $(audioContainerBottomEl).find('.line[data-start="0"]').first();
          firstLine.detach();
          audioContainerBottomEl.prepend(firstLine[0]);
          // jump to audio time of selected line
          ParsedClassicsContentContainers.jumpToAudioTime(lineIndicatorUrl, collectionShortname, resourceShortname, audioEl, activeTabId);
          break;
        
        case 'external_service':
          // generate html of external service resource  
          ParsedClassicsContentContainers.createExternalServiceResourceHtml(tabContentContainerInner, resourceData);
          // run service's init function
          const initFunction = resourceContents.init_func;
          initFunction(activeTabId);
          if (formUrl) {
            // get service's update function
            const updateFunction = resourceContents.update_func;
            // run update function
            updateFunction(activeTabId);
          }
          break;
      }
      return;
    }

    // Case V. resource is "scanned" , but collectionShortname|resourceShortname pair from URL and that from DOM are different 
    
    else if (scannedOrTyped === 'scanned' &&  collResPairUrl !== collResPairDom) {
      // update container's attrs 
      ParsedClassicsContentContainers.updateContainerAttrs(tabContentContainer, collResPairUrl, lineIndicatorUrl, wordUrl, lexiconUrl, lexiconEntryUrl, resourceType, scannedOrTyped, paragraphIndicatorUrl, pageUrl, formUrl);
      // generate html of resource
      let iframeEl;
      if (resourceType !== 'lexicon') {
        iframeEl = ParsedClassicsContentContainers.createScannedResourceHtml(tabContentContainerInner, resourceDef);
      }
      if (resourceType === 'original_text' || resourceType === 'translation' || resourceType === 'commentary') {
        if (contentsType === 'line') {
          // browse scanned resource in the iframe to selected line
          ParsedClassicsContentContainers.browseToSelectedLine(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, lineIndicatorUrl);
        }
        else if (contentsType === 'paragraph') {
          // browse scanned resource in the iframe to selected paragraph
          ParsedClassicsContentContainers.browseToSelectedLine(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, paragraphIndicatorUrl);
        }
      }
      if (resourceType === 'concordance') {
        // browse scanned resource in the iframe to selected word
        ParsedClassicsContentContainers.browseToSelectedWord(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, wordUrl);
      }
      if (resourceType === 'reader') {
        // browse scanned resource in the iframe to selected page
        ParsedClassicsContentContainers.browseToSelectedPage(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, pageUrl);
      }
      if (resourceType == 'lexicon') {
        
        // split container into left part for list of lemmas and right part for displaying scanned book
        const {lexiconContainerLeftPart, lexiconContainerRightPart} = ParsedClassicsContentContainers.splitLexiconContainer(activeTabId, tabContentContainerInner, resourceDef);

        // add scanned book into right subpane
        const iframeEl = ParsedClassicsContentContainers.createScannedResourceHtml(lexiconContainerRightPart, resourceDef);
        iframeEl.css('position', 'absolute').css('left', 0);
        
        // create html of the left subpane
        const lexiconContainerLeftPartInner = ParsedClassicsContentContainers.createLexiconScannedResourceHtml(lexiconContainerLeftPart, resourceContents, resourceDef);
        
        // delegate "click" event from <div> els of lemma buttons to left part of splitted container
        lexiconContainerLeftPartInner.delegate('div', 'click', (event) => ParsedClassicsSelectedLemma.hashSelectLemma(event, collectionShortname));
        // browse scanned resource in the iframe to selected word
        ParsedClassicsContentContainers.browseToSelectedWord(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, wordUrl);
        // find selected lemma and scroll it into view
        ParsedClassicsSelectedLemma.treatSelectedLemma(lexiconContainerLeftPartInner, collectionShortname);
      }
      return;
    }
    
  },

  updateContainerAttrs: function(container, collResPair, lineIndicator, lemma, lexicon, lexiconEntry, resourceType, scannedOrTyped, paragraph, page, wordForm) {
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
    // save paragraph num as DOM attr
    container.attr(ParsedClassicsAppVars.paragraphNumberAttr, paragraph);
    // save page num as DOM attr
    container.attr(ParsedClassicsAppVars.pageAttr, page);
    // save word form as DOM attr
    container.attr(ParsedClassicsAppVars.formAttr, wordForm);
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

  splitParsedTextContainer: function(activeTabId, tabContentContainerInner, parsing_external) {
    const splitHtml = `
      <div class="${ParsedClassicsAppVars.parsedTextContainerTopPartClass}" id="parsed-text-split-top-${activeTabId}"></div>
      <div class="${ParsedClassicsAppVars.parsedTextContainerBottomPartClass}" id="parsed-text-split-bottom-${activeTabId}"></div>
    `;
    tabContentContainerInner.html(splitHtml);
    const parsedTextContainerTopPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.parsedTextContainerTopPartClass}`);
    const parsedTextContainerBottomPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.parsedTextContainerBottomPartClass}`);
    if (parsing_external !== 'yes') {
      Split([parsedTextContainerTopPart[0], parsedTextContainerBottomPart[0]], {
        sizes: [95, 5],
        direction: 'vertical',
        gutterSize: 4,
        minSize: ParsedClassicsAppVars.parsedTextSplitMinSizes,
        snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
        cursor: ParsedClassicsAppVars.verticalSplitterCursor,
      });
    }
    return {parsedTextContainerTopPart, parsedTextContainerBottomPart};
  },
  
  createParsedTextResourceHtml: function(parsedTextContainerTopPart, collectionDef, resourceDef, resourceData) {
    // is contents line, paragraph or page based?
    const contentsType = collectionDef['contents_type'];
    let classAttrVal, numberAttrVal;
    if (contentsType === 'line') {
      classAttrVal = ParsedClassicsAppVars.lineNumberClass;
      numberAttrVal = ParsedClassicsAppVars.lineNumberAttr;
    }
    else if (contentsType === 'paragraph') {
      classAttrVal = ParsedClassicsAppVars.paragraphNumberClass;
      numberAttrVal = ParsedClassicsAppVars.paragraphNumberAttr;
    }
    const html = `
      <div class="${classAttrVal} pc-padding-top-8" ${numberAttrVal}="title"></div>
      <h1>${collectionDef['author_orig']}</h1>
      <h1>${resourceDef['library_app_panel_title']}</h1>
      <p class="text-from">Text based on: <a href="./reader/index.html?${resourceDef['scanned_source_shortname']}" target="_blank">${resourceDef['library_app_panel_text_from']}</a></p>
    `;
    const display_paragraph_numbering_class = typeof resourceDef['extra']['display_paragraph_numbering'] !== 'undefined' && resourceDef['extra']['display_paragraph_numbering'] === 'yes' ? 'display_paragraph_numbering' : '';
    const display_pagination_class = typeof resourceDef['extra']['display_pagination'] !== 'undefined' && resourceDef['extra']['display_pagination'] === 'yes' ? 'display_pagination' : '';
    
    parsedTextContainerTopPart.html(`<div class="${display_paragraph_numbering_class} ${display_pagination_class}">` + html + resourceData + '</div>');
  },

  createLexiconTypedResourceHtml: function(tabContentContainerInner, resourceDef, resourceData) {
    let html = `
      <span class="text-from title">Source: <a href="./reader/index.html?${resourceDef['scanned_source_shortname']}" target="_blank">${resourceDef['library_app_panel_text_from']}</a></span>
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
    concordanceContainerLeftPart.find(`.${ParsedClassicsAppVars.concordanceContainerLeftPartInnerClass}`).html(html + resourceData);
  },

  createCommentaryRefsResourceHtml: function(commentaryRefsContainerLeftPart, collectionDef, resourceDef, resourceData) {
    let html = `
      <div class="${ParsedClassicsAppVars.lineNumberClass} pc-padding-top-8" ${ParsedClassicsAppVars.lineNumberAttr}="title"></div>
      <h1>${resourceDef['library_app_panel_title']}</h1>
      
    `;
    if (resourceDef['library_app_panel_note']) {
      html += `
        <span class="text-from">${resourceDef['library_app_panel_note']}</span>
      `;
    }
    commentaryRefsContainerLeftPart.find(`.${ParsedClassicsAppVars.commentaryRefsContainerLeftPartInnerClass}`).html(html + resourceData);
  },

  createGrammarRefsResourceHtml: function(grammarRefsContainerLeftPart, collectionDef, resourceDef, resourceData) {
    let html = `
      <div class="${ParsedClassicsAppVars.lineNumberClass} pc-padding-top-8" ${ParsedClassicsAppVars.lineNumberAttr}="title"></div>
      <h1>${resourceDef['library_app_panel_title']}</h1>
      
    `;
    if (resourceDef['library_app_panel_note']) {
      html += `
        <span class="text-from">${resourceDef['library_app_panel_note']}</span>
      `;
    }
    grammarRefsContainerLeftPart.find(`.${ParsedClassicsAppVars.grammarRefsContainerLeftPartInnerClass}`).html(html + resourceData);
  },

  createDiagramResourceHtml: function(tabContentContainerInner, collectionDef, resourceDef, resourceData) {
    const html = `
      <div class="${ParsedClassicsAppVars.lineNumberClass} pc-padding-top-8" ${ParsedClassicsAppVars.lineNumberAttr}="title"></div>
      <h1>${collectionDef['author_orig']}</h1>
      <h1>${collectionDef['collections_page_title_orig']}<h1>
      <h1>${resourceDef['library_app_panel_title']}</h1>
      <span class="text-from">Text based on: <a href="./reader/index.html?${resourceDef['scanned_source_shortname']}" target="_blank">${resourceDef['library_app_panel_text_from']}</a></span>
    `;
    tabContentContainerInner.html(html + resourceData);
  },

  createAudioResourceHtml: function(tabContentContainerInner, collectionDef, resourceShortname, resourceDef, resourceData) {
    const html = `
      <div class="audio-container-top">
        <audio preload="auto" controls="" controlslist="nodownload">
          <source src="./_audio/${resourceShortname}/${resourceShortname}.mp3" type="audio/mpeg">
        </audio>
      </div>
      <div class="audio-container-bottom rabbit-lyrics">
        <div class="audio-resource-header">
          <div class="${ParsedClassicsAppVars.lineNumberClass} pc-padding-top-8" ${ParsedClassicsAppVars.lineNumberAttr}="title"></div>
          <h1>${collectionDef['author_orig']}</h1>
          <h1>${collectionDef['collections_page_title_orig']}<h1>
          <h1>${resourceDef['library_app_panel_title']}</h1>
          <span class="text-from">Text based on: <a href="./reader/index.html?${resourceDef['scanned_source_shortname']}" target="_blank">${resourceDef['library_app_panel_text_from']}</a></span>
          <span class="text-from">${resourceDef['library_app_panel_note']}</span>
        </div>
        ${resourceData}
      </div>
    `;
    tabContentContainerInner.html(html);
    const audioEl = tabContentContainerInner.find('audio')[0];
    const headerEl = tabContentContainerInner.find('.audio-resource-header')[0];
    const audioContainerBottomEl = tabContentContainerInner.find('.audio-container-bottom')[0];
    return {audioEl, headerEl, audioContainerBottomEl};
  },

  createLexiconScannedResourceHtml: function(lexiconContainerLeftPart, resourceContents, resourceDef) {
    const lexiconContainerLeftPartInner = lexiconContainerLeftPart.find(`.${ParsedClassicsAppVars.lexiconContainerLeftPartInnerClass}`);
    const lemmaKeys = Object.keys(resourceContents);
    let html = '';
    for (let i = 1; i < lemmaKeys.length; i++) {
      const charCodesStr = lemmaKeys[i].slice(2);
      const charCodesArr = charCodesStr.split('-');
      let lemma = '';
      charCodesArr.forEach(charCode => {lemma += String.fromCodePoint(charCode);});
      let lemmaLowercase = lemma.toLowerCase();
      // normalize Greek lemma, i.e. remove diacritics; from https://stackoverflow.com/questions/23346506/javascript-normalize-accented-greek-characters and https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
      //lemmaLowercase = lemmaLowercase.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      lemmaLowercase = lemmaLowercase.normalize('NFD').replace(/\p{Diacritic}/gu, "");
      html += `<div class="lemma-button" ${ParsedClassicsAppVars.lemmaAttr}="${lemma}" ${ParsedClassicsAppVars.lemmaLowercaseAttr}="${lemmaLowercase}">${lemma}</div>`;
    }
    lexiconContainerLeftPartInner.append(html);
    return lexiconContainerLeftPartInner;
  },

  createExternalServiceResourceHtml: function(tabContentContainerInner, resourceData) {
    let html = resourceData;
    tabContentContainerInner.html(html);
  },

  splitConcordanceContainer: function(activeTabId, tabContentContainerInner) {
    const splitHtml = `
      <div class="${ParsedClassicsAppVars.concordanceContainerLeftPartClass}" id="concordance-split-left-${activeTabId}"><div class="${ParsedClassicsAppVars.concordanceContainerLeftPartInnerClass}"></div></div>
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

  splitCommentaryRefsContainer: function(activeTabId, tabContentContainerInner) {
    const splitHtml = `
      <div class="${ParsedClassicsAppVars.commentaryRefsContainerLeftPartClass}" id="commentary-refs-split-left-${activeTabId}"><div class="${ParsedClassicsAppVars.commentaryRefsContainerLeftPartInnerClass}" id="commentary-refs-split-left-inner-${activeTabId}"></div></div>
      <div class="${ParsedClassicsAppVars.commentaryRefsContainerRightPartClass}" id="commentary-refs-split-right-${activeTabId}"><iframe></iframe></div>
    `;
    tabContentContainerInner.html(splitHtml);
    const commentaryRefsContainerLeftPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.commentaryRefsContainerLeftPartClass}`);
    const commentaryRefsContainerRightPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.commentaryRefsContainerRightPartClass}`);
    Split([commentaryRefsContainerLeftPart[0], commentaryRefsContainerRightPart[0]], {
      sizes: [50, 50],
      direction: 'horizontal',
      gutterSize: 4,
      minSize: [70, 70],
      snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
      cursor: ParsedClassicsAppVars.horizontalSplitterCursor,
    });
    return {commentaryRefsContainerLeftPart, commentaryRefsContainerRightPart};
  },

  splitGrammarRefsContainer: function(activeTabId, tabContentContainerInner) {
    const splitHtml = `
      <div class="${ParsedClassicsAppVars.grammarRefsContainerLeftPartClass}" id="grammar-refs-split-left-${activeTabId}"><div class="${ParsedClassicsAppVars.grammarRefsContainerLeftPartInnerClass}" id="grammar-refs-split-left-inner-${activeTabId}"></div></div>
      <div class="${ParsedClassicsAppVars.grammarRefsContainerRightPartClass}" id="grammar-refs-split-right-${activeTabId}"><iframe></iframe></div>
    `;
    tabContentContainerInner.html(splitHtml);
    const grammarRefsContainerLeftPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.grammarRefsContainerLeftPartClass}`);
    const grammarRefsContainerRightPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.grammarRefsContainerRightPartClass}`);
    Split([grammarRefsContainerLeftPart[0], grammarRefsContainerRightPart[0]], {
      sizes: [50, 50],
      direction: 'horizontal',
      gutterSize: 4,
      minSize: [70, 70],
      snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
      cursor: ParsedClassicsAppVars.horizontalSplitterCursor,
    });
    return {grammarRefsContainerLeftPart, grammarRefsContainerRightPart};
  },

  splitLexiconContainer: function(activeTabId, tabContentContainerInner, resourceDef) {
    // is this Greek lexicon?
    const isGreek = typeof resourceDef['extra'] !== 'undefined' && typeof resourceDef['extra']['language'] !== 'undefined' && resourceDef['extra']['language'] === 'EL' ? true : false;
    // if it is Greek lexicon, add additional class to wrapper and additional class to search input
    const greekLangClassWrapper = isGreek ? 'greek-lang' : '';
    // form html of splitted container
    let splitHtml = `
      <div class="${ParsedClassicsAppVars.lexiconContainerLeftPartClass}" id="lexicon-split-left-${activeTabId}" style="visibility: hidden;">
        <div class="lexicon-search-wrapper ${greekLangClassWrapper}" id="lexicon-search-wrapper-${activeTabId}">
          <input type="text" class="lexicon-search-input" id="lexicon-search-input-${activeTabId}"><div class="lexicon-info"><div class="lexicon-info-btn" title="Click to read how to type polytonic Greek in this inbox" onclick="window.open('./tools/keyboard_greek_polytonic.html', '_blank')"><img class="lexicon-info-btn-img" src="./img/info.svg"></div></div>
        </div>  
        <div class="${ParsedClassicsAppVars.lexiconContainerLeftPartInnerClass}" id="lexicon-split-left-inner-${activeTabId}">
        </div>
      </div>
      <div class="${ParsedClassicsAppVars.lexiconContainerRightPartClass}" id="lexicon-split-right-${activeTabId}"></div>
    `;
    splitHtml = $(splitHtml);

    // get search input el
    const lemmaSearchInput = splitHtml.find(`#lexicon-search-input-${activeTabId}`);

    // attach event handlers: (1) in case it is Greek lexicon, activate Greek keyboard mapping
    if (isGreek) {
      ParsedClassicsContentContainers.keyboardMapping(lemmaSearchInput[0]); 
    }
    
    // attach event handlers: (2) filtering by typing in seach box
    lemmaSearchInput.on('keyup', function(){
      var lemmaInput = $(this);
      ParsedClassicsSelectedLemma.filterByTyping(lemmaInput, activeTabId)
    });

    // attach event handlers: (3) filtering by pasting in seach box
    // paste event gets fired before text is in textbox; the fix is to use setTimeout: https://stackoverflow.com/questions/9690097/paste-event-gets-fired-before-text-is-in-textbox
    lemmaSearchInput.on('paste', function () {
      var lemmaInput = $(this)
      setTimeout(function () {
          ParsedClassicsSelectedLemma.filterByTyping(lemmaInput, activeTabId)
      }, 0);
    });
    
    // put generated html into tab's inner container
    tabContentContainerInner.html(splitHtml);

    // split tab's inner container
    const lexiconContainerLeftPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.lexiconContainerLeftPartClass}`);
    const lexiconContainerRightPart = tabContentContainerInner.find(`.${ParsedClassicsAppVars.lexiconContainerRightPartClass}`);
    Split([lexiconContainerLeftPart[0], lexiconContainerRightPart[0]], {
      sizes: [20, 80],
      direction: 'horizontal',
      gutterSize: 4,
      minSize: [70, 70],
      snapOffset: ParsedClassicsAppVars.splitterSnapOffset,
      cursor: ParsedClassicsAppVars.horizontalSplitterCursor,
    });

    // hide splitter in order to avoid flash of unstyled content (.lexicon-split-left-part is already hidden by css)
    tabContentContainerInner.find(`div.gutter-horizontal`).css('visibility', 'hidden');

    return {lexiconContainerLeftPart, lexiconContainerRightPart};
  },

  createScannedResourceHtml: function(tabContentContainerInner, resourceDef) {
    // get scanned source shortname
    const scannedSourceShortname = resourceDef['scanned_source_shortname'];
    // page number of scanned book
    const scannedPageNum = "#page/1";
    // display two or one page of scanned book?
    const pageDisplayMode = localStorage.getItem(scannedSourceShortname) ?? "/mode/2up";
    
    const html = `
      <iframe class="pc-bookreader" src="./reader/embedded_bookreader.html?${scannedSourceShortname}${scannedPageNum}${pageDisplayMode}"></iframe>
    `;
    tabContentContainerInner.html(html);
    const iframeEl = tabContentContainerInner.find('.pc-bookreader');
    return iframeEl;
  },

  keyboardMapping: function(inputEl) {
    // attach keyboard mapping functionality to input
    keyman.attachToControl(inputEl);
    // remove class which was added by Keymanweb script
    inputEl.classList.remove('keymanweb-font');
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
        const lineToScroll = container.find(`.${ParsedClassicsAppVars.lineNumberClass}[${ParsedClassicsAppVars.lineNumberAttr}="${lineIndicatorFromUrl}"]`).first();
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
            message: `The verse ${lineIndicatorFromUrl} was not found.`,
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
    const lineToScroll = container.find(`.${ParsedClassicsAppVars.lineNumberClass}[${ParsedClassicsAppVars.lineNumberAttr}="${lineIndicatorFromUrl}"]`).first();
    // find if there is only one el in DOM
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
        message: `The verse ${lineIndicatorFromUrl} was not found.`,
      });
    }
  },

  scrollToParaResourceLoading: function(container, paragraphIndicatorUrl, activeTabId) {
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
        const paraToScroll = container.find(`.${ParsedClassicsAppVars.paragraphNumberClass}[${ParsedClassicsAppVars.paragraphNumberAttr}="${paragraphIndicatorUrl}"]`).first();
        // find if line to be scrolled is already in DOM
        const renderedLength = paraToScroll.length;
        // find if line to be scrolled is already in viewport, i.e. is already seen
        const inViewportLength = paraToScroll.isInViewport({tolerance: 0, viewport: `#${containerId}`}).length;
        // line to be scrolled is in DOM - let's scroll it into view
        if (renderedLength === 1) {
          container.scrollTo(paraToScroll, ParsedClassicsAppVars.animationSpeed);
          // line to be scrolled is in DOM and in viewport? - let's clear interval
          if (inViewportLength === 1) {
            clearInterval(ParsedClassicsContentContainers.scrollFuncIntervals[activeTabId]);
          }
        }
        // show alert that the line was not found 
        else if (renderedLength === 0 && count === maxCount - 1) {
          ParsedClassicsAlertDialogue.openDialogue(paneId, {
            heading: 'Not found',
            message: `The verse ${paragraphIndicatorUrl} was not found.`,
          });
        }
        count++;
      }
    }, 50);
  },

  scrollToParaResourceLoaded: function(container, paragraphIndicatorUrl, activeTabId) {
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // close alert dialogue that may be open
    ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);
    // close confirm dialogue that may be open 
    ParsedClassicsConfirmDialogue.closeConfirmDialogueWithoutClick(paneId);
    // get id of container to be scrolled 
    const containerId = container.attr('id');
    // get paragraph to be scrolled
    const paraToScroll = container.find(`.${ParsedClassicsAppVars.paragraphNumberClass}[${ParsedClassicsAppVars.paragraphNumberAttr}="${paragraphIndicatorUrl}"]`).first();
    // find if there is only one el in DOM
    const renderedLength = paraToScroll.length;
    // find if paragraph to be scrolled is already in viewport, i.e. is already seen
    const inViewportLength = paraToScroll.isInViewport({tolerance: 0, viewport: `#${containerId}`}).length;
     // line to be scrolled is in DOM - let's scroll it into view
    if (renderedLength === 1 && inViewportLength === 0) {
      container.scrollTo(paraToScroll, ParsedClassicsAppVars.animationSpeed);
    }
    else if (renderedLength === 0) {
      ParsedClassicsAlertDialogue.openDialogue(paneId, {
        heading: 'Not found',
        message: `The paragraph ${paragraphIndicatorUrl} was not found.`,
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
    if (!lemma) {
      return;
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

  jumpToAudioTime: function(lineIndicatorUrl, collectionShortname, resourceShortname, audioEl, activeTabId) {
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // get resource contents
    const collectionResourcesData = APP.loadedResourcesData[collectionShortname];
    const resourceData = collectionResourcesData[resourceShortname];
    const resourceContents = resourceData['contents'];

    if (resourceContents && typeof resourceContents[lineIndicatorUrl] !== "undefined") {
      // set audio el to needed time point (we need to add a little time in order audio-text synchronized didplay one line instead of two)
      // exclude the case when lineIndicatorUrl === "title"
      let timePoint;
      if (lineIndicatorUrl === 'title') {
        timePoint = resourceContents[lineIndicatorUrl];
      }
      else {
        timePoint = resourceContents[lineIndicatorUrl] + 0.01;
      }
      
      // are metadata loaded?
      if (audioEl.readyState > 0) {
        audioEl.currentTime = timePoint;
      }
      // no metadata? - then set timeout
      else {
        const interval = 500;
        ParsedClassicsContentContainers.setTimeAfterMetadataLoads(audioEl, timePoint, interval);
      }
    }
    // line was not found
    else {
      ParsedClassicsAlertDialogue.openDialogue(paneId, {
        heading: 'Not found',
        message: `The line ${lineIndicatorUrl} was not found.`,
      });   
    }
  },

  setTimeAfterMetadataLoads: function(audioEl, timePoint, interval) {
    // has metadata loaded?
    if (audioEl.readyState > 0) {
      // then set current time
      audioEl.currentTime = timePoint;
    }
    else {
      setTimeout(function() {ParsedClassicsContentContainers.setTimeAfterMetadataLoads(audioEl, timePoint, interval)}, interval);
    }
  },

  browseToSelectedLine: function(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, lineIndicatorUrl) {
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // close alert dialogue if such exists
    ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);
    // get resource contents
    const collectionResourcesData = APP.loadedResourcesData[collectionShortname];
    const resourceData = collectionResourcesData[resourceShortname];
    const resourceContents = resourceData['contents'];
    // get scanned source shortname
    const scannedSourceShortname = resourceDef['scanned_source_shortname'];
    

    // form main part of iframe src
    let iframeSrcNew = "./reader/embedded_bookreader.html?" + scannedSourceShortname;
  
    // display two or one page of scanned book?
    const pageDisplayMode = localStorage.getItem(scannedSourceShortname) ?? "/mode/2up";

    // is page in contents JSON?
    if (typeof resourceContents[lineIndicatorUrl] != "undefined" && resourceContents[lineIndicatorUrl] != "") {
      // get page number of scanned book
      const scannedPageNum = resourceContents[lineIndicatorUrl];
      // form new "src" attr of the iframe
      iframeSrcNew += "#page/" + scannedPageNum + pageDisplayMode;
      // set new "src" attr of the iframe (IMPORTANT! this cannot be done by iframeEl.attr("src", iframeSrcNew) because it would add new entry in browser's history)
      iframeEl[0].contentWindow.location.replace(iframeSrcNew);
      // save iframeSrcNew as value of attribute
      iframeEl.attr("data-src", iframeSrcNew);
    }
    // page with selected line not found
    else {
      ParsedClassicsAlertDialogue.openDialogue(paneId, {
        heading: 'Not found',
        message: `The line ${lineIndicatorUrl} was not found.`,
      }); 
    }
  },

  browseToSelectedPage: function(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, pageUrl)  {
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // close alert dialogue if such exists
    ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);
    // get resource contents
    const collectionResourcesData = APP.loadedResourcesData[collectionShortname];
    const resourceData = collectionResourcesData[resourceShortname];
    const resourceContents = resourceData['contents'];
    // get scanned source shortname
    const scannedSourceShortname = resourceDef['scanned_source_shortname'];

    // form main part of iframe src
    let iframeSrcNew = "./reader/embedded_bookreader.html?" + scannedSourceShortname;

    // display two or one page of scanned book?
    const pageDisplayMode = localStorage.getItem(scannedSourceShortname) ?? "/mode/2up";

    // is page in contents Map?
    if (typeof resourceContents.get(pageUrl) != "undefined" && resourceContents.get(pageUrl)[0] != "") {
      // get page number of scanned book
      let scannedPageNum;
      if (pageUrl === 'title') {
        pageUrl = resourceContents.get('title');
        scannedPageNum = resourceContents.get(pageUrl)[0];
      }
      else {
        scannedPageNum = resourceContents.get(pageUrl)[0];
      }
      // form new "src" attr of the iframe
      iframeSrcNew += "#page/" + scannedPageNum + pageDisplayMode;
      // set new "src" attr of the iframe (IMPORTANT! this cannot be done by iframeEl.attr("src", iframeSrcNew) because it would add new entry in browser's history)
      iframeEl[0].contentWindow.location.replace(iframeSrcNew);
      // save iframeSrcNew as value of attribute
      iframeEl.attr("data-src", iframeSrcNew);
    }
    // selected page was not found
    else {
      ParsedClassicsAlertDialogue.openDialogue(paneId, {
        heading: 'Not found',
        message: `The page ${pageUrl} was not found.`,
      }); 
    }
  },

  browseToSelectedWord: function(activeTabId, iframeEl, collectionShortname, resourceShortname, resourceDef, wordUrl) {
    // get pane id
    const paneId = ParsedClassicsLayout.getPaneIdFromUrl(activeTabId);
    // close alert dialogue if such exists
    ParsedClassicsAlertDialogue.closeDialogueWithoutClick(paneId);
    // get resource contents
    const collectionResourcesData = APP.loadedResourcesData[collectionShortname];
    const resourceData = collectionResourcesData[resourceShortname];
    const resourceContents = resourceData['contents'];
    // get scanned source shortname
    const scannedSourceShortname = resourceDef['scanned_source_shortname'];
    

    // form main part of iframe src
    let iframeSrcNew = "./reader/embedded_bookreader.html?" + scannedSourceShortname;
  
    // display two or one page of scanned book?
    const pageDisplayMode = localStorage.getItem(scannedSourceShortname) ?? "/mode/2up";

    // is lemma in url?
    if (wordUrl) {
      // get JSON key
      let contentsKey = "w";
      for (let i = 0; i < wordUrl.length; i++) {
          contentsKey += "-" + wordUrl.codePointAt(i);	
      }
      // is lemma in contents JSON?
      if (typeof resourceContents[contentsKey] != "undefined" && resourceContents[contentsKey] != "") {
        // get page number of scanned book
        const scannedPageNum = resourceContents[contentsKey];
        // form new "src" attr of the iframe
        iframeSrcNew += "#page/" + scannedPageNum + pageDisplayMode;
        // set new "src" attr of the iframe (IMPORTANT! this cannot be done by iframeEl.attr("src", iframeSrcNew) because it would add new entry in browser's history)
        iframeEl[0].contentWindow.location.replace(iframeSrcNew);
        // save iframeSrcNew as value of attribute
        iframeEl.attr("data-src", iframeSrcNew);
      }
      // page with selected word not found
      else {
        ParsedClassicsAlertDialogue.openDialogue(paneId, {
          heading: 'Not found',
          message: `The word ${wordUrl} was not found.`,
        }); 
      }
    }
    // lemma not in url so lets browse to title page
    else {
      // is title in contents JSON?
      if (typeof resourceContents['title'] != "undefined" && resourceContents['title'] != "") {
        // get page number of scanned book
        const scannedPageNum = resourceContents['title'];
        // form new "src" attr of the iframe
        iframeSrcNew += "#page/" + scannedPageNum + pageDisplayMode;
        // set new "src" attr of the iframe (IMPORTANT! this cannot be done by iframeEl.attr("src", iframeSrcNew) because it would add new entry in browser's history)
        iframeEl[0].contentWindow.location.replace(iframeSrcNew);
        // save iframeSrcNew as value of attribute
        iframeEl.attr("data-src", iframeSrcNew);
      }
    }
  },

};
