/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
Scripts supporting separate ParsedClassics library app widgets
=====================================================
*/


/*
Modal dialogue
*/

var ParsedClassicsModalDialogues = {

  reloadAfterClosing: false
  
  , openDialogue: function(dialogueId, tabButtonContainerIdArray, tabButtonClass) {
      var dialogue;

      dialogue = $("#" + dialogueId);
      // display modal dialogue
      dialogue.show();

      // display first tab of each tabbed panel which is inside any modal dialogue
      if (tabButtonContainerIdArray && $.isArray(tabButtonContainerIdArray) && tabButtonClass) {
        for (var i = 0; i < tabButtonContainerIdArray.length; i++) {
          $("#" + tabButtonContainerIdArray[i]).find("." + tabButtonClass).eq(0).click();
        }
      }

  }
  
  , closeDialogue: function(event) {
      var dialogue;

      dialogue = $(event.target).parent().parent().parent();
      dialogue.hide();
      if (ParsedClassicsModalDialogues.reloadAfterClosing === true) {
        location.reload(true);
      }

  }
	
		, contentPanelErrorMessage: function(contentPanelWrapper, lineClass) {
						var lineNum, urlJSON, contentPanelDialogue;

						// find "Item not found" dialogue
						contentPanelDialogue = contentPanelWrapper.find("." + ParsedClassicsVars.contentPanelDialogueClass);

						// find line number 
						lineNum = lineClass;
						urlJSON = ParsedClassicsHelpers._getUrlJSON();
						if (typeof urlJSON[ParsedClassicsVars.lineUrlAndCookieName] != "undefined") {
									lineNum = urlJSON[ParsedClassicsVars.lineUrlAndCookieName];
						}
						else if (localStorage.getItem(ParsedClassicsVars.lineUrlAndCookieName)) {
								lineNum = localStorage.getItem(ParsedClassicsVars.lineUrlAndCookieName);  
						}

						// put error message inside dialogue
						contentPanelDialogue.find("." + ParsedClassicsVars.dialogueContentInnerClass).html("The line " + lineNum + " was not found.");
						// display "Item not found" dialogue
						contentPanelDialogue.css("display", "block");
		}
	
		, contentPanelErrorMessageOnWord: function(contentPanelWrapper, lemma) {
						var urlJSON, contentPanelDialogue;
			
						// find "Item not found" dialogue
						contentPanelDialogue = contentPanelWrapper.find("." + ParsedClassicsVars.contentPanelDialogueClass);
			
						// put error message inside dialogue
						contentPanelDialogue.find("." + ParsedClassicsVars.dialogueContentInnerClass).html("The article on word " + lemma + " was not found.");
			
						// display "Item not found" dialogue
						contentPanelDialogue.css("display", "block");
		}
  
  , onloadDialogueClose: function() {
      var modal_dialogue;
      
      // get modal dialogue
						modal_dialogue = $("#" + ParsedClassicsVars.onloadDialogueId);
      // close modal dialogue
						modal_dialogue.attr("style", "display: none !important");
  }
  
  , initOpenSettingsDialogueButton: function() {
      var openDialogueButton;

      openDialogueButton = $("#" + ParsedClassicsVars.openSettingsDialogueButtonId);
      openDialogueButton.bind("click", function(){
        ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.dialogueId, ParsedClassicsVars.tabButtonContainerIdArray, ParsedClassicsVars.tabButtonClass);
      });

  }
  
  , initAllCloseDialogueButtons: function() {
      var closeDialogueButtons;    

      closeDialogueButtons = $("." + ParsedClassicsVars.closeDialogueButtonClass);
      closeDialogueButtons.bind("click", function(event){
        ParsedClassicsModalDialogues.closeDialogue(event);
      });

  }

};

/*
Confirm dialogue
*/

const ParsedClassicsConfirmDialogue = {

  createConfirmDialogue: function(paneId) {
    // create confirm dialogue html
    const confirmDialogueHtml = ParsedClassicsConfirmDialogue.createConfirmDialogueHtml(paneId);
    // create confirm dialogue 
    const confirmDialogue = $(confirmDialogueHtml);
    // get close btn
    const closeButton = confirmDialogue.find(`.dialogue-close-btn`);
    // bind func to close button
    closeButton.bind('click', () => {
      ParsedClassicsConfirmDialogue.closeConfirmDialogueWithClick(confirmDialogue);
    });
    // get cancel button
    const cancelButton = confirmDialogue.find(`.dialogue-cancel-btn`);
    // bind func to cancel button
    cancelButton.bind('click', () => {
      ParsedClassicsConfirmDialogue.closeConfirmDialogueWithClick(confirmDialogue);
    });

    return confirmDialogue;
  },
  
  createConfirmDialogueHtml: function(paneId) {
    // create alert dialogue html
    const confirmDialogueHtml = `
      <div id="confirm-dialogue-${paneId}" class="pc-dialogue" style="displayx: block;">
        <div class="pc-modal-content">
          <div class="header"><div class="header-inner"><div class="header-text">Confirm</div></div><div class="dialogue-close"><div class="dialogue-close-btn" title="Close dialogue"><img class="dialogue-close-img" src="../../img/close.svg" /></div></div></div>
          <div class="message-text pc-container pc-padding-16">
            Confirm
          </div>
          <div class="pc-container pc-padding-bottom-16">
            <button class="dialogue-confirm-btn pc-action-button w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">
              OK
            </button>
            <button class="dialogue-cancel-btn pc-action-button w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;

    return confirmDialogueHtml;
  },

  openConfirmDialogue: function(paneId, argObj, callback) {
    const heading = argObj.heading;
    const message = argObj.message;

    // create confirm dialogue
    const confirmDialogue = ParsedClassicsConfirmDialogue.createConfirmDialogue(paneId);
    $('body').append(confirmDialogue);
    // insert heading
    confirmDialogue.find(`.header-text`).text(heading);
    // insert message
    confirmDialogue.find(`.message-text`).text(message);
    // get confirm button
    const confirmButton = confirmDialogue.find(`.dialogue-confirm-btn`);
    // bind callback to confirm button
    confirmButton.bind('click', callback);
    confirmButton.bind('click', () => {
      ParsedClassicsConfirmDialogue.closeConfirmDialogueWithClick(confirmDialogue);
    });

    // display dialogue
    confirmDialogue.show();
  },

  closeConfirmDialogueWithClick: function(confirmDialogue) {
    confirmDialogue.hide();
    confirmDialogue.remove();
  },

  closeConfirmDialogueWithoutClick: function(paneId) {
    // get confirm dialogue
    const confirmDialogue = $(`#confirm-dialogue-${paneId}`);
    confirmDialogue.hide();
    confirmDialogue.remove();
  }

};

/*
Tabbed panel
*/

var ParsedClassicsTabbedPanels = {

  openTab: function(singleButton, buttons, tabs, singleTab) {    

      // hide all tabs in tabbed panel
      tabs.each(function( index, el ) {
        $(el).hide();
      });

      // style all tabbuttons as not opened
      buttons.each(function( index, el ) {
        $(el).removeClass(ParsedClassicsVars.tabOpenedClass);
      }); 

      // display single tab
      singleTab.show();  

      // style one tabbutton as opened
      singleButton.addClass(ParsedClassicsVars.tabOpenedClass);   

  }

  , init: function(settingsObject) {
      var buttonContainer, buttons, tabContainer, tabs;

      $.extend(ParsedClassicsTabbedPanels.settings, settingsObject);

      for (var i = 0; i < ParsedClassicsVars.tabButtonContainerIdArray.length; i++) {

        buttonContainer = $("#" + ParsedClassicsVars.tabButtonContainerIdArray[i]);
        tabContainer = buttonContainer.next();
        buttons = buttonContainer.find("." + ParsedClassicsVars.tabButtonClass);
        tabs = tabContainer.find("." + ParsedClassicsVars.tabClass);

        // bind function to each tabbutton
        buttons.each( function( index, el ) {
          if (tabs.eq(index).length) {
            $(buttons.eq(index)).bind("click", function() {
              ParsedClassicsTabbedPanels.openTab(buttons.eq(index), buttons, tabs, tabs.eq(index));  
            });  
          }
        });

      } 

  }


};

/*
Collections selectbox
*/

var ParsedClassicsCollectionsSelectbox = {

  collectionsSelectboxOnchangeFunc: function(event) {
     var selectedCollectionShortname, selectedCollectionShortnameObject, urlJSON;
     
     // find selected collection shortname
     selectedCollectionShortname = event.target.value;
     // get JSON part of url
     urlJSON = ParsedClassicsHelpers._getUrlJSON();
     // update JSON part of url
     selectedCollectionShortnameObject = {};
     selectedCollectionShortnameObject[ParsedClassicsVars.collectionUrlAndCookieName] = selectedCollectionShortname;
     delete urlJSON[ParsedClassicsVars.lineUrlAndCookieName];
					delete urlJSON[ParsedClassicsVars.wordUrlAndCookieName];
     delete urlJSON[ParsedClassicsVars.resourceUrlAndCookieName];
     delete urlJSON[ParsedClassicsVars.lexiconUrlAndCookieName];
     delete urlJSON[ParsedClassicsVars.lexiconEntryUrlAndCookieName];
     ParsedClassicsHelpers._setUrlJSON(urlJSON, selectedCollectionShortnameObject);
     // save selected collection shortname
     localStorage.setItem(ParsedClassicsVars.collectionUrlAndCookieName, selectedCollectionShortname);
     // remove line number, selected word, resource, enabled resources, extra windows from cookie
     localStorage.removeItem(ParsedClassicsVars.lineUrlAndCookieName);
		 localStorage.removeItem(ParsedClassicsVars.wordUrlAndCookieName);
     localStorage.removeItem(ParsedClassicsVars.resourceUrlAndCookieName);
     localStorage.removeItem(ParsedClassicsVars.enabledResourcesCookieName);
     localStorage.removeItem(ParsedClassicsVars.extraWindowsCookieName);
     // reload library app
     location.reload(true);
  }
  
  , init: function() {
      var collectionsSelectbox;
      
      collectionsSelectbox = $("#" + ParsedClassicsVars.collectionsSelectboxId);
      
      if (collectionsSelectbox.length == 1) {
        collectionsSelectbox.bind("change", ParsedClassicsCollectionsSelectbox.collectionsSelectboxOnchangeFunc);
      }
  }

};

/*
Sections selectbox
*/

var ParsedClassicsSectionsSelectbox = {

  sectionsSelectboxOnchangeFunc: function(event) {
    var contentPanels, urlJSON, selectedLineClass, selectedLineSingle, selectedLineNum, selectedLineNumObject, extra_win, singleContentPanel, valuesObject, resource_shortname, scanned_or_typed, is_audio;
    
    selectedLineClass = event.target.value;
    selectedLineNum = "";
    
    if (selectedLineClass) {
      
      // put info about selected line into url

      // get JSON from hash part of the url
      urlJSON = ParsedClassicsHelpers._getUrlJSON();
      
      // find one el having selectedLineClass
      selectedLineSingle = $("." + selectedLineClass).first();

      // certain verse (not title) was selected in selectbox
      if (selectedLineSingle.hasClass(ParsedClassicsVars.verseNumberClass)) {
        // find number of the new selected line
        selectedLineNum = selectedLineSingle.text();
        // put number of the selected line into JSON which is in the hash part of the url
        selectedLineNumObject = {};
        selectedLineNumObject[ParsedClassicsVars.lineUrlAndCookieName] = selectedLineNum;
        // remove selected word from url and cookie
        delete urlJSON[ParsedClassicsVars.wordUrlAndCookieName];
        localStorage.removeItem(ParsedClassicsVars.wordUrlAndCookieName);
        // set JSON part of the url
        ParsedClassicsHelpers._setUrlJSON(urlJSON, selectedLineNumObject);
        // save number of selected line in cookie
        localStorage.setItem(ParsedClassicsVars.lineUrlAndCookieName, selectedLineNum); 
      }
      // not verse was selected in selectbox
      else {
        // remove line number and word from url
        delete urlJSON[ParsedClassicsVars.lineUrlAndCookieName];
				delete urlJSON[ParsedClassicsVars.wordUrlAndCookieName];
        ParsedClassicsHelpers._setUrlJSON(urlJSON);
        localStorage.removeItem(ParsedClassicsVars.lineUrlAndCookieName);
				localStorage.removeItem(ParsedClassicsVars.wordUrlAndCookieName);
      }
      
      // find content panels
      contentPanels = $("." + ParsedClassicsVars.contentPanelWrapperClass);
      // trigger custom event "sections-selectbox-change"
      contentPanels.trigger(ParsedClassicsVars.eventSectionsSelectboxChange);

      // go to selected line in each extra window, if there is any
      ParsedClassicsHelpers._toLineInExtraWindows(selectedLineClass, selectedLineNum);

    }
    
    // unfocus sections selectbox in order not to generate "change" event when arrow keys are being pressed
    event.target.blur();
     
  }
  
  , init: function() {
    var sectionsSelectbox;
    
    sectionsSelectbox = $("#" + ParsedClassicsVars.sectionsSelectboxId);
    if (sectionsSelectbox.length == 1) {
      sectionsSelectbox.bind("change", ParsedClassicsSectionsSelectbox.sectionsSelectboxOnchangeFunc);
    }
  }

};

