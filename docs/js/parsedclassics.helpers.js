/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
Script supporting ParsedClassics data functionality
=====================================================
*/

var ParsedClassicsHelpers = {

  _getUrlJSON: function(hash_string_start) {
      var url, urlSegments, urlJSON;
      
      url = window.location.href;
      hash_string_start = hash_string_start ? hash_string_start : ParsedClassicsVars.hashStringStart; 
      urlSegments = url.split(hash_string_start);
      urlJSON = {};
      
      if (urlSegments.length == 2) {
        urlJSON = decodeURIComponent(urlSegments[1]);
        try {
          urlJSON = JSON.parse(urlJSON);
        }
        catch(err) {
        }
      }
      return urlJSON;
      
  }
  
  , _setUrlJSON: function(urlJSON, valuesObject) {
      var newUrlJSON, newHashString;
      
      newUrlJSON = urlJSON;
      if (typeof valuesObject != "undefined") {
        newUrlJSON = $.extend(urlJSON, valuesObject);
      }
      newHashString = ParsedClassicsVars.hashStringStart + JSON.stringify(newUrlJSON);
      window.location.hash = newHashString;
      
  }

  , _scrollToSelectedLine: function(event, contentPanelWrapper, lineClass) {
      var contentPanelInner, elToBeScrolled, selectedLine, cssDisplay, contentPanelDialogue, lineNum, urlJSON, lemma;
      
      // in case function was fired by event "sections-selectbox-change" find contentPanelWrapper and lineClass
      if (event != null) {
        var contentPanelWrapper = $(event.target);
        var lineClass = $("#" + ParsedClassicsVars.sectionsSelectboxId).val();
      }
      
      // is content panel wrapper visible?
      cssDisplay = contentPanelWrapper.css("display");
      
      // get JSON part of the url
      urlJSON = ParsedClassicsHelpers._getUrlJSON();
      
      if (cssDisplay != "none") {
        
        // find contentPanelInner which will be scrolled
        contentPanelInner = contentPanelWrapper.find("." + ParsedClassicsVars.contentPanelInnerClass);
        
        // find line which will be scrolled
        elToBeScrolled = contentPanelInner.find("." + lineClass).first();
        
        // find "Item not found" dialogue
        contentPanelDialogue = contentPanelWrapper.find("." + ParsedClassicsVars.contentPanelDialogueClass);
        
        // hide "Item not found" dialogue
        contentPanelDialogue.css("display", "none");
        
        // needed line was found
        if (elToBeScrolled.length == 1) {
            
            // in case content panel wrapper is in Parsing pane, remove styling from old selected line and add styling to new selected verse
            if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeParsedText)) {

              // remove styling from old selected line
              selectedLine = contentPanelInner.find("." + ParsedClassicsVars.selectedLineClass);
              selectedLine.removeClass(ParsedClassicsVars.selectedLineClass);
													
  			  // remove selected word from old selected line
  			  selectedLine.find("." + ParsedClassicsVars.selectedWordClass).removeClass(ParsedClassicsVars.selectedWordClass);

              // certain verse (not title) was selected
              if (elToBeScrolled.hasClass('verse-number')) {
                // style new selected line
                elToBeScrolled.parent().addClass(ParsedClassicsVars.selectedLineClass);
                // is word in url?
                if (typeof urlJSON[ParsedClassicsVars.wordUrlAndCookieName] != "undefined" && urlJSON[ParsedClassicsVars.wordUrlAndCookieName] != "") {
                  // escape braces in word
                  lemma = urlJSON[ParsedClassicsVars.wordUrlAndCookieName];
                  lemma = lemma.replace("(", "\\(");
                  lemma = lemma.replace(")", "\\)");
                  // find selected word in newly selected line and style it
                  elToBeScrolled.parent().find("[" + ParsedClassicsVars.lemmaAttr + "=" + lemma + "]").first().addClass(ParsedClassicsVars.selectedWordClass);
                }
              }

            }

            contentPanelInner.scrollTo(elToBeScrolled, ParsedClassicsVars.animationSpeed); 
            
        }
        // needed line was not found, so display error message
        else {
           
		  ParsedClassicsModalDialogues.contentPanelErrorMessage(contentPanelWrapper, lineClass);
           
        }
        
      
      } 

  }
	
  , _browseToSelectedLine: function(event, contentPanelWrapper, lineClass) {
    var cssDisplay, contents_shortname_attr, contentsJSON, scanned_page_num, iframe_el, scanned_source_shortname, iframe_src_new, iframe_src, page_display_mode, onload, iframe_is_empty, urlJSON;
    
    // initialize var
    iframe_is_empty = false;
    onload = false;

    // get JSON part of the url
    urlJSON = ParsedClassicsHelpers._getUrlJSON();

    // in case function was fired by event "sections-selectbox-change" find contentPanelWrapper and lineClass
    if (event != null) {
      var contentPanelWrapper = $(event.target);
      var lineClass = $("#" + ParsedClassicsVars.sectionsSelectboxId).val();
    }
    // we try to take lineClass from onloadVars or resource is in extra window
    else {
      // is it  main window?
      if (typeof urlJSON[ParsedClassicsVars.extraWinUrlName] == "undefined" || urlJSON[ParsedClassicsVars.extraWinUrlName] != ParsedClassicsVars.extraWinUrlVal) {
        onload = true;
      }
      // it is extra window
      else {
        // is extra windoe already loaded? var extrawin_loaded is INTENTIONALY global
        if (typeof extrawin_loaded != "undefined" && extrawin_loaded == "yes") {
          onload = false;
        }
        // extra window loads now
        else {
          onload = true;
          extrawin_loaded = "yes";
        }
      }
    }
  
    // find  iframe
    iframe_el = contentPanelWrapper.find("." + ParsedClassicsVars.bookReaderIframeClass);
  
    // find shortname of scanned book
    scanned_source_shortname = iframe_el.attr("id");
    
    // find "scr" attr of the iframe
    iframe_src = iframe_el.attr("src");
    
    if (iframe_src.indexOf('data:') != -1) {
      // iframe is as yet empty
      iframe_is_empty = true;
    }
    
  
    // form main part of iframe src
    iframe_src_new = "../reader/embedded_bookreader.html?" + scanned_source_shortname;
  
    // display two or one page of scanned book?
    page_display_mode = "/mode/2up";
    if (typeof ParsedClassicsScannedBookMode.params[scanned_source_shortname] != "undefined" && ParsedClassicsScannedBookMode.params[scanned_source_shortname]) {
        page_display_mode = ParsedClassicsScannedBookMode.params[scanned_source_shortname];
    }

    // is content panel wrapper visible?
    cssDisplay = contentPanelWrapper.css("display");
  
    if (cssDisplay != "none") {
        
      // find contents shortname
      contents_shortname_attr = contentPanelWrapper.attr(ParsedClassicsVars.contentsShortnameAttr);
      
      // there is contents file
      if (contents_shortname_attr) {
          
        // get contents JSON object
        if (typeof window[contents_shortname_attr] != "undefined") {
          contentsJSON = window[contents_shortname_attr];
          
          // is page in contents JSON?
          if (typeof contentsJSON[lineClass] != "undefined" && contentsJSON[lineClass] != "") {
              // get page number of scanned book
              scanned_page_num = contentsJSON[lineClass];

              // form new "src" attr of the iframe
              iframe_src_new += "#page/" + scanned_page_num + page_display_mode;
            
              // set new "src" attr of the iframe
              iframe_el.attr("src", iframe_src_new);
          }
          // page number was not found, so scroll to title page and display error message
          else {
            // we tried to take lineClass from onloadVars or iframe is as yet empty or resource is in extra window 
            if (onload || iframe_is_empty) {
              // title page was found in contents
              if (typeof contentsJSON[ParsedClassicsVars.lineClassSelectedByDefault] != "undefined") {
                  // find title page num
                  scanned_page_num = contentsJSON[ParsedClassicsVars.lineClassSelectedByDefault];
                  // form new "src" attr of the iframe
                  iframe_src_new += "#page/" + scanned_page_num + page_display_mode;
                  // change "src" attr of the iframe
                  iframe_el.attr("src", iframe_src_new);
              }
              // title page not found in contents
              else {
                  // was as yet no page loaded?
                  if (iframe_src == "") {
                      // then load first page of the scanned book
                      iframe_el.attr("src", iframe_src_new);
                  }
              }
            }  
              
            // display error message
            ParsedClassicsModalDialogues.contentPanelErrorMessage(contentPanelWrapper, lineClass);	
          }
        }
          
      }
      // there is no contents file
      else {
          // load first page of the scanned book
          iframe_el.attr("src", iframe_src_new);
      }
      
    }
  }
  
  , _jumpToAudioTime: function(event, contentPanelWrapper, lineClass) {
      var cssDisplay
      , contents_shortname_attr
      , contentsJSON
      , audio_el
      , time_point
      , interval;
      
      // define var
      interval =  ParsedClassicsVars.waitForDataTimeout;
      
      // in case function was fired by event "sections-selectbox-change" find contentPanelWrapper and lineClass
  				if (event != null) {
  						var contentPanelWrapper = $(event.target);
  						var lineClass = $("#" + ParsedClassicsVars.sectionsSelectboxId).val();
  				}
      
      // is content panel wrapper visible?
      cssDisplay = contentPanelWrapper.css("display");
      
      if (cssDisplay != "none") {
        
        // find audio el
        audio_el = contentPanelWrapper.find("audio").first();
          
        // find contents shortname
						  contents_shortname_attr = contentPanelWrapper.attr(ParsedClassicsVars.contentsShortnameAttr);
        
        // there is audio el and contents file
						  if (audio_el.length == 1 && contents_shortname_attr) {
          
          // get contents JSON object
								  if (typeof window[contents_shortname_attr] != "undefined") {
            contentsJSON = window[contents_shortname_attr];
            
            // is line in contents JSON?
            if (typeof contentsJSON[lineClass] != "undefined") {
              
              // set audio el to needed time point (we need to add a little time in order audio-text synchronized didplay one line instead of two)
              // exclude the case when lineClass == "v-title"
              if (lineClass == ParsedClassicsVars.lineClassSelectedByDefault) {
                time_point = contentsJSON[lineClass];
              }
              else {
                time_point = contentsJSON[lineClass] + 0.1;
              }

              // are metadata loaded?
              if (audio_el[0].readyState > 0) {
                audio_el[0].currentTime = time_point;  
              }
              // no metadata? - then set timeout
              else {
                ParsedClassicsHelpers._setTimeAfterMetadataLoads(audio_el[0], time_point, interval);
              }
              
            }
            // line was not found, what to do then?
            else {
            
            }
          }
          
        }
        
      }
  }
  
  , _setTimeAfterMetadataLoads: function(audioEl, timePoint, interval) {
      // has metadata loaded?
      if (audioEl.readyState > 0) {
        // then set current time
        audioEl.currentTime = timePoint;
      }
      else {
        setTimeout(function() {ParsedClassicsHelpers._setTimeAfterMetadataLoads(audioEl, timePoint, interval)}, interval);
      }
  }
	
		, _scrollToSelectedWord: function(event, contentPanelWrapper, lemma) {
      var urlJSON
      , contentPanelInner
      , elToBeScrolled
      , cssDisplay
      , contentPanelDialogue
      , lemma_escaped
      , lexicon
      , lexicon_entry_num
      , lexicon_array
      , lexicon_entry_num_array
      , lexicon_shortname
      , lexicon_index;
      
      // get JSON part of the url
      urlJSON = ParsedClassicsHelpers._getUrlJSON();
      
      // in case function was fired by event "selected-word-change" find contentPanelWrapper and lemma
      if (event != null) {
        var contentPanelWrapper = $(event.target);
        var lemma = urlJSON[ParsedClassicsVars.wordUrlAndCookieName];
      }
      
      // is content panel wrapper visible?
      cssDisplay = contentPanelWrapper.css("display");
      
      if (cssDisplay != "none" && lemma) {
        
        // find contentPanelInner which will be scrolled
        contentPanelInner = contentPanelWrapper.find("." + ParsedClassicsVars.contentPanelInnerClass);
        
        // escape braces in lemma
        lemma_escaped = lemma.replace("(", "\\(");
        lemma_escaped = lemma_escaped.replace(")", "\\)");
        
        // find word which will be scrolled
								if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeConcordance)) {
										elToBeScrolled = contentPanelInner.find("." + ParsedClassicsVars.concordanceHeadingClass).filter("[" + ParsedClassicsVars.lemmaAttr + "=" + lemma_escaped + "]");	
								}
								if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeLexicon)) {
										elToBeScrolled = contentPanelInner.find("." + ParsedClassicsVars.lexiconHeadingClass).filter("[" + ParsedClassicsVars.lemmaAttr + "=" + lemma_escaped + "]");	
								}
        
        // find "Item not found" dialogue
        contentPanelDialogue = contentPanelWrapper.find("." + ParsedClassicsVars.contentPanelDialogueClass);
        
        // hide "Item not found" dialogue
        contentPanelDialogue.css("display", "none");
        
        // needed word was found
        if (elToBeScrolled.length == 1) {
          // scroll it to top
          contentPanelInner.scrollTo(elToBeScrolled, ParsedClassicsVars.animationSpeed);
        }
        // two or more words having the same lemma were found
        else if (elToBeScrolled.length > 1) {
          // is lexicon shortname and lexicon entry order number in URL?
          if (typeof urlJSON[ParsedClassicsVars.lexiconUrlAndCookieName] != "undefined" && typeof urlJSON[ParsedClassicsVars.lexiconEntryUrlAndCookieName] != "undefined") {
            // get lexicon shortname string
            lexicon = urlJSON[ParsedClassicsVars.lexiconUrlAndCookieName];
            // get lexicon entry order number string
            lexicon_entry_num = urlJSON[ParsedClassicsVars.lexiconEntryUrlAndCookieName];
            // convert lexicon shortname string into array
            lexicon_array = lexicon.split("|");
            // convert lexicon entry order number string 
            lexicon_entry_num_array = lexicon_entry_num.split("|");
            // get shortname of current resource into array
            lexicon_shortname = contentPanelWrapper.attr("id");
            // is current resource in lexicon array?
            lexicon_index = $.inArray(lexicon_shortname, lexicon_array);
            // is there lexicon entry number at the same index as lexicon in lexicon array?
            if (typeof lexicon_entry_num_array[lexicon_index] != "undefined") {
              lexicon_entry_num = lexicon_entry_num_array[lexicon_index];
            }
            // if there is not, the first entry will be loaded
            else {
              lexicon_entry_num = 1;
            }
            // get word entry to be scrolled
            elToBeScrolled = elToBeScrolled.get(lexicon_entry_num - 1);
            // scroll it to top
            contentPanelInner.scrollTo(elToBeScrolled, ParsedClassicsVars.animationSpeed);
            
          }
          // lexicon shortname and lexicon entry order number not in URL, 
          // so scroll yo the first word having the same lemma
          else {
            elToBeScrolled = elToBeScrolled.get(0);
            contentPanelInner.scrollTo(elToBeScrolled, ParsedClassicsVars.animationSpeed);
          }
        }
        // needed line was not found, so display error message
        else {
          ParsedClassicsModalDialogues.contentPanelErrorMessageOnWord(contentPanelWrapper, lemma);
        }
        
      }
  }
  
  , _browseToSelectedWord: function(event, contentPanelWrapper, lemma) {
    var urlJSON
    , iframe_el
    , scanned_source_shortname
    , iframe_src
    , iframe_src_new
    , page_display_mode
    , cssDisplay
    , contents_shortname_attr
    , contentsJSON
    , contents_key
    , scanned_page_num
    , onload
    , lemma_in_url;

    // initialize var
    lemma_in_url = true;
    onload = false;
						
    // get JSON part of the url
    urlJSON = ParsedClassicsHelpers._getUrlJSON();
      
    // in case function was fired by event "selected-word-change" find contentPanelWrapper and lemma
    if (event != null) {
      var contentPanelWrapper = $(event.target);
      var lemma = typeof urlJSON[ParsedClassicsVars.wordUrlAndCookieName] != "undefined" ? urlJSON[ParsedClassicsVars.wordUrlAndCookieName] : "";
      if (!lemma) {
        lemma_in_url = false;
      }
    }
    // lemma is taken from onload vars or resource is in extra window
    else {
      // is it  main window?
      if (typeof urlJSON[ParsedClassicsVars.extraWinUrlName] == "undefined" || urlJSON[ParsedClassicsVars.extraWinUrlName] != ParsedClassicsVars.extraWinUrlVal) {
        onload = true;
      }
      // it is extra window
      else {
        // is extra windoe already loaded? var extrawin_loaded is INTENTIONALY global
        if (typeof extrawin_loaded != "undefined" && extrawin_loaded == "yes") {
          onload = false;
        }
        // extra window loads now
        else {
          onload = true;
          extrawin_loaded = "yes";
        }
      }
      
    }
			
    // find  iframe
    iframe_el = contentPanelWrapper.find("." + ParsedClassicsVars.bookReaderIframeClass);

    // find shortname of scanned book
    scanned_source_shortname = iframe_el.attr("id");

    // find "scr" attr of the iframe
    iframe_src = iframe_el.attr("src");

    // form main part of iframe src
    iframe_src_new = "../reader/embedded_bookreader.html?" + scanned_source_shortname;

    // display two or one page of scanned book?
    page_display_mode = "/mode/2up";
    if (typeof ParsedClassicsScannedBookMode.params[scanned_source_shortname] != "undefined" && ParsedClassicsScannedBookMode.params[scanned_source_shortname]) {
        page_display_mode = ParsedClassicsScannedBookMode.params[scanned_source_shortname];
    }

    // is content panel wrapper visible?
    cssDisplay = contentPanelWrapper.css("display");
			
    if (cssDisplay != "none") {
        
      // find contents shortname
      contents_shortname_attr = contentPanelWrapper.attr(ParsedClassicsVars.contentsShortnameAttr);
        
      // there is contents file
      if (contents_shortname_attr) {
        
        // get contents JSON object

        if (typeof window[contents_shortname_attr] != "undefined") {
          contentsJSON = window[contents_shortname_attr];
        
          // get JSON key
          contents_key = "w";
          for (var i = 0; i < lemma.length; i++) {
              contents_key += "-" + lemma.codePointAt(i);	
          }


          // is page in contents JSON?
          if (typeof contentsJSON[contents_key] != "undefined" && contentsJSON[contents_key] != "") {
              
            // close content panel error message, if such exists
            contentPanelWrapper.find("." + ParsedClassicsVars.contentPanelDialogueClass).css("display", "none");
              
            // get page number of scanned book
            scanned_page_num = contentsJSON[contents_key];

          
            // form new "src" attr of the iframe
            iframe_src_new += "#page/" + scanned_page_num + page_display_mode;

            // set new "src" attr of the iframe
            iframe_el.attr("src", iframe_src_new);
          }
          // page number was not found, so scroll to title page and display error message
          else {
            // lemma is taken from onload vars or there is no lemma in url
            if (onload || ! lemma_in_url) {
              // title page was found in contents
              if (typeof contentsJSON[ParsedClassicsVars.wordClassSelectedByDefault] != "undefined") {
                // find title page num
                scanned_page_num = contentsJSON[ParsedClassicsVars.wordClassSelectedByDefault];
                // form new "src" attr of the iframe
                iframe_src_new += "#page/" + scanned_page_num + page_display_mode;
                // change "src" attr of the iframe
                iframe_el.attr("src", iframe_src_new);
              }
              // title page not found in contents
              else {
                // was as yet no page loaded?
                if (iframe_src == "") {
                  // then load first page of the scanned book
                  iframe_el.attr("src", iframe_src_new);
                }
              }
            }
            
            // display error message
            if (lemma) {
                ParsedClassicsModalDialogues.contentPanelErrorMessageOnWord(contentPanelWrapper, lemma);
            }
              
          }
        }
        
      }
      
    }
  }

  , _toLineInExtraWindows: function(lineClass, lineNum) {
    var extra_win
    , singleContentPanel
    , resource_shortname
    , scanned_or_typed
    , is_audio
    , is_lexicon
    , is_concordance
    , valuesObject
    , urlJSON;

    // get JSON from hash part of the url
    urlJSON = ParsedClassicsHelpers._getUrlJSON();

    // loop through extra windows
    for (var i = 0; i < ParsedClassicsData.onloadVars.extraWindows.length; i++) {
      if (typeof ParsedClassicsData.onloadVars.extraWindows[i] != "undefined" && ParsedClassicsData.onloadVars.extraWindows != null) {
        extra_win = ParsedClassicsData.onloadVars.extraWindows[i];
        // get content panel in extra window
        singleContentPanel = extra_win.$("." + ParsedClassicsVars.contentPanelWrapperClass);
        // get resource shortname which is content panel's id attr in extra window
        resource_shortname = singleContentPanel.attr("id");
        // is resource scanned or typed?
        scanned_or_typed = singleContentPanel.hasClass(ParsedClassicsVars.resourceTypeTyped) ? ParsedClassicsVars.resourceTypeTyped : ParsedClassicsVars.resourceTypeScanned;
        // is resource of the type "audio recording"?
        is_audio = singleContentPanel.hasClass(ParsedClassicsVars.resourceTypeAudio);
        // is resource of the type "lexicon"?
        is_lexicon = singleContentPanel.hasClass(ParsedClassicsVars.resourceTypeLexicon);
        // is resource of the type "concordance"?
        is_concordance = singleContentPanel.hasClass(ParsedClassicsVars.resourceTypeConcordance);
        // form object containing values specific for urlJSON in extra window 
        valuesObject = {};
        valuesObject[ParsedClassicsVars.resourceUrlAndCookieName] = resource_shortname; 
        valuesObject[ParsedClassicsVars.extraWinUrlName] = ParsedClassicsVars.extraWinUrlVal; 
        if (lineNum) {
          valuesObject[ParsedClassicsVars.lineUrlAndCookieName] = lineNum;
        }
        
        // is resource audio recording?
        if (is_audio) {
          // set JSON part of the url in extra window
          extra_win.ParsedClassicsHelpers._setUrlJSON(urlJSON, valuesObject);
          // jump to audio time
          extra_win.ParsedClassicsHelpers._jumpToAudioTime(null, singleContentPanel, lineClass);
        }
        // is resource scanned AND not lexicon AND not concordance?
        else if (! is_lexicon && ! is_concordance) {
          // set JSON part of the url in extra window
          extra_win.ParsedClassicsHelpers._setUrlJSON(urlJSON, valuesObject);
          // is resource scanned?
          if (scanned_or_typed == ParsedClassicsVars.resourceTypeScanned) {
            // browse extra window to selected line
            extra_win.ParsedClassicsHelpers._browseToSelectedLine(null, singleContentPanel, lineClass);
          }
          // resource is typed
          else {
            // scroll extra window to selected line
            extra_win.ParsedClassicsHelpers._scrollToSelectedLine(null, singleContentPanel, lineClass);
          }
        } 
      }
    }

  }

  , _toWordInExtraWindows: function(lemma, lexicon, lexicon_entry_num) {
    var extra_win
    , singleContentPanel
    , resource_shortname
    , scanned_or_typed
    , is_lexicon
    , is_concordance
    , valuesObject
    , urlJSON;

    // get JSON from hash part of the url
    urlJSON = ParsedClassicsHelpers._getUrlJSON();

    // loop through extra windows
    for (var i = 0; i < ParsedClassicsData.onloadVars.extraWindows.length; i++) {
      if (typeof ParsedClassicsData.onloadVars.extraWindows[i] != "undefined" && ParsedClassicsData.onloadVars.extraWindows != null) {
        extra_win = ParsedClassicsData.onloadVars.extraWindows[i];
        // get content panel in extra window
        singleContentPanel = extra_win.$("." + ParsedClassicsVars.contentPanelWrapperClass);
        // get resource shortname which is content panel's id attr in extra window
        resource_shortname = singleContentPanel.attr("id");
        // is resource scanned or typed?
        scanned_or_typed = singleContentPanel.hasClass(ParsedClassicsVars.resourceTypeTyped) ? ParsedClassicsVars.resourceTypeTyped : ParsedClassicsVars.resourceTypeScanned;
        // is resource of the type "lexicon"?
        is_lexicon = singleContentPanel.hasClass(ParsedClassicsVars.resourceTypeLexicon);
        // is resource of the type "concordance"?
        is_concordance = singleContentPanel.hasClass(ParsedClassicsVars.resourceTypeConcordance);
        // form object containing values specific for urlJSON in extra window 
        valuesObject = {};
        valuesObject[ParsedClassicsVars.resourceUrlAndCookieName] = resource_shortname; 
        valuesObject[ParsedClassicsVars.extraWinUrlName] = ParsedClassicsVars.extraWinUrlVal; 
        valuesObject[ParsedClassicsVars.wordUrlAndCookieName] = lemma;
        if (lexicon && lexicon_entry_num) {
          valuesObject[ParsedClassicsVars.lexiconUrlAndCookieName] = lexicon;
          valuesObject[ParsedClassicsVars.lexiconEntryUrlAndCookieName] = lexicon_entry_num;
        }

        // is resource of the type "lexicon" OR of the type "concordance"?
        if (is_lexicon || is_concordance) {
          // set JSON part of the url in extra window
          extra_win.ParsedClassicsHelpers._setUrlJSON(urlJSON, valuesObject);
          // is resource scanned?
          if (scanned_or_typed == ParsedClassicsVars.resourceTypeScanned) {
            // browse extra window to selected word
            extra_win.ParsedClassicsHelpers._browseToSelectedWord(null, singleContentPanel, lemma);
          }
          // resource is typed
          else {
            // scroll extra window to selected word
            extra_win.ParsedClassicsHelpers._scrollToSelectedWord(null, singleContentPanel, lemma);
          }

        }
         
      }
    }
  }

  , loadScript: function(url, callback) {
    // Adding the script tag to the head
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
  }
   
};