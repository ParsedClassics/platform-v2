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
    if (url.indexOf('/site/drills/') != -1) {
        upwards = '../../../';
    }
    else {
        upwards = '../';
    }
    
    $("#pc-site-content").before('<div id="pc-sidebar-nav" class="w3-sidebar w3-bar-block w3-border-right">' +

    '<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'site/index.html"><span>PARSED<span class="pc-interverb-symbol">·</span>CLASSICS</span></a>' +

    '<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'site/about.html">About</a>' + 

    //'<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'site/drills.html">Drills</a>' +

    '<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'site/catalogue.html">Catalogue</a>' +

    '<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'docs/for_reader.html">Docs</a>' +

    //'<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'lexicons.html">Lexicons</a>' +

    //'<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'readers.html">Readers</a>' +

    //'<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'classics.html">Classics</a>' +

    '<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'site/copyright.html">Copyright</a>' + 

    '<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding" href="' + upwards + 'site/contacts.html">Contacts</a>' + 

    '<a class="w3-bar-item w3-hover-dark-grey w3-button w3-padding pc-small pc-position-absolute pc-bottom-0" href="' + upwards + 'tools/index.html">Editor\'s area</a>' +

    '</div>');

});