/*
Resources selectbox
*/

var ParsedClassicsResourcesSelectbox = {
  
  showHideContentPanels: function(event) {
    var resourceShortname, urlJSON, selectedResourceShortnameObject, displayAtTime, selectedContentPanel, resourcesPane, contentPanels, panel, newContentType, iframe_el, container;
    
    // find selected resource shortname
    resourceShortname = event.target.value;
    
    // get JSON from hash part of the url
    urlJSON = ParsedClassicsHelpers._getUrlJSON();
    
    // put name of the selected resource into JSON which is in the hash part of the url
    selectedResourceShortnameObject = {};
    selectedResourceShortnameObject[ParsedClassicsVars.resourceUrlAndCookieName] = resourceShortname;
    ParsedClassicsHelpers._setUrlJSON(urlJSON, selectedResourceShortnameObject);
    
    // save shortname of selected resource in cookie
    localStorage.setItem(ParsedClassicsVars.resourceUrlAndCookieName, resourceShortname);
			
			
				// find if single or all or belonginto to certain type content panels should be displayed
    displayAtTime = $('input[name=' + ParsedClassicsVars.displayResourcesAtTimeRadioName +']:checked').val();
				if (!displayAtTime) {
						displayAtTime = ParsedClassicsVars.valResourcesAtTimeSingle;
				}
    
    // find selected resource
    selectedContentPanel = $("#" + resourceShortname);
			
				
				
    
    // find resources pane
    resourcesPane = $("#" + ParsedClassicsVars.centerPaneContainerId);
    
    // find all content panels in Resources pane
    contentPanels = resourcesPane.find("." + ParsedClassicsVars.contentPanelWrapperClass);
    
    // I. The case only one resource should be shown at a time
    
    if (displayAtTime == ParsedClassicsVars.valResourcesAtTimeSingle) {
      
      // hide all content panels
      contentPanels.hide();
					
						// hack for Firefox which in some cases does not load new content in iframe after cganging its src attr
						iframe_el = selectedContentPanel.find("." + ParsedClassicsVars.bookReaderIframeClass);
						container = iframe_el.parent();
						iframe_el.remove();
						container.append(iframe_el);
      
      // Show selected resource
      selectedContentPanel.css("display", "table");
					
						
      
      // trigger event "sections-selectbox-change" on just displayed content panel
      selectedContentPanel.trigger(ParsedClassicsVars.eventSectionsSelectboxChange);
					
						// trigger event "selected-word-change" on just displayed content panel
						selectedContentPanel.trigger(ParsedClassicsVars.eventSelectedWordChange);
					
						
    }
    
    // II. The case all resources of certain content type should be shown at a time
    
    else if (displayAtTime == ParsedClassicsVars.valResourcesAtTimeCategory) {
      
      // resources of which content type should be displayed?
      newContentType = $(event.target.options[event.target.selectedIndex]).closest('optgroup').attr(ParsedClassicsVars.resourceTypeAttr);
    
      //loop through all content panels
      for (var i = 0; i < contentPanels.length; i++) {
        panel = $(contentPanels[i]);

        // check if panel is hidden and is of the right content type
        if (panel.css("display") == "none" && panel.hasClass(newContentType)) {
          
										// hack for Firefox which in some cases does not load new content in iframe after cganging its src attr
										iframe_el = panel.find("." + ParsedClassicsVars.bookReaderIframeClass);
										container = iframe_el.parent();
										iframe_el.remove();
										container.append(iframe_el);
									
										// show such content panel
          panel.css("display", "table");
          // trigger custom event on it
          panel.trigger(ParsedClassicsVars.eventSectionsSelectboxChange);
										panel.trigger(ParsedClassicsVars.eventSelectedWordChange);
        }
        // check if panel is displayed and is of the wrong content type
        else if (panel.css("display") != "none" && !panel.hasClass(newContentType)) {
          // hide such content panel
          panel.css("display", "none");
        }
      }
      
      // scroll selected content panel to top
      resourcesPane.scrollTo(selectedContentPanel, ParsedClassicsVars.animationSpeed);
      
    }
    
    // III. The case all resources sould be shown
    
    else if (displayAtTime == ParsedClassicsVars.valResourcesAtTimeAll) {
      
      // loop through all content panels in Resources pane, check if they are visible and if not make the visible and trigger event "sections-selectbox-change" on them
      for (var i = 0; i < contentPanels.length; i++) {
        panel = $(contentPanels[i]);
        if (panel.css("display") == "none") {
          
										// hack for Firefox which in some cases does not load new content in iframe after cganging its src attr
										iframe_el = panel.find("." + ParsedClassicsVars.bookReaderIframeClass);
										container = iframe_el.parent();
										iframe_el.remove();
										container.append(iframe_el);
									
										panel.css("display", "table");
          panel.trigger(ParsedClassicsVars.eventSectionsSelectboxChange);
										panel.trigger(ParsedClassicsVars.eventSelectedWordChange);
        }
      }
      
      // hide enabled/disabled resources panel
      $("#" + ParsedClassicsVars.resourcesListPanelId).css("display", "none");
      
      // scroll selected content panel to top
      resourcesPane.scrollTo(selectedContentPanel, ParsedClassicsVars.animationSpeed);
      
    }
    // unfocus resources selectbox in order not to generate "change" event when array keys are being pressed
    event.target.blur();
    
  }
  
  , init: function() {
  
    $("#" + ParsedClassicsVars.resourcesSelectboxId).bind("change", function(event) {
      ParsedClassicsResourcesSelectbox.showHideContentPanels(event);
    });
  
  }

};

/*
Keybindings to navigate through resources
*/

var ParsedClassicsKeyBindings = {
  
  fetchKey: function(e) {
    var key
    , shiftKey;

    key = e.which || e.keyCode;
    shiftKey = e.shiftKey;

    ParsedClassicsKeyBindings.showHideContentPanelsFromKeyBindings(key, shiftKey);

  }

  , showHideContentPanelsFromKeyBindings: function(key, shiftKey) {
    var resourcesSelectbox
    , selectedOptionIndex
    , indexToBeSelected
    , optionsMaxIndex
    , optgroupNum
    , selectedOptionEl
    , selectedOptionParentOptgroup
    , optgroupEls
    , currentOptgroupIndex
    , optgroupToBeSelected
    , optionToBeSelected
    , allOptionEls
    , optgroupsMaxIndex;

    // 1. the case key "[" has been pressed
    if (shiftKey == false && key == 219) {
      // fetch resources selectbox
      resourcesSelectbox = $("#" + ParsedClassicsVars.resourcesSelectboxId);
      // get index of selected option
      selectedOptionIndex = resourcesSelectbox[0].selectedIndex;

      // is selected resource second or further in the row?
      if (selectedOptionIndex > 1) {
        // index to be selected is index of the previous option
        indexToBeSelected = selectedOptionIndex - 1;
        resourcesSelectbox[0].selectedIndex = indexToBeSelected;
        // trigger "change" event in Resources selectbox
        resourcesSelectbox.trigger('change');
      }
    }

    // 2. the case key "]" has been pressed
    else if (shiftKey == false && key == 221) {
      // fetch resources selectbox
      resourcesSelectbox = $("#" + ParsedClassicsVars.resourcesSelectboxId);
      // get index of selected option
      selectedOptionIndex = resourcesSelectbox[0].selectedIndex;
      // get index of the last option
      optionsMaxIndex = resourcesSelectbox[0].length - 1;

      // is selected resource not the last in the row?
      if (selectedOptionIndex < optionsMaxIndex) {
        // index to be selected is index of the next option
        indexToBeSelected = selectedOptionIndex + 1;
        resourcesSelectbox[0].selectedIndex = indexToBeSelected;
        // trigger "change" event in Resources selectbox
        resourcesSelectbox.trigger('change');
      }

    }
    // 3. the case key "<" has been pressed
    else if (shiftKey == true && key == 188) {
      // fetch resources selectbox
      resourcesSelectbox = $("#" + ParsedClassicsVars.resourcesSelectboxId);
      // get index of selected option
      selectedOptionIndex = resourcesSelectbox[0].selectedIndex;
      // get selected option el
      selectedOptionEl = resourcesSelectbox.find("option:selected");
      // get parent optgroup el of the selected option el
      selectedOptionParentOptgroup = selectedOptionEl.parent().is("optgroup") ? selectedOptionEl.parent() : "-1";
      // fetch all optgroup els
      optgroupEls = resourcesSelectbox.find("optgroup");
      // get all option els
      allOptionEls = resourcesSelectbox.find("option");

      // get number of optgroup els
      optgroupNum = optgroupEls.length;

      // is selected option inside optgroup el?
      if (selectedOptionParentOptgroup !== -1) {
        // get index num of of the optgroup in which is selected option el
        currentOptgroupIndex = optgroupEls.index(selectedOptionParentOptgroup);
        // is current optgoup not the first in the row?
        if (currentOptgroupIndex > 0) {
          // get previous optgroup
          optgroupToBeSelected = optgroupEls[currentOptgroupIndex - 1];
          // get first option el inside previous optgroup
          optionToBeSelected = $(optgroupToBeSelected).find("option").first();
          // get index of the option el
          indexToBeSelected = allOptionEls.index(optionToBeSelected);
          // select first option in the previous optgroup
          resourcesSelectbox[0].selectedIndex = indexToBeSelected;
          // trigger "change" event in Resources selectbox
          resourcesSelectbox.trigger('change');
        }
      }
    }

    // 4. the case key ">" has been pressed
    else if (shiftKey == true && key == 190) {
      // fetch resources selectbox
      resourcesSelectbox = $("#" + ParsedClassicsVars.resourcesSelectboxId);
      // get index of selected option
      selectedOptionIndex = resourcesSelectbox[0].selectedIndex;
      // get selected option el
      selectedOptionEl = resourcesSelectbox.find("option:selected");
      // get parent optgroup el of the selected option el
      selectedOptionParentOptgroup = selectedOptionEl.parent().is("optgroup") ? selectedOptionEl.parent() : "-1";
      // fetch all optgroup els
      optgroupEls = resourcesSelectbox.find("optgroup");
      // get all option els
      allOptionEls = resourcesSelectbox.find("option");

      // get number of optgroup els
      optgroupNum = optgroupEls.length;
      // get uptgroups max index
      optgroupsMaxIndex = optgroupNum - 1;

      // get index num of of the optgroup in which is selected option el
      currentOptgroupIndex = optgroupEls.index(selectedOptionParentOptgroup);

      // is selected optgroup not the last in the row?
      if (currentOptgroupIndex < optgroupsMaxIndex) {
        // get next optgroup
        optgroupToBeSelected = optgroupEls[currentOptgroupIndex + 1];
        // get first option el inside next optgroup
        optionToBeSelected = $(optgroupToBeSelected).find("option").first();
        // get index of the option el
        indexToBeSelected = allOptionEls.index(optionToBeSelected);
        // select first option in the next optgroup
        resourcesSelectbox[0].selectedIndex = indexToBeSelected;
        // trigger "change" event in Resources selectbox
        resourcesSelectbox.trigger('change');
      }

    }

  }

}

