/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

/*
Displays list of shelfs and relevant links in main page of the Catalogue
*/

ParsedClassicsCatalogueMain = {

  shelfs_already_numbered: 2,

  generate: function() {

    let html = '';
    let shelf_num = ParsedClassicsCatalogueMain.shelfs_already_numbered;
    for (const shelf_key in ParsedClassicsShelfs) {
      const shelfDef = ParsedClassicsShelfs[shelf_key];
      const categoryKeyArr = shelf_key.split('--');
      const categoryArr = [];
      categoryKeyArr.forEach((category_key) => categoryArr.push(ParsedClassicsShelfCategories[category_key]));
      const empty = shelfDef['coll_sets'].length === 0 ? ' (empty)' : '';
      if (!empty) {
        shelf_num = shelf_num + 1;
        let shelf_num_roman = ParsedClassicsSiteHelpers.numberToRoman(shelf_num);
        const shelfHeading = `<h2><span class="chapter-number">${shelf_num_roman}</span>. Shelf${empty}: ${categoryArr.join(' | ')}</h2>\n\n`;
        const links = !empty ? ParsedClassicsCatalogueMain.compile_links(shelf_key) : '';
        html += shelfHeading + links;
      }
    }

    $('#pc-site-content').append(html);
  },

  compile_links: function(shelf_key) {
    const shelfDef = ParsedClassicsShelfs[shelf_key];
    const collSets = shelfDef['coll_sets'];
    const shelfLabels = shelfDef['labels'];
    const extra = shelfDef['extra'];
    const use_coll_set_labels = typeof extra['use_coll_set_labels'] !== 'undefined' ? extra['use_coll_set_labels'] : 'no';
    const shelf_categories_str = '"'+ shelf_key.replaceAll('--', '","') + '"';
    let links = `<p>○ <a href='../library.html#{"S":[${shelf_categories_str}]}'>Last saved layout</a></p>`;
    const linksObj = {};
    // Case I. We use shelf labels to construct links
    for (const label_key in shelfLabels) {
      const labelDef = shelfLabels[label_key];
      const title = typeof labelDef['title'] !== 'undefined' ? labelDef['title'] : '';
      const url = typeof labelDef['url'] !== 'undefined' ? labelDef['url'] : '';
      const parent = typeof labelDef['parent'] !== 'undefined' ? labelDef['parent'] : '';
      // (a) Url is defined for the link
      if (url && title) {
        linksObj[label_key] = {title, url, parent};
      }
      // (b) Url is not defined
      else {
        const url = `catalogue-details.html#{"shelf":[${shelf_categories_str}],"label":"${label_key}"}`;
        linksObj[label_key] = {title, url, parent};
      }
    }
    
    // Case II. We use collection set's labels to construct links
    if (use_coll_set_labels === 'yes') {
      for (const coll_set_key of collSets) {
        const collSetDef = ParsedClassicsCollectionSets[coll_set_key];
        const collSetLabels = collSetDef['labels'];
        for (const label_key in collSetLabels) {
          const labelDef = collSetLabels[label_key];
          const title = typeof labelDef['title'] !== 'undefined' ? labelDef['title'] : '';
          const url = `catalogue-details.html#{"shelf":[${shelf_categories_str}],"edition":"${coll_set_key}","label":"${label_key}"}`;
          const parent = typeof labelDef['parent'] !== 'undefined' ? labelDef['parent'] : '';
          linksObj[label_key] = {title, url, parent};
        }
      }
    }

    // create hierarchy of links 
    links += ParsedClassicsCatalogueMain.renderFlatHierarchy(linksObj);

    return links;
  },

  renderFlatHierarchy: function(data, indentSizePx = 24) {
    const tree = {};
    const roots = [];

    const isRoot = (parentKey) => !parentKey;

    // 1. Create node map
    Object.keys(data).forEach(key => {
      tree[key] = { ...data[key], key, children: [] };
    });

    // 2. Build child relationships
    Object.keys(tree).forEach(key => {
      const node = tree[key];
      const parentKey = typeof node.parent !== 'undefined' ? node.parent : null;

      if (isRoot(parentKey) || !tree[parentKey]) {
        roots.push(node);
      } else {
        tree[parentKey].children.push(node);
      }
    });

    // 3. Flatten hierarchy and calculate depth level for each item
    function flattenNodes(nodes, depth = 0) {
      let result = [];
      nodes.forEach(node => {
        result.push({ ...node, depth });
        if (node.children.length > 0) {
          result = result.concat(flattenNodes(node.children, depth + 1));
        }
      });
      return result;
    }

    const flatList = flattenNodes(roots);

    // 4. Render flat HTML elements with dynamic padding/margin based on depth
    const html = flatList.map(item => {
      const indentPx = item.depth * indentSizePx;
      return `<p style='padding-left: ${indentPx}px;'>- <a href='${item.url}'>${item.title}</a></p>\n\n`;
    }).join('');

    return html;
  },

};

