/*
 * Based on: https://github.com/JonathanAquino/Dowlings-Wheel
 * MIT license
 */

const ParsedClassicsMorphDrillsSubmit = {

  init: function() {
    const template = $("#template").val();
    $("#text").val(template);
    const checkBtn = $("button.drills-check-btn");
    checkBtn.on("click", ParsedClassicsMorphDrillsSubmit.check);
    const goOnBtn = $("button.drills-go-on-btn");
    goOnBtn.on("click", ParsedClassicsMorphDrillsSubmit.goOn);
    const tryAgainBtn = $("button.drills-try-again-btn");
    tryAgainBtn.on("click", ParsedClassicsMorphDrillsSubmit.tryAgain);
  },

  check: function() {
    const textEl = $("#text");
    const actualText = textEl.val().trim();
    const expectedText = $("#answers").val().trim();
    const html = ParsedClassicsMorphDrillsSubmit.diff(expectedText, actualText);
    $("#marking").html(html);
    $("#marking-wrapper").css("display", "inline-block");
    $("p.after-submit-text").show();
    $("p.before-submit-text").hide();
    $("button.drills-check-btn").hide();
    if (!textEl.hasClass("drill-success")) {
      $("button.drills-go-on-btn").show();
    }
    else {
      textEl.removeClass("drill-success");
    }
    $("button.drills-try-again-btn").show();
    textEl.hide();
  },

  goOn: function() {
    $("#text").show();
    $("#marking-wrapper").hide();
    $("p.after-submit-text").hide();
    $("p.before-submit-text").show();
    $("button.drills-check-btn").show();
    $("button.drills-go-on-btn").hide();
    $("button.drills-try-again-btn").hide();
  },

  tryAgain: function() {
    const template = $("#template").val();
    $("#text").val(template).css("background-color", "white");
    ParsedClassicsMorphDrillsSubmit.goOn();
  },

  /** 
   * Returns an HTML report of the difference between the expected
   * and submitted data.
   *
   * @param expectedText string  the correct data
   * @param actualText string  the submitted data
   * @return string  HTML showing correct words in green and incorrect words in red
   */

  diff: function(expectedText, actualText) {
    const regex = /\r\n|\n\r|\n|\r/g;
    const expectedLines = ParsedClassicsMorphDrillsSubmit.linesWithLabels(expectedText.replace(regex, "\n").split("\n"));
    let i = 0;
    let lineProcessed = "";
    const actualLines = actualText.replace(regex, "\n").split("\n")

    diff = [];
    actualLines.forEach(actualLine => {
      
      if (!actualLine.match(/^(?<label>[^:]+):(?<words>.*)/)) {
        lineProcessed = ParsedClassicsMorphDrillsSubmit.qh(actualLine);
        diff.push(lineProcessed); 
      }
      else {
        lineProcessed = ParsedClassicsMorphDrillsSubmit.diffLines(expectedLines[i] ?? '', actualLine);
        diff.push(lineProcessed);
        i++;
      }
      
    });
    return diff.join("\n");
  },

  /**
   * Returns an HTML report of the difference between the expected
   * and actual line.
   *
   * @param $expectedLine string  the correct line
   * @param $actualLine string  the submitted line
   * @return string  HTML showing correct words in green and incorrect words in red
  */

  diffLines: function(expectedLine, actualLine) {
    const [expectedLabel, expectedWords] = expectedLine ? expectedLine.split(':').splice(0, 2) : ['', ''];
    const [actualLabel, actualWords] = actualLine.split(':').splice(0, 2);
    const regex = /[\s,]*([^\s,]+)/g;
    const actualMatchesRaw = [...actualWords.matchAll(regex)];
    const expectedMatchesRaw = [...expectedWords.matchAll(regex)];
    
    const actualMatches = [];
    const expectedMatches = [];
    actualMatchesRaw.forEach(item => actualMatches.push(item[1]));
    expectedMatchesRaw.forEach(item => expectedMatches.push(item[1]));

    let diff = actualLabel + ':';

    const n = actualMatches.length > expectedMatches.length ? actualMatches.length : expectedMatches.length;

    const regexNonLetters = /[^a-z]/i;
    for (i = 0; i < n; i++) {
      if (i >= expectedMatches.length) {
        diff += ' <span class="incorrect">' + ParsedClassicsMorphDrillsSubmit.qh(actualMatches[i]) + ' <span class="hint">()</span></span>';
      }
      else if (i >= actualMatches.length) {
        diff += ' <span class="incorrect"><span class="hint">(' + ParsedClassicsMorphDrillsSubmit.qh(expectedMatches[i]) + ')</span></span>';
      } 
      else if (expectedMatches[i].replace(regexNonLetters, "").toLowerCase() !== actualMatches[i].replace(regexNonLetters, "").toLowerCase()) { 
        diff += ' <span class="incorrect">' + ParsedClassicsMorphDrillsSubmit.qh(actualMatches[i]) + ' <span class="hint">(' + ParsedClassicsMorphDrillsSubmit.qh(expectedMatches[i]) + ')</span></span>';
      } 
      else {
        diff += ' <span class="correct">' + ParsedClassicsMorphDrillsSubmit.qh(actualMatches[i]) + '</span>';
      }
    }

    return diff;
  },

  /** 
   * Returns the lines that contain labels (strings followed by a colon).
   *
   * @param lines array  the lines to parse
   * @return array  matching lines
  */

  linesWithLabels: function(lines) {
    result = [];
    lines.forEach(line => {
      if (line.match(/^[^:]+:/)) {
        result.push(line);
      }
    });
    return result;
  },

  /**
   * HTML-encodes a string.
   *
   * @param text string  plain text
   * @return string  HTML
  */

  qh: function(str) {
    return ParsedClassicsMorphDrillsSubmit.htmlEntities(str);
  },

  htmlEntities: function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\'/g, '&apos;');
  }

}