/*
Selected line
*/

var ParsedClassicsSelectedLine = {
 
  syncWithSelectedLine: function(event) {
    var el, westPaneContainer, currentSelectedLine, lineClicked, verseNumberClass, verseNumber, verseNumberObject, verses_except_clicked, selected_word;
    
    // find parsing pane
    westPaneContainer = $("#" + ParsedClassicsVars.westPaneContainerId);
    
    // find currently selected line
    currentSelectedLine = westPaneContainer.find("." + ParsedClassicsVars.selectedLineClass);
    
    // find which line is newly selected by clicking
    el = $(event.target);
    if (el.hasClass(ParsedClassicsVars.verseClass)) {
      lineClicked = el;
    }
    else {
      while (el.attr("id") != ParsedClassicsVars.westPaneContainerId) {
        el = el.parent();
        if (el.hasClass(ParsedClassicsVars.verseClass)) {
          lineClicked = el;
          break;
        }
      }  
    }
    
    if (typeof lineClicked != "undefined") {
      // remove styling from currently selected line
      currentSelectedLine.removeClass(ParsedClassicsVars.selectedLineClass);
      // add styling to newly selected line
      lineClicked.addClass(ParsedClassicsVars.selectedLineClass);
      // find verse number class inside newly selected line element
      verseNumberClass = ParsedClassicsSelectedLine._findVerseNumberClass(lineClicked);
      // sync sections selectbox with newly selected line number
      ParsedClassicsSelectedLine._changeSectionsSelectboxVal(verseNumberClass);
      // find verse number inside verse number element
      verseNumber = lineClicked.find("." + ParsedClassicsVars.verseNumberClass).text();
      
      // get JSON from hash part of the url
      urlJSON = ParsedClassicsHelpers._getUrlJSON();
      // put number of the selected line into JSON which is in the hash part of the url
      verseNumberObject = {};
      verseNumberObject[ParsedClassicsVars.lineUrlAndCookieName] = verseNumber;
      
      
      // save number of selected line in cookie
      localStorage.setItem(ParsedClassicsVars.lineUrlAndCookieName, verseNumber);

      // find verses except the one clicked
      verses_except_clicked = westPaneContainer.find("." + ParsedClassicsVars.verseClass).not(lineClicked);
    
      // remove selected word from all verses except the one clicked
      verses_except_clicked.find("." + ParsedClassicsVars.selectedWordClass).removeClass(ParsedClassicsVars.selectedWordClass);
    
      // find selected word in clicked line
      selected_word = lineClicked.find("." + ParsedClassicsVars.selectedWordClass);
    
      // if there is no selected word in clicked line, then remove seledted word from url and cookie
      if (selected_word.length === 0) {
          delete urlJSON[ParsedClassicsVars.wordUrlAndCookieName];
          localStorage.removeItem(ParsedClassicsVars.wordUrlAndCookieName);
      }
    
      // set JSON part of the url
      ParsedClassicsHelpers._setUrlJSON(urlJSON, verseNumberObject);
      
      // scroll content panels in Resource pane by triggering on them custom event "sections-selectbox-change"
      $("#" + ParsedClassicsVars.centerPaneContainerId).find("." + ParsedClassicsVars.contentPanelWrapperClass).trigger(ParsedClassicsVars.eventSectionsSelectboxChange);

      // go to selected line in each extra window, if any
      ParsedClassicsHelpers._toLineInExtraWindows(verseNumberClass, verseNumber);
    }
      
  }
    
  , _findVerseNumberClass: function(verseEl) {
    var verseNumberEl, verseNumberElClone, verseNumberClass;
    
    // find <span> el which contains verse number as its text and verse class as its "class" attr
    verseNumberEl = verseEl.find("." + ParsedClassicsVars.verseNumberClass);
    // verse number will be extracted from clone of the element containing verse number class
    verseNumberElClone = verseNumberEl.clone(true);
    // remove class which indicates verse number element
    verseNumberElClone.removeClass(ParsedClassicsVars.verseNumberClass);
    // extract class which contains singular verse number
    verseNumberClass =  verseNumberElClone.attr("class");
    
    return verseNumberClass;
      
  }
    
  , _changeSectionsSelectboxVal: function(verseNumberClass) {
      var sectionsSelectbox;

      sectionsSelectbox = $("#" + ParsedClassicsVars.sectionsSelectboxId);
      // put verse number ar the value of sections selectbox
      sectionsSelectbox.val(verseNumberClass);

  }
  
  , init: function() {
      var westPaneContainer;

      westPaneContainer = $("#" + ParsedClassicsVars.westPaneContainerId);
      westPaneContainer.bind("click", function(event) {
        ParsedClassicsSelectedLine.syncWithSelectedLine(event);
      });
  
  }
    
};

/*
Selected word
*/

var ParsedClassicsSelectedWord = {
	
	selectedWordMouseEnter: function() {
		var word_el, form, part_of_speech, parsing, lemma, parsing_subpane_inner, parsing_html;
		
		word_el = $(this);
		form = word_el.attr(ParsedClassicsVars.formAttr);
		part_of_speech = word_el.attr(ParsedClassicsVars.partOfSpeechAttr);
		parsing = word_el.attr(ParsedClassicsVars.parsingAttr);
		lemma = word_el.attr(ParsedClassicsVars.lemmaAttr);
		
		parsing_html = "<strong>" + form + "</strong> " + lemma + "<br>" + part_of_speech + " " + parsing;
		
		parsing_subpane_inner = $("#" + ParsedClassicsVars.parsingSubPaneContainerId);
		parsing_subpane_inner.html(parsing_html);
	}
	
	, selectedWordMouseLeave: function() {
		var parsing_subpane_inner;
		
		parsing_subpane_inner = $("#" + ParsedClassicsVars.parsingSubPaneContainerId);
		parsing_subpane_inner.html("");
	}
	
	, selectedWordClick: function(event) {
		var word_el, parsing_pane, selected_word_el, lemma, lexicon, lexicon_entry_num, urlJSON, selectedWordObject;
			
    // get clicked word el
    word_el = $(event.target);
  
    // get parsing pane
    parsing_pane = $("#" + ParsedClassicsVars.westPaneContainerId);
  
    // find previous selected word
    selected_word_el = parsing_pane.find("." + ParsedClassicsVars.selectedWordClass);
  
    // remove class "selected-word" from previously selected word
    selected_word_el.removeClass(ParsedClassicsVars.selectedWordClass);
  
    // add class "selected-word" to currently selected word
    word_el.addClass(ParsedClassicsVars.selectedWordClass);
    
    // get lemma of the word
    lemma = $(word_el).attr(ParsedClassicsVars.lemmaAttr);
   
    // get lexicon shortname
    lexicon = typeof $(word_el).attr(ParsedClassicsVars.lexiconAttr) != "undefined" ? $(word_el).attr(ParsedClassicsVars.lexiconAttr) : "";
    
    // get lexicon entry order number
    lexicon_entry_num = typeof $(word_el).attr(ParsedClassicsVars.lexiconEntryAttr) != "undefined" ? $(word_el).attr(ParsedClassicsVars.lexiconEntryAttr) : "";
      
    // get JSON part of the url
    urlJSON = ParsedClassicsHelpers._getUrlJSON();
  
    // update JSON part of url
    selectedWordObject = {};
    selectedWordObject[ParsedClassicsVars.wordUrlAndCookieName] = lemma;
    if (lexicon && lexicon_entry_num) {
      selectedWordObject[ParsedClassicsVars.lexiconUrlAndCookieName] = lexicon;
      selectedWordObject[ParsedClassicsVars.lexiconEntryUrlAndCookieName] = lexicon_entry_num;
    }
    else {
      delete urlJSON[ParsedClassicsVars.lexiconUrlAndCookieName];
      delete urlJSON[ParsedClassicsVars.lexiconEntryUrlAndCookieName];
    }
    ParsedClassicsHelpers._setUrlJSON(urlJSON, selectedWordObject);
      
    // save word in cookie
    localStorage.setItem(ParsedClassicsVars.wordUrlAndCookieName, lemma);
    
    // save lexicon and lexicon entry order number in cookie in case this info is available
    if (lexicon && lexicon_entry_num) {
      localStorage.setItem(ParsedClassicsVars.lexiconUrlAndCookieName, lexicon);
      localStorage.setItem(ParsedClassicsVars.lexiconEntryUrlAndCookieName, lexicon_entry_num);
    }
    // delete lexicon and lexicon entry order number cookies in case this info not available
    else {
      localStorage.removeItem(ParsedClassicsVars.lexiconUrlAndCookieName);
      localStorage.removeItem(ParsedClassicsVars.lexiconEntryUrlAndCookieName);
    }
      
    // scroll content panels in Resource pane by triggering on them custom event "selected-word-change"
    $("#" + ParsedClassicsVars.centerPaneContainerId).find("." + ParsedClassicsVars.contentPanelWrapperClass).trigger(ParsedClassicsVars.eventSelectedWordChange);

    // go to selected word in each extra window, if there is any
		ParsedClassicsHelpers._toWordInExtraWindows(lemma, lexicon, lexicon_entry_num);	
	}
	
};

/*
Inner link
*/

var ParsedClassicsInnerLink = {

		innerLinkClick: function(event) {
				var inner_link_el
				, anchor_attr
				, anchor_el
				, parent
				, content_panel_inner
				, modal_dialogue
				, msg_el;
			
				// get clicked inner link el
				inner_link_el = $(event.target);
    
    // the case some <em> or <span> element inside inner link has been clicked
    if (!inner_link_el.hasClass(ParsedClassicsVars.innerLinkClass)) {
      while (!inner_link_el.hasClass(ParsedClassicsVars.innerLinkClass) && !inner_link_el.hasClass(ParsedClassicsVars.contentPanelInnerClass)) {
        inner_link_el = inner_link_el.parent();
      }
    }
			
				// define var
				parent = inner_link_el.parent();
			
				// get content panel inner
				while ( ! parent.hasClass(ParsedClassicsVars.contentPanelInnerClass) && parent.attr('id') !== 'pc-site-content') {
					 parent = parent.parent();
				}
				content_panel_inner = parent;

				// get "data-anchor" attr, which contains "id" of the anchor el
				anchor_attr = inner_link_el.attr(ParsedClassicsVars.anchorAttr);
			
				// get anchor el, meke sure it's unique
				anchor_el = $("#" + anchor_attr).first();
			
				// anchor el not found? then nothing to do except to display error message
				if (anchor_el.length != 1) {
						// get modal dialogue
						modal_dialogue = content_panel_inner.parent().find("." + ParsedClassicsVars.contentPanelDialogueClass).first();
						// ger message el
						msg_el = modal_dialogue.find("." + ParsedClassicsVars.dialogueContentInnerClass);
						// put message text inside message el
						msg_el.html("Link anchor not found!");
						// display modal dialogue
						modal_dialogue.css("display", "block");
						return;
				}

				// scroll to top anchor el
    //content_panel_inner.scrollTo(anchor_el, ParsedClassicsVars.animationSpeed);	// for unknown reason this does not work in Drills page, so let's use scrollIntoView()
    anchor_el[0].scrollIntoView({behavior: "smooth"});

		}
	
};

