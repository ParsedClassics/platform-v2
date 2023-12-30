/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

ParsedClassicsCatalogue = {

  editionsList: function() {
    var catalogueContent = "";

    // compile catalogue links
    for (var key in ParsedClassicsCollectionSets) {
      catalogueContent += "<p><a target='_blank' href='collections.html#{\"" + ParsedClassicsAppVars.collectionSetMember + "\":\"" + key + "\"}'>" + ParsedClassicsCollectionSets[key].title_orig + ' / ' + ParsedClassicsCollectionSets[key].title_eng + '</a></p>';
    }

    $('#pc-site-content').append(catalogueContent);
  },

  collectionsList: function() {
    const hashJsonString = window.location.hash.replace("#", "");
    const hashJson = ParsedClassicsCatalogue.stringToJson(hashJsonString);

    //find shortname of collections set
    const collSetShortname = (typeof hashJson[ParsedClassicsAppVars.collectionSetMember] != "undefined" && hashJson[ParsedClassicsAppVars.collectionSetMember] != "") ? hashJson[ParsedClassicsAppVars.collectionSetMember] : "";

    // if there is no shortname of collections set in URL or shortname of collections set is invalid
    // then redirect to catalogue page
    if (collSetShortname == "" || typeof ParsedClassicsCollectionSets[collSetShortname] == "undefined") {
      window.location = "catalogue.html";
    }

    // find original name and English name of the collections set
    const collSetOrigTitle = collSetShortname ? ParsedClassicsCollectionSets[collSetShortname].title_orig : "";
    const collSetEngTitle = collSetShortname ? ParsedClassicsCollectionSets[collSetShortname].title_eng: "";

    //find all shortnames of the collections included in collections set
    const collectionShortnamesArray = ParsedClassicsCollectionSets[collSetShortname].collections;

    // create HTML table into which info about collections will be placed
    ParsedClassicsCatalogue.createCollectionsTable(collectionShortnamesArray, collSetOrigTitle, collSetEngTitle);
  },

  stringToJson: function (jsonString) {
    const jsonStringDecoded = decodeURIComponent(jsonString);
    let json = {};
    try {
      json = JSON.parse(jsonStringDecoded);
    } catch (err) {}
    return json;
  },

  createCollectionsTable: function(collectionShortnamesArray, collSetOrigTitle, collSetEngTitle) {
    // load needed data
    const collDataPromises = ParsedClassicsCatalogue.loadCollectionsDefs(collectionShortnamesArray);
    Promise.allSettled(collDataPromises)
      // collections data loaded successfully
      .then((values) => {
        
        let titleHTML = '<h1>' + collSetOrigTitle + ' / ' + collSetEngTitle + '</h1>';
        titleHTML += '<h2>Collections</h2>';
        let collectionsTableHTML = '<table border="0" class="w3-table">';
        const id = ParsedClassicsSiteHelpers.generateUID;
        const baseUrl = window.location.href.split('site/')[0];

        for (let i = 0; i < collectionShortnamesArray.length; i++) {
          const collectionDef = ParsedClassicsCollDefs[collectionShortnamesArray[i]];
          const resourceDefs = collectionDef['resource_defs'];
          const parsedTextResShortname = Object.keys(resourceDefs)[0];
          const url = baseUrl + `app.html#{"L":{"a":[["${collectionShortnamesArray[i]}|${parsedTextResShortname}"]],"b":[["${collectionShortnamesArray[i]}"]]},"P":{"${collectionShortnamesArray[i]}":{"line":"title"}},"D":{"a":[["${id()}",50],["${id()}",100,["${id()}"],0]],"b":[["${id()}",50],["${id()}",100,["${id()}"],0]]}}`;
          
          collectionsTableHTML += '<tr>';

          collectionsTableHTML += '<td id="' + collectionShortnamesArray[i] + '" class="pc-padding-left-0">';
          collectionsTableHTML += `<a href='${url}' target='_blank'>` + collectionDef['collections_page_title_orig'] + ' / ' + collectionDef['collections_page_title_eng'] + '</a>';
          collectionsTableHTML += '</td>';          
          collectionsTableHTML += '<td style="width: 1%;"><button id="' + collectionShortnamesArray[i] + '_button" class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey" onclick="ParsedClassicsCatalogue.toggleDetails(\'' + collectionShortnamesArray[i] +'_details\');">Details</button></td>';
          
          collectionsTableHTML += '</tr>';
          collectionsTableHTML += '<tr>';

          collectionsTableHTML += '<td id="' + collectionShortnamesArray[i] + '_details" colspan="2" style="display: none;" class="pc-padding-top-0">';  
          collectionsTableHTML += ParsedClassicsCatalogue.createAvailableResourcesListHtml(collectionDef, resourceDefs);
          collectionsTableHTML += '</td>';

          collectionsTableHTML += '</tr>';
        }

        collectionsTableHTML += '</table>';
        $('#pc-site-content').append(titleHTML + collectionsTableHTML);
      })
      // collections data loaded unsuccessfully, so display error
      .catch((error) => {
        // This catch block will not be executed
        console.error(error);
      });
  },

  loadCollectionsDefs: function(collectionsToLoad) {
    // load definitions of resouces included in collection if not yet loaded
    const baseUrl = window.location.href.split('site/')[0];
    const promises = collectionsToLoad.map((shortname) => {
      // create definitions of resouces file's url
      const url = baseUrl + ParsedClassicsAppVars.cataloguesDir + shortname + '.js';
      // get collection's definition
      const collectionDef = ParsedClassicsCollDefs[shortname];
      // are definitions of resources loaded?
      if (typeof collectionDef['resource_defs'] === 'undefined') {
        // definitions of resources not loaded, so let's load the file 
        return ParsedClassicsSiteHelpers.loadJs(url);
      }
    });
    return promises;
  },

  createAvailableResourcesListHtml: function(collectionDef, resourceDefs) { 
    let html = '';
    
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
      // is resource scanned or transcribed?
      const resScannedOrTyped = resourceDefCurr['scanned_or_typed'] === 'typed' ? 'transcribed' : resourceDefCurr['scanned_or_typed'];
      // get resource type label
      const resTypeLabel = ParsedClassicsAppVars.resourceTypeLabels[resTypeCurr];
      // get resource definition of previous resource
      const resourceDefPrev = i - 1 >= 0 ? resourceDefs[resShortnamesAll[i - 1]] : '';
      // get resource type of previous resource
      const resTypePrev = resourceDefPrev ? resourceDefPrev['resource_type'] : '';
      // create item of the list
      const itemHtml = `${resTitle}, ${resScannedOrTyped}<br>\n`;
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

  toggleDetails: function(button_id) {
    $("#" + button_id).toggle(ParsedClassicsAppVars.animationSpeed);
  }

}