/*
Displays catalogue of editions, collections and resources
or catalogue of collections and resources depending on url
*/

ParsedClassicsCatalogueDetails = {

  generate: function() {

    const hashJsonString = window.location.hash.replace("#", "");
    const hashJson = ParsedClassicsCatalogueDetails.stringToJson(hashJsonString);

    // do we have reference to collection set in url?
    const coll_set = typeof hashJson['edition'] !== 'undefined' ? hashJson['edition'] : null;

    // do we have reference to label in url?
    const label = typeof hashJson['label'] !== 'undefined' ? hashJson['label'] : null;

    // do we have reference to shelf in url?
    const shelfCategoriesUrl = typeof hashJson['shelf'] !== 'undefined' && hashJson['shelf'].length > 0 ? hashJson['shelf'] : null;

    if (coll_set && label) {
      ParsedClassicsCatalogueDetails.collectionsTable(shelfCategoriesUrl, coll_set, label);
    }
    else if (shelfCategoriesUrl && label) {
      ParsedClassicsCatalogueDetails.editionsTable(shelfCategoriesUrl, label);
    }
    else {
      const titleHTML = '<h1>Nothing found</h1>\n\n';
      const content = '<p>Probably URL address is incorrect.</p>'
      $('#pc-site-content').append(titleHTML + content);
      return;
    }

  },

  collectionsTable(shelfCategoriesUrl, coll_set, label) {
    // let's use coll set shortname and label to get label title and array of collection shortnames
    const collectionShortnamesArray = 
    typeof ParsedClassicsCollectionSets[coll_set] !== 'undefined' &&
    typeof ParsedClassicsCollectionSets[coll_set]['labels'] !== 'undefined' &&
    typeof ParsedClassicsCollectionSets[coll_set]['labels'][label] !== 'undefined' &&
    typeof ParsedClassicsCollectionSets[coll_set]['labels'][label]['collections'] !== 'undefined' ?
    ParsedClassicsCollectionSets[coll_set]['labels'][label]['collections'] : [];

    const title = 
    typeof ParsedClassicsCollectionSets[coll_set] !== 'undefined' &&
    typeof ParsedClassicsCollectionSets[coll_set]['labels'] !== 'undefined' &&
    typeof ParsedClassicsCollectionSets[coll_set]['labels'][label] !== 'undefined' &&
    typeof ParsedClassicsCollectionSets[coll_set]['labels'][label]['title'] !== 'undefined' ?
    ParsedClassicsCollectionSets[coll_set]['labels'][label]['title'] : '';

    if (collectionShortnamesArray.length === 0) {
      const titleHTML = '<h1>Nothing found</h1>\n\n';
      const content = '<p>Probably URL address is incorrect.</p>'
      $('#pc-site-content').append(titleHTML + content);
      return;
    }

    let titleHTML = '<h1>' + title + '</h1>';

    const id = ParsedClassicsSiteHelpers.generateUID;
    const baseUrl = window.location.href.split('site/')[0];

    const tableId = `collections-table-${id()}`;
    let collectionsTableHTML = `<table id="${tableId}" class="sortable-theme-light w3-table" style="table-layout: fixed;" data-sortable>`;

    collectionsTableHTML += '<thead>';
    collectionsTableHTML += '<tr>'; 
    collectionsTableHTML += '<th style="width: 15rem;">Author</th>'; 
    collectionsTableHTML += '<th>Title</th>'; 
    collectionsTableHTML += '<th style="width: 6rem;">Level</th>'; // data-sorted="true" data-sorted-direction="ascending"
    collectionsTableHTML += '<th data-sortable="false" style="width: 6rem;;">&nbsp;</th>'; 
    collectionsTableHTML += '</tr>'; 
    collectionsTableHTML += '</thead>'; 
    collectionsTableHTML += '<tbody>';

    for (let i = 0; i < collectionShortnamesArray.length; i++) {
      const collectionDef = ParsedClassicsCollDefs[collectionShortnamesArray[i]];

      const rowPairId = `pair-${id()}`;

      // find strings which should be ignored in sorting inside catalogue
      const catalogue_ignore = typeof collectionDef['catalogue_ignore'] !== 'undefined' ? collectionDef['catalogue_ignore'] : {};
      const author_ignore = typeof catalogue_ignore['author_orig_short'] !== 'undefined' ? catalogue_ignore['author_orig_short'] : false;
      const title_ignore = typeof catalogue_ignore['title_orig'] !== 'undefined' ? catalogue_ignore['title_orig'] : false;

      let author = collectionDef['author_orig_short'] && collectionDef['author_orig_short'] != collectionDef['author_eng_short'] ? collectionDef['author_orig_short'] + ' / ' + collectionDef['author_eng_short'] : collectionDef['author_orig_short'];
      author = ParsedClassicsCatalogueDetails.formatCellValue(author, author_ignore);

      let title = collectionDef['title_orig'] && collectionDef['title_orig'] != collectionDef['title_eng'] ? collectionDef['title_orig'] + ' / ' + collectionDef['title_eng'] : collectionDef['title_eng'];
      title = ParsedClassicsCatalogueDetails.formatCellValue(title, title_ignore);

      const tabId = id();
      const shelf_categories_str = '"'+ shelfCategoriesUrl.join('","') + '"';
   
      const url = baseUrl + `library.html#{"L":{"a":[["${collectionShortnamesArray[i]}|${collectionDef['central_resource']}"]],"b":[["${collectionShortnamesArray[i]}"]]},"S":[${shelf_categories_str}],"P":{"${collectionShortnamesArray[i]}":{}},"D":{"a":[["${id()}",50],["${id()}",100,["${tabId}"],0]],"b":[["${id()}",50],["${id()}",100,["${id()}"],0]]}}`;

      const link = `<a href='${url}' target='_blank'>${title}</a>`;

      let difficultyLevel = typeof collectionDef['extra'] != 'undefined' && typeof collectionDef['extra']['difficulty_level'] != 'undefined' ? collectionDef['extra']['difficulty_level'] : '';
      difficultyLevel = !Number.isNaN(difficultyLevel) ? difficultyLevel : '';

      const button = `<button class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey" onclick="ParsedClassicsCatalogueDetails.toggleLowerLevelRow('${tableId}', '${rowPairId}', '${collectionShortnamesArray[i]}')">Details</button>`;

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

      collectionsTableHTML += '<td colspan="4" style="padding: 0 8px 8px 32px;">';
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

  toggleLowerLevelRow: function(table_id, rowPairAttr, collectionShortname) {
    let secondaryRow = $(`#${table_id}`).find(`.secondary_tr[data-row-pair="${rowPairAttr}"]`);
    secondaryRow.toggle(ParsedClassicsAppVars.animationSpeed);
    if (typeof ParsedClassicsCollDefs[collectionShortname]['resource_defs'] == 'undefined') {
      const collectionShortnamesArray = [collectionShortname];
      // load needed data
      const collDataPromises = ParsedClassicsCatalogueDetails.loadCollectionsDefs(collectionShortnamesArray);
      Promise.allSettled(collDataPromises)
      // collections data loaded successfully
        .then((values) => {
          const collectionDef = ParsedClassicsCollDefs[collectionShortname];
          const resourceDefs = collectionDef['resource_defs'];
          const resourcesListHtml = ParsedClassicsCatalogueDetails.createAvailableResourcesListHtml(collectionDef, resourceDefs);
          secondaryRow.find('td').html(resourcesListHtml);
        })
        // collections data loaded unsuccessfully, so display error
        .catch((error) => {
          // This catch block will not be executed
          console.error(error);
        });
    }
  },

  editionsTable: function(shelfCategoriesUrl, label) {
    const id = ParsedClassicsSiteHelpers.generateUID;

    const tableId = `editions-table-${id()}`;
    let editionsTableHTML = `<table id="${tableId}" class="sortable-theme-light w3-table" style="table-layout: fixed;" data-sortable>`;

    editionsTableHTML += '<thead>';
    editionsTableHTML += '<tr>'; 
    editionsTableHTML += '<th style="width: 15rem;">Author/Set</th>'; 
    editionsTableHTML += '<th>Title</th>'; 
    editionsTableHTML += '<th style="width: 6rem;">Level</th>'; // data-sorted="true" data-sorted-direction="ascending"
    editionsTableHTML += '<th data-sortable="false" style="width: 6rem;">&nbsp;</th>'; 
    editionsTableHTML += '</tr>'; 
    editionsTableHTML += '</thead>'; 
    editionsTableHTML += '<tbody>';

    // let's use array of shelf categories from URL to get array of edition shortnames
    let editionShortnamesArr = [];
    let title;
    for (var key in ParsedClassicsShelfs) {
      const categories_str = key;
      const categoriesArr = categories_str.split('--');
      const sameMembers = ParsedClassicsSiteHelpers.arraysEqual(shelfCategoriesUrl, categoriesArr);
      if (sameMembers) {
        editionShortnamesArr = 
        typeof ParsedClassicsShelfs[key] !== 'undefined' &&
        typeof ParsedClassicsShelfs[key]['labels'] !== 'undefined' &&
        typeof ParsedClassicsShelfs[key]['labels'][label] !== 'undefined' &&
        typeof ParsedClassicsShelfs[key]['labels'][label]['coll_sets'] !== 'undefined' ?
        ParsedClassicsShelfs[key]['labels'][label]['coll_sets'] : [];
        title = 
        typeof ParsedClassicsShelfs[key] !== 'undefined' &&
        typeof ParsedClassicsShelfs[key]['labels'] !== 'undefined' &&
        typeof ParsedClassicsShelfs[key]['labels'][label] !== 'undefined' &&
        typeof ParsedClassicsShelfs[key]['labels'][label]['title'] !== 'undefined' ?
        ParsedClassicsShelfs[key]['labels'][label]['title'] : '';
        break;
      }
    }

    if (editionShortnamesArr.length === 0) {
      const titleHTML = '<h1>Nothing found</h1>\n\n';
      const content = '<p>Probably URL address is incorrect.</p>'
      $('#pc-site-content').append(titleHTML + content);
      return;
    }

    for (var key of editionShortnamesArr) {
      const editionShortname = key;
      const editionDef = ParsedClassicsCollectionSets[key];
      const rowPairId = `pair-${id()}`;

      // find strings which should be ignored in sorting inside catalogue
      const catalogue_ignore = typeof editionDef['catalogue_ignore'] !== 'undefined' ? editionDef['catalogue_ignore'] : {};
      const author_ignore = typeof catalogue_ignore['author_orig'] !== 'undefined' ? catalogue_ignore['author_orig'] : false;
      const title_ignore = typeof catalogue_ignore['title_orig'] !== 'undefined' ? catalogue_ignore['title_orig'] : false;

      let author = editionDef['author_orig'];
      author = ParsedClassicsCatalogueDetails.formatCellValue(author, author_ignore);

      let title = editionDef['title_orig'];
      title = ParsedClassicsCatalogueDetails.formatCellValue(title, title_ignore);

      //const url = 'url';
      //const link = `<a href='${url}' target='_blank'>${title}</a>`;
      let difficultyLevel = typeof editionDef['extra'] != 'undefined' && typeof editionDef['extra']['difficulty_level'] != 'undefined' ? editionDef['extra']['difficulty_level'] : '';
      difficultyLevel = !Number.isNaN(difficultyLevel) ? difficultyLevel : '';
      const shelf_categories_str = "'" + shelfCategoriesUrl.join("','") + "'";
      const button = `<button class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey" onclick="ParsedClassicsCatalogueDetails.toggleSecondaryRow('${tableId}', '${rowPairId}', [${shelf_categories_str}], '${editionShortname}')">Details</button>`;

      editionsTableHTML += `<tr class="primary_tr" data-row-pair="${rowPairId}">`;

      editionsTableHTML += '<td>';
      editionsTableHTML += author;
      editionsTableHTML += '</td>';

      editionsTableHTML += '<td>';
      editionsTableHTML += title;
      editionsTableHTML += '</td>';

      editionsTableHTML += '<td>';
      editionsTableHTML += difficultyLevel;
      editionsTableHTML += '</td>';

      editionsTableHTML += '<td>';
      editionsTableHTML += button;
      editionsTableHTML += '</td>';

      editionsTableHTML += '</tr>';

      editionsTableHTML += `<tr class="secondary_tr pc-hide" data-row-pair="${rowPairId}">`;
      editionsTableHTML += '<td colspan="4" style="padding: 0 0 0 32px;">';
      editionsTableHTML += '<p style="text-align: center;"><img src="./img/ajax-loader.gif"></p>';
      //editionsTableHTML += difficultyLevel;
      editionsTableHTML += '</td>';
      editionsTableHTML += '</tr>';
    }

    editionsTableHTML += '</tbody>';
    editionsTableHTML += '</table>';

    const titleHtml = `<h1>${title}</h1>`;

    $('#pc-site-content').append(titleHtml + editionsTableHTML);

    // initialize sortable tables
    sortableTable.init();
  },

  formatCellValue: function(value, ignore_string) {
    value = value.trim();
    if (!value) {
      return '';
    }
    ignore_string = ignore_string ? ignore_string.trim() : '';
    if (ignore_string) {
      // length of the string to be ignored
      const ignore_str_len = ignore_string.length;
      // get string left after removing part to be ignored
      let value_without_ignore_str = value.substring(ignore_str_len);

      // find position of the first non space character in string left after removing part to be ignored
      const first_non_space_pos = value_without_ignore_str.match(/\S/)?.index ?? -1;

      // get first non space char
      const first_non_space_char = first_non_space_pos !== -1 ? value_without_ignore_str[first_non_space_pos] : false;

      // make first non space char bold
      value_without_ignore_str = value_without_ignore_str.substring(0, first_non_space_pos) + `<strong>${first_non_space_char}</strong>` + value_without_ignore_str.substring(first_non_space_pos+1);

      // wrap with <span> elenent the string to be ignored
      const ignore_html = `<span class="ignore">${ignore_string}</span>`;

      // get result string
      value = ignore_html + value_without_ignore_str;  
    }
    else {
      // get first non space char
      const first_non_space_char = value[0];
      // make first non space char bold
      value = `<strong>${first_non_space_char}</strong>` + value.substring(1);
    }
    return value;
  },

  toggleSecondaryRow: async function(table_id, rowPairAttr,shelfCategoriesUrl, editionShortname) {
    let secondaryRow = $(`#${table_id}`).find(`.secondary_tr[data-row-pair="${rowPairAttr}"]`);
    secondaryRow.toggle(ParsedClassicsAppVars.animationSpeed);
    const collListHtml = await ParsedClassicsCatalogueDetails.collectionsList(shelfCategoriesUrl, editionShortname);
    secondaryRow.find('td').html(collListHtml);
  },

  collectionsList: async function(shelfCategoriesUrl, collSetShortname) {

    // if there is no shortname of collections set or shortname of collections set is invalid
    // then there is nothing to do
    if (collSetShortname == "" || typeof ParsedClassicsCollectionSets[collSetShortname] == "undefined") {
      return;
    }

    // find original name and English name of the collections set
    const collSetOrigTitle = collSetShortname ? ParsedClassicsCollectionSets[collSetShortname].title_orig : "";
    const collSetEngTitle = collSetShortname ? ParsedClassicsCollectionSets[collSetShortname].title_eng: "";

    //find all shortnames of the collections included in collections set
    const collectionShortnamesArray = ParsedClassicsCollectionSets[collSetShortname].collections;

    // create HTML table into which info about collections will be placed
    const collListHtml = await ParsedClassicsCatalogueDetails.createCollectionsTable(shelfCategoriesUrl, collectionShortnamesArray, collSetOrigTitle, collSetEngTitle);

    return collListHtml;
  },

  stringToJson: function (jsonString) {
    const jsonStringDecoded = decodeURIComponent(jsonString);
    let json = {};
    try {
      json = JSON.parse(jsonStringDecoded);
    } catch (err) {}
    return json;
  },

  createCollectionsTable: async function(shelfCategoriesUrl, collectionShortnamesArray, collSetOrigTitle, collSetEngTitle) {   
    // load needed data
    const collDataPromises = ParsedClassicsCatalogueDetails.loadCollectionsDefs(collectionShortnamesArray);
    await Promise.allSettled(collDataPromises)
      // collections data loaded successfully
      .then((values) => {
      })
      // collections data loaded unsuccessfully, so display error
      .catch((error) => {
        // This catch block will not be executed
        console.error(error);
      });
      let titleHTML = '';
      //titleHTML += '<h1>' + collSetOrigTitle + ' / ' + collSetEngTitle + '</h1>';
      //titleHTML += '<h2>Collections</h2>';
      let collectionsTableHTML = '<table border="0" class="w3-table" style="table-layout: fixed;">';
      const id = ParsedClassicsSiteHelpers.generateUID;
      const baseUrl = window.location.href.split('site/')[0];

      for (let i = 0; i < collectionShortnamesArray.length; i++) {
        const collectionDef = ParsedClassicsCollDefs[collectionShortnamesArray[i]];
        const resourceDefs = collectionDef['resource_defs'];
        const parsedTextResShortname = Object.keys(resourceDefs)[0];
        const contents_type = collectionDef['contents_type'];
        let collTitle = collectionDef['title_orig'];
        //collTitle += collectionDef['title_eng'];
        const shelf_categories_str = '"'+ shelfCategoriesUrl.join('","') + '"';
        const url = baseUrl + `library.html#{"L":{"a":[["${collectionShortnamesArray[i]}|${parsedTextResShortname}"]],"b":[["${collectionShortnamesArray[i]}"]]},"S":[${shelf_categories_str}],"P":{"${collectionShortnamesArray[i]}":{"${contents_type}":"title"}},"D":{"a":[["${id()}",50],["${id()}",100,["${id()}"],0]],"b":[["${id()}",50],["${id()}",100,["${id()}"],0]]}}`;
        
        collectionsTableHTML += '<tr>';

        collectionsTableHTML += '<td id="' + collectionShortnamesArray[i] + '" class="pc-padding-left-0">';
        collectionsTableHTML += `<a href='${url}' target='_blank'>` + collTitle + '</a>';
        collectionsTableHTML += '</td>';          
        collectionsTableHTML += '<td style="width: 6rem;"><button id="' + collectionShortnamesArray[i] + '_button" class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey" onclick="ParsedClassicsCatalogueDetails.toggleDetails(\'' + collectionShortnamesArray[i] +'_details\');">Details</button></td>';
        
        collectionsTableHTML += '</tr>';
        collectionsTableHTML += '<tr>';

        collectionsTableHTML += '<td id="' + collectionShortnamesArray[i] + '_details" colspan="2" style="display: none;" class="pc-padding-top-0">';  
        collectionsTableHTML += ParsedClassicsCatalogueDetails.createAvailableResourcesListHtml(collectionDef, resourceDefs);
        collectionsTableHTML += '</td>';

        collectionsTableHTML += '</tr>';
      }

      collectionsTableHTML += '</table>';

      return titleHTML + collectionsTableHTML;
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

};
