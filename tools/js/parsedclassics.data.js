/*

=====================================================

 This file is part of ParsedClassics app

=====================================================

 Copyright (c) Éleuthère Ioannidis

=====================================================

Script supporting ParsedClassics data functionality

=====================================================

*/



var ParsedClassicsData = {



  onloadVars: {

    collectionShortname: ""

    , resourceShortname: ""

    , lineClass: ""

    , word: ""

    , resourcesAtTime: ParsedClassicsVars.valResourcesAtTimeSingle

    , resourceType: ""

    , enabledResources: []

    , disabledResources: []

    , extraWindows: []

    , isExtraWindow: false

  }



  , loadCollections: function (collectionObjectsArray) {

    var url
    , urlJSON
    , selectedCollectionShortnameObject
    , collectionShortnamesArray
    , selectedCollectionShortname
    , lineNumToBeSelectedOnload
    , lineClassToBeSelectedOnload
    , wordToBeSelectedOnload
    , displayResourcesAtTime
    , catalogueContent
    , collSetShortname
    , collSetOrigName
    , collSetEngName
    , collectionsParamsObj
    , collectionShortname;



    url = window.location.href;

    collectionShortnamesArray = [];

    selectedCollectionShortnameObject = {};

    collectionsParamsObj = {};


    // Case I: script is in "library" page

    
    if (url.indexOf("library") > 0) {

      // get JSON from hash part of the url

      urlJSON = ParsedClassicsHelpers._getUrlJSON();

      // is this extra window?

      if (typeof urlJSON[ParsedClassicsVars.extraWinUrlName] != "undefined" && urlJSON[ParsedClassicsVars.extraWinUrlName] == ParsedClassicsVars.extraWinUrlVal) {
        ParsedClassicsData.onloadVars.isExtraWindow = true;
      }
      
      // push collection shortnames into array and create collectionsParamsObj containing collection objects keyed to collection shortnames

      for (var i = 0; i < collectionObjectsArray.length; i++) {
        collectionShortname = collectionObjectsArray[i].collection_shortname;
        collectionShortnamesArray.push(collectionShortname);
        collectionsParamsObj[collectionShortname] = collectionObjectsArray[i];

      }

      
      // find shortname of to be selected collection, put it into onloadVars object
      selectedCollectionShortname = ParsedClassicsData._findSelectedCollectionShortname(urlJSON, collectionShortnamesArray, collectionsParamsObj);

      ParsedClassicsData.onloadVars.collectionShortname = selectedCollectionShortname;



      // put shortname of the selected collection into JSON which is in the hash part of the url

      selectedCollectionShortnameObject[ParsedClassicsVars.collectionUrlAndCookieName] = selectedCollectionShortname;

      ParsedClassicsHelpers._setUrlJSON(urlJSON, selectedCollectionShortnameObject);



      // if it is not extra window, create <option> elements for collection selectbox
      if (!ParsedClassicsData.onloadVars.isExtraWindow) {
        ParsedClassicsData._collectionsSelectboxOptions(collectionObjectsArray, selectedCollectionShortname);
      }


      // if it is not extra window,  find if in cookie is preserved displayAtTime variable and if it is, put it into onloadVars object
      if (!ParsedClassicsData.onloadVars.isExtraWindow) {
        displayResourcesAtTime = localStorage.getItem(ParsedClassicsVars.displayResourcesAtTimeCookieName);

        if (typeof displayResourcesAtTime != "undefined" && $.inArray(displayResourcesAtTime, [ParsedClassicsVars.valResourcesAtTimeSingle, ParsedClassicsVars.valResourcesAtTimeCategory, ParsedClassicsVars.valResourcesAtTimeAll]) != -1) {

          ParsedClassicsData.onloadVars.resourcesAtTime = displayResourcesAtTime;

        }
      }


      // find class of the to be selected line, put it into onloadVars object  

      lineNumToBeSelectedOnload = ParsedClassicsData._findLineToBeSelectedOnload();

      // by default onload the selected option should have the value "v-title"

      lineClassToBeSelectedOnload = ParsedClassicsVars.lineClassSelectedByDefault;

      if (lineNumToBeSelectedOnload) {

        // find line class

        lineClassToBeSelectedOnload = ParsedClassicsData._findLineNumClass(lineNumToBeSelectedOnload);

      }

      ParsedClassicsData.onloadVars.lineClass = lineClassToBeSelectedOnload;



      // find to be selected word lemma, put it into onloadVars object  

      wordToBeSelectedOnload = ParsedClassicsData._findWordToBeSelectedOnload();

      ParsedClassicsData.onloadVars.word = wordToBeSelectedOnload;



      // load selected collection by appending <script> tag

      ParsedClassicsData._appendScriptTags(selectedCollectionShortname, ParsedClassicsVars.cataloguesRelUrl);

    }

    // Case II: script is in "catalogue" page
    else if (url.indexOf("catalogue.html") > 0) {
      
      catalogueContent = "";

      // compile catalogue links
      for (var key in ParsedClassicsCollectionSets) {
        catalogueContent += "<p><a target='_blank' href='../site/collections-classics.html#catalogue/{\"" + ParsedClassicsVars.collSetUrlName + "\":\"" + key + "\"}'>" + ParsedClassicsCollectionSets[key].orig + ' / ' + ParsedClassicsCollectionSets[key].eng + '</a></p>';
      }

      $("#" + ParsedClassicsVars.siteContentId).append(catalogueContent);

    }


    // Case III: script is in "collections" page

    else if (url.indexOf("collections") > 0) {

      // find JSON part of the url
      urlJSON = ParsedClassicsHelpers._getUrlJSON();

      //find shortname of collections set
      collSetShortname = (typeof urlJSON[ParsedClassicsVars.collSetUrlName] != "undefined" && urlJSON[ParsedClassicsVars.collSetUrlName] != "") ? urlJSON[ParsedClassicsVars.collSetUrlName] : "";

      // if there is no shortname of collections set in URL or shortname of collections set is invalid
      // then redirect to catalogue page
      if (collSetShortname == "" || typeof ParsedClassicsCollectionSets[collSetShortname] == "undefined") {
        window.location = "catalogue.html";
      }

      // find original name and English name of the collections set
      collSetOrigName = collSetShortname ? ParsedClassicsCollectionSets[collSetShortname].orig : "";
      collSetEngName = collSetShortname ? ParsedClassicsCollectionSets[collSetShortname].eng: "";

      //find all shortnames of the collections included in collections set
      if (collSetShortname != "") {
        for (var i = 0; i < collectionObjectsArray.length; i++) {
          if (collectionObjectsArray[i].collection_set == collSetShortname) {
            collectionShortnamesArray.push(collectionObjectsArray[i].collection_shortname);
          }
        }
      }


      // create HTML table into which info about collections will be loaded

      ParsedClassicsData._createCollectionsTable(collectionShortnamesArray, collSetOrigName, collSetEngName);


      // load info about each collection by appending <script> tags

      ParsedClassicsData._appendScriptTags(collectionShortnamesArray, ParsedClassicsVars.cataloguesRelUrl);

    }

  }



  , _createCollectionsTable: function (collectionShortnamesArray, collSetOrigName, collSetEngName) {

    var collectionsTableHTML,
    titleHTML;

    collectionsTableHTML = "";

    titleHTML = '<h1>' + collSetOrigName + ' / ' + collSetEngName + '</h1>';

    titleHTML += '<h2>Collections</h2>';

    collectionsTableHTML += titleHTML;


    collectionsTableHTML += '<table border="0" class="w3-table">';

    for (var i = 0; i < collectionShortnamesArray.length; i++) {

      collectionsTableHTML += '<tr>'

      collectionsTableHTML += '<td id="' + collectionShortnamesArray[i] + '" class="pc-padding-left-0"></td><td><button id="' + collectionShortnamesArray[i] + '_button" class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey" onclick="ParsedClassicsCollectionDetailsButton.toggle(\'' + collectionShortnamesArray[i] +'_details\');">Details</button></td>';

      collectionsTableHTML += '</tr>'

      collectionsTableHTML += '<tr>'

      collectionsTableHTML += '<td id="' + collectionShortnamesArray[i] + '_details" colspan="2" style="display: none;" class="pc-padding-top-0"></td>'

      collectionsTableHTML += '</tr>'

    }


    collectionsTableHTML += '</table>';


    $(collectionsTableHTML).appendTo($('#' + ParsedClassicsVars.siteContentId));

  }



  , _appendScriptTags: function (resourceShortnameOrresourceShortnamesArray, relativeUrl) {

    var script_el, resourceShortnamesArray, resourceShortname;



    if ($.isArray(resourceShortnameOrresourceShortnamesArray)) {



      resourceShortnamesArray = resourceShortnameOrresourceShortnamesArray;

      for (var i = 0; i < resourceShortnamesArray.length; i++) {

        if (resourceShortnamesArray[i]) {

          script_el = document.createElement("script");

          script_el.src = relativeUrl + resourceShortnamesArray[i] + ".js";

          document.body.appendChild(script_el);

        }

      }



    }



    if (typeof resourceShortnameOrresourceShortnamesArray == "string") {



      resourceShortname = resourceShortnameOrresourceShortnamesArray;

      if (resourceShortname) {

        script_el = document.createElement("script");

        script_el.src = relativeUrl + resourceShortname + ".js";

        document.body.appendChild(script_el);

      }

    }



  }



  , loadCollectionData: function (collectionObject) {

    var url

      , urlJSON

      , selectedResourceShortnameAndType

      , parsedTextShortNamesArray

      , originalTextShortNamesArray

      , concordanceShortNamesArray

      , lexiconsShortNamesArray

      , translationShortNamesArray

      , commentariesShortNamesArray

      , grammarRefsShortNamesArray

      , diagramShortNamesArray

      , audioShortNamesArray

      , contentPanelIdsArray

      , contentPanelTitlesArray

      , contentPanelContentTypesArray

      , contentPanelScannedOrTypedArray

      , contentPanelTextFromArray

      , contentPanelScannedSourcesArray

      , contentPanelContentsShortnamesArray

      , contentPanelsHTML

      , resource_title

      , resource_textfrom

      , index

      , selectedContentPanel

      , resourcePaneContainer

      , contentPanelWrappers

      , singleContentPanelWrapper
      
      , resourcesListPanelHTML
      
      , res_in_extra_win_from_cookie_arr_checked
      
      , params_obj
      
      , conc_contents_shortname;



    url = window.location.href;



    // Case I: script is in "collections" page

    if (url.indexOf("collections") > 0) {



      ParsedClassicsData._loadCollectionInfoIntoTableCells(collectionObject);



    }



    // Case II: script is in "library" page

    if (url.indexOf("library") > 0) {



      // define variables

      parsedTextShortNamesArray = [];

      originalTextShortNamesArray = [];

      concordanceShortNamesArray = [];

      lexiconsShortNamesArray = [];

      translationShortNamesArray = [];

      commentariesShortNamesArray = [];

      grammarRefsShortNamesArray = [];

      diagramShortNamesArray = [];

      audioShortNamesArray = [];

      contentPanelIdsArray = [];

      contentPanelTitlesArray = [];

      contentPanelContentTypesArray = [];

      contentPanelScannedOrTypedArray = [];

      contentPanelContentsShortnamesArray = [];

      contentPanelTextFromArray = [];

      contentPanelScannedSourcesArray = [];

      contentPanelsHTML = "";



      //if it is not extra window, load collection contents which will be used to create <option> elements for Sections selectbox 

      if (!ParsedClassicsData.onloadVars.isExtraWindow && typeof collectionObject.contents_shortname != "undefined" && collectionObject.contents_shortname) {

        ParsedClassicsData._appendScriptTags(collectionObject.contents_shortname, ParsedClassicsVars.contentsRelUrl);

        // load Sections selectbox options

        ParsedClassicsData.loadSectionsSelectboxOptions(collectionObject.contents_shortname);

      }


      // find JSON part of the url

      urlJSON = ParsedClassicsHelpers._getUrlJSON();

      // get object which contains params of all resources, keyed to resource shortnames
      params_obj = ParsedClassicsData._resourcesParams(collectionObject);


      // find selected resource shortname and its type

      selectedResourceShortnameAndType = ParsedClassicsData._findSelectedResourceShortname(urlJSON, collectionObject, params_obj);


      // save shortname of selected resource and its type in onloadVars object

      if (selectedResourceShortnameAndType) {

        ParsedClassicsData.onloadVars.resourceShortname = selectedResourceShortnameAndType.resource_shortname;

        ParsedClassicsData.onloadVars.resourceType = selectedResourceShortnameAndType.resource_type;

      }

      // push shortnames of enabled resources to onloadVars.enabledResources array and
      // push shortnames of disabled resources to onloadVars.disabledResources array

      ParsedClassicsData._enabledAndDisabledResourcesArrays(collectionObject);

      // if it is not extra window 
      if (!ParsedClassicsData.onloadVars.isExtraWindow) {
        
        // push shortnames of resources to be opened in extra windows to array
        res_in_extra_win_from_cookie_arr_checked = ParsedClassicsData._resourcesInExtraWindowsArray(params_obj);
        
      }

      //if it is not extra window, create <option> elements for Resources selectbox

      if (!ParsedClassicsData.onloadVars.isExtraWindow) {
        ParsedClassicsData._resourcesSelectboxOptions(collectionObject);
      }

      // if it is not extra window, create form inside Options dialogue which allows to enable and disable resources

      if (!ParsedClassicsData.onloadVars.isExtraWindow) {
        ParsedClassicsLibraryCollectionSettings.createEnableDisableResourcesForm(collectionObject);
      }

      // if it is not extra window, create form inside Options dialogue which allows to open resources in extra windows

      if (!ParsedClassicsData.onloadVars.isExtraWindow) {
        ParsedClassicsLibraryExtraWindowsSettings.createExtraWindowsForm(collectionObject, res_in_extra_win_from_cookie_arr_checked);
      }

      // I. Preparation of the loading of the parsed text



      // push shortnames into contentPanelIdsArray, create title and source strings

      if (typeof collectionObject.parsed_text != "undefined" && collectionObject.parsed_text) {

        parsedTextShortNamesArray[0] = collectionObject.parsed_text.resource_shortname;

        contentPanelIdsArray.push(collectionObject.parsed_text.resource_shortname);

        contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeParsedText);

        contentPanelScannedOrTypedArray.push(collectionObject.parsed_text.scanned_or_typed);

        resource_title = "<h1 class='resource_title v-title'>" + collectionObject.author_orig + "<br>" + collectionObject.parsed_text.library_app_panel_title + "</h1>" + (collectionObject.parsed_text.library_app_panel_unit_num ? "<h2 class='resource_title'>" + collectionObject.parsed_text.library_app_panel_unit_num + "</h2>" : "");

        contentPanelTitlesArray.push(resource_title);

        resource_textfrom = "<span class='text_from'>Text based on: " + (collectionObject.parsed_text.scanned_source_shortname ? "<a href='../reader/index.html?" + collectionObject.parsed_text.scanned_source_shortname + "' target='blank'>" : "") + collectionObject.parsed_text.library_app_panel_text_from + (collectionObject.parsed_text.scanned_source_shortname ? "</a>" : "") + "</span>";

        resource_textfrom += collectionObject.parsed_text.library_app_panel_note ? "<span class='text_from'>" + collectionObject.parsed_text.library_app_panel_note + "</span>" : "";

        contentPanelTextFromArray.push(resource_textfrom);

        contentPanelScannedSourcesArray.push(collectionObject.parsed_text.scanned_source_shortname);

        contentPanelContentsShortnamesArray.push(collectionObject.parsed_text.contents_shortname);

      }



      // II. Preparation of the loading of critical editions



      // push shortnames into contentPanelIdsArray, create title and source strings

      if (typeof collectionObject.original_texts != "undefined" && collectionObject.original_texts.length > 0) {

        for (var i = 0; i < collectionObject.original_texts.length; i++) {

          if ($.inArray(collectionObject.original_texts[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {

            // "typed" resources will be loaded by creating <script> tags

            if (collectionObject.original_texts[i].scanned_or_typed == ParsedClassicsVars.resourceTypeTyped) {

              originalTextShortNamesArray.push(collectionObject.original_texts[i].resource_shortname);

            }

            contentPanelIdsArray.push(collectionObject.original_texts[i].resource_shortname);

            contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeOriginalText);

            contentPanelScannedOrTypedArray.push(collectionObject.original_texts[i].scanned_or_typed);

            resource_title = "<h2 class='v-title'>" + collectionObject.original_texts[i].library_app_panel_title + "</h2>";

            contentPanelTitlesArray.push(resource_title);

            resource_textfrom = "<span class='text_from v-title'>Source: " + (collectionObject.original_texts[i].scanned_source_shortname ? "<a href='../reader/index.html?" + collectionObject.original_texts[i].scanned_source_shortname + "' target='_blank'>" : "") + collectionObject.original_texts[i].library_app_panel_text_from + (collectionObject.original_texts[i].scanned_source_shortname ? "</a>" : "") + "</span>";

            resource_textfrom += collectionObject.original_texts[i].library_app_panel_note ? "<span class='text_from'>" + collectionObject.original_texts[i].library_app_panel_note + "</span>" : "";

            contentPanelTextFromArray.push(resource_textfrom);

            contentPanelScannedSourcesArray.push(collectionObject.original_texts[i].scanned_source_shortname);

            contentPanelContentsShortnamesArray.push(collectionObject.original_texts[i].contents_shortname);

          }

        }

      }



      // III. Preparation of the loading of concordance



      // push shortnames into contentPanelIdsArray, create title and source strings

      if (typeof collectionObject.concordance != "undefined" && collectionObject.concordance.length > 0) {

        for (var i = 0; i < collectionObject.concordance.length; i++) {

          if ($.inArray(collectionObject.concordance[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {

            // "typed" resources will be loaded by creating <script> tags

            if (collectionObject.concordance[i].scanned_or_typed == ParsedClassicsVars.resourceTypeTyped) {

              concordanceShortNamesArray.push(collectionObject.concordance[i].resource_shortname);

            }

            contentPanelIdsArray.push(collectionObject.concordance[i].resource_shortname);

            contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeConcordance);

            contentPanelScannedOrTypedArray.push(collectionObject.concordance[i].scanned_or_typed);

            resource_title = "<h2 class='v-title'>" + collectionObject.concordance[i].library_app_panel_title + "</h2>";

            contentPanelTitlesArray.push(resource_title);

            resource_textfrom = collectionObject.concordance[i].library_app_panel_note ? "<span class='text_from v-title'>" + collectionObject.concordance[i].library_app_panel_note + "</span>" : "";

            contentPanelTextFromArray.push(resource_textfrom);

            contentPanelScannedSourcesArray.push(collectionObject.concordance[i].scanned_source_shortname);

            contentPanelContentsShortnamesArray.push(collectionObject.concordance[i].contents_shortname);

          }

        }

      }



      // IV. Preparation of the loading of lexicons



      // push shortnames into contentPanelIdsArray, create title and source strings

      if (typeof collectionObject.lexicons != "undefined" && collectionObject.lexicons.length > 0) {

        for (var i = 0; i < collectionObject.lexicons.length; i++) {

          if ($.inArray(collectionObject.lexicons[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {

            // "typed" resources will be loaded by creating <script> tags

            if (collectionObject.lexicons[i].scanned_or_typed == ParsedClassicsVars.resourceTypeTyped) {

              lexiconsShortNamesArray.push(collectionObject.lexicons[i].resource_shortname);

            }

            contentPanelIdsArray.push(collectionObject.lexicons[i].resource_shortname);

            contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeLexicon);

            contentPanelScannedOrTypedArray.push(collectionObject.lexicons[i].scanned_or_typed);

            resource_title = "<h2 class='v-title'>" + collectionObject.lexicons[i].library_app_panel_title + "</h2>";

            contentPanelTitlesArray.push(resource_title);

            resource_textfrom = "<span class='text_from v-title'>Source: " + (collectionObject.lexicons[i].scanned_source_shortname ? "<a href='../reader/index.html?" + collectionObject.lexicons[i].scanned_source_shortname + "' target='_blank'>" : "") + collectionObject.lexicons[i].library_app_panel_text_from + (collectionObject.lexicons[i].scanned_source_shortname ? "</a>" : "") + "</span>";

            resource_textfrom += collectionObject.lexicons[i].library_app_panel_note ? "<span class='text_from'>" + collectionObject.lexicons[i].library_app_panel_note + "</span>" : "";

            contentPanelTextFromArray.push(resource_textfrom);

            contentPanelScannedSourcesArray.push(collectionObject.lexicons[i].scanned_source_shortname);

            contentPanelContentsShortnamesArray.push(collectionObject.lexicons[i].contents_shortname);

          }

        }

      }



      // V. Preparation of the loading of translations



      // push shortnames into contentPanelIdsArray, create title and source strings

      if (typeof collectionObject.translations != "undefined" && collectionObject.translations.length > 0) {

        for (var i = 0; i < collectionObject.translations.length; i++) {

          if ($.inArray(collectionObject.translations[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {

            // "typed" resources will be loaded by creating <script> tags

            if (collectionObject.translations[i].scanned_or_typed == ParsedClassicsVars.resourceTypeTyped) {

              translationShortNamesArray.push(collectionObject.translations[i].resource_shortname);

            }

            contentPanelIdsArray.push(collectionObject.translations[i].resource_shortname);

            contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeTranslation);

            contentPanelScannedOrTypedArray.push(collectionObject.translations[i].scanned_or_typed);

            resource_title = "<h2 class='v-title'>" + collectionObject.translations[i].library_app_panel_title + "</h2>";

            contentPanelTitlesArray.push(resource_title);

            resource_textfrom = "<span class='text_from v-title'>Source: " + (collectionObject.translations[i].scanned_source_shortname ? "<a href='../reader/index.html?" + collectionObject.translations[i].scanned_source_shortname + "' target='_blank'>" : "") + collectionObject.translations[i].library_app_panel_text_from + (collectionObject.translations[i].scanned_source_shortname ? "</a>" : "") + "</span>";

            resource_textfrom += collectionObject.translations[i].library_app_panel_note ? "<span class='text_from'>" + collectionObject.translations[i].library_app_panel_note + "</span>" : "";

            contentPanelTextFromArray.push(resource_textfrom);

            contentPanelScannedSourcesArray.push(collectionObject.translations[i].scanned_source_shortname);

            contentPanelContentsShortnamesArray.push(collectionObject.translations[i].contents_shortname);

          }

        }

      }



      // VI. Preparation of the loading of commentaries



      // push shortnames into contentPanelIdsArray, create title and source strings

      if (typeof collectionObject.commentaries != "undefined" && collectionObject.commentaries.length > 0) {

        for (var i = 0; i < collectionObject.commentaries.length; i++) {

          if ($.inArray(collectionObject.commentaries[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {

            // "typed" resources will be loaded by creating <script> tags

            if (collectionObject.commentaries[i].scanned_or_typed == ParsedClassicsVars.resourceTypeTyped) {

              commentariesShortNamesArray.push(collectionObject.commentaries[i].resource_shortname);

            }

            contentPanelIdsArray.push(collectionObject.commentaries[i].resource_shortname);

            contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeCommentary);

            contentPanelScannedOrTypedArray.push(collectionObject.commentaries[i].scanned_or_typed);

            resource_title = "<h2 class='v-title'>" + collectionObject.commentaries[i].library_app_panel_title + "</h2>";

            contentPanelTitlesArray.push(resource_title);

            resource_textfrom = "<span class='text_from v-title'>Source: " + (collectionObject.commentaries[i].scanned_source_shortname ? "<a href='../reader/index.html?" + collectionObject.commentaries[i].scanned_source_shortname + "' target='_blank'>" : "") + collectionObject.commentaries[i].library_app_panel_text_from + (collectionObject.commentaries[i].scanned_source_shortname ? "</a>" : "") + "</span>";

            resource_textfrom += collectionObject.commentaries[i].library_app_panel_note ? "<span class='text_from'>" + collectionObject.commentaries[i].library_app_panel_note + "</span>" : "";

            contentPanelTextFromArray.push(resource_textfrom);

            contentPanelScannedSourcesArray.push(collectionObject.commentaries[i].scanned_source_shortname);

            contentPanelContentsShortnamesArray.push(collectionObject.commentaries[i].contents_shortname);

          }

        }

      }



      // VII. Preparation of the loading of grammar references



      // push shortnames into contentPanelIdsArray, create title and source strings

      if (typeof collectionObject.grammar_refs != "undefined" && collectionObject.grammar_refs.length > 0) {

        for (var i = 0; i < collectionObject.grammar_refs.length; i++) {

          if ($.inArray(collectionObject.grammar_refs[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {

            // "typed" resources will be loaded by creating <script> tags

            if (collectionObject.grammar_refs[i].scanned_or_typed == ParsedClassicsVars.resourceTypeTyped) {

              grammarRefsShortNamesArray.push(collectionObject.grammar_refs[i].resource_shortname);

            }

            contentPanelIdsArray.push(collectionObject.grammar_refs[i].resource_shortname);

            contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeGrammarRefs);

            contentPanelScannedOrTypedArray.push(collectionObject.grammar_refs[i].scanned_or_typed);

            resource_title = "<h2 class='v-title'>" + collectionObject.grammar_refs[i].library_app_panel_title + "</h2>";

            contentPanelTitlesArray.push(resource_title);

            resource_textfrom = '';

            resource_textfrom += collectionObject.grammar_refs[i].library_app_panel_note ? "<span class='text_from'>" + collectionObject.grammar_refs[i].library_app_panel_note + "</span>" : "";

            contentPanelTextFromArray.push(resource_textfrom);

            contentPanelScannedSourcesArray.push(collectionObject.grammar_refs[i].scanned_source_shortname);

            contentPanelContentsShortnamesArray.push(collectionObject.grammar_refs[i].contents_shortname);

          }

        }

      }



      // VIII. Preparation of the loading of diagrams



      // push shortnames into contentPanelIdsArray, create title and source strings

      if (typeof collectionObject.diagrams != "undefined" && collectionObject.diagrams.length > 0) {

        for (var i = 0; i < collectionObject.diagrams.length; i++) {

          if ($.inArray(collectionObject.diagrams[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {

            // "typed" resources will be loaded by creating <script> tags

            if (collectionObject.diagrams[i].scanned_or_typed == ParsedClassicsVars.resourceTypeTyped) {

              diagramShortNamesArray.push(collectionObject.diagrams[i].resource_shortname);

            }

            contentPanelIdsArray.push(collectionObject.diagrams[i].resource_shortname);

            contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeDiagrams);

            contentPanelScannedOrTypedArray.push(collectionObject.diagrams[i].scanned_or_typed);

            resource_title = "<h2>" + collectionObject.diagrams[i].library_app_panel_title + "</h2>";

            contentPanelTitlesArray.push(resource_title);

            resource_textfrom = "<span class='text_from v-title'>Text based on: " + (collectionObject.diagrams[i].scanned_source_shortname ? "<a href='../reader/index.html?" + collectionObject.diagrams[i].scanned_source_shortname + "' target='_blank'>" : "") + collectionObject.diagrams[i].library_app_panel_text_from + (collectionObject.diagrams[i].scanned_source_shortname ? "</a>" : "") + "</span>";

            resource_textfrom += collectionObject.diagrams[i].library_app_panel_note ? "<span class='text_from'>" + collectionObject.diagrams[i].library_app_panel_note + "</span>" : "";

            contentPanelTextFromArray.push(resource_textfrom);

            contentPanelScannedSourcesArray.push(collectionObject.diagrams[i].scanned_source_shortname);

            contentPanelContentsShortnamesArray.push(collectionObject.diagrams[i].contents_shortname);

          }

        }

      }



      // IX. Preparation of the loading of audio

      if (typeof collectionObject.audio != "undefined" && collectionObject.audio.length > 0) {

        for (var i = 0; i < collectionObject.audio.length; i++) {

          if ($.inArray(collectionObject.audio[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {

            // "typed" resources will be loaded by creating <script> tags

            if (collectionObject.audio[i].scanned_or_typed == ParsedClassicsVars.resourceTypeTyped) {

              audioShortNamesArray.push(collectionObject.audio[i].resource_shortname);

            }

            contentPanelIdsArray.push(collectionObject.audio[i].resource_shortname);

            contentPanelContentTypesArray.push(ParsedClassicsVars.resourceTypeAudio);

            contentPanelScannedOrTypedArray.push(collectionObject.audio[i].scanned_or_typed);

            resource_title = "<h2>" + collectionObject.audio[i].library_app_panel_title + "</h2>";

            contentPanelTitlesArray.push(resource_title);

            resource_textfrom = "<span class='text_from v-title'>Text based on: " + (collectionObject.audio[i].scanned_source_shortname ? "<a href='../reader/index.html?" + collectionObject.audio[i].scanned_source_shortname + "' target='_blank'>" : "") + collectionObject.audio[i].library_app_panel_text_from + (collectionObject.audio[i].scanned_source_shortname ? "</a>" : "") + "</span>";

            resource_textfrom += collectionObject.audio[i].library_app_panel_note ? "<span class='text_from'>" + collectionObject.audio[i].library_app_panel_note + "</span>" : "";

            contentPanelTextFromArray.push(resource_textfrom);

            contentPanelScannedSourcesArray.push(collectionObject.audio[i].scanned_source_shortname);

            contentPanelContentsShortnamesArray.push(collectionObject.audio[i].contents_shortname);

          }

        }

      }



      // X. Loading content objects from content files by appending script tags

      ParsedClassicsData._appendScriptTags(contentPanelContentsShortnamesArray, ParsedClassicsVars.contentsRelUrl);



      // XI. Creating of empty content panels inside Parsed text pane and Resources pane


  
      // if it is not extra window, create content panel for parsed text
      if (!ParsedClassicsData.onloadVars.isExtraWindow && typeof collectionObject.parsed_text != "undefined") {
        
        // create HTML of the content panel for parsed text
        contentPanelsHTML = ParsedClassicsData._createContentPanelHTML(contentPanelIdsArray[0], contentPanelContentTypesArray[0], contentPanelScannedOrTypedArray[0], contentPanelTitlesArray[0], contentPanelTextFromArray[0], contentPanelScannedSourcesArray[0], contentPanelContentsShortnamesArray[0]);

        // put HTML of the content panel for parsed text into Parsing pane
        $("#" + ParsedClassicsVars.westPaneContainerId).html(contentPanelsHTML);
      }



      // put val to empty

      contentPanelsHTML = "";

      // exclude parsed text data

      index = typeof collectionObject.parsed_text != "undefined" ? 1 : 0;

      // create HTML of content panels for critical editions, translations, diagrams, etc.

      for (var i = index; i < contentPanelIdsArray.length; i++) {

        contentPanelsHTML += ParsedClassicsData._createContentPanelHTML(contentPanelIdsArray[i], contentPanelContentTypesArray[i], contentPanelScannedOrTypedArray[i], contentPanelTitlesArray[i], contentPanelTextFromArray[i], contentPanelScannedSourcesArray[i], contentPanelContentsShortnamesArray[i]);

      }



      // restore from cookie scanned book mode

      for (var i = 0; i < contentPanelScannedSourcesArray.length; i++) {

        if (contentPanelScannedSourcesArray[i] != "") {

          ParsedClassicsScannedBookMode.restoreFromCookie(contentPanelScannedSourcesArray[i]);

        }

      }
      
      
      // if this is not extra window, create Enabled and disabled resources list which will be displayed as panel in resources pane in case no resource has been selected
      resourcesListPanelHTML = "";
      if (!ParsedClassicsData.onloadVars.isExtraWindow) {
        resourcesListPanelHTML = ParsedClassicsData._createResourcesListPanelHTML(collectionObject);
      }
      
      
      // join Enabled and disabled resources HTML and other content panels HTML 
      contentPanelsHTML = resourcesListPanelHTML + contentPanelsHTML;

      // put HTML of content panels' into Resources pane 
       
      $("#" + ParsedClassicsVars.centerPaneContainerId).html(contentPanelsHTML);



      // init "close" buttons of "Item not found" dialogues inside content panels and "close" button of Settings dialogue

      ParsedClassicsModalDialogues.initAllCloseDialogueButtons();



      // find all content wrappers

      contentPanelWrappers = $("." + ParsedClassicsVars.contentPanelWrapperClass);

      //delegate "click" event from els having class "concordance-verse-number" to content panels which (a) ar of the content type "typed" and (b) are of the content type "concordance"

      // bind content panels which (a) are of the content type "typed" and (b) are of the content types "parsed_text", "original_text", "translation", "commentary", "grammar references", "diagram_set", "audio_recording"

      // to the function which listens to custom event "sections-selectbox-change"

      // and bind content panels which (a) are of the content type "scanned" and (b) are of the content types "original_text", "translation", "commentary"

      // to the function which listens to custom event "sections-selectbox-change"

      // and bind content panels which (a) are of the content type "typed" and (b) are of the content types "concordance", "lexicon"

      // to the function which listens to custom event "selected-word-change"

      // and bind content panels which (a) are of the content type "scanned" and (b) are of the content types "concordance", "lexicon"

      // to the function which listens to custom event "selected-word-change"

      for (var i = 0; i < contentPanelWrappers.length; i++) {

        singleContentPanelWrapper = $(contentPanelWrappers[i]);
        if (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTyped) && singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeConcordance)) {
          conc_contents_shortname = contentPanelContentsShortnamesArray[i-index];
          singleContentPanelWrapper.delegate("." + ParsedClassicsVars.concordanceLineNumClass, "click", function(event){ParsedClassicsConcordanceLink.show_line(event, conc_contents_shortname)});
        }

        if (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTyped) && (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeParsedText) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeOriginalText) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTranslation) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeCommentary) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeGrammarRefs) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeDiagrams))) {

          singleContentPanelWrapper.bind(ParsedClassicsVars.eventSectionsSelectboxChange, ParsedClassicsHelpers._scrollToSelectedLine);

        }

        else if (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeScanned) && (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeOriginalText) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTranslation) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeCommentary))) {

          singleContentPanelWrapper.bind(ParsedClassicsVars.eventSectionsSelectboxChange, ParsedClassicsHelpers._browseToSelectedLine);

        }

        else if (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeAudio)) {

          singleContentPanelWrapper.bind(ParsedClassicsVars.eventSectionsSelectboxChange, ParsedClassicsHelpers._jumpToAudioTime);

        }

        else if (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTyped) && (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeConcordance) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeLexicon))) {

          singleContentPanelWrapper.bind(ParsedClassicsVars.eventSelectedWordChange, ParsedClassicsHelpers._scrollToSelectedWord);

        }

        else if (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeScanned) && (singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeConcordance) || singleContentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeLexicon))) {

          singleContentPanelWrapper.bind(ParsedClassicsVars.eventSelectedWordChange, ParsedClassicsHelpers._browseToSelectedWord);

        }

      }



      // XII. Pushing typed content into content panels



      //  create <script> tag for parsed text which should be loaded into just created content panel inside Parsing pane 

      ParsedClassicsData._appendScriptTags(parsedTextShortNamesArray, ParsedClassicsVars.parsedTextsRelUrl);



      //  create <script> tags for original texts which should be loaded into Resource pane content panels

      ParsedClassicsData._appendScriptTags(originalTextShortNamesArray, ParsedClassicsVars.originalTextsRelUrl);



      //  create <script> tags for concordances which should be loaded into Resource pane content panels

      ParsedClassicsData._appendScriptTags(concordanceShortNamesArray, ParsedClassicsVars.concordanceRelUrl);



      //  create <script> tags for lexicons which should be loaded into Resource pane content panels

      ParsedClassicsData._appendScriptTags(lexiconsShortNamesArray, ParsedClassicsVars.lexiconsRelUrl);



      //  create <script> tags for translations which should be loaded into Resource pane content panels

      ParsedClassicsData._appendScriptTags(translationShortNamesArray, ParsedClassicsVars.translationsRelUrl);



      //  create <script> tags for commentaries which should be loaded into Resource pane content panels

      ParsedClassicsData._appendScriptTags(commentariesShortNamesArray, ParsedClassicsVars.commentariesRelUrl);



      //  create <script> tags for grammar references which should be loaded into Resource pane content panels

      ParsedClassicsData._appendScriptTags(grammarRefsShortNamesArray, ParsedClassicsVars.grammarRefsRelUrl);



      //  create <script> tags for diagram sets which should be loaded into center Resource pane content panels

      ParsedClassicsData._appendScriptTags(diagramShortNamesArray, ParsedClassicsVars.diagramsRelUrl);



      //  create <script> tags for audio recordings which should be loaded into center Resource pane content panels

      ParsedClassicsData._appendScriptTags(audioShortNamesArray, ParsedClassicsVars.audioRelUrl);



      // scroll selected content panel to top

      if (ParsedClassicsData.onloadVars.resourceShortname && $.inArray(ParsedClassicsData.onloadVars.resourcesAtTime, [ParsedClassicsVars.valResourcesAtTimeCategory, ParsedClassicsVars.valResourcesAtTimeAll]) > -1) {

        resourcePaneContainer = $("#" + ParsedClassicsVars.centerPaneContainerId);

        selectedContentPanel = ("#" + ParsedClassicsData.onloadVars.resourceShortname);

        resourcePaneContainer.scrollTo(selectedContentPanel, ParsedClassicsVars.animationSpeed);

      }







      // load scanned books into <iframe> els inside content panels

      ParsedClassicsData.loadAllScannedResources();



      // load audio resources

      ParsedClassicsData.loadAllAudioResources();

      // XIII if it is not extra window, open all extra windows
      if (!ParsedClassicsData.onloadVars.isExtraWindow && res_in_extra_win_from_cookie_arr_checked.length > 0) {
        ParsedClassicsLibraryExtraWindowsSettings.openAllExtraWindows(res_in_extra_win_from_cookie_arr_checked, params_obj);
      }

    }



  }



  , _enabledAndDisabledResourcesArrays: function (collectionObject) {
    var all_res_arr
    , enabled_res_arr
    , disabled_res_arr
    , enabled_res_from_cookie
    , enabled_res_from_cookie_arr
    , enabled_res_from_cookie_arr_checked
    , urlJSON
    , selectedResourceShortname;

    // define vars
    all_res_arr = [];
    enabled_res_arr = [];
    disabled_res_arr = [];
    enabled_res_from_cookie_arr = [];
    enabled_res_from_cookie_arr_checked = [];

    // if this is not extra window
    if (!ParsedClassicsData.onloadVars.isExtraWindow) {

      // by default enabled resources are those defined in collection object
      enabled_res_arr = (typeof collectionObject.enabled_resources !== "undefined" && collectionObject.enabled_resources.length > 0) ? collectionObject.enabled_resources : [];

      // get shortnames of the all resources of the collection
      //1) get shortnames of critical editions
      for (var i = 0; i < collectionObject.original_texts.length; i++) {
        all_res_arr.push(collectionObject.original_texts[i].resource_shortname);
      }
      //2) get shortnames of concordances
      for (var i = 0; i < collectionObject.concordance.length; i++) {
        all_res_arr.push(collectionObject.concordance[i].resource_shortname);
      }
      //3) get shortnames of lexicons
      for (var i = 0; i < collectionObject.lexicons.length; i++) {
        all_res_arr.push(collectionObject.lexicons[i].resource_shortname);
      }
      // 4) get shortnames of translations
      for (var i = 0; i < collectionObject.translations.length; i++) {
        all_res_arr.push(collectionObject.translations[i].resource_shortname);
      }
      // 5) get shortnames of commentaries
      for (var i = 0; i < collectionObject.commentaries.length; i++) {
        all_res_arr.push(collectionObject.commentaries[i].resource_shortname);
      }
      // 6) get shortnames of grammar references
      for (var i = 0; i < collectionObject.grammar_refs.length; i++) {
        all_res_arr.push(collectionObject.grammar_refs[i].resource_shortname);
      }
      // 7) get shortnames of diagrams
      for (var i = 0; i < collectionObject.diagrams.length; i++) {
        all_res_arr.push(collectionObject.diagrams[i].resource_shortname);
      }
      // 8) get shortnames of audio recs
      for (var i = 0; i < collectionObject.audio.length; i++) {
        all_res_arr.push(collectionObject.audio[i].resource_shortname);
      }

      // if in collection object enabled resorces are not defined, make all resources enabled
      if (enabled_res_arr.length == 0) {
        enabled_res_arr = all_res_arr;
      }

      // does cookie contains pipe delimited list of enabled resources?
      enabled_res_from_cookie = localStorage.getItem(ParsedClassicsVars.enabledResourcesCookieName);
      if (enabled_res_from_cookie) {
        enabled_res_from_cookie_arr = enabled_res_from_cookie.split("|");
      }

      // check if each resource from cookie list is really from this collection
      for (var i = 0; i < enabled_res_from_cookie_arr.length; i++) {
        if ($.inArray(enabled_res_from_cookie_arr[i], all_res_arr) != -1) {
          enabled_res_from_cookie_arr_checked.push(enabled_res_from_cookie_arr[i])
        }
      }

      // array of enabled resources from cookie overrides that from collection object
      if (enabled_res_from_cookie_arr_checked.length > 0) {
        enabled_res_arr = enabled_res_from_cookie_arr_checked;
      }

      // is currently selected resource among enabled resources?
      // if not, push its shortname into enabled_res_arr
      if (typeof ParsedClassicsData.onloadVars.resourceShortname !== "undefined" && ParsedClassicsData.onloadVars.resourceShortname !== "" && $.inArray(ParsedClassicsData.onloadVars.resourceShortname, enabled_res_arr) == -1) {
        enabled_res_arr.push(ParsedClassicsData.onloadVars.resourceShortname);
      }

      // pick from all resources those which are not enabled and push them into array
      for (var i = 0; i < all_res_arr.length; i++) {
        if ($.inArray(all_res_arr[i], enabled_res_arr) == -1) {
          disabled_res_arr.push(all_res_arr[i]);
        }
      }

      // put values of enabled_res_arr and disabled_res_arr into onloadVars
      ParsedClassicsData.onloadVars.enabledResources = enabled_res_arr;
      ParsedClassicsData.onloadVars.disabledResources = disabled_res_arr;

      // save list of enabled resources in cookie
      localStorage.setItem(ParsedClassicsVars.enabledResourcesCookieName, enabled_res_arr.join("|"));

    }
    // this is extra window
    else {
      // get urlJSON
      urlJSON = ParsedClassicsHelpers._getUrlJSON();
      if (typeof urlJSON[ParsedClassicsVars.resourceUrlAndCookieName] != 'undefined') {
        // get selected resource shortname from urlJSON
        selectedResourceShortname = urlJSON[ParsedClassicsVars.resourceUrlAndCookieName];
        enabled_res_arr.push(selectedResourceShortname);
        ParsedClassicsData.onloadVars.enabledResources = enabled_res_arr;
      }

    }
    
  }

  , _resourcesParams: function (collectionObject) {
    var paramsObj
    , key;

    paramsObj = {};

    //1) get params of critical editions
    for (var i = 0; i < collectionObject.original_texts.length; i++) {
      key = collectionObject.original_texts[i].resource_shortname;
      paramsObj[key] = collectionObject.original_texts[i];
      // save info about resource type in params obj
      paramsObj[key].resource_type = ParsedClassicsVars.resourceTypeOriginalText;
    }
    //2) get params of concordances
    for (var i = 0; i < collectionObject.concordance.length; i++) {
      key = collectionObject.concordance[i].resource_shortname;
      paramsObj[key] = collectionObject.concordance[i];
      // save info about resource type in params obj
      paramsObj[key].resource_type = ParsedClassicsVars.resourceTypeConcordance;
    }
    //3) get params of lexicons
    for (var i = 0; i < collectionObject.lexicons.length; i++) {
      key = collectionObject.lexicons[i].resource_shortname;
      paramsObj[key] = collectionObject.lexicons[i];
      // save info about resource type in params obj
      paramsObj[key].resource_type = ParsedClassicsVars.resourceTypeLexicon;
    }
    // 4) get params of translations
    for (var i = 0; i < collectionObject.translations.length; i++) {
      key = collectionObject.translations[i].resource_shortname;
      paramsObj[key] = collectionObject.translations[i];
      // save info about resource type in params obj
      paramsObj[key].resource_type = ParsedClassicsVars.resourceTypeTranslation;
    }
    // 5) get params of commentaries
    for (var i = 0; i < collectionObject.commentaries.length; i++) {
      key = collectionObject.commentaries[i].resource_shortname;
      paramsObj[key] = collectionObject.commentaries[i];
      // save info about resource type in params obj
      paramsObj[key].resource_type = ParsedClassicsVars.resourceTypeCommentary;
    }
    // 6) get params of grammar references
    for (var i = 0; i < collectionObject.grammar_refs.length; i++) {
      key = collectionObject.grammar_refs[i].resource_shortname;
      paramsObj[key] = collectionObject.grammar_refs[i];
      // save info about resource type in params obj
      paramsObj[key].resource_type = ParsedClassicsVars.resourceTypeGrammarRefs;
    }
    // 7) get params of diagrams
    for (var i = 0; i < collectionObject.diagrams.length; i++) {
      key = collectionObject.diagrams[i].resource_shortname;
      paramsObj[key] = collectionObject.diagrams[i];
      // save info about resource type in params obj
      paramsObj[key].resource_type = ParsedClassicsVars.resourceTypeDiagrams;
    }
    // 8) get params of audio recs
    for (var i = 0; i < collectionObject.audio.length; i++) {
      key = collectionObject.audio[i].resource_shortname;
      paramsObj[key] = collectionObject.audio[i];
      // save info about resource type in params obj
      paramsObj[key].resource_type = ParsedClassicsVars.resourceTypeAudio;
    }

    return paramsObj;

  }


  , _resourcesInExtraWindowsArray: function (params_obj) {
    var all_res_arr
    , res_in_extra_win_from_cookie
    , res_in_extra_win_from_cookie_arr
    , res_in_extra_win_from_cookie_arr_checked;

    // define vars
    all_res_arr = [];
    res_in_extra_win_from_cookie_arr = [];
    res_in_extra_win_from_cookie_arr_checked = [];

    // get shortnames of the all resources of the collection
    all_res_arr = Object.keys(params_obj);

    // does cookie contains pipe delimited list of resources to be opened in extra windows?
    res_in_extra_win_from_cookie = localStorage.getItem(ParsedClassicsVars.extraWindowsCookieName);
    if (res_in_extra_win_from_cookie) {
      res_in_extra_win_from_cookie_arr = res_in_extra_win_from_cookie.split("|");
    }

    // check if each resource from cookie list is really from this collection
    for (var i = 0; i < res_in_extra_win_from_cookie_arr.length; i++) {
      if ($.inArray(res_in_extra_win_from_cookie_arr[i], all_res_arr) != -1) {
        res_in_extra_win_from_cookie_arr_checked.push(res_in_extra_win_from_cookie_arr[i]);
      } 
    }

    // save list of resources to be opened in extra windows in cookie
    localStorage.setItem(ParsedClassicsVars.extraWindowsCookieName, res_in_extra_win_from_cookie_arr_checked.join("|"));

    return res_in_extra_win_from_cookie_arr_checked;

  }

  , _loadCollectionInfoIntoTableCells: function (collectionObject) {

    var td_el, resources_data, num;



    td_el = $("#" + collectionObject.collection_shortname);

    

    // "Collection" link

    td_el.html('<a href=\'' + '../library/index.html#catalogue/{"coll":"' + collectionObject.collection_shortname + '"}' + '\' target=\'_blank\'>' + collectionObject.collections_page_title_orig + ' / ' + collectionObject.collections_page_title_eng + "</a>");

    // "Resources" list

    resources_data = "";



    // Parsing

    if (typeof collectionObject.parsed_text != "undefined" && collectionObject.parsed_text) {

      resources_data += "<span class='pc-resource-list-heading'>Parsing:</span><br>" + collectionObject.parsed_text.collections_page_resource_desc + " [" + (collectionObject.parsed_text.scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

    }



    // Original text editions

    // There is one original text edition

    if (typeof collectionObject.original_texts != "undefined" && collectionObject.original_texts.length == 1) {

      resources_data += "<span class='pc-resource-list-heading'>Critical edition:</span><br>" + collectionObject.original_texts[0].collections_page_resource_desc + " [" + (collectionObject.original_texts[0].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

    }

    // There are several original text editions

    else if (typeof collectionObject.original_texts != "undefined" && collectionObject.original_texts.length > 1) {

      resources_data += "<span class='pc-resource-list-heading'>Critical editions:</span><br>";

      for (var i = 0; i < collectionObject.original_texts.length; i++) {

        num = i + 1;

        resources_data += " (" + num + ") " + collectionObject.original_texts[i].collections_page_resource_desc + " [" + (collectionObject.original_texts[i].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]";

        if (num != collectionObject.original_texts.length) {

          resources_data += ";<br>";

        }

        else {

          resources_data += ".<br>";

        }

      }

    }



    // Concordances

    // There is one concordance

    if (typeof collectionObject.concordance != "undefined" && collectionObject.concordance.length == 1) {

      resources_data += "<span class='pc-resource-list-heading'>Concordance:</span><br>" + collectionObject.concordance[0].collections_page_resource_desc + " [" + (collectionObject.concordance[0].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

    }

    // There are several concordances

    else if (typeof collectionObject.concordance != "undefined" && collectionObject.concordance.length > 1) {

      resources_data += "<span class='pc-resource-list-heading'>Concordances:</span><br>";

      for (var i = 0; i < collectionObject.concordance.length; i++) {

        num = i + 1;

        resources_data += " (" + num + ") " + collectionObject.concordance[i].collections_page_resource_desc + " [" + (collectionObject.concordance[i].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]";

        if (num != collectionObject.concordance.length) {

          resources_data += ";<br>";

        }

        else {

          resources_data += ".<br>";

        }

      }

    }



    // Lexicons

    // There is one lexicon

    if (typeof collectionObject.lexicons != "undefined" && collectionObject.lexicons.length == 1) {

      resources_data += "<span class='pc-resource-list-heading'>Lexicon:</span><br>" + collectionObject.lexicons[0].collections_page_resource_desc + " [" + (collectionObject.lexicons[0].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

    }

    // There are several lexicons

    else if (typeof collectionObject.lexicons != "undefined" && collectionObject.lexicons.length > 1) {

      resources_data += "<span class='pc-resource-list-heading'>Lexicons:</span><br>";

      for (var i = 0; i < collectionObject.lexicons.length; i++) {

        num = i + 1;

        resources_data += " (" + num + ") " + collectionObject.lexicons[i].collections_page_resource_desc + " [" + (collectionObject.lexicons[i].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]";

        if (num != collectionObject.lexicons.length) {

          resources_data += ";<br>";

        }

        else {

          resources_data += ".<br>";

        }

      }

    }



    // Translations

    if (typeof collectionObject.translations != "undefined" && collectionObject.translations.length) {

      // There is one translation

      if (collectionObject.translations.length == 1) {

        resources_data += "<span class='pc-resource-list-heading'>Translation:</span><br>" + collectionObject.translations[0].collections_page_resource_desc + " [" + (collectionObject.translations[0].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

      }

      // There are several translations

      else if (typeof collectionObject.translations != "undefined" && collectionObject.translations.length > 1) {

        resources_data += "<span class='pc-resource-list-heading'>Translations:</span><br>";

        for (var i = 0; i < collectionObject.translations.length; i++) {

          num = i + 1;

          resources_data += " (" + num + ") " + collectionObject.translations[i].collections_page_resource_desc + " [" + (collectionObject.translations[i].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]";

          if (num != collectionObject.translations.length) {

            resources_data += ";<br>";

          }

          else {

            resources_data += ".<br>";

          }

        }

      }

    }



    // Commentaries

    if (typeof collectionObject.commentaries != "undefined" && collectionObject.commentaries.length) {

      // There is one commentary

      if (collectionObject.commentaries.length == 1) {

        resources_data += "<span class='pc-resource-list-heading'>Commentary:</span><br>" + collectionObject.commentaries[0].collections_page_resource_desc + " [" + (collectionObject.commentaries[0].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

      }

      // There are several commentaries

      else if (typeof collectionObject.commentaries != "undefined" && collectionObject.commentaries.length > 1) {

        resources_data += "<span class='pc-resource-list-heading'>Commentaries:</span><br>";

        for (var i = 0; i < collectionObject.commentaries.length; i++) {

          num = i + 1;

          resources_data += " (" + num + ") " + collectionObject.commentaries[i].collections_page_resource_desc + " [" + (collectionObject.commentaries[i].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]";

          if (num != collectionObject.commentaries.length) {

            resources_data += ";<br>";

          }

          else {

            resources_data += ".<br>";

          }

        }

      }

    }



    // Grammar references

    if (typeof collectionObject.grammar_refs != "undefined" && collectionObject.grammar_refs.length) {

      // There is one set of grammar references

      if (collectionObject.grammar_refs.length == 1) {

        resources_data += "<span class='pc-resource-list-heading'>Grammar references:</span><br>" + collectionObject.grammar_refs[0].collections_page_resource_desc + " [" + (collectionObject.grammar_refs[0].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

      }

      // There are several sets of grammar references

      else if (typeof collectionObject.grammar_refs != "undefined" && collectionObject.grammar_refs.length > 1) {

        resources_data += "<span class='pc-resource-list-heading'>Grammar references:</span><br>";

        for (var i = 0; i < collectionObject.grammar_refs.length; i++) {

          num = i + 1;

          resources_data += " (" + num + ") " + collectionObject.grammar_refs[i].collections_page_resource_desc + " [" + (collectionObject.grammar_refs[i].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]";

          if (num != collectionObject.grammar_refs.length) {

            resources_data += ";<br>";

          }

          else {

            resources_data += ".<br>";

          }

        }

      }

    }



    // Diagrams

    if (typeof collectionObject.diagrams != "undefined" && collectionObject.diagrams.length) {

      // There is one diagram set

      if (collectionObject.diagrams.length == 1) {

        resources_data += "<span class='pc-resource-list-heading'>Syntax diagrams:</span><br>" + collectionObject.diagrams[0].collections_page_resource_desc + " [" + (collectionObject.diagrams[0].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

      }

      // There are several diagram sets

      else if (typeof collectionObject.diagrams != "undefined" && collectionObject.diagrams.length > 1) {

        resources_data += "<span class='pc-resource-list-heading'>Syntax diagrams:</span><br>";

        for (var i = 0; i < collectionObject.diagrams.length; i++) {

          num = i + 1;

          resources_data += " (" + num + ") " + collectionObject.diagrams[i].collections_page_resource_desc + " [" + (collectionObject.diagrams[i].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]";

          if (num != collectionObject.diagrams.length) {

            resources_data += ";<br>";

          }

          else {

            resources_data += ".<br>";

          }

        }

      }

    }



    // Audio recordings

    if (typeof collectionObject.audio != "undefined" && collectionObject.audio.length) {

      // There is one audio recording set

      if (collectionObject.audio.length == 1) {

        resources_data += "<span class='pc-resource-list-heading'>Audio recording:</span><br>" + collectionObject.audio[0].collections_page_resource_desc + " [" + (collectionObject.audio[0].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]" + ".<br>";

      }

      // There are several diagram sets

      else if (typeof collectionObject.audio != "undefined" && collectionObject.audio.length > 1) {

        resources_data += "<span class='pc-resource-list-heading'>Audio recordings:</span><br>";

        for (var i = 0; i < collectionObject.audio.length; i++) {

          num = i + 1;

          resources_data += " (" + num + ") " + collectionObject.audio[i].collections_page_resource_desc + " [" + (collectionObject.audio[i].scanned_or_typed == ParsedClassicsVars.resourceTypeScanned ? ParsedClassicsVars.resourceTypeScanned : "transcribed") + "]";

          if (num != collectionObject.audio.length) {

            resources_data += ";<br>";

          }

          else {

            resources_data += ".<br>";

          }

        }

      }

    }




    td_el = $("#" + collectionObject.collection_shortname + "_details").html(resources_data);

  }



  , _findSelectedCollectionShortname: function (urlJSON, collectionShortnamesArray, collectionsParamsObj) {

    var selectedCollectionShortname, selectedCollectionShortnameInCookie, selected_collection_selectboxname;



    // find, if collection shortname is in url

    if (typeof urlJSON[ParsedClassicsVars.collectionUrlAndCookieName] != 'undefined') {

      selectedCollectionShortname = urlJSON[ParsedClassicsVars.collectionUrlAndCookieName];

      if ($.inArray(selectedCollectionShortname, collectionShortnamesArray) > -1) {

        // find which collection shortname has been saved in cookie

        selectedCollectionShortnameInCookie = localStorage.getItem(ParsedClassicsVars.collectionUrlAndCookieName);

        // if collection name in cookie and in url do not match, remove line number and enabled resources cookies

        if (selectedCollectionShortnameInCookie && selectedCollectionShortnameInCookie != selectedCollectionShortname) {
          
          localStorage.removeItem(ParsedClassicsVars.lineUrlAndCookieName);
          localStorage.removeItem(ParsedClassicsVars.enabledResourcesCookieName);

        }

        // if this is not extra window, save selected collection shortname in cookie
        if (!ParsedClassicsData.onloadVars.isExtraWindow) {
          localStorage.setItem(ParsedClassicsVars.collectionUrlAndCookieName, selectedCollectionShortname);
        }

        // if this is not extra window, put name of the collection into <title>
        if (!ParsedClassicsData.onloadVars.isExtraWindow) {
          selected_collection_selectboxname = collectionsParamsObj[selectedCollectionShortname].collection_selectboxname;
          document.title = selected_collection_selectboxname + " | " + document.title;
        }
        
        return selectedCollectionShortname;

      }

    }



    // if not, find, if collection shortname is preserved in cookie

    selectedCollectionShortname = localStorage.getItem(ParsedClassicsVars.collectionUrlAndCookieName);

    if (selectedCollectionShortname) {

      if ($.inArray(selectedCollectionShortname, collectionShortnamesArray) > -1) {

        // if this is not extra window, put name of the collection into <title>
        if (!ParsedClassicsData.onloadVars.isExtraWindow) {
          selected_collection_selectboxname = collectionsParamsObj[selectedCollectionShortname].collection_selectboxname;
          document.title = selected_collection_selectboxname + " | " + document.title;
        }

        return selectedCollectionShortname;

      }

    }



    // if not, find which collection shortname is first in collectionObjectsArray

    else {

      selectedCollectionShortname = collectionShortnamesArray[0];

      // if this is not extra window, save selected collection shortname in cookie
      // and put name of the collection into <title>
      if (!ParsedClassicsData.onloadVars.isExtraWindow) {
        localStorage.setItem(ParsedClassicsVars.collectionUrlAndCookieName, selectedCollectionShortname);
        selected_collection_selectboxname = collectionsParamsObj[selectedCollectionShortname].collection_selectboxname;
        document.title = selected_collection_selectboxname + " | " + document.title;
      }
      
      return selectedCollectionShortname;

    }

  }



  , _findLineToBeSelectedOnload: function () {

    var urlJSON, lineNum, lineNumObject;



    // get JSON from hash part of the url

    urlJSON = ParsedClassicsHelpers._getUrlJSON();



    // find, if line number is in url

    if (typeof urlJSON[ParsedClassicsVars.lineUrlAndCookieName] != 'undefined') {

      // is collection shortname in url?

      if (typeof urlJSON[ParsedClassicsVars.collectionUrlAndCookieName] != 'undefined') {

        lineNum = urlJSON[ParsedClassicsVars.lineUrlAndCookieName];

        // if this is not extra window, save line num in cookie
        if (!ParsedClassicsData.onloadVars.isExtraWindow) {
          localStorage.setItem(ParsedClassicsVars.lineUrlAndCookieName, lineNum);
        }
        
        return lineNum;

      }

      // remove line number from url JSON

      else {

        delete urlJSON[ParsedClassicsVars.lineUrlAndCookieName];

        ParsedClassicsHelpers._setUrlJSON(urlJSON);

      }

    }

    // if not, find, if line number is preserved in cookie

    if (localStorage.getItem(ParsedClassicsVars.lineUrlAndCookieName)) {

      // is collection shortname in cookie?

      if (localStorage.getItem(ParsedClassicsVars.collectionUrlAndCookieName)) {

        lineNum = localStorage.getItem(ParsedClassicsVars.lineUrlAndCookieName);

        // form line number object

        lineNumObject = {};

        lineNumObject[ParsedClassicsVars.lineUrlAndCookieName] = lineNum;

        // if this is not extra window, push line number into JSON which is in the hash part of the url
        if (!ParsedClassicsData.onloadVars.isExtraWindow) {
          ParsedClassicsHelpers._setUrlJSON(urlJSON, lineNumObject);
        }

        return lineNum;

      }

      // remove line number from cookie

      else {

        localStorage.removeItem(ParsedClassicsVars.lineUrlAndCookieName);

      }

    }



  }



  , _findLineNumClass: function (lineNum) {

    var lineClass;



    // replace dots into dashes

    lineNum = lineNum.replace(/\./g, ParsedClassicsVars.verseNumClassSeparator);

    // replace colons into dashes

    lineNum = lineNum.replace(/\:/g, ParsedClassicsVars.verseNumClassSeparator);

    // add verse indicator "v"

    lineClass = ParsedClassicsVars.verseNumClassPrefix + lineNum;

    return lineClass;

  }



  , _findWordToBeSelectedOnload: function () {

    var urlJSON, lemma, lexicon, lexicon_entry_num, wordObject;



    // define variable

    lemma = "";



    // get JSON from hash part of the url

    urlJSON = ParsedClassicsHelpers._getUrlJSON();



    // find, if word is in url

    if (typeof urlJSON[ParsedClassicsVars.wordUrlAndCookieName] != 'undefined') {

      // is line number in url?

      if (typeof urlJSON[ParsedClassicsVars.lineUrlAndCookieName] != 'undefined') {

        lemma = urlJSON[ParsedClassicsVars.wordUrlAndCookieName];

        // if this is not extra window, save lemma in cookie
        if (!ParsedClassicsData.onloadVars.isExtraWindow) {
          localStorage.setItem(ParsedClassicsVars.wordUrlAndCookieName, lemma);
        }
        
        lexicon = urlJSON[ParsedClassicsVars.lexiconUrlAndCookieName];

        lexicon_entry_num = urlJSON[ParsedClassicsVars.lexiconEntryUrlAndCookieName];

        if (lexicon && lexicon_entry_num) {

          // if this is not extra window, save lexicon ans lexicon entry num in cookie
          if (!ParsedClassicsData.onloadVars.isExtraWindow) {
            localStorage.setItem(ParsedClassicsVars.lexiconUrlAndCookieName, lexicon);

            localStorage.setItem(ParsedClassicsVars.lexiconEntryUrlAndCookieName, lexicon_entry_num);
          }
          
        }

        return lemma;

      }

      // remove word info from url JSON

      else {

        delete urlJSON[ParsedClassicsVars.wordUrlAndCookieName];

        delete urlJSON[ParsedClassicsVars.lexiconUrlAndCookieName];

        delete urlJSON[ParsedClassicsVars.lexiconEntryUrlAndCookieName];

        ParsedClassicsHelpers._setUrlJSON(urlJSON);

      }

    }

    // if not, find, if word is preserved in cookie

    if (localStorage.getItem(ParsedClassicsVars.wordUrlAndCookieName)) {

      // is line number in cookie?

      if (localStorage.getItem(ParsedClassicsVars.lineUrlAndCookieName)) {

        lemma = localStorage.getItem(ParsedClassicsVars.wordUrlAndCookieName);

        lexicon = localStorage.getItem(ParsedClassicsVars.lexiconUrlAndCookieName);

        lexicon_entry_num = localStorage.getItem(ParsedClassicsVars.lexiconEntryUrlAndCookieName);

        // push word into JSON which is in the hash part of the url

        wordObject = {};

        wordObject[ParsedClassicsVars.wordUrlAndCookieName] = lemma;

        if (lexicon && lexicon_entry_num) {

          wordObject[ParsedClassicsVars.lexiconUrlAndCookieName] = lexicon;

          wordObject[ParsedClassicsVars.lexiconEntryUrlAndCookieName] = lexicon_entry_num;

        }

        // if this is not extra window, put word into urlJSON
        if (!ParsedClassicsData.onloadVars.isExtraWindow) {
          ParsedClassicsHelpers._setUrlJSON(urlJSON, wordObject);
        }

        return lemma;

      }

      // remove word from cookie

      else {

        localStorage.removeItem(ParsedClassicsVars.wordUrlAndCookieName);

        localStorage.removeItem(ParsedClassicsVars.lexiconUrlAndCookieName);

        localStorage.removeItem(ParsedClassicsVars.lexiconEntryUrlAndCookieName);

      }

    }



    return lemma;

  }



  , _collectionsSelectboxOptions: function (collectionObjectsArray, selectedCollectionShortname) {

    var collectionsSelectbox, collectionsSelectboxHTML, selectedAttr, collectionsSetShortnameOld, collectionsSetShortnameNew, optgroupLabel;



    // find collections selectbox

    collectionsSelectbox = $("#" + ParsedClassicsVars.collectionsSelectboxId);

    if (collectionsSelectbox.length == 1) {

      collectionsSelectboxHTML = "";
      collectionsSetShortnameOld = "";
      collectionsSetShortnameNew = "";


      // create <option> els

      for (var i = 0; i < collectionObjectsArray.length; i++) {

        collectionsSetShortnameNew = (typeof collectionObjectsArray[i].collection_set != "undefined" && collectionObjectsArray[i].collection_set != "") ? collectionObjectsArray[i].collection_set : "error_coll_set_undefined";
        optgroupLabel = (typeof ParsedClassicsCollectionSets[collectionsSetShortnameNew].orig_short != "undefined" && ParsedClassicsCollectionSets[collectionsSetShortnameNew].orig_short != "") ? ParsedClassicsCollectionSets[collectionsSetShortnameNew].orig_short : "error_coll_set_label_undefined";

        // is this start of the first collections set? 
        if (i == 0) {
          // add name of collection set
          collectionsSelectboxHTML += '<optgroup label="' + optgroupLabel + '">';
        }
        // is this start of the new collections set ?
        else if (collectionsSetShortnameOld != collectionObjectsArray[i].collection_set) {
          // close previous optgroup
          collectionsSelectboxHTML += '</optgroup>';
          // add name of collection set
          collectionsSelectboxHTML += '<optgroup label="' + optgroupLabel + '">'; 
        }
        
        selectedAttr = collectionObjectsArray[i].collection_shortname == selectedCollectionShortname ? " selected" : "";

        collectionsSelectboxHTML += '<option value="' + collectionObjectsArray[i].collection_shortname + '"' + selectedAttr + '>' + collectionObjectsArray[i].collection_selectboxname + '</option>';

        collectionsSetShortnameOld = collectionObjectsArray[i].collection_set;

        // is this end of the end of the last collection set?
        if (i == collectionObjectsArray.length - 1) {
          // close last optgroup
          collectionsSelectboxHTML += '</optgroup>';
        }

      }



      // append <option> els

      collectionsSelectbox.append(collectionsSelectboxHTML);

    }



  }



  , _resourcesSelectboxOptions: function (collectionObject) {
    var options_html, optgroup_html, option_count, resourcesSelectbox;

    resourcesSelectbox = $("#" + ParsedClassicsVars.resourcesSelectboxId);

    // define vars
    options_html = "";

    // are there critical editions?

    if (typeof collectionObject.original_texts != "undefined" && collectionObject.original_texts.length > 0) {

      optgroup_html = "";
      option_count = 0;

      // create <option> tags
      for (var i = 0; i < collectionObject.original_texts.length; i++) {
        if ($.inArray(collectionObject.original_texts[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          optgroup_html += "<option value='" + collectionObject.original_texts[i].resource_shortname + "'" + (collectionObject.original_texts[i].resource_shortname == ParsedClassicsData.onloadVars.resourceShortname ? " selected" : "") + ">" + collectionObject.original_texts[i].library_app_selectbox_title + "</option>";
          option_count++;
        }
      }

      if (optgroup_html != "") {
        // create <optgroup> tag
        options_html += "<optgroup " + ParsedClassicsVars.resourceTypeAttr + "='" + ParsedClassicsVars.resourceTypeOriginalText + "' label='Critical edition" + (option_count > 1 ? "s" : "") + "'>";
        options_html += optgroup_html;
        options_html += "</optgroup>";
      }

    }

    // are there concordances?

    if (typeof collectionObject.concordance != "undefined" && collectionObject.concordance.length > 0) {

      optgroup_html = "";
      option_count = 0;

      // create <option> tags
      for (var i = 0; i < collectionObject.concordance.length; i++) {
        if ($.inArray(collectionObject.concordance[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          optgroup_html += "<option value='" + collectionObject.concordance[i].resource_shortname + "'" + (collectionObject.concordance[i].resource_shortname == ParsedClassicsData.onloadVars.resourceShortname ? " selected" : "") + ">" + collectionObject.concordance[i].library_app_selectbox_title + "</option>";
          option_count++;
        }
      }

      if (optgroup_html != "") {
        // create <optgroup> tag
        options_html += "<optgroup " + ParsedClassicsVars.resourceTypeAttr + "='" + ParsedClassicsVars.resourceTypeConcordance + "' label='Concordance" + (option_count > 1 ? "s" : "") + "'>";
        options_html += optgroup_html;
        options_html += "</optgroup>";
      }

    }

    // are there lexicons?

    if (typeof collectionObject.lexicons != "undefined" && collectionObject.lexicons.length > 0) {

      optgroup_html = "";
      option_count = 0;

      // create <option> tags
      for (var i = 0; i < collectionObject.lexicons.length; i++) {
        if ($.inArray(collectionObject.lexicons[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          optgroup_html += "<option value='" + collectionObject.lexicons[i].resource_shortname + "'" + (collectionObject.lexicons[i].resource_shortname == ParsedClassicsData.onloadVars.resourceShortname ? " selected" : "") + ">" + collectionObject.lexicons[i].library_app_selectbox_title + "</option>";
          option_count++;
        }
      }

      if (optgroup_html != "") {
        // create <optgroup> tag
        options_html += "<optgroup " + ParsedClassicsVars.resourceTypeAttr + "='" + ParsedClassicsVars.resourceTypeLexicon + "' label='Lexicon" + (option_count > 1 ? "s" : "") + "'>";
        options_html += optgroup_html;
        options_html += "</optgroup>";
      }
      
    }

    // are there translations?

    if (typeof collectionObject.translations != "undefined" && collectionObject.translations.length > 0) {

      optgroup_html = "";
      option_count = 0;

      // create <option> tags
      for (var i = 0; i < collectionObject.translations.length; i++) {
        if ($.inArray(collectionObject.translations[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          optgroup_html += "<option value='" + collectionObject.translations[i].resource_shortname + "'" + (collectionObject.translations[i].resource_shortname == ParsedClassicsData.onloadVars.resourceShortname ? " selected" : "") + ">" + collectionObject.translations[i].library_app_selectbox_title + "</option>";
          option_count++;
        }
      }

      if (optgroup_html != "") {
        // create <optgroup> tag
        options_html += "<optgroup " + ParsedClassicsVars.resourceTypeAttr + "='" + ParsedClassicsVars.resourceTypeTranslation + "' label='Translation" + (option_count > 1 ? "s" : "") + "'>";
        options_html += optgroup_html;
        options_html += "</optgroup>";
      }

    }

    // are there commentaries?

    if (typeof collectionObject.commentaries != "undefined" && collectionObject.commentaries.length > 0) {

      optgroup_html = "";
      option_count = 0;

      // create <option> tags
      for (var i = 0; i < collectionObject.commentaries.length; i++) {
        if ($.inArray(collectionObject.commentaries[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          optgroup_html += "<option value='" + collectionObject.commentaries[i].resource_shortname + "'" + (collectionObject.commentaries[i].resource_shortname == ParsedClassicsData.onloadVars.resourceShortname ? " selected" : "") + ">" + collectionObject.commentaries[i].library_app_selectbox_title + "</option>";
          option_count++;
        }
      }

      if (optgroup_html != "") {
        // create <optgroup> tag
        options_html += "<optgroup " + ParsedClassicsVars.resourceTypeAttr + "='" + ParsedClassicsVars.resourceTypeCommentary + "' label='" + (option_count > 1 ? "Commentaries" : "Commentary") + "'>";
        options_html += optgroup_html;
        options_html += "</optgroup>";
      }
      
    }

    // are there grammar references?

    if (typeof collectionObject.grammar_refs != "undefined" && collectionObject.grammar_refs.length > 0) {

      optgroup_html = "";
      option_count = 0;

      // create <option> tags
      for (var i = 0; i < collectionObject.grammar_refs.length; i++) {
        if ($.inArray(collectionObject.grammar_refs[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          optgroup_html += "<option value='" + collectionObject.grammar_refs[i].resource_shortname + "'" + (collectionObject.grammar_refs[i].resource_shortname == ParsedClassicsData.onloadVars.resourceShortname ? " selected" : "") + ">" + collectionObject.grammar_refs[i].library_app_selectbox_title + "</option>";
          option_count++;
        }
      }

      if (optgroup_html != "") {
        // create <optgroup> tag
        options_html += "<optgroup " + ParsedClassicsVars.resourceTypeAttr + "='" + ParsedClassicsVars.resourceTypeGrammarRefs + "' label='Grammar references'>";
        options_html += optgroup_html;
        options_html += "</optgroup>";
      }
      
    }

    // are there diagrams?

    if (typeof collectionObject.diagrams != "undefined" && collectionObject.diagrams.length > 0) {

      optgroup_html = "";
      option_count = 0;

      // create <option> tags
      for (var i = 0; i < collectionObject.diagrams.length; i++) {
        if ($.inArray(collectionObject.diagrams[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          optgroup_html += "<option value='" + collectionObject.diagrams[i].resource_shortname + "'" + (collectionObject.diagrams[i].resource_shortname == ParsedClassicsData.onloadVars.resourceShortname ? " selected" : "") + ">" + collectionObject.diagrams[i].library_app_selectbox_title + "</option>";
          option_count++;
        }
      }

      if (optgroup_html != "") {
        // create <optgroup> tag
        options_html += "<optgroup " + ParsedClassicsVars.resourceTypeAttr + "='" + ParsedClassicsVars.resourceTypeDiagrams + "' label='Syntax diagrams'>";
        options_html += optgroup_html;
        options_html += "</optgroup>";
      }

    }

    // are there audio recordings?

    if (typeof collectionObject.audio != "undefined" && collectionObject.audio.length > 0) {

      optgroup_html = "";
      option_count = 0;

      // create <option> tags
      for (var i = 0; i < collectionObject.audio.length; i++) {
        if ($.inArray(collectionObject.audio[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          optgroup_html += "<option value='" + collectionObject.audio[i].resource_shortname + "'" + (collectionObject.audio[i].resource_shortname == ParsedClassicsData.onloadVars.resourceShortname ? " selected" : "") + ">" + collectionObject.audio[i].library_app_selectbox_title + "</option>";
          option_count++;
        }
      }

      if (optgroup_html != "") {
        // create <optgroup> tag
        options_html += "<optgroup " + ParsedClassicsVars.resourceTypeAttr + "='" + ParsedClassicsVars.resourceTypeAudio + "' label='" + (option_count > 1 ? "Audio recordings" : "Audio recording") + "'>";
        options_html += optgroup_html;
        options_html += "</optgroup>";
      }
      
    }

    // append options html to resources selectbox
    resourcesSelectbox.append(options_html);

  }



  , _findSelectedResourceShortname: function (urlJSON, collectionObject, params_obj) {

    var selectedResourceShortname, resourceType, selectedResourceShortnameAndType, found_in_url, found_in_cookie, found_in_coll_object, selectedResourceShortnameObject, selected_resource_title;



    selectedResourceShortname = "";

    found_in_url = false;

    found_in_cookie = false;

    found_in_coll_object = false;

    // find if resource shortname is in url

    if (typeof urlJSON[ParsedClassicsVars.resourceUrlAndCookieName] != 'undefined') {

      selectedResourceShortname = urlJSON[ParsedClassicsVars.resourceUrlAndCookieName];

      found_in_url = true;

    }

    // find if resource shortname is preserved in cookie

    else {

      selectedResourceShortname = localStorage.getItem(ParsedClassicsVars.resourceUrlAndCookieName);

      found_in_cookie = true;

    }



    // find if there is such resource in collection, and if there is, find its type

    if (selectedResourceShortname) {

      // a) is there such resource among critical editions?

      if (typeof collectionObject.original_texts != "undefined") {



        for (var i = 0; i < collectionObject.original_texts.length; i++) {

          if (collectionObject.original_texts[i].resource_shortname == selectedResourceShortname) {

            resourceType = ParsedClassicsVars.resourceTypeOriginalText;

            found_in_coll_object = true;

          }

        }



      }



      // b) is there such resource among translations?

      if (!found_in_coll_object && typeof collectionObject.translations != "undefined") {



        for (var i = 0; i < collectionObject.translations.length; i++) {

          if (collectionObject.translations[i].resource_shortname == selectedResourceShortname) {

            resourceType = ParsedClassicsVars.resourceTypeTranslation;

            found_in_coll_object = true;

          }

        }



      }



      // c) is there such resource among concordances?

      if (!found_in_coll_object && typeof collectionObject.concordance != "undefined") {



        for (var i = 0; i < collectionObject.concordance.length; i++) {

          if (collectionObject.concordance[i].resource_shortname == selectedResourceShortname) {

            resourceType = ParsedClassicsVars.resourceTypeConcordance;

            found_in_coll_object = true;

          }

        }



      }



      // d) is there such resource among lexicons?

      if (!found_in_coll_object && typeof collectionObject.lexicons != "undefined") {



        for (var i = 0; i < collectionObject.lexicons.length; i++) {

          if (collectionObject.lexicons[i].resource_shortname == selectedResourceShortname) {

            resourceType = ParsedClassicsVars.resourceTypeLexicon;

            found_in_coll_object = true;

          }

        }



      }



      // e) is there such resource among commentaries?

      if (!found_in_coll_object && typeof collectionObject.commentaries != "undefined") {



        for (var i = 0; i < collectionObject.commentaries.length; i++) {

          if (collectionObject.commentaries[i].resource_shortname == selectedResourceShortname) {

            resourceType = ParsedClassicsVars.resourceTypeCommentary;

            found_in_coll_object = true;

          }

        }



      }



      // f) is there such resource among grammar references?

      if (!found_in_coll_object && typeof collectionObject.grammar_refs != "undefined") {



        for (var i = 0; i < collectionObject.grammar_refs.length; i++) {

          if (collectionObject.grammar_refs[i].resource_shortname == selectedResourceShortname) {

            resourceType = ParsedClassicsVars.resourceTypeGrammarRefs;

            found_in_coll_object = true;

          }

        }



      }



      // g) is there such resource among diagram sets?

      if (!found_in_coll_object && typeof collectionObject.diagrams != "undefined") {



        for (var i = 0; i < collectionObject.diagrams.length; i++) {

          if (collectionObject.diagrams[i].resource_shortname == selectedResourceShortname) {

            resourceType = ParsedClassicsVars.resourceTypeDiagrams;

            found_in_coll_object = true;

          }

        }



      }



      // h) is there such resource among audio recordings?

      if (!found_in_coll_object && typeof collectionObject.audio != "undefined") {



        for (var i = 0; i < collectionObject.audio.length; i++) {

          if (collectionObject.audio[i].resource_shortname == selectedResourceShortname) {

            resourceType = ParsedClassicsVars.resourceTypeAudio;

            found_in_coll_object = true;

          }

        }



      }



      // resource shortname found, so put it into url and cookie and return resource shortname and resource type

      if (found_in_coll_object) {



        if (found_in_url) {

          // if this is not extra window, preserve selected resource shortname in cookie
          if (!ParsedClassicsData.onloadVars.isExtraWindow) {
            localStorage.setItem(ParsedClassicsVars.resourceUrlAndCookieName, selectedResourceShortname);
          }
          
        }

        if (found_in_cookie) {

          // put selected resource shortname in url

          selectedResourceShortnameObject = {};

          selectedResourceShortnameObject[ParsedClassicsVars.resourceUrlAndCookieName] = selectedResourceShortname;

          ParsedClassicsHelpers._setUrlJSON(urlJSON, selectedResourceShortnameObject);

        }

        // if this is extra window, put selected resource name into <title> el
        if (ParsedClassicsData.onloadVars.isExtraWindow) {
          selected_resource_title = params_obj[selectedResourceShortname].library_app_panel_title;
          document.title = selected_resource_title + " | " + document.title;
        }



        selectedResourceShortnameAndType = { resource_shortname: selectedResourceShortname, resource_type: resourceType };

        return selectedResourceShortnameAndType;



      }

      else {

        // remove selected resource shortname from url and cookie

        delete urlJSON[ParsedClassicsVars.resourceUrlAndCookieName];

        ParsedClassicsHelpers._setUrlJSON(urlJSON);

        localStorage.removeItem(ParsedClassicsVars.resourceUrlAndCookieName);

      }



    }



    return false;



  }



  , _createContentPanelHTML: function (contentPanelId, contentPanelContentType, contentPanelScannedOrTyped, contentPanelTitle, contentPanelTextFrom, contentPanelScannedSource, contentPanelContentsShortname) {

    var panel_html, showContentPanel, contents_shortname_attr, src_data, progressbar_url, style_url;



    // by default content panels are hidden after page loads

    showContentPanel = false;

    // except parsed text content panel

    if (contentPanelContentType == ParsedClassicsVars.resourceTypeParsedText) {

      showContentPanel = true;

    }

    //except onloadVar.resourcesAtTime has the value "single" and contentPanelId is the same as onloadVars.resourceShortname

    else if (ParsedClassicsData.onloadVars.resourcesAtTime == ParsedClassicsVars.valResourcesAtTimeSingle && contentPanelId == ParsedClassicsData.onloadVars.resourceShortname) {

      showContentPanel = true;

    }

    //except onloadVar.resourcesAtTime has the value "category" and contentPanelContentType is the same as onloadVars.resourceType

    else if (ParsedClassicsData.onloadVars.resourcesAtTime == ParsedClassicsVars.valResourcesAtTimeCategory && contentPanelContentType == ParsedClassicsData.onloadVars.resourceType) {

      showContentPanel = true;

    }

    // except onloadVars.resourceShortname is defined and onloadVar.resourcesAtTime has the value "all"

    else if (ParsedClassicsData.onloadVars.resourceShortname != "" && ParsedClassicsData.onloadVars.resourcesAtTime == ParsedClassicsVars.valResourcesAtTimeAll) {

      showContentPanel = true;

    }



    contents_shortname_attr = "";

    if (contentPanelScannedOrTyped == ParsedClassicsVars.resourceTypeScanned || contentPanelContentType == ParsedClassicsVars.resourceTypeAudio) {

      contents_shortname_attr = ' ' + ParsedClassicsVars.contentsShortnameAttr + '="' + contentPanelContentsShortname + '"';

    }



    panel_html = "";



    panel_html += '<table border="0" cellspacing="0" id="' + contentPanelId + '" class="pc-height-100 pc-width-100 ' + ParsedClassicsVars.contentPanelWrapperClass + ' ' + contentPanelContentType + ' ' + contentPanelScannedOrTyped + (showContentPanel ? '' : ' pc-hide') + '"' + contents_shortname_attr + '>';



    // heading not needed for parsed text and for scanned books

    if (contentPanelContentType != ParsedClassicsVars.resourceTypeParsedText && contentPanelScannedOrTyped != ParsedClassicsVars.resourceTypeScanned) {

      panel_html += '<tr>';

      panel_html += '<td class="pc-content-panel-header pc-height-min pc-padding-0">';



      panel_html += contentPanelTitle;



      panel_html += '</td>';

      panel_html += '</tr>';

    }



    if (contentPanelContentType == ParsedClassicsVars.resourceTypeAudio) {

      panel_html += '<tr>';

      panel_html += '<td class="pc-height-min pc-position-relative pc-padding-0 pc-valign-top">';

      panel_html += '<div class="w3-light-grey w3-border-bottom">';

      panel_html += '<audio id="' + ParsedClassicsVars.audioPlayerElPrefix + contentPanelId + '" class="w3-show pc-width-100" preload="auto" controls controlsList="nodownload">';

      panel_html += '<source src="' + ParsedClassicsVars.audioFilesRelUrl + contentPanelId + '.mp3' + '" type="audio/mpeg">';

      panel_html += '</audio>';

      panel_html += '</div>';

      panel_html += '<div id="' + ParsedClassicsVars.audioTextfromElPrefix + contentPanelId + '" class="pc-hide">' + contentPanelTextFrom + '</div>';

      panel_html += '</td>';

      panel_html += '</tr>';

    }



    panel_html += '<tr>';

    panel_html += '<td class="pc-height-max pc-position-relative pc-padding-0 pc-valign-top">';



    // resource is not of the type "scanned"

    if (contentPanelScannedOrTyped != ParsedClassicsVars.resourceTypeScanned) {

      panel_html += '<div class="pc-position-absolute pc-height-100 pc-width-100 pc-overflow-y-scroll pc-padding-right-8 ' + ParsedClassicsVars.contentPanelInnerClass + (contentPanelContentType != ParsedClassicsVars.resourceTypeParsedText ? ' pc-padding-left-16' : '') + '"' + (contentPanelContentType == ParsedClassicsVars.resourceTypeAudio ? 'id="' + ParsedClassicsVars.audioTextElPrefix + contentPanelId + '" data-audio="#' + ParsedClassicsVars.audioPlayerElPrefix + contentPanelId + '"' : '') + '>';



      if (contentPanelContentType == ParsedClassicsVars.resourceTypeParsedText) {

        panel_html += contentPanelTitle;

      }



      if (contentPanelContentType != ParsedClassicsVars.resourceTypeAudio) {

        panel_html += contentPanelTextFrom;

      }



      panel_html += '</div>';

    }

    // resource is of the type "scanned"

    // ../reader/embedded_bookreader.html?

    // + contentPanelScannedSource

    // #page/1/mode/2up

    else {

      // form progressbar url

      progressbar_url = window.location;

      progressbar_url = progressbar_url.toString().split("/library");

      progressbar_url = progressbar_url[0];

      progressbar_url = progressbar_url + '/reader/BookReader/images/progressbar.gif';

      style_url = window.location;

      style_url = style_url.toString().split("/library"); 

      style_url = style_url[0];

      style_url = style_url + '/css/pc.css';

      // form data value of "src" attr of iframe el

      src_data = 'data:text/html;charset=utf-8,';

      src_data += encodeURI('<html><head><link type="text/css" rel="stylesheet" href="' + style_url + '" /></head><body><center>' + contentPanelTitle 
      //+ '<img src="' + progressbar_url + '">'
      + '<div class="loader8" style="width: 220px;"></div>' 
      + '</center></body></html>');

      panel_html += '<iframe id="' + contentPanelScannedSource + '" class="' + ParsedClassicsVars.bookReaderIframeClass + '" src="' + src_data + '" >';

      panel_html += '</iframe>';

    }



    // "Item not found" dialogue which appears inside content panel

    panel_html += '<div class="pc-content-panel-dialogue pc-hide">';

    panel_html += '<div class="w3-modal-content pc-modal-content w3-card-4 w3-animate-zoom">';

    panel_html += '<header class="w3-container w3-dark-grey">';

    panel_html += '<span class="pc-close-dialogue_button w3-button w3-dark-grey w3-xlarge w3-hover-white w3-display-topright">&times;</span>';

    panel_html += '<h2>Not found</h2>';

    panel_html += '</header>';

    panel_html += '<div class="pc-modal-content-inner w3-container w3-padding-16">';



    panel_html += '</div>';

    panel_html += '</div>';

    panel_html += '</div>'; // End of "Item not found" dialogue



    panel_html += '</td>';

    panel_html += '</tr>';



    panel_html += '</table>';


    return panel_html;



  }


  , _createResourcesListPanelHTML: function(collectionObject) {
    var panel_html
    , showContentPanel
    , resgroup_html
    , res_count
    , res_count_absolute;
    
    // by default enabled/disabled resources list is displayed after page loads

    showContentPanel = true;
    
    // except onloadVars.resourceShortname is not empty
    
    if (ParsedClassicsData.onloadVars.resourceShortname !== "") {
      showContentPanel = false;
    }
    
    panel_html = "";
    
    panel_html += '<table border="0" cellspacing="0" id="' + ParsedClassicsVars.resourcesListPanelId + '" class="pc-height-100 pc-width-100 ' + ParsedClassicsVars.contentPanelWrapperClass + ' ' + ParsedClassicsVars.resourceTypeTyped + (showContentPanel ? '' : ' pc-hide') + '">';
    
    panel_html += '<tr>';

    panel_html += '<td class="pc-height-max pc-position-relative pc-padding-0 pc-valign-top">';
    
    panel_html += '<div class="pc-position-absolute pc-height-100 pc-width-100 pc-overflow-y-scroll pc-padding-right-8 pc-content-panel-inner pc-padding-left-16">';
    
    panel_html += '<div class="pc-enabled-resources"><h2 class="pc-text-center">Enabled resources:</h2>';
    
    // are there enabled critical editions?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.original_texts != "undefined" && collectionObject.original_texts.length > 0) {
      for (var i = 0; i < collectionObject.original_texts.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.original_texts[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          resgroup_html += collectionObject.original_texts[i].library_app_selectbox_title + '<br>';
          res_count++;
        } 
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Critical edition" + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there enabled concordances?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.concordance != "undefined" && collectionObject.concordance.length > 0) {
      for (var i = 0; i < collectionObject.concordance.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.concordance[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          resgroup_html += collectionObject.concordance[i].library_app_selectbox_title + '<br>';
          res_count++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Concordance" + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there enabled lexicons?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.lexicons != "undefined" && collectionObject.lexicons.length > 0) {
      for (var i = 0; i < collectionObject.lexicons.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.lexicons[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          resgroup_html += collectionObject.lexicons[i].library_app_selectbox_title + '<br>';
          res_count++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Lexicon" + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there enabled translations?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.translations != "undefined" && collectionObject.translations.length > 0) {
      for (var i = 0; i < collectionObject.translations.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.translations[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          resgroup_html += collectionObject.translations[i].library_app_selectbox_title + '<br>';
          res_count++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Translation" + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there enabled commentaries?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.commentaries != "undefined" && collectionObject.commentaries.length > 0) {
      for (var i = 0; i < collectionObject.commentaries.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.commentaries[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          resgroup_html += collectionObject.commentaries[i].library_app_selectbox_title + '<br>';
          res_count++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += (res_count > 1 ? "Commentaries" : "Commentary");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there enabled grammar references?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.grammar_refs != "undefined" && collectionObject.grammar_refs.length > 0) {
      for (var i = 0; i < collectionObject.grammar_refs.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.grammar_refs[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          resgroup_html += collectionObject.grammar_refs[i].library_app_selectbox_title + '<br>';
          res_count++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Grammar references";
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there enabled diagrams?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.diagrams != "undefined" && collectionObject.diagrams.length > 0) {
      for (var i = 0; i < collectionObject.diagrams.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.diagrams[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          resgroup_html += collectionObject.diagrams[i].library_app_selectbox_title + '<br>';
          res_count++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Syntax diagrams";
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there audio enabled recordings?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.audio != "undefined" && collectionObject.audio.length > 0) {
      for (var i = 0; i < collectionObject.audio.length; i++) {
        // is resource enabled?
        if ($.inArray(collectionObject.audio[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) != -1) {
          resgroup_html += collectionObject.audio[i].library_app_selectbox_title + '<br>';
          res_count++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += 'Audio recording' + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    panel_html += '</div><!-- End of .pc-enabled-resources -->';
    
    panel_html += '<div class="pc-disabled-resources"><h2 class="pc-text-center">Disabled resources:</h2>';
    
    res_count_absolute = 0;
    
    // are there disabled critical editions?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.original_texts != "undefined" && collectionObject.original_texts.length > 0) {
      for (var i = 0; i < collectionObject.original_texts.length; i++) {
        // is resource disabled?
        if ($.inArray(collectionObject.original_texts[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) == -1) {
          resgroup_html += collectionObject.original_texts[i].library_app_selectbox_title + '<br>';
          res_count++;
          res_count_absolute++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Critical edition" + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there disabled concordances?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.concordance != "undefined" && collectionObject.concordance.length > 0) {
      for (var i = 0; i < collectionObject.concordance.length; i++) {
        // is resource disabled?
        if ($.inArray(collectionObject.concordance[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) == -1) {
          resgroup_html += collectionObject.concordance[i].library_app_selectbox_title + '<br>';
          res_count++;
          res_count_absolute++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Concordance" + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there disabled lexicons?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.lexicons != "undefined" && collectionObject.lexicons.length > 0) {
      for (var i = 0; i < collectionObject.lexicons.length; i++) {
        // is resource disabled?
        if ($.inArray(collectionObject.lexicons[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) == -1) {
          resgroup_html += collectionObject.lexicons[i].library_app_selectbox_title + '<br>';
          res_count++;
          res_count_absolute++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Lexicon" + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there disabled translations?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.translations != "undefined" && collectionObject.translations.length > 0) {
      for (var i = 0; i < collectionObject.translations.length; i++) {
        // is resource disabled?
        if ($.inArray(collectionObject.translations[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) == -1) {
          resgroup_html += collectionObject.translations[i].library_app_selectbox_title + '<br>';
          res_count++;
          res_count_absolute++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Translation" + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there disabled commentaries?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.commentaries != "undefined" && collectionObject.commentaries.length > 0) {
      for (var i = 0; i < collectionObject.commentaries.length; i++) {
        // is resource disabled?
        if ($.inArray(collectionObject.commentaries[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) == -1) {
          resgroup_html += collectionObject.commentaries[i].library_app_selectbox_title + '<br>';
          res_count++;
          res_count_absolute++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += (res_count > 1 ? "Commentaries" : "Commentary");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there grammar disabled references?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.grammar_refs != "undefined" && collectionObject.grammar_refs.length > 0) {
      for (var i = 0; i < collectionObject.grammar_refs.length; i++) {
        // is resource disabled?
        if ($.inArray(collectionObject.grammar_refs[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) == -1) {
          resgroup_html += collectionObject.grammar_refs[i].library_app_selectbox_title + '<br>';
          res_count++;
          res_count_absolute++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Grammar references";
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there disabled diagrams?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.diagrams != "undefined" && collectionObject.diagrams.length > 0) {
      for (var i = 0; i < collectionObject.diagrams.length; i++) {
        // is resource disabled?
        if ($.inArray(collectionObject.diagrams[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) == -1) {
          resgroup_html += collectionObject.diagrams[i].library_app_selectbox_title + '<br>';
          res_count++;
          res_count_absolute++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += "Syntax diagrams";
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    // are there audio disabled recordings?
    resgroup_html = "";
    res_count = 0;
    if (typeof collectionObject.audio != "undefined" && collectionObject.audio.length > 0) {
      for (var i = 0; i < collectionObject.audio.length; i++) {
        // is resource disabled?
        if ($.inArray(collectionObject.audio[i].resource_shortname, ParsedClassicsData.onloadVars.enabledResources) == -1) {
          resgroup_html += collectionObject.audio[i].library_app_selectbox_title + '<br>';
          res_count++;
          res_count_absolute++;
        }
      }
      if (resgroup_html !== "") {
        panel_html += '<div class="pc-padding-bottom-16"><span class="pc-resource-list-heading">';
        panel_html += 'Audio recording' + (res_count > 1 ? "s" : "");
        panel_html += '</span><br>';
        panel_html += resgroup_html;
        panel_html += '</div>';
      }
    }
    
    if (res_count_absolute == 0) {
      panel_html += 'None';
    }
    
    panel_html += '</div><!-- End of .pc-disabled-resources -->';
    
    panel_html += '</div><!-- End of .pc-content-panel-inner -->';
    
    panel_html += '</td>';

    panel_html += '</tr>';

    panel_html += '</table>';



    return panel_html;
  }


  , loadSectionsSelectboxOptions: function (coll_contents_shortname) {

    var interval;



    // define vars

    interval = ParsedClassicsVars.waitForDataTimeout;



    ParsedClassicsData._sectionsSelectboxOptionsLoadingTimeout(coll_contents_shortname, interval);

  }



  , _sectionsSelectboxOptionsLoadingTimeout: function (coll_contents_shortname, interval) {

    var coll_contents_object;



    // contents has been loaded?

    if (typeof window[coll_contents_shortname] != "undefined") {

      coll_contents_object = window[coll_contents_shortname];

      ParsedClassicsData._appendSectionsSelectboxOptions(coll_contents_object);

    }

    // contents has not been loaded? - then we must wait for them to load

    else {

      setTimeout(function () { ParsedClassicsData._sectionsSelectboxOptionsLoadingTimeout(coll_contents_shortname, interval) }, interval);

    }



  }



  , _appendSectionsSelectboxOptions: function (coll_contents_object) {

    var sectionsSelectbox, optionEl, optionsHTML;



    sectionsSelectbox = $("#" + ParsedClassicsVars.sectionsSelectboxId);



    if (sectionsSelectbox.length == 1) {

      // create html of <option> els

      optionsHTML = ParsedClassicsData._contentFromJSON(coll_contents_object);



      // append <option> els to Sections selectbox

      sectionsSelectbox.append(optionsHTML);



      // is there <option> element which has onload lineClass as it's "value" attr?

      optionEl = sectionsSelectbox.find("option[value='" + ParsedClassicsData.onloadVars.lineClass + "']");



      // if there is such <option> el, make it selected

      if (optionEl.length === 1) {

        optionEl.attr('selected', 'selected');

      }

    }





  }



  , _contentFromJSON: function (contentJSON) {

    var optionsHTML;



    optionsHTML = '';



    for (var key in contentJSON) {



      if (key.indexOf(ParsedClassicsVars.keyStringLevelStart) === 0) {

        optionsHTML += "<optgroup label='" + contentJSON[key] + "'>";

      }

      else if (key.indexOf(ParsedClassicsVars.keyStringLevelEnd) === 0) {

        optionsHTML += "</optgroup>";

      }

      else {

        optionsHTML += "<option value='" + key + "'>" + contentJSON[key] + "</option>";

      }

    }



    return optionsHTML;

  }



  , _loadResource: function (resourceShortname, resourceCode) {

    var contentPanelWrapper, contentPanelInner, resourceType, text_from_el, urlJSON, line_num;

    // get urlJSON
    urlJSON = ParsedClassicsHelpers._getUrlJSON();


    // find content panel wrapper

    contentPanelWrapper = $("#" + resourceShortname);



    // find scrollable div inside content panel wrapper

    contentPanelInner = contentPanelWrapper.find(" ." + ParsedClassicsVars.contentPanelInnerClass);

    // find which type of resource is being loaded

    resourceType = ""

    // is resource of the type "typed"?

    if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTyped)) {

      resourceType = ParsedClassicsVars.resourceTypeTyped;

    }

    // is resource of the type "scanned"?

    if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeScanned)) {

      resourceType = ParsedClassicsVars.resourceTypeScanned;

    }



    // Case I. resource of the type "typed"

    if (resourceType == ParsedClassicsVars.resourceTypeTyped) {

      if (contentPanelInner.length == 1) {

        if (resourceCode) {



          // append content to scrollable div inside content panel wrapper

          contentPanelInner.append(resourceCode);



          // delegate "hover" and "click" events from els having class "word" to "parsed_text" inner content panel

          if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeParsedText)) {

            contentPanelInner.delegate("." + ParsedClassicsVars.wordClass, "mouseenter", ParsedClassicsSelectedWord.selectedWordMouseEnter);

            contentPanelInner.delegate("." + ParsedClassicsVars.wordClass, "mouseleave", ParsedClassicsSelectedWord.selectedWordMouseLeave);

            if (typeof urlJSON[ParsedClassicsVars.extraWinUrlName] == "undefined" || urlJSON[ParsedClassicsVars.extraWinUrlName] != ParsedClassicsVars.extraWinUrlValConcordance) {
              contentPanelInner.delegate("." + ParsedClassicsVars.wordClass, "click", ParsedClassicsSelectedWord.selectedWordClick);
            }
            

          }


          //delegate "click" event from els having class "concordance-lines-button" to "concordance" inner content panel
          if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeConcordance)) {

            contentPanelInner.delegate("." + ParsedClassicsVars.concordanceLinesButtonClass, "click", ParsedClassicsConcordanceButton.toggleLinksPanel);

          }


          // delegate "click" event from els having attr "data-anchor" to "lexicon" inner content panel

          if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeLexicon)) {

            contentPanelInner.delegate("." + ParsedClassicsVars.innerLinkClass, "click", ParsedClassicsInnerLink.innerLinkClick);

          }



          // delegate "click" event from <a> els to "Grammar references" inner content panel

          if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeGrammarRefs)) {

            contentPanelInner.delegate("", "click", ParsedClassicsGrammarRefLink.grammarRefLinkClick);

          }



          // fire function which synchronizes audio reading with text scrolling

          if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeAudio)) {

            new RabbitLyrics({

              element: document.getElementById(ParsedClassicsVars.audioTextElPrefix + resourceShortname),

              mediaElement: document.getElementById(ParsedClassicsVars.audioPlayerElPrefix + resourceShortname)

            });

            // put textfrom el into el which scrolls together with audio reading

            text_from_el = $("#" + ParsedClassicsVars.audioTextfromElPrefix + resourceShortname).detach().css("display", "block");

            $("#" + resourceShortname + " ." + ParsedClassicsVars.contentPanelInnerClass).prepend(text_from_el);

          }



        }

        else {

          contentPanelInner.append("<h1>To be done</h1>");

        }


        // if this is extra window containing parsed text and opened by simple concordance resource, we still do not have line class in onloadVars
        if (typeof urlJSON[ParsedClassicsVars.extraWinUrlName] != "undefined" || urlJSON[ParsedClassicsVars.extraWinUrlName] == ParsedClassicsVars.extraWinUrlValConcordance) {
          if (typeof urlJSON[ParsedClassicsVars.lineUrlAndCookieName] != "undefined") {
            line_num = urlJSON[ParsedClassicsVars.lineUrlAndCookieName];
            ParsedClassicsData.onloadVars.lineClass = ParsedClassicsData._findLineNumClass(line_num);
          }
        }


        // if the value of onloadVars.lineClass is not "v-title", then scroll to line 

        if (ParsedClassicsData.onloadVars.lineClass != ParsedClassicsVars.lineClassSelectedByDefault) {

          // content panels which  are of the content types "parsed_text", "original_text", "translation", "commentary", "grammar_references", "diagram_set" should scroll to the line

          if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeParsedText) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeOriginalText) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTranslation) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeCommentary) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeGrammarRefs) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeDiagrams)) {

            ParsedClassicsHelpers._scrollToSelectedLine(null, contentPanelWrapper, ParsedClassicsData.onloadVars.lineClass);

          }

        }



        // if the value of onloadVars.word is not empty string, then scroll to the word

        if (ParsedClassicsData.onloadVars.word != "") {

          // content panels which  are of the content types "concordance", "lexicon" should scroll to the word

          if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeConcordance) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeLexicon)) {

            ParsedClassicsHelpers._scrollToSelectedWord(null, contentPanelWrapper, ParsedClassicsData.onloadVars.word);

          }

        }



      }

    }



    /*

// Case II. resource of the type "scanned"

if (resourceType == ParsedClassicsVars.resourceTypeScanned) {

	

        if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeOriginalText) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTranslation) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeCommentary)) {

            ParsedClassicsHelpers._browseToSelectedLine(null, contentPanelWrapper, ParsedClassicsData.onloadVars.lineClass);	

        }

        else if ( contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeConcordance) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeLexicon) ) {

            ParsedClassicsHelpers._browseToSelectedWord(null, contentPanelWrapper, ParsedClassicsData.onloadVars.word);

        }

           

}

    */



  }



  , loadAllScannedResources: function () {

    var interval, duration, resourcesPane, contentPanels, panels_scanned, resource_params_arr, resource_params_arr_reduced, contentPanelWrapper, iframe_el;



    // define vars

    interval = ParsedClassicsVars.waitForDataTimeout;

    resource_params_arr = [];

    resource_params_arr_reduced = [];



    // find resources pane

    resourcesPane = $("#" + ParsedClassicsVars.centerPaneContainerId);



    // find in Resources pane all content panels containing scanned resources 

    contentPanels = resourcesPane.find("." + ParsedClassicsVars.contentPanelWrapperClass);

    panels_scanned = contentPanels.filter("." + ParsedClassicsVars.resourceTypeScanned);



    // put needed params of each content panel containing scanned resource into object and objects - into resource_params_arr array

    for (var i = 0; i < panels_scanned.length; i++) {



      contentPanelWrapper = $(panels_scanned[i]);

      resource_params_arr[i] = {};



      // get resource shortname

      resource_params_arr[i]["resource_shortname"] = contentPanelWrapper.attr("id");

      // get contents shortname

      resource_params_arr[i]["contents_shortname"] = contentPanelWrapper.attr(ParsedClassicsVars.contentsShortnameAttr);

      // do we need to browse to line or to word?

      if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeOriginalText) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeTranslation) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeCommentary)) {

        resource_params_arr[i]["word_or_line"] = "line";

      }

      else if (contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeConcordance) || contentPanelWrapper.hasClass(ParsedClassicsVars.resourceTypeLexicon)) {

        resource_params_arr[i]["word_or_line"] = "word";

      }

      // get scanned book shortname

      iframe_el = contentPanelWrapper.find("." + ParsedClassicsVars.bookReaderIframeClass);

      resource_params_arr[i]["scanned_source_shortname"] = iframe_el.attr("id");

      // put <iframe> el itself into params array

      resource_params_arr[i]["iframe_el"] = iframe_el;

      // put content panel wrapper el itself into params array

      resource_params_arr[i]["content_panel_wrapper"] = contentPanelWrapper;



    }



    // launch function which will wait for contents to load if needed

    ParsedClassicsData._scannedResourcesLoadingTimeout(resource_params_arr, interval);



  }



  , _scannedResourcesLoadingTimeout: function (resource_params_arr, interval) {

    var resource_params_arr_reduced, contents_shortname;



    // define var

    resource_params_arr_reduced = [];



    // loop through array of scanned books params

    for (var i = 0; i < resource_params_arr.length; i++) {

      contents_shortname = resource_params_arr[i]["contents_shortname"];

      // contents has been loaded?

      if (typeof window[contents_shortname] != "undefined") {

        // do we need to browse to line?

        if (resource_params_arr[i]["word_or_line"] == "line") {

          ParsedClassicsHelpers._browseToSelectedLine(null, resource_params_arr[i]["content_panel_wrapper"], ParsedClassicsData.onloadVars.lineClass);

        }

        // do we need to browse to word?

        else if (resource_params_arr[i]["word_or_line"] == "word") {

          ParsedClassicsHelpers._browseToSelectedWord(null, resource_params_arr[i]["content_panel_wrapper"], ParsedClassicsData.onloadVars.word);

        }

      }

      // contents has not been loaded? - then we must wait for them to load  

      else {

        resource_params_arr_reduced.push(resource_params_arr[i]);

      }

    }



    if (resource_params_arr_reduced.length > 0) {

      setTimeout(function () { ParsedClassicsData._scannedResourcesLoadingTimeout(resource_params_arr_reduced) }, interval);

    }

  }



  , loadAllAudioResources: function () {

    var interval

      , resourcesPane

      , contentPanels

      , panels_audio

      , contentPanelWrapper

      , resource_params_arr;



    // define vars

    interval = ParsedClassicsVars.waitForDataTimeout;

    resource_params_arr = [];



    // find resources pane

    resourcesPane = $("#" + ParsedClassicsVars.centerPaneContainerId);



    // find in Resources pane all content panels containing audio resources

    contentPanels = resourcesPane.find("." + ParsedClassicsVars.contentPanelWrapperClass);

    panels_audio = contentPanels.filter("." + ParsedClassicsVars.resourceTypeAudio);



    // put needed params of each content panel containing audio resource into object and objects - into resource_params_arr array

    for (var i = 0; i < panels_audio.length; i++) {

      contentPanelWrapper = $(panels_audio[i]);

      resource_params_arr[i] = {};



      // get resource shortname

      resource_params_arr[i]["resource_shortname"] = contentPanelWrapper.attr("id");

      // get contents shortname

      resource_params_arr[i]["contents_shortname"] = contentPanelWrapper.attr(ParsedClassicsVars.contentsShortnameAttr);

      // put content panel wrapper el itself into params array

      resource_params_arr[i]["content_panel_wrapper"] = contentPanelWrapper;

    }



    // launch function which will wait for contents to load if needed

    ParsedClassicsData._audioResourcesLoadingTimeout(resource_params_arr, interval);

  }



  , _audioResourcesLoadingTimeout: function (resource_params_arr, interval) {

    var resource_params_arr_reduced, contents_shortname;



    // define var

    resource_params_arr_reduced = [];



    // loop through array of audio resource params

    for (var i = 0; i < resource_params_arr.length; i++) {

      contents_shortname = resource_params_arr[i]["contents_shortname"];

      // contents has been loaded?

      if (typeof window[contents_shortname] != "undefined") {

        ParsedClassicsHelpers._jumpToAudioTime(null, resource_params_arr[i]["content_panel_wrapper"], ParsedClassicsData.onloadVars.lineClass);

      }

      // contents has not been loaded? - then we must wait for them to load

      else {

        resource_params_arr_reduced.push(resource_params_arr[i]);

      }

    }



    if (resource_params_arr_reduced.length > 0) {

      setTimeout(function () { ParsedClassicsData._audioResourcesLoadingTimeout(resource_params_arr_reduced) }, interval);

    }

  }





}; // End of Object ParsedClassicsData