/*
Grammar reference link
*/

var ParsedClassicsGrammarRefLink = {

  grammarRefLinkClick: function(event) {
    var scanned_book
    , clicked_link
    , book_page
    , book_url
    , grammar_window
    , strWindowFeatures
    , current_url
    , current_url_split
    , root_url
    , page_display_mode
    , page_display_mode_from_cookie;

    // find clicked link
    clicked_link = $(event.target);
    
    // find grammar book's resource shortname
    scanned_book = clicked_link.attr(ParsedClassicsVars.grammarBookAttr);
    
    // find grammar book's page
    book_page = clicked_link.attr(ParsedClassicsVars.grammarPageAttr);
    
    if (scanned_book && book_page) {
    
      // form window features string
      strWindowFeatures = ParsedClassicsGrammarRefLink._popupWinFeatures();
      
      // find url of the Library page
      current_url = window.location.href;
  
      // find url of the root directory ( directory in which ParsedClassics files are placed)
      current_url_split = current_url.split("/library");
      root_url = current_url_split[0];
      
      // display two or one page of scanned book?
  				page_display_mode = "/mode/1up";
      
      // find if page display mode (two or one page) has beeen saved in cookie
      page_display_mode_from_cookie = localStorage.getItem(scanned_book);
      
      if (typeof page_display_mode_from_cookie != "undefined") {
        page_display_mode = page_display_mode_from_cookie
      }
      
      // form book URL
      book_url = root_url + "/reader/embedded_bookreader.html?" + scanned_book + "#page/" + book_page + page_display_mode;
      
      // open grammar page
      grammar_window = window.open(book_url
                                    , scanned_book
                                    , strWindowFeatures
                                    ).focus();
    }
    
  }

  , _popupWinFeatures: function() {
    var chrome_height_corr
    , chrome_left_corr
    , newwin_height
    , newwin_leftpos
    , newwin_width
    , strWindowFeatures;

    // in chrome popup windows are too high and placed too right
    chrome_left_corr = 0;
    chrome_height_corr = 0;
    if(navigator.userAgent.indexOf("Chrome") != -1 ) {
      //chrome_left_corr = 15;
      //chrome_height_corr = 65;
      chrome_left_corr = Math.round((window.screen.availWidth / 100) * 1);
      chrome_height_corr = Math.round((window.screen.availHeight / 100) * 7.5);
    }

    // find height of newwin
    newwin_height = window.screen.availHeight - chrome_height_corr;
  
    // find new window leftpos
    newwin_leftpos = Math.round(((window.screen.availWidth / 100) * 60) - chrome_left_corr);

    // find new window width  
    newwin_width = window.screen.availWidth - (newwin_leftpos + chrome_left_corr);

    // form window features string 
    strWindowFeatures = "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=" + newwin_leftpos + ",width=" + newwin_width  + ",height=" + newwin_height;

    return strWindowFeatures;
  }

};

/*
Concordance button to toggle reference links
*/

var ParsedClassicsConcordanceButton = {

  toggleLinksPanel: function(event) {
    var button
    , el
    , conc_word_container
    , lines_list_container;

    // initialize vars
    conc_word_container = "";

    // get clicked button
    button = $(event.target);

    // find concordance-word container
    el = button;
    while (!el.hasClass(ParsedClassicsVars.concordanceVerseClass) && el[0] != document.body) {
      el = el.parent();
      if (el[0] != document.body) {
        conc_word_container = el;
      }
    }
      
    if (conc_word_container) {
      lines_list_container = conc_word_container.find("." + ParsedClassicsVars.concordanceLinesListClass);
      if (button.hasClass(ParsedClassicsVars.concordanceLinesButtonCollapsedClass)) {
        lines_list_container.show(ParsedClassicsVars.animationSpeed);
        lines_list_container.css("display", "block");
        button.removeClass(ParsedClassicsVars.concordanceLinesButtonCollapsedClass);
        button.addClass(ParsedClassicsVars.concordanceLinesButtonExpandedClass);
      }
      else {
        lines_list_container.hide(ParsedClassicsVars.animationSpeed);
        button.removeClass(ParsedClassicsVars.concordanceLinesButtonExpandedClass);
        button.addClass(ParsedClassicsVars.concordanceLinesButtonCollapsedClass);
      }
    }
  }

};

/*
Concordance link to open parsed text in a popup window
*/

var ParsedClassicsConcordanceLink = {

  resource_shortname: ""
  , contents_shortname: ""
  , content_panel_wrapper: ""
  , popup: null

  , show_line: function(event, contents_shortname) {
    var button
    , button_text
    , book_abbr
    , contents_obj
    , res_shortname
    , strWindowFeatures
    , url_base
    , popup_url
    , urlJSON
    , line_num;

    // get clicked button
    button = $(event.target);
    
    // get text
    button_text = button.text();

    // get line class
    line_num = button_text.substring(button_text.indexOf('\xa0') + 1);

    // get abbreviated title of the book 
    book_abbr = button_text.substring(0, button_text.indexOf('\xa0'));

    // get shortname of parsed text resource
    if (contents_shortname != null && line_num && book_abbr) {
      contents_obj = window[contents_shortname];

      res_shortname = Object.keys(contents_obj).find(key => contents_obj[key] === book_abbr);

      // form window features string
      strWindowFeatures = ParsedClassicsGrammarRefLink._popupWinFeatures();

      // get url without urlJSON of the main window
      url_base = window.location.href.split("index.html")[0];

      // form urlJSON
      urlJSON = {};
      urlJSON[ParsedClassicsVars.resourceUrlAndCookieName] = res_shortname;
      urlJSON[ParsedClassicsVars.lineUrlAndCookieName] = line_num;
      urlJSON[ParsedClassicsVars.contentsUrlName] = contents_shortname;
      urlJSON[ParsedClassicsVars.extraWinUrlName] = ParsedClassicsVars.extraWinUrlValConcordance;

      // form url of the popup window
      popup_url = url_base + "parsed_text.html"  + "?" + Date.now() + ParsedClassicsVars.hashStringStart + JSON.stringify(urlJSON);

      // open parsed text in popup window
      if (!ParsedClassicsConcordanceLink.popup) {
        ParsedClassicsConcordanceLink.popup = window.open(popup_url, "text_popup_window", strWindowFeatures);
      }
      else {
        ParsedClassicsConcordanceLink.popup.location.href = popup_url;
        ParsedClassicsConcordanceLink.popup.focus();
      }

    }

  }

  , load_text_resource: function() {
    var urlJSON
    , west_pane_container;
    
    // get urlJSON
    urlJSON = ParsedClassicsHelpers._getUrlJSON();

    // get text resource shortname
    ParsedClassicsConcordanceLink.resource_shortname = urlJSON[ParsedClassicsVars.resourceUrlAndCookieName];

    // get text resource contents shortname
    ParsedClassicsConcordanceLink.contents_shortname = urlJSON[ParsedClassicsVars.contentsUrlName];

    // get west pane container
    west_pane_container = $("#" + ParsedClassicsVars.westPaneContainerId);

    // create HTML of content panel wrapper 
    ParsedClassicsConcordanceLink.content_panel_wrapper = $('<table id="' + ParsedClassicsConcordanceLink.resource_shortname + '" class="pc-height-100 pc-width-100 pc-content-panel-wrapper parsed_text typed"></table>').append('<tr><td class="pc-height-max pc-position-relative pc-padding-0 pc-valign-top"></td></tr>');
    ParsedClassicsConcordanceLink.content_panel_wrapper.find('td').html('<div class="pc-position-absolute pc-height-100 pc-width-100 pc-overflow-y-scroll pc-padding-right-8 pc-content-panel-inner"></div>');

    // add content panel wrapper inside west pane container
    west_pane_container.append(ParsedClassicsConcordanceLink.content_panel_wrapper);

    // load contents
    ParsedClassicsHelpers.loadScript(ParsedClassicsVars.contentsRelUrl + ParsedClassicsConcordanceLink.contents_shortname + ".js", ParsedClassicsConcordanceLink._after_contents_loaded);
    
  }

  , _after_contents_loaded: function() {
    var contentsObj
    , titlesObj
    , author
    , title
    , heading_el
    , textfrom_text
    , textfrom_link
    , textfrom_el
    , notice
    , notice_el;

    // put contents obj to var
    contentsObj = window[ParsedClassicsConcordanceLink.contents_shortname];
    
    // get titles obj
    titlesObj = contentsObj["titles"];

    // get author and title of current text
    author = titlesObj[ParsedClassicsConcordanceLink.resource_shortname].author_orig;
    title = titlesObj[ParsedClassicsConcordanceLink.resource_shortname].collections_page_title_orig;

    // get textfrom text and link
    textfrom_text = titlesObj[ParsedClassicsConcordanceLink.resource_shortname].library_app_panel_text_from;
    textfrom_link = titlesObj[ParsedClassicsConcordanceLink.resource_shortname].scanned_source_shortname;

    // get notice text
    notice = titlesObj[ParsedClassicsConcordanceLink.resource_shortname].library_app_panel_note;

    // change page title
    document.title = title + " | " + document.title;

    // form heading el
    heading_el = $('<h1 class="resource_title v-title">' + author + '<br>' + title + '</h1>');

    // form textfrom el
    textfrom_el = $('<span class="text_from">Text based on: <a href="../reader/index.html?' + textfrom_link + '" target="blank">' + textfrom_text + '</a></span>');

    // form notice el
    notice_el = $('<span class="text_from">Parsing based on: ' + notice + '</span>');

    // append heading el, textfrom el  to content panel wrapper
    ParsedClassicsConcordanceLink.content_panel_wrapper.find("." + ParsedClassicsVars.contentPanelInnerClass).append(heading_el).append(textfrom_el).append(notice_el);

    // load text
    ParsedClassicsHelpers.loadScript(ParsedClassicsVars.parsedTextsRelUrl + ParsedClassicsConcordanceLink.resource_shortname + ".js");

  }

};

/*
Scanned book mode
*/

var ParsedClassicsScannedBookMode = {

				params: {}
	
				, restoreFromCookie: function(book_shortname) {
								var book_mode;
					
								// get scanned book mode from cookie
								book_mode = localStorage.getItem(book_shortname);
					
								if (book_mode) {
										// put scanned book shortname and book mode into params object
										ParsedClassicsScannedBookMode.params[book_shortname] = book_mode;
								}
								
				}

				, updateMode: function(event) {
								var msg, msg_arr, book_shortname, book_mode;
								
        // get mesage sent from iframe containing scanned book
  						msg = event.originalEvent.data
        
        // is it really message from iframe containing scanned book?
        if (typeof msg == "string" && msg.indexOf("|") != -1) {

  								// split message into parts
  								msg_arr = msg.split("|");
  								
          // is it really message from iframe containing scanned book?
          if (msg_arr.length == 2) {
            // get scanned book shortname and book mode
    								book_shortname = msg_arr[0];
    								book_mode = msg_arr[1];
          }
  								
  								// put scanned book shortname and book mode into params object
  								ParsedClassicsScannedBookMode.params[book_shortname] = book_mode;
  					
  								// save book shortname and book mode in cookie
  								localStorage.setItem(book_shortname, book_mode);
        }
								
				}
	
				, init: function() {
								$(window).on("message", ParsedClassicsScannedBookMode.updateMode);
				}
};

/*
Library data settings forms
*/

