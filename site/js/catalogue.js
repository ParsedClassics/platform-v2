/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

/*
Displays catalogue of Classics editions, collections and resources
*/

ParsedClassicsCatalogue = {

  editionsList: function() {
      
    // file containing definitions of editions
    const fileName = '_sets_classics.js';
    const baseUrl = window.location.href.split('site/')[0];
    // url of the file containing definitions of editions
    const url = baseUrl + ParsedClassicsAppVars.cataloguesDir + fileName;

    // load definitions of editions
    const editionsPromises = [ParsedClassicsSiteHelpers.loadJs(url)];
    Promise.allSettled(editionsPromises)
      // definitions of editions successfully
      .then((values) => {

        let catalogueContent = "<h2>Classics</h2>";
        //catalogueContent += "<h3>Editions</h3>";
        catalogueContent += "<p><a target='_blank' href='../classics.html'>Last saved layout</a></p>";

        // compile catalogue links
        for (var key in ParsedClassicsCollectionSets) {
          catalogueContent += "<p><a target='_blank' href='collections-classics.html#{\"" + ParsedClassicsAppVars.collectionSetMember + "\":\"" + key + "\"}'>" + ParsedClassicsCollectionSets[key].title_orig + ' / ' + ParsedClassicsCollectionSets[key].title_eng + '</a></p>';
        }

        $('#pc-site-content').append(catalogueContent);

      })
      // definitions of editions loaded unsuccessfully, so display error
      .catch((error) => {
        // This catch block will not be executed
        console.error(error);
      });

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
          const url = baseUrl + `classics.html#{"L":{"a":[["${collectionShortnamesArray[i]}|${parsedTextResShortname}"]],"b":[["${collectionShortnamesArray[i]}"]]},"P":{"${collectionShortnamesArray[i]}":{"line":"title"}},"D":{"a":[["${id()}",50],["${id()}",100,["${id()}"],0]],"b":[["${id()}",50],["${id()}",100,["${id()}"],0]]}}`;
          
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
          html += '<div class="pc-padding-bottom-16 pc-width-100">\n';
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

/*
Displays catalogue of Readers editions, collections and resources
*/

ParsedClassicsReadersCatalogue = {

  editionsList: function() {

    // file containing definitions of editions
    const fileName = '_sets_readers.js';

    const baseUrl = window.location.href.split('site/')[0];
    // url of the file containing definitions of editions
    const url = baseUrl + ParsedClassicsAppVars.cataloguesDir + fileName;

    // load definitions of editions
    const editionsPromises = [ParsedClassicsSiteHelpers.loadJs(url)];
    Promise.allSettled(editionsPromises)
      // definitions of editions successfully
      .then((values) => {
        let catalogueContent = "<h2>Readers</h2>";
        //catalogueContent += "<h3>Editions</h3>";
        catalogueContent += "<p><a target='_blank' href='../readers.html'>Last saved layout</a></p>";

        // compile catalogue links
        for (var key in ParsedClassicsCollectionSets) {
          if (ParsedClassicsCollectionSets[key]['collections'].length > 0) {
            const title = ParsedClassicsCollectionSets[key].title_orig && ParsedClassicsCollectionSets[key].title_orig != ParsedClassicsCollectionSets[key].title_eng ? ParsedClassicsCollectionSets[key].title_orig + ' / ' + ParsedClassicsCollectionSets[key].title_eng : ParsedClassicsCollectionSets[key].title_orig;
            catalogueContent += "<p><a target='_blank' href='collections-readers.html#{\"" + ParsedClassicsAppVars.collectionSetMember + "\":\"" + key + "\"}'>" + title + '</a></p>';
          }
        }

        $('#pc-site-content').append(catalogueContent);

      })
      // definitions of editions loaded unsuccessfully, so display error
      .catch((error) => {
        // This catch block will not be executed
        console.error(error);
      });
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

    // find English name of the collections set
    const collSetEngTitle = collSetShortname ? ParsedClassicsCollectionSets[collSetShortname].title_eng: "";

    //find all shortnames of the collections included in collections set
    const collectionShortnamesArray = ParsedClassicsCollectionSets[collSetShortname].collections;

    // create HTML table into which info about collections will be placed
    ParsedClassicsReadersCatalogue.createCollectionsTable(collectionShortnamesArray, collSetEngTitle);
  },

  createCollectionsTable: function(collectionShortnamesArray, collSetEngTitle) {
    let titleHTML = '<h1>' + collSetEngTitle + '</h1>';
    //titleHTML += '<h2>Collections</h2>';

    const id = ParsedClassicsSiteHelpers.generateUID;
    const baseUrl = window.location.href.split('site/')[0];

    const tableId = `collections-table-${id()}`;
    let collectionsTableHTML = `<table id="${tableId}" class="sortable-theme-light w3-table" data-sortable>`;
    
    collectionsTableHTML += '<thead>';
    collectionsTableHTML += '<tr>'; 
    collectionsTableHTML += '<th>Author</th>'; 
    collectionsTableHTML += '<th>Title</th>'; 
    collectionsTableHTML += '<th data-sorted="true" data-sorted-direction="ascending" style="width: 7rem;">Level</th>'; 
    collectionsTableHTML += '<th data-sortable="false" style="width: 1%;">&nbsp;</th>'; 
    collectionsTableHTML += '</tr>'; 
    collectionsTableHTML += '</thead>'; 
    collectionsTableHTML += '<tbody>';
    
    for (let i = 0; i < collectionShortnamesArray.length; i++) {
      const collectionDef = ParsedClassicsCollDefs[collectionShortnamesArray[i]];

      const rowPairId = `pair-${id()}`;

      const author = collectionDef['author_orig_short'] && collectionDef['author_orig_short'] != collectionDef['author_eng_short'] ? collectionDef['author_orig_short'] + ' / ' + collectionDef['author_eng_short'] : collectionDef['author_orig_short'];

      const title = collectionDef['collections_page_title_orig'] && collectionDef['collections_page_title_orig'] != collectionDef['collections_page_title_eng'] ? collectionDef['collections_page_title_orig'] + ' / ' + collectionDef['collections_page_title_eng'] : collectionDef['collections_page_title_eng'];

      const tabId = id();
   
      const url = baseUrl + `readers.html#{"L":{"a":[["${collectionShortnamesArray[i]}|${collectionDef['central_resource']}"]],"b":[["${collectionShortnamesArray[i]}"]]},"P":{"${collectionShortnamesArray[i]}":{}},"D":{"a":[["${id()}",50],["${id()}",100,["${tabId}"],0]],"b":[["${id()}",50],["${id()}",100,["${id()}"],0]]}}`;

      const link = `<a href='${url}' target='_blank'>${title}</a>`;

      let difficultyLevel = typeof collectionDef['extra'] != 'undefined' && typeof collectionDef['extra']['difficulty_level'] != 'undefined' ? collectionDef['extra']['difficulty_level'] : '';
      difficultyLevel = !Number.isNaN(difficultyLevel) ? difficultyLevel : '';

      const button = `<button class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey" onclick="ParsedClassicsReadersCatalogue.toggleSecondaryRow('${tableId}', '${rowPairId}', '${collectionShortnamesArray[i]}')">Details</button>`;

      collectionsTableHTML += `<tr class="primary_tr" data-row-pair="${rowPairId}">`;

      collectionsTableHTML += '<td>';
      collectionsTableHTML += author;
      collectionsTableHTML += '</td>';

      collectionsTableHTML += '<td>';
      collectionsTableHTML += link;
      collectionsTableHTML += '</td>';

      collectionsTableHTML += '<td>';
      collectionsTableHTML += difficultyLevel;
      collectionsTableHTML += '</td>';

      collectionsTableHTML += '<td>';
      collectionsTableHTML += button;
      collectionsTableHTML += '</td>';

      collectionsTableHTML += '</tr>';

      collectionsTableHTML += `<tr class="secondary_tr pc-hide" data-row-pair="${rowPairId}">`;

      collectionsTableHTML += '<td colspan="4" style="padding-left: 32px;">';
      collectionsTableHTML += '<p style="text-align: center;"><img src="./img/ajax-loader.gif"></p>';
      //collectionsTableHTML += difficultyLevel;
      collectionsTableHTML += '</td>';

      collectionsTableHTML += '</tr>';
    }

    collectionsTableHTML += '</tbody>';
    collectionsTableHTML += '</table>';
    $('#pc-site-content').append(titleHTML + collectionsTableHTML);

    // initialize sortable tables
    sortableTable.init();
  },

  toggleSecondaryRow: function(table_id, rowPairAttr, collectionShortname) {
    let secondaryRow = $(`#${table_id}`).find(`.secondary_tr[data-row-pair="${rowPairAttr}"]`);
    secondaryRow.toggle(ParsedClassicsAppVars.animationSpeed);
    if (typeof ParsedClassicsCollDefs[collectionShortname]['resource_defs'] == 'undefined') {
      const collectionShortnamesArray = [collectionShortname];
      // load needed data
      const collDataPromises = ParsedClassicsCatalogue.loadCollectionsDefs(collectionShortnamesArray);
      Promise.allSettled(collDataPromises)
      // collections data loaded successfully
        .then((values) => {
          const collectionDef = ParsedClassicsCollDefs[collectionShortname];
          const resourceDefs = collectionDef['resource_defs'];
          const resourcesListHtml = ParsedClassicsCatalogue.createAvailableResourcesListHtml(collectionDef, resourceDefs);
          secondaryRow.find('td').html(resourcesListHtml);
        })
        // collections data loaded unsuccessfully, so display error
        .catch((error) => {
          // This catch block will not be executed
          console.error(error);
        });
    }
  }

}

ParsedClassicsLexiconsCatalogue = {
  
  collectionsList: function() {

    // file containing definitions of editions
    const fileName = '_sets_lexicons.js';

    const baseUrl = window.location.href.split('site/')[0];
    // url of the file containing definitions of editions
    const url = baseUrl + ParsedClassicsAppVars.cataloguesDir + fileName;

    // load definitions of editions
    const editionsPromises = [ParsedClassicsSiteHelpers.loadJs(url)];
    Promise.allSettled(editionsPromises)
      // definitions of editions successfully
      .then((values) => {
        let catalogueContent = "<h2>Lexicons</h2>";
        //catalogueContent += "<h3>Editions</h3>";
        catalogueContent += "<p><a target='_blank' href='../lexicons.html'>Last saved layout</a></p>";

        // compile catalogue links
        for (const set_shortname in ParsedClassicsCollectionSets) {
          for (const i in ParsedClassicsCollectionSets[set_shortname]['collections']) {
            const coll_shortname = ParsedClassicsCollectionSets[set_shortname]['collections'][i]; 
            const collDef = ParsedClassicsCollDefs[coll_shortname];
            const title = collDef['collection_selectboxname'];
            catalogueContent += "<p><a target='_blank' href='resources-lexicons.html#{\"" + ParsedClassicsAppVars.collectionMember + "\":\"" + coll_shortname + "\"}'>" + title + '</a></p>';
          }
        }

        $('#pc-site-content').append(catalogueContent);

      })
      // definitions of editions loaded unsuccessfully, so display error
      .catch((error) => {
        // This catch block will not be executed
        console.error(error);
      });
  },

  resourcesList: function() {
    const hashJsonString = window.location.hash.replace("#", "");
    const hashJson = ParsedClassicsCatalogue.stringToJson(hashJsonString);

    //find shortname of collection
    const coll_shortname = (typeof hashJson[ParsedClassicsAppVars.collectionMember] != "undefined" && hashJson[ParsedClassicsAppVars.collectionMember] != "") ? hashJson[ParsedClassicsAppVars.collectionMember] : "";

    // if there is no shortname of collection in URL or shortname of collection is invalid
    // then redirect to catalogue page
    if (coll_shortname == "" || typeof ParsedClassicsCollDefs[coll_shortname] == "undefined") {
      window.location = "catalogue.html";
    }

    // find English title of the collection
    const collEngTitle = coll_shortname ? ParsedClassicsCollDefs[coll_shortname].collections_page_title_eng : "";

    // create HTML table into which info about resources will be placed
    ParsedClassicsLexiconsCatalogue.createResourcesTable(coll_shortname, collEngTitle);

  },

  createResourcesTable: function(coll_shortname, collEngTitle) {
    let titleHTML = '<h1>' + collEngTitle + '</h1>';
    //titleHTML += '<h2>Resources</h2>';

    const id = ParsedClassicsSiteHelpers.generateUID;
    const baseUrl = window.location.href.split('site/')[0];

    // get collection's definition
    const collDataPromise = ParsedClassicsCatalogue.loadCollectionsDefs([coll_shortname]);
    Promise.allSettled(collDataPromise)
      // collection's data loaded successfully
      .then((values) => {
        const resDefs = ParsedClassicsCollDefs[coll_shortname].resource_defs;

        const tableId = `collections-table-${id()}`;
        let collectionsTableHTML = `<table id="${tableId}" class="sortable-theme-light w3-table" data-sortable>`;
        
        collectionsTableHTML += '<thead>';
        collectionsTableHTML += '<tr>'; 
        collectionsTableHTML += '<th>Author</th>'; 
        collectionsTableHTML += '<th>Title</th>'; 
        collectionsTableHTML += '<th data-sorted="true" data-sorted-direction="ascending" style="width: 7rem;">Level</th>'; 
        collectionsTableHTML += '<th data-sortable="false" style="width: 1%;">&nbsp;</th>'; 
        collectionsTableHTML += '</tr>'; 
        collectionsTableHTML += '</thead>'; 
        collectionsTableHTML += '<tbody>';

        const res_shortnames_arr = Object.keys(resDefs);
        for (let i = 0; i < res_shortnames_arr.length; i++) {
          const res_shortname = res_shortnames_arr[i];
          const resource = resDefs[res_shortname];

          const rowPairId = `pair-${id()}`;

          const author = typeof resource['collections_page_resource_author'] != 'undefined' ? resource['collections_page_resource_author'] : '';

          const title = resource['collections_page_resource_desc'];
          
          const tabId = id();
          const url = baseUrl + `lexicons.html#{"L":{"a":[["${coll_shortname}|${res_shortname}"]],"b":[["${coll_shortname}"]]},"P":{"${coll_shortname}":{}},"D":{"a":[["${id()}",50],["${id()}",100,["${tabId}"],0]],"b":[["${id()}",50],["${id()}",100,["${id()}"],0]]}}`;

          const link = `<a href='${url}' target='_blank'>${title}</a>`;

          let difficultyLevel = typeof resource['extra'] != 'undefined' && typeof resource['extra']['difficulty_level'] != 'undefined' ? resource['extra']['difficulty_level'] : '';
          difficultyLevel = !Number.isNaN(difficultyLevel) ? difficultyLevel : '';

          const button = `<button class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey" onclick="ParsedClassicsLexiconsCatalogue.toggleSecondaryRow('${tableId}', '${rowPairId}', '${coll_shortname}', '${res_shortname}')">Details</button>`;

          collectionsTableHTML += `<tr class="primary_tr" data-row-pair="${rowPairId}">`;

          collectionsTableHTML += '<td>';
          collectionsTableHTML += author;
          collectionsTableHTML += '</td>';

          collectionsTableHTML += '<td>';
          collectionsTableHTML += link;
          collectionsTableHTML += '</td>';

          collectionsTableHTML += '<td>';
          collectionsTableHTML += difficultyLevel;
          collectionsTableHTML += '</td>';

          collectionsTableHTML += '<td>';
          collectionsTableHTML += button;
          collectionsTableHTML += '</td>';

          collectionsTableHTML += '</tr>';

          collectionsTableHTML += `<tr class="secondary_tr pc-hide" data-row-pair="${rowPairId}">`;

          collectionsTableHTML += '<td colspan="4" style="padding-left: 32px;">';
          collectionsTableHTML += '<p style="text-align: center;"><img src="./img/ajax-loader.gif"></p>';
          //collectionsTableHTML += difficultyLevel;
          collectionsTableHTML += '</td>';

          collectionsTableHTML += '</tr>';
        }

        collectionsTableHTML += '</tbody>';
        collectionsTableHTML += '</table>';
        $('#pc-site-content').append(titleHTML + collectionsTableHTML);

        // initialize sortable tables
        sortableTable.init();
      })
      // collection's data loaded unsuccessfully, so display error
      .catch((error) => {
        // This catch block will not be executed
        console.error(error);
      });
  },

  toggleSecondaryRow: function(tableId, rowPairAttr, coll_shortname, res_shortname) {
    let secondaryRow = $(`#${tableId}`).find(`.secondary_tr[data-row-pair="${rowPairAttr}"]`);
    secondaryRow.toggle(ParsedClassicsAppVars.animationSpeed);
    const resDef = ParsedClassicsCollDefs[coll_shortname].resource_defs[res_shortname];
    const text_from = resDef['library_app_panel_text_from'];
    secondaryRow.find('td').html(text_from);
  },

}
