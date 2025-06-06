/*
Adapted from https://gist.github.com/prof3ssorSt3v3/6488ff041419c50cedb0dcc811e2d283
*/

/*

structure of loadedResourcesData object

loadedResourcesData: {

    nt_romans: {
  
      nt_romans_parsed_text: {
        contents: {},
        data: "",
      },
  
      nt_romans_text_ed_robinson_pierpont: {
        contents: {},
        data: "",
      },
  
    },
  
    nt_matthew: {
  
      nt_matthew_tr_EL_vamvas: {
        contents: {},
        data: "",
      },
  
      nt_matthew_tr_LA_beza: {
        contents: {},
        data: "",
      },
  
    },
  
  },

*/

const APP = {
  
  loadedResourcesData: {},
  
  //called when the page loads
  init: function() {
    //add listener for popstate
    window.addEventListener('popstate', APP.checkState);
    // add listener to fire on window resize end
    $(window).resize(function() {
      clearTimeout(this.id);
      this.id = setTimeout(ParsedClassicsLayout.windowResizeEnd, 500);
    });
    // add listener for message from iframe event (IMPORTANT! window.addEventListener("message", ParsedClassicsScannedBookMode.updateMode) does not work here )
    $(window).on('message', ParsedClassicsScannedBookMode.updateMode);
    // create alert dialogue el
    alertDialogue = ParsedClassicsAlertDialogue.createDialogue('container');
    $('body').append(alertDialogue);
    // create confirm dialogue
    confirmDialogue = ParsedClassicsConfirmDialogue.createConfirmDialogue('container');
    $('body').append(confirmDialogue);
    //check the state
    APP.checkState(); 
  },
  
  //called when page loads AND after a popstate event
  checkState: function() {
    //default first load
    let hashJsonStr;
    if (!location.hash) { 
      ParsedClassicsLayout.firstLoad(); 
    }
    // page load after popstate event 
    else {
      ParsedClassicsLayout.popStateLoad(); 
    }
  },
  
};

document.addEventListener('DOMContentLoaded', APP.init);