var ParsedClassicsLibraryDataSettings = {
    
    toggleVersesParagraphs: function() {
        var westPaneContainer, centerPaneContainer, contentPanels;
        
        // find Parsing pane container
        westPaneContainer = $("#" + ParsedClassicsVars.westPaneContainerId);
        
        // toggle verses/paragraphs class for Parsing pane
        ParsedClassicsLibraryDataSettings._changeContainerClass(westPaneContainer);
        
        // find Resources pane container
        centerPaneContainer = $("#" + ParsedClassicsVars.centerPaneContainerId);
        
        // toggle verses/paragraphs class for Resources pane
        ParsedClassicsLibraryDataSettings._changeContainerClass(centerPaneContainer);
        
        // trigger custom event "sections-selectbox-change" on all content panels (this is needed to restore selected verse in its proper place in content panels)
        contentPanels = $("." + ParsedClassicsVars.contentPanelWrapperClass);
        contentPanels.trigger(ParsedClassicsVars.eventSectionsSelectboxChange);
        
    }
    
    , _changeContainerClass: function(containerEl) {

      if (containerEl.hasClass(ParsedClassicsVars.showAsVersesClass)) {
        // remove "show as verses" class and add "show as paragraphs" class
        containerEl.removeClass(ParsedClassicsVars.showAsVersesClass).addClass(ParsedClassicsVars.showAsParagraphsClass);
        // save setting in cookie
        localStorage.setItem(ParsedClassicsVars.versesOrParagraphsCookieName, ParsedClassicsVars.cookieValShowParagraphs);
        
        return;
      }

      if (containerEl.hasClass(ParsedClassicsVars.showAsParagraphsClass)) {
        // remove "show as paragraphs" class and add "show as verses" class
        containerEl.removeClass(ParsedClassicsVars.showAsParagraphsClass).addClass(ParsedClassicsVars.showAsVersesClass);
        // save setting in cookie
        localStorage.setItem(ParsedClassicsVars.versesOrParagraphsCookieName, ParsedClassicsVars.cookieValShowVerses);
        
        return;
      }

    }
    
    , _restoreVersesOrParagraphsFromCookie: function() {
        var cookieVal, westPaneContainer, centerPaneContainer, form_el, radio_el;
        
        cookieVal = localStorage.getItem(ParsedClassicsVars.versesOrParagraphsCookieName);
        
        if (cookieVal) {
            if (cookieVal == ParsedClassicsVars.cookieValShowParagraphs) {
                // find Parsing pane and Resources pane
                westPaneContainer = $("#" + ParsedClassicsVars.westPaneContainerId);
                centerPaneContainer = $("#" + ParsedClassicsVars.centerPaneContainerId);
                
                // remove "show as verses" class and add "show as paragraphs" class
                westPaneContainer.removeClass(ParsedClassicsVars.showAsVersesClass).addClass(ParsedClassicsVars.showAsParagraphsClass);
                centerPaneContainer.removeClass(ParsedClassicsVars.showAsVersesClass).addClass(ParsedClassicsVars.showAsParagraphsClass);
                
                // restore value in the settings form
                // find form el
                form_el = document.forms[ParsedClassicsVars.versesOrParagraphsFormName];
                if (form_el) {
                    // find radio el
                    radio_el = form_el[ParsedClassicsVars.versesOrParagraphsRadioName];
                    if (radio_el) {
                      radio_el.value = cookieVal;
                    }
                }
                
            }
        }
        
    }
    
    , initToggleVersesParagraphs: function() {
        var versesOrParagraphsForm;
        
        // restore value in the settings form
        ParsedClassicsLibraryDataSettings._restoreVersesOrParagraphsFromCookie();
        versesOrParagraphsForm = $("form[name=" + ParsedClassicsVars.versesOrParagraphsFormName + "]");
        if (versesOrParagraphsForm.length == 1) {
          // bind function to settings form value change
          versesOrParagraphsForm.bind("change", ParsedClassicsLibraryDataSettings.toggleVersesParagraphs);
        }
    }
    
};


var ParsedClassicsLibraryInterfaceSettings = {
    
   toggleDisplayResourcesAtTime: function() {
      var displayResourcesAtTimeVal, resourcesSelectbox, urlJSON, resources_container_inner;
      
      // get form value
      displayResourcesAtTimeVal = $('input[name=' + ParsedClassicsVars.displayResourcesAtTimeRadioName +']:checked').val();
      
      // save value in cookie
      localStorage.setItem(ParsedClassicsVars.displayResourcesAtTimeCookieName, displayResourcesAtTimeVal);
      
      // hide content panels inside Resources pane 
      $("#" + ParsedClassicsVars.centerPaneContainerId).find("." + ParsedClassicsVars.contentPanelWrapperClass).css("display", "none");
      
      // show enabled/disabled resources panel
      $("#" + ParsedClassicsVars.resourcesListPanelId).css("display", "table");
      
      // reset resources selectbox
      resourcesSelectbox = $("#" + ParsedClassicsVars.resourcesSelectboxId);
      resourcesSelectbox[0].selectedIndex = 0;
       
      // remove resource shortname from url 
      urlJSON = ParsedClassicsHelpers._getUrlJSON();
      delete urlJSON[ParsedClassicsVars.resourceUrlAndCookieName];
      ParsedClassicsHelpers._setUrlJSON(urlJSON);
      
      // remove resource shortname from cookie
      localStorage.removeItem(ParsedClassicsVars.resourceUrlAndCookieName);
	   
	  // change resources container class
	  resources_container_inner = $("#" + ParsedClassicsVars.centerPaneContainerId);
	  resources_container_inner.removeClass(ParsedClassicsVars.resourcesAtTimeSingleClass);
	  resources_container_inner.removeClass(ParsedClassicsVars.resourcesAtTimeCategoryClass);
	  resources_container_inner.removeClass(ParsedClassicsVars.resourcesAtTimeAllClass);
	  if (displayResourcesAtTimeVal == ParsedClassicsVars.valResourcesAtTimeSingle) {
		resources_container_inner.addClass(ParsedClassicsVars.resourcesAtTimeSingleClass);  
	  }
	  else if (displayResourcesAtTimeVal == ParsedClassicsVars.valResourcesAtTimeCategory) {
		resources_container_inner.addClass(ParsedClassicsVars.resourcesAtTimeCategoryClass);   
	  }
	  else if (displayResourcesAtTimeVal == ParsedClassicsVars.valResourcesAtTimeAll) {
		resources_container_inner.addClass(ParsedClassicsVars.resourcesAtTimeAllClass);  
	  }
  } 
    
  ,  _restoreDisplayResourcesAtTimeFromCookie: function() {
    var cookieVal, form_el, radio_el, resources_container_inner;
    
    // cookie values has already been found and saved in onloadVars
    cookieVal = ParsedClassicsData.onloadVars.resourcesAtTime;

    if (cookieVal != ParsedClassicsVars.valResourcesAtTimeSingle) {
      
      // restore form value
      form_el = document.forms[ParsedClassicsVars.displayResourcesAtTimeFormName];
      if (form_el) {
        radio_el = form_el[ParsedClassicsVars.displayResourcesAtTimeRadioName];
        if (radio_el) {
          radio_el.value = cookieVal;
        }
      }
      
      resources_container_inner = $("#" + ParsedClassicsVars.centerPaneContainerId);
      if (cookieVal == ParsedClassicsVars.valResourcesAtTimeCategory) {
        resources_container_inner.removeClass(ParsedClassicsVars.resourcesAtTimeSingleClass);
        resources_container_inner.removeClass(ParsedClassicsVars.resourcesAtTimeAllClass);
        resources_container_inner.addClass(ParsedClassicsVars.resourcesAtTimeCategoryClass);
      }
      if (cookieVal == ParsedClassicsVars.valResourcesAtTimeAll) {
        resources_container_inner.removeClass(ParsedClassicsVars.resourcesAtTimeSingleClass);
        resources_container_inner.removeClass(ParsedClassicsVars.resourcesAtTimeCategoryClass);
        resources_container_inner.addClass(ParsedClassicsVars.resourcesAtTimeAllClass);
      }

    }
      
  }
    
   , initDisplayResourcesAtTime: function() {
        var displayResourcesAtTimeForm;
        
        // restore value in the settings form
        ParsedClassicsLibraryInterfaceSettings._restoreDisplayResourcesAtTimeFromCookie();
        displayResourcesAtTimeForm = $("form[name=" + ParsedClassicsVars.displayResourcesAtTimeFormName + "]");
        if (displayResourcesAtTimeForm.length == 1) {
            // bind function to settings form value change
            displayResourcesAtTimeForm.bind("change", ParsedClassicsLibraryInterfaceSettings.toggleDisplayResourcesAtTime);
        }
    }
    
};

/*
Library collection settings form
*/

