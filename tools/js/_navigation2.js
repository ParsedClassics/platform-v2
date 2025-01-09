/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

$(document).ready(function(){
  //<span class="pc-interverb-symbol">&#8942;</span>
  $("#pc-site-content").before('<div id="pc-sidebar-nav" class="w3-sidebar w3-bar-block w3-border-right">' +

  '<a id="menu-button-site-index" class="w3-hover-dark-grey w3-button" href="../../site/index.html" title="Go to ParsedClassics.com">P·C</a>' +

  '<a id="menu-button-tools-index" class="w3-hover-dark-grey w3-button" href="../index.html" title="Go to Editor\'s tools"><img class="menu-button-tools-index-img" src="../img/tools.svg" /></a>' +

  '</div>');

});