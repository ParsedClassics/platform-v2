/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

$(document).ready(function(){
    const url = location.href;
    let upwards;
    if (url.indexOf('/tools/diagramming_playground/') != -1) {
        upwards = '../';
    }
    else {
        upwards = '';
    }
    $("#pc-site-content").before('<div id="pc-sidebar-nav" class="w3-sidebar w3-bar-block w3-border-right">' +

    '<a id="menu-button-site-index" class="w3-hover-dark-grey w3-button" href="' + upwards + '../site/index.html" title="Go to ParsedClassics.com">P·C</a>' +

    '<a id="menu-button-tools-index" class="w3-hover-dark-grey w3-button" href="' + upwards + 'index.html" title="Go to Editor\'s tools"><img class="menu-button-tools-index-img" src="' + upwards + 'img/tools.svg" /></a>' +

    '</div>');

});