var ParsedClassicsLibraryCollectionSettings = {

  createEnableDisableResourcesForm: function(collectionObject) {
    var form_el
    , fieldset_el
    , res_html;

    // define vars
    res_html = "";

    // get form el
    form_el = $("form[name=" + ParsedClassicsVars.enableDisableResourcesFormName + "]");

    // get fieldset el
    fieldset_el = form_el.find("fieldset").first();

    // are there critical editions?
    if (typeof collectionObject.original_texts != "undefined" && collectionObject.original_texts.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Critical edition' + (collectionObject.original_texts.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.original_texts.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.original_texts[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          res_html += '<input type="checkbox" name="' + collectionObject.original_texts[i].resource_shortname + '" value="' + collectionObject.original_texts[i].resource_shortname + '" checked="checked"> '; 
        }
        // resource is disabled
        else {
          res_html += '<input type="checkbox" name="' + collectionObject.original_texts[i].resource_shortname + '" value="' + collectionObject.original_texts[i].resource_shortname + '"> ';
        }
        res_html += '<label for="' + collectionObject.original_texts[i].resource_shortname + '">' + collectionObject.original_texts[i].library_app_selectbox_title + '</label><br>';
      }
      res_html += '</div>';
    }

    // are there concordances?
    if (typeof collectionObject.concordance != "undefined" && collectionObject.concordance.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Concordance' + (collectionObject.concordance.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.concordance.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.concordance[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          res_html += '<input type="checkbox" name="' + collectionObject.concordance[i].resource_shortname + '" value="' + collectionObject.concordance[i].resource_shortname + '" checked="checked"> ';
        }
        // resource is disabled
        else {
          res_html += '<input type="checkbox" name="' + collectionObject.concordance[i].resource_shortname + '" value="' + collectionObject.concordance[i].resource_shortname + '"> ';
        }
        res_html += '<label for="' + collectionObject.concordance[i].resource_shortname + '">' + collectionObject.concordance[i].library_app_selectbox_title + '</label><br>'; 
      } 
      res_html += '</div>'; 
    }

    // are there lexicons?
    if (typeof collectionObject.lexicons != "undefined" && collectionObject.lexicons.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Lexicon' + (collectionObject.lexicons.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.lexicons.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.lexicons[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          res_html += '<input type="checkbox" name="' + collectionObject.lexicons[i].resource_shortname + '" value="' + collectionObject.lexicons[i].resource_shortname + '" checked="checked"> ';
        }
        // resource is disabled
        else {
          res_html += '<input type="checkbox" name="' + collectionObject.lexicons[i].resource_shortname + '" value="' + collectionObject.lexicons[i].resource_shortname + '"> ';
        }
        res_html += '<label for="' + collectionObject.lexicons[i].resource_shortname + '">' + collectionObject.lexicons[i].library_app_selectbox_title + '</label><br>'; 
      } 
      res_html += '</div>'; 
    }

    // are there translations?
    if (typeof collectionObject.translations != "undefined" && collectionObject.translations.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Translation' + (collectionObject.translations.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.translations.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.translations[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          res_html += '<input type="checkbox" name="' + collectionObject.translations[i].resource_shortname + '" value="' + collectionObject.translations[i].resource_shortname + '" checked="checked"> ';
        } 
        // resource is disabled
        else {
          res_html += '<input type="checkbox" name="' + collectionObject.translations[i].resource_shortname + '" value="' + collectionObject.translations[i].resource_shortname + '"> ';
        } 
        res_html += '<label for="' + collectionObject.translations[i].resource_shortname + '">' + collectionObject.translations[i].library_app_selectbox_title + '</label><br>'; 
      } 
      res_html += '</div>'; 
    }

    // are there commentaries?
    if (typeof collectionObject.commentaries != "undefined" && collectionObject.commentaries.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += (collectionObject.commentaries.length > 1 ? "Commentaries" : "Commentary");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.commentaries.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.commentaries[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          res_html += '<input type="checkbox" name="' + collectionObject.commentaries[i].resource_shortname + '" value="' + collectionObject.commentaries[i].resource_shortname + '" checked="checked"> ';
        } 
        // resource is disabled
        else {
          res_html += '<input type="checkbox" name="' + collectionObject.commentaries[i].resource_shortname + '" value="' + collectionObject.commentaries[i].resource_shortname + '"> ';
        }
        res_html += '<label for="' + collectionObject.commentaries[i].resource_shortname + '">' + collectionObject.commentaries[i].library_app_selectbox_title + '</label><br>';  
      }
      res_html += '</div>';  
    }

    // are there grammar references?
    if (typeof collectionObject.grammar_refs != "undefined" && collectionObject.grammar_refs.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Grammar references';
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.grammar_refs.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.grammar_refs[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          res_html += '<input type="checkbox" name="' + collectionObject.grammar_refs[i].resource_shortname + '" value="' + collectionObject.grammar_refs[i].resource_shortname + '" checked="checked"> ';
        }
        // resource is disabled
        else {
          res_html += '<input type="checkbox" name="' + collectionObject.grammar_refs[i].resource_shortname + '" value="' + collectionObject.grammar_refs[i].resource_shortname + '"> ';
        }
        res_html += '<label for="' + collectionObject.grammar_refs[i].resource_shortname + '">' + collectionObject.grammar_refs[i].library_app_selectbox_title + '</label><br>';  
      }
      res_html += '</div>';  
    }   

    // are there diagrams?
    if (typeof collectionObject.diagrams != "undefined" && collectionObject.diagrams.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Syntax diagrams';
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.diagrams.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.diagrams[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          res_html += '<input type="checkbox" name="' + collectionObject.diagrams[i].resource_shortname + '" value="' + collectionObject.diagrams[i].resource_shortname + '" checked="checked"> ';
        }
        // resource is disabled
        else {
          res_html += '<input type="checkbox" name="' + collectionObject.diagrams[i].resource_shortname + '" value="' + collectionObject.diagrams[i].resource_shortname + '"> ';
        }
        res_html += '<label for="' + collectionObject.diagrams[i].resource_shortname + '">' + collectionObject.diagrams[i].library_app_selectbox_title + '</label><br>';  
      } 
      res_html += '</div>'; 
    }

    // are there audio recordings?
    if (typeof collectionObject.audio != "undefined" && collectionObject.audio.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Audio recording' + (collectionObject.audio.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.audio.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.audio[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          res_html += '<input type="checkbox" name="' + collectionObject.audio[i].resource_shortname + '" value="' + collectionObject.audio[i].resource_shortname + '" checked="checked"> ';
        }
        // resource is disabled
        else {
          res_html += '<input type="checkbox" name="' + collectionObject.audio[i].resource_shortname + '" value="' + collectionObject.audio[i].resource_shortname + '"> ';
        }
        res_html += '<label for="' + collectionObject.audio[i].resource_shortname + '">' + collectionObject.audio[i].library_app_selectbox_title + '</label><br>';  
      }
      res_html += '</div>'; 
    }   

    // append checkboxes to fieldset
    fieldset_el.append(res_html);

  }

  , markChangeEvent: function() {
    var hidden_input;
    // in case form values has been changed, the value of the hidden el having name "values changed" should be "yes"
    hidden_input = $("#" + ParsedClassicsVars.dialogueId + " form[name=" + ParsedClassicsVars.enableDisableResourcesFormName + "] input[name=" + ParsedClassicsVars.enableDisableResourcesValChangeInputName + "]");
    hidden_input.val("yes");
  }

  , saveEnabledResourcesList: function() {
    var form_el, hidden_input, values_changed, checked_inputs, values_arr, single_checkbox_val, cookie_string, urlJSON;

    //define vars
    values_arr = [];
    cookie_string = "";

    // get form el
    form_el = $("#" + ParsedClassicsVars.dialogueId + " form[name=" + ParsedClassicsVars.enableDisableResourcesFormName + "]");

    // get value of the hidden form el having name "values changed"
    hidden_input = form_el.find("input[name=" + ParsedClassicsVars.enableDisableResourcesValChangeInputName + "]");
    values_changed = hidden_input.val();

    // the case form values has been changed
    if (values_changed == "yes") {
    
      // get all checked inputs
      checked_inputs = form_el.find("input:checked");
      
      if (checked_inputs.length > 0) {
        // get shortnames of all enabled resources and push them into array
        for (var i = 0; i < checked_inputs.length; i++) {
          single_checkbox_val = $(checked_inputs[i]).val();
          values_arr.push(single_checkbox_val);  
        }
        // join shortnames of all enabled resources into cookie string
        cookie_string = values_arr.join("|");
      }
      
      // save cookie
      localStorage.setItem(ParsedClassicsVars.enabledResourcesCookieName, cookie_string);

      // remove resource shortname from URL
      urlJSON = ParsedClassicsHelpers._getUrlJSON();
      delete urlJSON[ParsedClassicsVars.resourceUrlAndCookieName];
      ParsedClassicsHelpers._setUrlJSON(urlJSON);
      
      // delete resource cookie
      localStorage.removeItem(ParsedClassicsVars.resourceUrlAndCookieName);

      // reload Library app
      location.reload(true);   
    }

  }

  , initEnableDisableResourcesForm: function() {
    var form_el, close_dialogue_button;

    form_el = $("#" + ParsedClassicsVars.dialogueId + " form[name=" + ParsedClassicsVars.enableDisableResourcesFormName + "]");
    form_el.bind("change", ParsedClassicsLibraryCollectionSettings.markChangeEvent);

    close_dialogue_button = $("#" + ParsedClassicsVars.dialogueId + " ." + ParsedClassicsVars.closeDialogueButtonClass);
    close_dialogue_button.bind("click", ParsedClassicsLibraryCollectionSettings.saveEnabledResourcesList);
  }

};

/*
Library extra windows settings form
*/

