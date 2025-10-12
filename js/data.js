/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

ParsedClassicsData = {
  
  // from https://www.educative.io/answers/how-to-dynamically-load-a-js-file-in-javascript
  // Use:
  // loadJs("file1_url")
  //   .then( data  => {
  //       console.info("Script loaded successfully", data);
  //   })
  //   .catch( err => {
  //       console.error(err);
  //   });
  loadJs: function(FILE_URL, async = false, type = "text/javascript") {
    return new Promise((resolve, reject) => {
        try {
            const scriptEle = document.createElement("script");
            scriptEle.type = type;
            scriptEle.async = async;
            scriptEle.src =FILE_URL;

            scriptEle.addEventListener("load", (ev) => {
                resolve({ status: true });
            });

            scriptEle.addEventListener("error", (ev) => {
                reject({
                    status: false,
                    message: `Failed to load the script ＄{FILE_URL}`
                });
            });

            document.head.appendChild(scriptEle);
        } catch (error) {
            reject(error);
        }
    });
  },
  
  findDataToLoad: function(layoutObj) {
    // init vars
    const collectionsToLoad = [];
    const resourcesToLoad = [];

    // get array of collection|resource shortname pairs from URL
    let collResShortnamePairs = Object.values(layoutObj);
    // flatten array of collection|resource shortname pairs
    collResShortnamePairs = collResShortnamePairs.flat(2);
    // remove duplicate values from array of collection|resource shortname pairs
    collResShortnamePairs = [...new Set(collResShortnamePairs)];

    // loop through array of collection|resource shortname pairs
    for (let i = 0; i < collResShortnamePairs.length; i++) {
      // get collection shortname
      const collectionShortname = collResShortnamePairs[i].split('|')[0];
      // get collection definition
      const collectionDef = ParsedClassicsCollDefs[collectionShortname];
      // get collection shortnames whose resources or contents are undefined and which is not already found as such
      if ((typeof collectionDef['resource_defs'] === 'undefined' || collectionDef['contents'] === 'undefined') && !collectionsToLoad.includes(collectionShortname)) {
        collectionsToLoad.push(collectionShortname);
      }

      // get resource shortname
      const resourceShortname = collResShortnamePairs[i].split('|')[1] ?? null;
      if (resourceShortname) {
        // was collection's definition loaded?
        if (typeof APP.loadedResourcesData[collectionShortname] === 'undefined') {
          // collection's definition should be loaded
          resourcesToLoad.push(collResShortnamePairs[i]);
        }
        else {
          // get laded resources data of current collection
          const loadedCollResources = APP.loadedResourcesData[collectionShortname];
          // was resource's data loaded?
          if (typeof loadedCollResources[resourceShortname] === 'undefined') {
            // resouce's data should be loaded
            resourcesToLoad.push(collResShortnamePairs[i]);
          }
        }
      }
    }

    return {collectionsToLoad, resourcesToLoad};
  },

  loadCollectionsDefs: function(collectionsToLoad) {
    // load definitions of resouces included in collection if not yet loaded
    const baseUrl = window.location.href.split(ParsedClassicsAppVars.rootFileName)[0];
    const promises = collectionsToLoad.map((shortname) => {
      // create definitions of resouces file's url
      const url = baseUrl + ParsedClassicsAppVars.cataloguesDir + shortname + '.js';
      // get collection's definition
      const collectionDef = ParsedClassicsCollDefs[shortname];
      // are definitions of resources loaded?
      if (typeof collectionDef['resource_defs'] === 'undefined') {
        // definitions of resources not loaded, so let's load the file 
        return ParsedClassicsData.loadJs(url);
      }
    });
    return promises;
  },

  loadResourcesData: function(resourcesToLoad, collectionsToLoad) {
    // base directory depends on type of the resource
    const baseUrl = window.location.href.split(ParsedClassicsAppVars.rootFileName)[0];
    const resTypeDir = {
      parsed_text: ParsedClassicsAppVars.parsedTextDir,
      original_text: ParsedClassicsAppVars.originalTextDir,
      concordance: ParsedClassicsAppVars.concordanceDir,
      lexicon: ParsedClassicsAppVars.lexiconDir,
      translation: ParsedClassicsAppVars.translationDir,
      commentary: ParsedClassicsAppVars.commentaryDir,
      commentary_refs: ParsedClassicsAppVars.commentaryRefsDir,
      grammar_refs: ParsedClassicsAppVars.grammarRefsDir,
      diagram_set: ParsedClassicsAppVars.diagramSetDir,
      audio_recording: ParsedClassicsAppVars.audioRecordingDir,
      reader: ParsedClassicsAppVars.readerDir,
      info_text: ParsedClassicsAppVars.infoTextDir,
    };

    // get resources of the type "parsed_text" which are the the firsts in their respective collections
    const firstParsedTextResources = ParsedClassicsData.findFirstParsedTextResources(collectionsToLoad);
    // push such resources into resources to load array, if not already there
    firstParsedTextResources.forEach(collResPair => {
      if (!resourcesToLoad.includes(collResPair)) {
        resourcesToLoad.push(collResPair);
      }
    });

    const promises = [];
    resourcesToLoad.forEach(collResPair => {
      // get collection shortname
      const collectionShortname = collResPair.split('|')[0];
      // get resource shortname
      const resourceShortname = collResPair.split('|')[1] ?? null;
      if (resourceShortname) {
        // get collection's definition
        const collectionDef = ParsedClassicsCollDefs[collectionShortname];
        // get definitions of the resources of current collection
        const resourceDefsAll = collectionDef['resource_defs'];
        // get definition of current resource
        const resourceDef = resourceDefsAll[resourceShortname];
        // get resource type of current rersource
        const resourceType = resourceDef['resource_type'];
        // get contents shortname
        const contentsShortname = resourceDef['contents_shortname'];
        // is resource scanned or typed?
        const scannedOrTyped = resourceDef['scanned_or_typed'];
        // create url of the contents file of the resource
        if (contentsShortname) {
          const contentFileUrl = baseUrl + resTypeDir[resourceType] + resourceShortname + '/' + contentsShortname + '.js';
          promises.push(ParsedClassicsData.loadJs(contentFileUrl));
        }
        if (scannedOrTyped === 'typed') {
          const dataFileUrl = baseUrl + resTypeDir[resourceType] + resourceShortname + '/' + resourceShortname + '.js';
          promises.push(ParsedClassicsData.loadJs(dataFileUrl));
        }
      }
    });
    return promises;
  },

  findFirstParsedTextResources: function(collectionsToLoad) {
    const firstParsedTextResources = [];
    collectionsToLoad.forEach(collectionShortname => {
      // get collection's definition
      const collectionDef = ParsedClassicsCollDefs[collectionShortname];
      // get definitions of the resources of current collection
      const resourceDefsAll = collectionDef['resource_defs'];
      for (let resourceShortname in resourceDefsAll) {
        const resourceDef = resourceDefsAll[resourceShortname];
        if (resourceDef['resource_type'] === 'parsed_text') {
          firstParsedTextResources.push(`${collectionShortname}|${resourceShortname}`);
          break;
        }
      }
    });
    return firstParsedTextResources;
  },
  
  appendLoadedResourceData: function(resourcesToLoad, collectionsToLoad) {
    resourcesToLoad.forEach(collResPair => {
      // get collection shortname
      const collectionShortname = collResPair.split('|')[0];
      // get resource shortname
      const resourceShortname = collResPair.split('|')[1] ?? null;
      if (resourceShortname) {
        // get collection's definition
        const collectionDef = ParsedClassicsCollDefs[collectionShortname];
        // get definitions of the resources of current collection
        const resourceDefsAll = collectionDef['resource_defs'];
        // get definition of current resource
        const resourceDef = resourceDefsAll[resourceShortname];
        // get contents shortname of the resource
        const contentsShortname = resourceDef['contents_shortname'];
        // is resource scanned or typed?
        const scannedOrTyped = resourceDef['scanned_or_typed'];
        // check if there is key for current collection
        if (typeof APP.loadedResourcesData[collectionShortname] === 'undefined') {
          // create key
          APP.loadedResourcesData[collectionShortname] = {};
        }
        // save reference in variable
        const resourceDataOfCollection = APP.loadedResourcesData[collectionShortname];
        // create key for current resource
        resourceDataOfCollection[resourceShortname] = {};
        // save reference in variable
        const resourceData = resourceDataOfCollection[resourceShortname];
        // has resource contents?
        if (contentsShortname) {
          // append contents
          resourceData['contents'] = window[contentsShortname];
          // delete global variable in which contents were contained
          delete window[contentsShortname];
        }
        // is resource typed?
        if (scannedOrTyped === 'typed') {
          // append data
          resourceData['data'] = window[resourceShortname];
          // delete global variable in which data were contained
          delete window[resourceShortname];
        }
      }
    });

    // get resources of the type "parsed_text" which are the the firsts in their respective collections
    const firstParsedTextResources = ParsedClassicsData.findFirstParsedTextResources(collectionsToLoad);
    // append contents of each of such resource to the definition of relevant collection
    firstParsedTextResources.forEach(collResPair => {
      // get collection shortname
      const collectionShortname = collResPair.split('|')[0];
      // get resource shortname
      const resourceShortname = collResPair.split('|')[1];
      // get loaded resources data for current collection
      const loadedResDataOfCollection = APP.loadedResourcesData[collectionShortname];
      // get loaded data of current resouce
      const loadedDataOfResource = loadedResDataOfCollection[resourceShortname];
      // get contents of the resource
      const resourceContents = loadedDataOfResource['contents'];
      // get collection's definition
      const collectionDef = ParsedClassicsCollDefs[collectionShortname];
      // append contents to collection's definition
      collectionDef['contents'] = resourceContents;
    });
    
  },

  findDataToUnLoad: function(layoutObj) {
    // get array of collection shortnames from URL
    // so, first get array of collection|resource shortname pairs from URL
    let collResShortnamePairs = Object.values(layoutObj);
    // flatten array of collection|resource shortname pairs
    collResShortnamePairs = collResShortnamePairs.flat(2);
    // get array of collection shortnames from URL
    let collectionShortnamesFromUrl = collResShortnamePairs.map(shotnamePair => {
      return collectionShortname = shotnamePair.split('|')[0];
    });
    // remove duplicate values
    collectionShortnamesFromUrl = [...new Set(collectionShortnamesFromUrl)];

    // get array of collection shortnames from loadedResourcesData object
    const collectionShortnamesFromObj = Object.keys(APP.loadedResourcesData);

    // get shortnames of collections which should be unloaded
    const collectionsToUnload = collectionShortnamesFromObj.filter(shortname => !collectionShortnamesFromUrl.includes(shortname));

    // get array of collection|resource shortname pairs from URL
    let collResShortnamePairsFromUrl = Object.values(layoutObj);
    // flatten array of collection|resource shortname pairs
    collResShortnamePairsFromUrl = collResShortnamePairsFromUrl.flat(2);
    // remove duplicate values from array of collection|resource shortname pairs
    collResShortnamePairsFromUrl = [...new Set(collResShortnamePairsFromUrl)];

    // get array of collection|resource shortname pairs from loadedResourcesData object
    const collResShortnamePairsFromObj = [];
    collectionShortnamesFromObj.forEach(collectionShortname => {
      const resourceShortnames = Object.keys(APP.loadedResourcesData[collectionShortname]);
      resourceShortnames.forEach(resourceShortname => {
        collResShortnamePairsFromObj.push(`${collectionShortname}|${resourceShortname}`);
      });
    });

    // get those collection|resource shortname pairs from loadedResourcesData object which are not present in URL
    let resourcesToUnload = collResShortnamePairsFromObj.filter(shortnamePair => !collResShortnamePairsFromUrl.includes(shortnamePair));
    // remove those collection|resource shortname pairs which include collection which should be removed
    resourcesToUnload = resourcesToUnload.filter(shortnamePair => {
      const collectionShortname = shortnamePair.split('|')[0];
      if (!collectionsToUnload.includes(collectionShortname)) {
        return collectionShortname;
      }
    });

    return {collectionsToUnload, resourcesToUnload};
  },

  unloadData: function(collectionsToUnload, resourcesToUnload) {
    // unload unneeded collections
    collectionsToUnload.forEach(collectionShortname => {
      // get collection definition
      const collectionDef = ParsedClassicsCollDefs[collectionShortname];
      // remove unneeded resources definitions
      delete collectionDef['resource_defs'];
      // remove unneeded collection contents
      delete collectionDef['contents'];
      // remove unneeded resources data
      delete APP.loadedResourcesData[collectionShortname];
    });

    // unload unneeded resources
    resourcesToUnload.forEach(shortnamePair => {
      const collectionShortname = shortnamePair.split('|')[0];
      const resourceShortname = shortnamePair.split('|')[1];
      // get resources data of certain collection
      const collResourcesData = APP.loadedResourcesData[collectionShortname];
      // remove data of certain resource
      delete collResourcesData[resourceShortname];
    });
  },

  getResourceDef(collectionShortname, resourceShortname) {
    // get definition of the collection
    const collectionDef = ParsedClassicsCollDefs[collectionShortname];
    // get definitions of all resources
    const resourceDefsAll = collectionDef['resource_defs'];
    // get definition of single resource
    const resourceDef = resourceDefsAll[resourceShortname];
    return resourceDef;
  },
  
};
