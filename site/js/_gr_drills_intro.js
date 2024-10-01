/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

$(document).ready(function(){

  $('h2').last().after(`
      
  <p class="before-submit-text">Fill in the table as best you can, then press Check button. We’ll show you which values are right and which are wrong. If needed, look at <a target="_blank" href="answers.pdf"> the answers</a> or at <a target="_blank" href="../../../tools/keyboard_greek_polytonic.html">the keyboard mapping</a> used here to type Greek characters.</p>
  <p class="after-submit-text pc-hide">We have finished marking your submission. Words in green are correct; words in red are incorrect (with the correct word shown in parentheses).</p>
  
  `);

});