var ParsedClassicsLibraryExtraWindowsSettings = {

  // flag marking that polling for extra windows is being done
  pollingForExtraWinFlag: false

  // jQuery array of checkboxes from "Open in Extra Window" form
  , openNowCheckboxes: []

  // array of names of already opened extra windows
  , openedExtraWindowsNames: []

  , createExtraWindowsForm: function(collectionObject, res_shortnames_in_extra_windows_arr) {
    var form_el
    , fieldset_el
    , res_html
    , open_for_this_session_text
    , open_on_load_text
    , checked;

    // define vars
    res_html = "";
    open_for_this_session_text = "For this session";
    open_on_load_text = "When app starts";

    // get form el
    form_el = $("form[name=" + ParsedClassicsVars.extraWindowsFormName + "]");

    // get fieldset el
    fieldset_el = form_el.find("fieldset").first();

    // are there critical editions?
    if (typeof collectionObject.original_texts != "undefined" && collectionObject.original_texts.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Critical edition' + (collectionObject.original_texts.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.original_texts.length; i++) {
        res_html += '<div class="pc-padding-bottom-8 ' + ParsedClassicsVars.extraWinFormDivClass + '">';
        res_html += collectionObject.original_texts[i].library_app_selectbox_title + '<br>';
        // hidden inputs
        res_html += '<input type="hidden" autocomplete="off" name="resource_shortname" value="' + collectionObject.original_texts[i].resource_shortname + '">';
        res_html += '<input type="hidden" autocomplete="off" name="resource_type" value="' + ParsedClassicsVars.resourceTypeOriginalText + '">';
        // is resource opened in extra window?
        checked = ($.inArray(collectionObject.original_texts[i].resource_shortname, res_shortnames_in_extra_windows_arr) != -1) ? ' checked="checked"' : '';
        // checkboxes
        res_html += '<input type="checkbox" autocomplete="off" class="' + ParsedClassicsVars.extraWinFormInputClassOpennow + '" name="' + collectionObject.original_texts[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpennow + '" value="yes"' + checked + '>&nbsp;'  + open_for_this_session_text + '&nbsp;&nbsp;&nbsp;'; 
        res_html += '<input type="checkbox" autocomplete="off" name="' + collectionObject.original_texts[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpenonload + '" value="yes"' + checked + '> ' + open_on_load_text;
        res_html += '</div>';
      }
      res_html += '</div>';
    }

    // are there concordances?
    if (typeof collectionObject.concordance != "undefined" && collectionObject.concordance.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Concordance' + (collectionObject.concordance.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.concordance.length; i++) {
        res_html += '<div class="pc-padding-bottom-8 ' + ParsedClassicsVars.extraWinFormDivClass + '">';
        res_html += collectionObject.concordance[i].library_app_selectbox_title + '<br>';
        // hidden inputs
        res_html += '<input type="hidden" autocomplete="off" name="resource_shortname" value="' + collectionObject.concordance[i].resource_shortname + '">';
        res_html += '<input type="hidden" autocomplete="off" name="resource_type" value="' + ParsedClassicsVars.resourceTypeConcordance + '">';
        // is resource opened in extra window?
        checked = ($.inArray(collectionObject.concordance[i].resource_shortname, res_shortnames_in_extra_windows_arr) != -1) ? ' checked="checked"' : '';
        // checkboxes
        res_html += '<input type="checkbox" autocomplete="off" class="' + ParsedClassicsVars.extraWinFormInputClassOpennow + '" name="' + collectionObject.concordance[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpennow + '" value="yes"' + checked + '>&nbsp;'  + open_for_this_session_text + '&nbsp;&nbsp;&nbsp;'; 
        res_html += '<input type="checkbox" autocomplete="off" name="' + collectionObject.concordance[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpenonload + '" value="yes"' + checked + '> ' + open_on_load_text;  
        res_html += '</div>';
      }
      res_html += '</div>';
    }

    // are there lexicons?
    if (typeof collectionObject.lexicons != "undefined" && collectionObject.lexicons.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Lexicon' + (collectionObject.lexicons.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.lexicons.length; i++) {
        res_html += '<div class="pc-padding-bottom-8 ' + ParsedClassicsVars.extraWinFormDivClass + '">';
        res_html += collectionObject.lexicons[i].library_app_selectbox_title + '<br>';
        // hidden inputs
        res_html += '<input type="hidden" autocomplete="off" name="resource_shortname" value="' + collectionObject.lexicons[i].resource_shortname + '">';
        res_html += '<input type="hidden" autocomplete="off" name="resource_type" value="' + ParsedClassicsVars.resourceTypeLexicon + '">';
        // is resource opened in extra window?
        checked = ($.inArray(collectionObject.lexicons[i].resource_shortname, res_shortnames_in_extra_windows_arr) != -1) ? ' checked="checked"' : '';
        // checkboxes
        res_html += '<input type="checkbox" autocomplete="off" class="' + ParsedClassicsVars.extraWinFormInputClassOpennow + '" name="' + collectionObject.lexicons[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpennow + '" value="yes"' + checked + '>&nbsp;'  + open_for_this_session_text + '&nbsp;&nbsp;&nbsp;'; 
        res_html += '<input type="checkbox" autocomplete="off" name="' + collectionObject.lexicons[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpenonload + '" value="yes"' + checked + '> ' + open_on_load_text;
        res_html += '</div>';
      }
      res_html += '</div>';
    }

    // are there translations?
    if (typeof collectionObject.translations != "undefined" && collectionObject.translations.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Translation' + (collectionObject.translations.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.translations.length; i++) {
        res_html += '<div class="pc-padding-bottom-8 ' + ParsedClassicsVars.extraWinFormDivClass + '">';
        res_html += collectionObject.translations[i].library_app_selectbox_title + '<br>';
        // hidden inputs
        res_html += '<input type="hidden" autocomplete="off" name="resource_shortname" value="' + collectionObject.translations[i].resource_shortname + '">';
        res_html += '<input type="hidden" autocomplete="off" name="resource_type" value="' + ParsedClassicsVars.resourceTypeTranslation + '">';
        // is resource opened in extra window?
        checked = ($.inArray(collectionObject.translations[i].resource_shortname, res_shortnames_in_extra_windows_arr) != -1) ? ' checked="checked"' : '';
        // checkboxes
        res_html += '<input type="checkbox" autocomplete="off" class="' + ParsedClassicsVars.extraWinFormInputClassOpennow + '" name="' + collectionObject.translations[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpennow + '" value="yes"' + checked + '>&nbsp;'  + open_for_this_session_text + '&nbsp;&nbsp;&nbsp;'; 
        res_html += '<input type="checkbox" autocomplete="off" name="' + collectionObject.translations[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpenonload + '" value="yes"' + checked + '> ' + open_on_load_text;
        res_html += '</div>';
      }
      res_html += '</div>';
    }

    // are there commentaries?
    if (typeof collectionObject.commentaries != "undefined" && collectionObject.commentaries.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += (collectionObject.commentaries.length > 1 ? "Commentaries" : "Commentary");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.commentaries.length; i++) {
        res_html += '<div class="pc-padding-bottom-8 ' + ParsedClassicsVars.extraWinFormDivClass + '">';
        res_html += collectionObject.commentaries[i].library_app_selectbox_title + '<br>';
        // hidden inputs
        res_html += '<input type="hidden" autocomplete="off" name="resource_shortname" value="' + collectionObject.commentaries[i].resource_shortname + '">';
        res_html += '<input type="hidden" autocomplete="off" name="resource_type" value="' + ParsedClassicsVars.resourceTypeCommentary + '">';
        // is resource opened in extra window?
        checked = ($.inArray(collectionObject.commentaries[i].resource_shortname, res_shortnames_in_extra_windows_arr) != -1) ? ' checked="checked"' : '';
        // checkboxes
        res_html += '<input type="checkbox" autocomplete="off" class="' + ParsedClassicsVars.extraWinFormInputClassOpennow + '" name="' + collectionObject.commentaries[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpennow + '" value="yes"' + checked + '>&nbsp;'  + open_for_this_session_text + '&nbsp;&nbsp;&nbsp;'; 
        res_html += '<input type="checkbox" autocomplete="off" name="' + collectionObject.commentaries[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpenonload + '" value="yes"' + checked + '> ' + open_on_load_text; 
        res_html += '</div>';
      }
      res_html += '</div>';
    }

    // are there grammar references?
    if (typeof collectionObject.grammar_refs != "undefined" && collectionObject.grammar_refs.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Grammar references';
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.grammar_refs.length; i++) {
        res_html += '<div class="pc-padding-bottom-8 ' + ParsedClassicsVars.extraWinFormDivClass + '">';
        res_html += collectionObject.grammar_refs[i].library_app_selectbox_title + '<br>';
        // hidden inputs
        res_html += '<input type="hidden" autocomplete="off" name="resource_shortname" value="' + collectionObject.grammar_refs[i].resource_shortname + '">';
        res_html += '<input type="hidden" autocomplete="off" name="resource_type" value="' + ParsedClassicsVars.resourceTypeGrammarRefs + '">';
        // is resource opened in extra window?
        checked = ($.inArray(collectionObject.grammar_refs[i].resource_shortname, res_shortnames_in_extra_windows_arr) != -1) ? ' checked="checked"' : '';
        // checkboxes
        res_html += '<input type="checkbox" autocomplete="off" class="' + ParsedClassicsVars.extraWinFormInputClassOpennow + '" name="' + collectionObject.grammar_refs[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpennow + '" value="yes"' + checked + '>&nbsp;'  + open_for_this_session_text + '&nbsp;&nbsp;&nbsp;'; 
        res_html += '<input type="checkbox" autocomplete="off" name="' + collectionObject.grammar_refs[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpenonload + '" value="yes"' + checked + '> ' + open_on_load_text;
        res_html += '</div>';
      }
      res_html += '</div>';
    }

    // are there diagrams?
    if (typeof collectionObject.diagrams != "undefined" && collectionObject.diagrams.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Syntax diagrams';
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.diagrams.length; i++) {
        res_html += '<div class="pc-padding-bottom-8 ' + ParsedClassicsVars.extraWinFormDivClass + '">';
        res_html += collectionObject.diagrams[i].library_app_selectbox_title + '<br>';
        // hidden inputs
        res_html += '<input type="hidden" autocomplete="off" name="resource_shortname" value="' + collectionObject.diagrams[i].resource_shortname + '">';
        res_html += '<input type="hidden" autocomplete="off" name="resource_type" value="' + ParsedClassicsVars.resourceTypeDiagrams + '">';
        // is resource opened in extra window?
        checked = ($.inArray(collectionObject.diagrams[i].resource_shortname, res_shortnames_in_extra_windows_arr) != -1) ? ' checked="checked"' : '';
        // checkboxes
        res_html += '<input type="checkbox" autocomplete="off" class="' + ParsedClassicsVars.extraWinFormInputClassOpennow + '" name="' + collectionObject.diagrams[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpennow + '" value="yes"' + checked + '>&nbsp;'  + open_for_this_session_text + '&nbsp;&nbsp;&nbsp;'; 
        res_html += '<input type="checkbox" autocomplete="off" name="' + collectionObject.diagrams[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpenonload + '" value="yes"' + checked + '> ' + open_on_load_text;
        res_html += '</div>';
      }
      res_html += '</div>';
    }

    // are there audio recordings?
    if (typeof collectionObject.audio != "undefined" && collectionObject.audio.length > 0) {
      res_html += '<div class="pc-padding-bottom-8">';
      res_html += '<div class="pc-padding-bottom-8"><span class="pc-resource-list-heading">';
      res_html += 'Audio recording' + (collectionObject.audio.length > 1 ? "s" : "");
      res_html += '</span></div>';
      for (var i = 0; i < collectionObject.audio.length; i++) {
        res_html += '<div class="pc-padding-bottom-8 ' + ParsedClassicsVars.extraWinFormDivClass + '">';
        res_html += collectionObject.audio[i].library_app_selectbox_title + '<br>';
        // hidden inputs
        res_html += '<input type="hidden" autocomplete="off" name="resource_shortname" value="' + collectionObject.audio[i].resource_shortname + '">';
        res_html += '<input type="hidden" autocomplete="off" name="resource_type" value="' + ParsedClassicsVars.resourceTypeAudio + '">';
        // is resource opened in extra window?
        checked = ($.inArray(collectionObject.audio[i].resource_shortname, res_shortnames_in_extra_windows_arr) != -1) ? ' checked="checked"' : '';
        // checkboxes
        res_html += '<input type="checkbox" autocomplete="off" class="' + ParsedClassicsVars.extraWinFormInputClassOpennow + '" name="' + collectionObject.audio[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpennow + '" value="yes"' + checked + '>&nbsp;'  + open_for_this_session_text + '&nbsp;&nbsp;&nbsp;'; 
        res_html += '<input type="checkbox" autocomplete="off" name="' + collectionObject.audio[i].resource_shortname + ParsedClassicsVars.extraWinFormPostfixOpenonload + '" value="yes"' + checked + '> ' + open_on_load_text;
        res_html += '</div>';
      }
      res_html += '</div>';
    }

    // append Form HTML to fieldset
    fieldset_el.append(res_html);

  }

  , markFormChange: function() {
    var hidden_input;
    // in case form values has been changed, the value of the hidden el having name "values changed" should be "yes"
    hidden_input = $("#" + ParsedClassicsVars.dialogueId + " form[name=" + ParsedClassicsVars.extraWindowsFormName + "] input[name=" + ParsedClassicsVars.extraWindowsValChangeInputName + "]");
    hidden_input.val("yes");
  }

  , saveExtraWindowsList: function() {
    var form_el
    , hidden_input
    , values_changed
    , shortnames_now_arr
    , params_arr
    , cookie_string
    , extra_win_form_divs
    , form_div_single
    , res_shortname
    , res_type
    , open_onload
    , open_now
    , params_obj;

    //define vars
    shortnames_onload_arr = [];
    shortnames_now_arr = [];
    params_arr = [];
    cookie_string = "";
    params_obj = {};

    // get form el
    form_el = $("#" + ParsedClassicsVars.dialogueId + " form[name=" + ParsedClassicsVars.extraWindowsFormName + "]");

    // get value of the hidden form el having name "values changed"
    hidden_input = form_el.find("input[name=" + ParsedClassicsVars.extraWindowsValChangeInputName + "]");
    values_changed = hidden_input.val();

    // the case form values has been changed
    if (values_changed == "yes") {
      // get all divs inside form having class "extra-win-form-div"
      extra_win_form_divs = $("." + ParsedClassicsVars.extraWinFormDivClass);

      for (var i = 0; i < extra_win_form_divs.length; i++) {
        form_div_single = $(extra_win_form_divs[i]);
        // find resource shortname
        res_shortname = form_div_single.find("input[name=resource_shortname]").val();
        // find resource type
        res_type = form_div_single.find("input[name=resource_type]").val();
        // put resource type to params object
        params_obj[res_shortname] = {};
        params_obj[res_shortname].resource_type = res_type;
        // find if resource should ONLOAD be opened in extra window
        open_onload = form_div_single.find("input[name=" + res_shortname +  ParsedClassicsVars.extraWinFormPostfixOpenonload + "]").is(":checked");

        // find if resource should NOW be opened in extra window
        open_now = form_div_single.find("input[name=" + res_shortname +  ParsedClassicsVars.extraWinFormPostfixOpennow + "]").is(":checked");

        // push to arr shortnames of resources to be opened ONLOAD
        if (open_onload === true) {
          shortnames_onload_arr.push(res_shortname);
        }
        // push to arr params of resources to be opened NOW
        if (open_now === true) {
          shortnames_now_arr.push(res_shortname);
        }
      }
      
      // join shortnames of all resources to be opened in extra windows into cookie string
      cookie_string = shortnames_onload_arr.join("|");
      
      // save cookie
      localStorage.setItem(ParsedClassicsVars.extraWindowsCookieName, cookie_string);

      // popup some if any extra windows and close some if any already opened extra windows
      ParsedClassicsLibraryExtraWindowsSettings.openAllExtraWindows(shortnames_now_arr, params_obj);
      
    }

  }

  , openAllExtraWindows: function(extra_windows_shortnames_arr, params_obj) {
    var strWindowFeatures
    , res_shortname
    , res_type
    , extra_win
    , opened_extra_win_names_arr
    , extra_win_name
    , url_base
    , urlJSON
    , extra_win_urlJSON
    , extra_win_url;

    // define vars
    opened_extra_win_names_arr = [];

    // form window features string
    strWindowFeatures = ParsedClassicsGrammarRefLink._popupWinFeatures();

    // loop through onloadVars.extraWindows array and close those extra windows which are not among those to be opened
    // and push names of opened extra windows into array
    for (var i = 0; i < ParsedClassicsData.onloadVars.extraWindows.length; i++) {
      if (typeof ParsedClassicsData.onloadVars.extraWindows[i].name != "undefined" && ParsedClassicsData.onloadVars.extraWindows[i].name) {
        extra_win_name = ParsedClassicsData.onloadVars.extraWindows[i].name;
        if ($.inArray(extra_win_name, extra_windows_shortnames_arr) == -1) {
          ParsedClassicsData.onloadVars.extraWindows[i].close();
        }
        else {
          opened_extra_win_names_arr.push(extra_win_name);
        }
      }
    }

    // save array of names of opened extra windows for later use
    ParsedClassicsLibraryExtraWindowsSettings.openedExtraWindowsNames = opened_extra_win_names_arr;

    // get url without urlJSON of the main window
    url_base = window.location.href.split(ParsedClassicsVars.hashStringStart)[0];

    // get JSON from hash part of the url
    urlJSON = ParsedClassicsHelpers._getUrlJSON();

    // loop through extra windows params array and open new extra windows
    for (var i = 0; i < extra_windows_shortnames_arr.length; i++) {
      res_shortname = extra_windows_shortnames_arr[i];
      // is extra window not already opened?
      if ($.inArray(res_shortname, opened_extra_win_names_arr) == -1) {
        // get resource type
        res_type = params_obj[res_shortname].resource_type;
        // form urlJSON for extra window
        extra_win_urlJSON = urlJSON;
        extra_win_urlJSON[ParsedClassicsVars.resourceUrlAndCookieName] = res_shortname;
        extra_win_urlJSON[ParsedClassicsVars.extraWinUrlName] = ParsedClassicsVars.extraWinUrlVal;
        // if this is resource NOT  of the type "lexicon" AND not of the "concordance", then remove from extra_win_urlJSON word, lexicon and entry number
        if (res_type != ParsedClassicsVars.resourceTypeLexicon && res_type != ParsedClassicsVars.resourceTypeConcordance) {
          delete extra_win_urlJSON[ParsedClassicsVars.wordUrlAndCookieName];
          delete extra_win_urlJSON[ParsedClassicsVars.lexiconUrlAndCookieName];
          delete extra_win_urlJSON[ParsedClassicsVars.lexiconEntryUrlAndCookieName];
        }
        // form url for extra window
        extra_win_url = url_base + ParsedClassicsVars.hashStringStart + JSON.stringify(extra_win_urlJSON);
        // open extra window
        extra_win = window.open(extra_win_url, res_shortname, strWindowFeatures);
        if (typeof extra_win != "undefined" && extra_win != null) {
          // focus extra window
          extra_win.focus();
          // push extra win to extraWindows array
          ParsedClassicsData.onloadVars.extraWindows.push(extra_win);
        }
        
      }

    }

    // polling for extra windows
    if (ParsedClassicsLibraryExtraWindowsSettings.pollingForExtraWinFlag == false) {
      // get "Open now" checkboxes from extra windows form
      ParsedClassicsLibraryExtraWindowsSettings.openNowCheckboxes = $("#" + ParsedClassicsVars.dialogueId + " form[name=" + ParsedClassicsVars.extraWindowsFormName + "]").find("." + ParsedClassicsVars.extraWinFormInputClassOpennow);
      // set flag that polling started
      ParsedClassicsLibraryExtraWindowsSettings.pollingForExtraWinFlag = true;
      // start polling
      ParsedClassicsLibraryExtraWindowsSettings.pollingForExtraWindows(1000); 
    }

  }

  , pollingForExtraWindows: function(interval) {
    var open_extra_win_names_arr_old
    , open_extra_win_names_arr_new
    , extra_win_name
    , closed_extra_win_names_arr
    , opennow_checkbox;

    // initialize vars
    open_extra_win_names_arr_old = ParsedClassicsLibraryExtraWindowsSettings.openedExtraWindowsNames;
    open_extra_win_names_arr_new = [];
    
    // loop through onloadVars.extraWindows array and push opened windows names into array
    for (var i = 0; i < ParsedClassicsData.onloadVars.extraWindows.length; i++) {
      if (typeof ParsedClassicsData.onloadVars.extraWindows[i].name != "undefined" && ParsedClassicsData.onloadVars.extraWindows[i].name) {
        extra_win_name = ParsedClassicsData.onloadVars.extraWindows[i].name;
        open_extra_win_names_arr_new.push(extra_win_name);
      } 
    }

    // get array of closed extra windows names
    closed_extra_win_names_arr = open_extra_win_names_arr_old.filter(e => !open_extra_win_names_arr_new.includes(e));

    // uncheck "open now" checkboxes of closed extra windows in extra windows form
    for (var i = 0; i < closed_extra_win_names_arr.length; i++) {
      opennow_checkbox = ParsedClassicsLibraryExtraWindowsSettings.openNowCheckboxes.filter("input[name=" + closed_extra_win_names_arr[i] + ParsedClassicsVars.extraWinFormPostfixOpennow + "]");
      opennow_checkbox.prop( "checked", false );
    }
    
    // save updated names of opened windows array 
    ParsedClassicsLibraryExtraWindowsSettings.openedExtraWindowsNames = open_extra_win_names_arr_new;

    // there is any opened extra windows?
    // then set timeout for polling if they have been closed
    if (open_extra_win_names_arr_new.length > 0) {
      setTimeout(function () { ParsedClassicsLibraryExtraWindowsSettings.pollingForExtraWindows(interval); }, interval);
    }
    // there are no extra windows, so set polling started flag to false
    else {
      ParsedClassicsLibraryExtraWindowsSettings.pollingForExtraWinFlag = false;
    }
    
  }

  , closeAllExtraWindows: function() {
    for (var i = 0; i < ParsedClassicsData.onloadVars.extraWindows.length; i++) {
      ParsedClassicsData.onloadVars.extraWindows[i].close();
    }
  }

  , initExtraWindowsForm: function() {
    var form_el, close_dialogue_button;

    form_el = $("#" + ParsedClassicsVars.dialogueId + " form[name=" + ParsedClassicsVars.extraWindowsFormName + "]");
    form_el.bind("change", ParsedClassicsLibraryExtraWindowsSettings.markFormChange);

    close_dialogue_button = $("#" + ParsedClassicsVars.dialogueId + " ." + ParsedClassicsVars.closeDialogueButtonClass);
    close_dialogue_button.bind("click", ParsedClassicsLibraryExtraWindowsSettings.saveExtraWindowsList);
  }

};

/*
Plain code button
*/

var ParsedClassicsPlainCodeButton = {
  
  showPlainCodeFromTextarea: function(id) {
    var textarea;
    var code;
    var wnd;
    
    // find hidden textarea
    textarea = document.getElementById(id);
    // fetch code from hidden textarea
    code = textarea.value.replace(/</g, '&lt;');
    // open new window and display code in it
    wnd = window.open('', 'pc_code_example', 'width=750, height=400, location=0, resizable=1, menubar=0, scrollbars=0');
  
    wnd.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"' +
    '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
    '<html xmlns="http://www.w3.org/1999/xhtml">' +
    '<head>' +
    '<title>Code example</title>' +
    '<style>' +
    'html, body {padding: 0; margin: 0; border: 0; width: 100%; height: 100%; overflow: hidden;}' +
    '</style>' +
    '</head>' + 
    '<body>' + 
    '<div style="width: 100%; height: 100%; padding: 5px;">' +
    '<textarea style="width: calc(100% - 16px); height: calc(100% - 16px); margin: 0; resize: none; font-size: 18px; border: solid 1px #616161; font-family: \'Courier New\', monospace;" readonly="readonly">' + 
    code + 
    '</textarea>' +
    '</div>' +
    '</body>' + 
    '</html>');
  
    wnd.document.close();
  }
  
  , createCodeTextareas: function() {
      var pre_els;
      var pre_single;
      var pre_id;
      var pre_val;
      var textarea_el;
      var div_el; 
      var button_el;
      var func;
      
      // find all <pre> tags having class "code_showarea"
      pre_els = $('pre.code_showarea');
      
      // loop through <pre> els
      for (var i = 0; i < pre_els.length; i++) {
        pre_single = $(pre_els[i]);
        pre_id = pre_single.attr("id");
        pre_val = pre_single.html();
        // remove "id" attr
        pre_single.removeAttr("id");
        // create hidden textarea having "id" attr of the <pre> el and containing code of <pre> el 
        textarea_el = $('<textarea id="' + pre_id + '" style="display: none;">' + pre_val + '</textarea>');
        textarea_el.insertAfter(pre_single);
        
        // create <div> el
        div_el = $('<div class="pc-padding-8"></div>');
        
        // create <button> el
        button_el = $('<button class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Show plain</button>');
        // bind function which will open a new window containing code
        func = (function(pre_id) {return function() {ParsedClassicsPlainCodeButton.showPlainCodeFromTextarea(pre_id)}; })(pre_id);
        button_el.bind("click", func);
        
        // append <button> el to <div> el
        div_el.append(button_el);
        
        // insert <div> with button after <pre> el
        div_el.insertAfter(pre_single);
      }
  }
  
  , init: function() {
    // create hidden code textareas
    ParsedClassicsPlainCodeButton.createCodeTextareas();
    // highlight code in <pre> els
    PR.prettyPrint();
  }

}

/*
Collection details button
*/

ParsedClassicsCollectionDetailsButton = {

  toggle: function(button_id) {

    $("#" + button_id).toggle(ParsedClassicsVars.animationSpeed);
    
  }

}

/*
Selected contents item
*/

ParsedClassicsSelectedContentsItem = {
  
  itemClicked: function(event) {
    var el, westPaneContainer, currentSelectedItem, itemClicked;
    
    // find contents container
    westPaneContainer = $("#" + ParsedClassicsVars.westPaneContainerId);
    
    // find currently selected contents item
    currentSelectedItem = westPaneContainer.find("." + ParsedClassicsVars.contentsItemClass);
    
    // find which item is newly selected by clicking
    el = $(event.target);
    if (el.hasClass(ParsedClassicsVars.contentsItemClass)) {
       itemClicked = el;
    }
    else {
      while (el.attr("id") != ParsedClassicsVars.westPaneContainerId) {
        el = el.parent();
        if (el.hasClass(ParsedClassicsVars.contentsItemClass)) {
          itemClicked = el;
          break;
        }
      }
    }
    
    if (typeof itemClicked != "undefined") {
      // remove styling from currently selected item
      currentSelectedItem.removeClass(ParsedClassicsVars.selectedLineClass);
      // add styling to newly selected item
      itemClicked.addClass(ParsedClassicsVars.selectedLineClass);
    } 
  }
  
  , init: function() {
      var westPaneContainer, centerPaneContainer, jsonURL, docs_heading_link, section_id, section, section_header_text, nav_header, nav_header_text_el;
      
      // get centerPaneContainer
      centerPaneContainer = $("#" + ParsedClassicsVars.centerPaneContentId);
      
      //initialization of Navigation link leading to Docs heading
      docs_heading_link = $("#" + ParsedClassicsVars.docsHeadingLinkId);
      docs_heading_link.bind("click", function(){
         centerPaneContainer.scrollTo($("#" + ParsedClassicsVars.docsHeadingId), ParsedClassicsVars.animationSpeed);
         if (window.location.hash) {
           window.location.hash = "";
         }
      });
      
      
      // bind onclick function to westpane container
      westPaneContainer = $("#" + ParsedClassicsVars.westPaneContainerId);
      westPaneContainer.bind("click", function(event) {
        ParsedClassicsSelectedContentsItem.itemClicked(event);
      });

      // get JSON from URL
      jsonURL = ParsedClassicsHelpers._getUrlJSON(ParsedClassicsVars.hashStringStartDocs);
      
      // onload scroll item to view if it is indicated in JSON in URL
      // first, get section to be scrolled HTML id attribute from JSON in URL
      section_id = "";
      if (typeof jsonURL[ParsedClassicsVars.sectionUrlAndCookieName] != "undefined") {
        section_id = jsonURL[ParsedClassicsVars.sectionUrlAndCookieName];
        // get section to be scrolled into view
        section = centerPaneContainer.find("#" + section_id);
        // get section header text
        section_header_text = section.text();
        // get navigation header having the same text
        nav_header = westPaneContainer.find("div.connav-table-item-title:contains('" + section_header_text + "')");
        // scroll navigation header into view
        westPaneContainer.scrollTo(nav_header, ParsedClassicsVars.animationSpeed);
        // trigger click in nav header item
        nav_header_text_el = nav_header.find(".connav-table-item-text");
        setTimeout(function(){ nav_header_text_el.trigger("click"); }, 2000);
      }
  }
  
}