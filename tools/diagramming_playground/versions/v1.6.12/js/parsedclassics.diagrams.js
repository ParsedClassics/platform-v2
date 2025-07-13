/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
Syntax diagram generator
=====================================================
*/

var ParsedClassicsDiagramGenerator = {
  
  diagrammer_version: "1.6.12",
  
  debug: false,

  hotspot_color: 'transparent', // '#f06' for debug; "transparent" for production

  line_color: "#666",

  fill_color: "#ccc",

  temp_path_color: "transparent",

  temp_hotspot_color: "transparent",

  fill_opacity: ".3",

  line_width: 1.5,

  relat_line_dasharray: "1.5, 1.5",

  appos_line_width: 3,

  appos_line_width2: 1,

  appos_line_color2: "white",

  word_border_width: 1.5,

  left_padding: 200,

  lines_arr: {},
  
  words_arr: [],

  space_y_between_words: 40, // vertical space between words in px

  compl_sign_width: 40,

  crowbar_sign_width: 50,

  coord_sign_width: 40,

  coord_initial_sign_height: 50,

  spec_sign_width: 20,

  spec_sign_line_width: 3,

  intro_sign_width: 30,

  intro_sign_width_additional: 50,

  intro_sign_height: 40,

  cl_adj_sign_width: 30,

  cl_adj_sign_width_additional: 50,

  cl_adj_sign_gap: 4,

  fork_point_intro_width: 50,

  fork_point_radius: 6,

  fork_point_intro_pos: 40,

  fork_point_back_pos: 75,

  parenthesis_sign_width: 15,

  external_index_pos: 15, // distance from complementation sign's left corner to top right corner of external index's text box

  intercolumn_direction_change_pos: 25, // distance from column at which signs of modification, apposition, relativization can change direction

  column_left_distance_default: [75],

  column_left_distance: [], // in version 1.5.0 the value was 250 (number, not array!)
  
  font_size_small: "80%",

  subscript_font_size: "60%",

  subscript_shift: "-35%",

  closeDialogue: function (event) {
    var dialogue;

    dialogue = $(event.target).parent().parent().parent();
    dialogue.hide();
  },

  show_success_msg: function (msg) {
    var msg_el, dialogue;
    // find message el
    msg_el = $("#success-msg-text-el");
    // put message text inside message el
    msg_el.html(msg);
    // display modal dialogue
    dialogue = $("#pc-tools-success-dialogue");
    dialogue.show();
  },

  show_error_msg: function (msg) {
    var msg_el, dialogue;
    // find message el
    msg_el = $("#error-msg-text-el");
    // put message text inside message el
    msg_el.html(msg);
    // display modal dialogue
    dialogue = $("#pc-tools-error-dialogue");
    dialogue.show();
  },

  show_attention_msg: function (msg) {
    var msg_el, dialogue, ok_button;
    // find message el
    msg_el = $("#attention-msg-text-el");
    // put message text inside message el
    msg_el.html(msg);
    // unbind handlers from "Ok" button
    ok_button = $("#ok-action-button");
    ok_button.unbind();
    // display modal dialogue
    dialogue = $("#pc-tools-attention-dialogue");
    dialogue.show();
  },

  initAllCloseDialogueButtons: function () {
    var closeDialogueButtons, cancel_action_button;

    closeDialogueButtons = $(".pc-close-dialogue-button");
    closeDialogueButtons.bind("click", function (event) {
      ParsedClassicsDiagramGenerator.closeDialogue(event);
    });

    cancel_action_button = $("#cancel-action-button");
    cancel_action_button.bind("click", function (event) {
      ParsedClassicsDiagramGenerator.closeDialogue(event);
    });
  },

  show_options_panel: function(e) {
    var options_checkbox, options_panel;

    options_checkbox = $(e.target);
    options_panel = $("#options-panel");

    if (options_checkbox.is(":checked")) {
      options_panel.show(400);
    }
    else {
      options_panel.hide(400);
    }
  },

  prefillOptionsInputs: function() {
    var val_from_storage, val_default, field, value_arr, value_arr_clean, num;
    
    // (1) column_left_distance option

    // get value from local storage
    val_from_storage = localStorage.getItem("column_left_distance");
    // get default value
    val_default = ParsedClassicsDiagramGenerator.column_left_distance_default;
    // get field input
    field = $("#options-panel").find('input[name="column-left-distance"]');
    // define var
    value_arr_clean = [];
    // put value from local storage inside field input and update global var for Diagram generator script
    if (val_from_storage) {
      field.val(val_from_storage);
      // set global var for Diagram generator script
      value_arr = val_from_storage.split("|");
      for (var i = 0; i < value_arr.length; i++) {
        num = value_arr[i].trim();
        value_arr_clean.push(Number(num));
      }
      ParsedClassicsDiagramGenerator.column_left_distance = value_arr_clean;
    }
    // put default value inside field input
    else {
      field.val(val_default);
      ParsedClassicsDiagramGenerator.column_left_distance = val_default; // added in v. 1.6.12 from v. 1.6.14 in order to be able to display diagram when no column_left_distance saved in local storage
    }
  },

  save_options: function() {
    var center_pane, field, value_from_field, value_arr, value_arr_clean, num, value_valid, success_msg;

    // get center pane 
    center_pane = $(".ui-layout-center");

    // define var
    success_msg = "";

    // (1) column_left_distance option

    // get field input
    field = $("#options-panel").find('input[name="column-left-distance"]');
    // get value from field
    value_from_field = field.val().trim();
    // define var
    value_arr_clean = [];

    // there is value in the field, so check if value from field input is valid
    if (value_from_field) {
      value_valid = true;
      value_arr = value_from_field.split("|");
      // is each value a number and number bigger than 50?
      for (var i = 0; i < value_arr.length; i++) {
        num = value_arr[i].trim();
        value_arr_clean.push(Number(num));
        if (!Number(num) || !(Number(num) > 50)) {
          value_valid = false;
        }
      }
      // pipe delimited 
      if (value_valid) {
        // save value in local storage
        localStorage.setItem("column_left_distance", value_arr_clean.join("|"));
        // set global var for Diagram generator script
        ParsedClassicsDiagramGenerator.column_left_distance = value_arr_clean;
      }
      else {
        // show error message
        ParsedClassicsDiagramGenerator.show_error_msg("column_left_distance must be a number or pipe delimited series of numbers each bigger than 50!");
        center_pane.scrollTo(field, 400);
        return;
      }
    }
    // there is no value in the field, so remove item from local storage and fill field with default value(s)
    else {
      localStorage.removeItem("column_left_distance");
      field.val(ParsedClassicsDiagramGenerator.column_left_distance_default.join("|"));
      ParsedClassicsDiagramGenerator.column_left_distance = ParsedClassicsDiagramGenerator.column_left_distance_default;
      success_msg += "Default value of column_left_distance restored.<br>"
    }

    // no error messages shown, so show sucsess message
    success_msg += "Options saved."
    ParsedClassicsDiagramGenerator.show_success_msg(success_msg);
  },

  load_sentence: function () {
    var sentence_textarea,
      sentence_code,
      sentence_text_container,
      line_els,
      line_single_el,
      word_els,
      line_num,
      word_form,
      relation_inputs_html,
      relation_button_html,
      syntax_data_container,
      buttons_container,
      generate_json_button_html;

    // get textarea containing code of the sentence
    sentence_textarea = $("#sentence-input-textarea");
    // get sentence code
    sentence_code = sentence_textarea.val();
    sentence_code = $.trim(sentence_code);

    // no sentence code? - then nothing to do except to display error message
    if (!sentence_code) {
      ParsedClassicsDiagramGenerator.show_error_msg(
        "No sentence code found in sentence code input!"
      );
      return;
    }

    // load sentence into sentence text container
    sentence_text_container = $("#sentence-text-container");
    sentence_code = $(sentence_code);
    sentence_code.hide();
    sentence_text_container.html(sentence_code);
    sentence_code.show(400);

    // get all line els
    line_els = $(".line");

    ParsedClassicsDiagramGenerator.lines_arr = {};
    ParsedClassicsDiagramGenerator.words_arr = [];

    // if line numbers exist push line numbers and word forms to object and arrays
    if (line_els.length > 0) {
      for (var j = 0; j < line_els.length; j++) {
        line_single_el = $(line_els[j]);
        line_num = line_single_el.find(".line-number").text();
        ParsedClassicsDiagramGenerator.lines_arr[line_num] = [];
        word_els = line_single_el.find(".word");
        for (var i = 0; i < word_els.length; i++) {
          word_form = $(word_els[i]).attr("data-form");
          ParsedClassicsDiagramGenerator.lines_arr[line_num].push(word_form);
        }
      }
    }
    // if line numbers not exist, push word forms to array
    else {
      // get all word_els
      word_els = $("span.word");
      for (var i = 0; i < word_els.length; i++) {
        word_form = $(word_els[i]).attr("data-form");
        ParsedClassicsDiagramGenerator.words_arr.push(word_form);
      }
    }

    // create relation inputs
    relation_inputs_html = ParsedClassicsDiagramGenerator.create_relation_inputs_html();
    relation_inputs_html.hide();

    // creade "Add new relation" button
    relation_button_html = $(
      `<button id="new-syntactic-relation-button" class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Syntactic relation</button>`
    );
    relation_button_html.hide();

    // creade "Generate JSON" button
    generate_json_button_html = $(
      `<button id="generate-json-button" class="w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Generate JSON</button>`
    );
    generate_json_button_html.hide();

    // bind function to "Add new relation" button
    relation_button_html.bind(
      "click",
      ParsedClassicsDiagramGenerator.add_relation
    );

    // bind function to "Generate JSON" button
    generate_json_button_html.bind(
      "click",
      ParsedClassicsDiagramGenerator.generate_json
    );

    // get container for syntax data
    syntax_data_container = $("#syntax-data-container");

    // get buttons container
    buttons_container = $("#syntax-data-btn-container");

    // is there at least one relation container inside container for syntax data?
    if ($("#syntax-data-container .relation-container").length == 0) {
      // put container that will hold data of single syntax relation into container for syntax data
      syntax_data_container.append(relation_inputs_html);
      relation_inputs_html.show(400);

      // display relation button
      buttons_container.append(relation_button_html);
      relation_button_html.show(400);

      // display generate json button
      buttons_container.append(" ");
      buttons_container.append(generate_json_button_html);
      generate_json_button_html.show(400);

      // delegate event handler for "remove relation button"
      syntax_data_container.undelegate(
        "button.cancel-relation",
        "click",
        ParsedClassicsDiagramGenerator.remove_relation
      );
      syntax_data_container.delegate(
        "button.cancel-relation",
        "click",
        ParsedClassicsDiagramGenerator.remove_relation
      );

      // delegate event handler for "add word button"
      syntax_data_container.undelegate(
        "button.add-word",
        "click",
        ParsedClassicsDiagramGenerator.add_word
      );
      syntax_data_container.delegate(
        "button.add-word",
        "click",
        ParsedClassicsDiagramGenerator.add_word
      );

      // delegate event handler for "add phrase button"
      syntax_data_container.undelegate(
        "button.add-phrase",
        "click",
        ParsedClassicsDiagramGenerator.add_phrase
      );
      syntax_data_container.delegate(
        "button.add-phrase",
        "click",
        ParsedClassicsDiagramGenerator.add_phrase
      );

      // delegate event handler for "delete word button"
      syntax_data_container.undelegate(
        "button.cancel-word",
        "click",
        ParsedClassicsDiagramGenerator.remove_word
      );
      syntax_data_container.delegate(
        "button.cancel-word",
        "click",
        ParsedClassicsDiagramGenerator.remove_word
      );

      // delegate event handler for "delete phrase button"
      syntax_data_container.undelegate(
        "button.cancel-phrase",
        "click",
        ParsedClassicsDiagramGenerator.remove_phrase
      );
      syntax_data_container.delegate(
        "button.cancel-phrase",
        "click",
        ParsedClassicsDiagramGenerator.remove_phrase
      );
      
      // delegate handler which prevents checking multiple root-relations
      syntax_data_container.undelegate('input[name="root"]', "click", ParsedClassicsDiagramGenerator.root_checked_unique);
      syntax_data_container.delegate('input[name="root"]', "click", ParsedClassicsDiagramGenerator.root_checked_unique);
    }
  },

  remove_relation: function (e) {
    var relation_inputs_wrapper, ok_button;

    // initialize var with value of button clicked
    relation_inputs_wrapper = $(e.target);

    // display attention message
    ParsedClassicsDiagramGenerator.show_attention_msg(
      "Do you really want to remove this syntactic relation?"
    );

    // get "OK" button in attention dialogue
    ok_button = $("#ok-action-button");

    ok_button.bind("click", function () {
      // find wrapper
      while (
        !relation_inputs_wrapper.hasClass("relation-container") ||
        relation_inputs_wrapper[0] == document.body
      ) {
        relation_inputs_wrapper = relation_inputs_wrapper.parent();
      }

      // remove wrapper
      if (relation_inputs_wrapper.hasClass("relation-container")) {
        relation_inputs_wrapper.hide(400, function () {
          relation_inputs_wrapper.remove();
        });
      }

      // close attention dialogue
      $("#pc-tools-attention-dialogue .pc-close-dialogue-button").trigger(
        "click"
      );
      
      // unbind click event
      ok_button.unbind("click");
    });
  },

  add_relation: function () {
    var syntax_data_container, relation_inputs_html;

    // get container for syntax data
    syntax_data_container = $("#syntax-data-container");

    // create relation inputs
    relation_inputs_html = ParsedClassicsDiagramGenerator.create_relation_inputs_html();

    // hide relation inputs
    relation_inputs_html.hide();

    // add relation inputs after last .relation-container or at the beginning if there are no .relation-container
    if (syntax_data_container.find(".relation-container").length > 0) {
      syntax_data_container
        .find(".relation-container")
        .last()
        .after(relation_inputs_html);
    } else {
      syntax_data_container.prepend(relation_inputs_html);
    }

    // show relation inputs
    relation_inputs_html.show(400);

    // make relation inputs sortable by drag-n-drop
    $("#syntax-data-container").sortable({items: "> .relation-container", handle: "legend"});
  },

  add_word: function (e) {
    var relation_inputs_wrapper, syntax_data_container, word_inputs_html;

    // initialize var with value of button clicked
    relation_inputs_wrapper = $(e.target);

    // get container for syntax data
    syntax_data_container = $("#syntax-data-container");

    // create word inputs
    word_inputs_html = ParsedClassicsDiagramGenerator.create_word_inputs_html();

    // add handler to generate automatically word's internal index
    word_inputs_html.find('select[name="word"]').bind("change", ParsedClassicsDiagramGenerator.internal_index_for_word);

    // hide word inputs
    word_inputs_html.hide();

    // find wrapper .relation-container
    while (
      !relation_inputs_wrapper.hasClass("relation-container") ||
      relation_inputs_wrapper[0] == document.body
    ) {
      relation_inputs_wrapper = relation_inputs_wrapper.parent();
    }

    // add word inputs to wrapper's fieldset el
    if (relation_inputs_wrapper.hasClass("relation-container")) {
      relation_inputs_wrapper.find("fieldset > div").append(word_inputs_html);
      word_inputs_html.show(400);
      // make word and phrase input blocks sortable by drag-n-drop
      relation_inputs_wrapper.sortable({items: ".word-inputs-block, .phrase-inputs-block", handle: "label"});
    }
  },

  add_phrase: function (e) {
    var relation_inputs_wrapper, phrase_inputs_html;

    // initialize var with value of button clicked
    relation_inputs_wrapper = $(e.target);

    // create phrase inputs
    phrase_inputs_html = ParsedClassicsDiagramGenerator.create_phrase_inputs_html();

    // hide phrase inputs
    phrase_inputs_html.hide();

    // find wrapper .relation-container
    while (
      !relation_inputs_wrapper.hasClass("relation-container") ||
      relation_inputs_wrapper[0] == document.body
    ) {
      relation_inputs_wrapper = relation_inputs_wrapper.parent();
    }

    // add lelation inputs to wrapper's fieldset el
    if (relation_inputs_wrapper.hasClass("relation-container")) {
      relation_inputs_wrapper.find("fieldset > div").append(phrase_inputs_html);
      phrase_inputs_html.show(400);
      // make word and phrase input blocks sortable by drag-n-drop
      relation_inputs_wrapper.sortable({items: ".word-inputs-block, .phrase-inputs-block", handle: "label"});
    }
  },

  remove_word: function (e) {
    var word_inputs_wrapper, ok_button;

    // initialize var with value of button clicked
    word_inputs_wrapper = $(e.target);

    // display attention message
    ParsedClassicsDiagramGenerator.show_attention_msg(
      "Do you really want to remove this word?"
    );

    // get "OK" button in attention dialogue
    ok_button = $("#ok-action-button");

    ok_button.bind("click", function () {
      // find wrapper
      while (
        !word_inputs_wrapper.hasClass("word-inputs-block") ||
        word_inputs_wrapper[0] == document.body
      ) {
        word_inputs_wrapper = word_inputs_wrapper.parent();
      }

      // remove wrapper
      if (word_inputs_wrapper.hasClass("word-inputs-block")) {
        word_inputs_wrapper.hide(400, function () {
          word_inputs_wrapper.remove();
        });
      }

      // close attention dialogue
      $("#pc-tools-attention-dialogue .pc-close-dialogue-button").trigger(
        "click"
      );

      // unbind click event
      ok_button.unbind("click");
    });
  },

  remove_phrase: function (e) {
    var phrase_inputs_wrapper, ok_button;

    // initialize var with value of button clicked
    phrase_inputs_wrapper = $(e.target);

    // display attention message
    ParsedClassicsDiagramGenerator.show_attention_msg(
      "Do you really want to remove this phrase?"
    );

    // get "OK" button in attention dialogue
    ok_button = $("#ok-action-button");

    ok_button.bind("click", function () {
      // find wrapper
      while (
        !phrase_inputs_wrapper.hasClass("phrase-inputs-block") ||
        phrase_inputs_wrapper[0] == document.body
      ) {
        phrase_inputs_wrapper = phrase_inputs_wrapper.parent();
      }

      // remove wrapper
      if (phrase_inputs_wrapper.hasClass("phrase-inputs-block")) {
        phrase_inputs_wrapper.hide(400, function () {
          phrase_inputs_wrapper.remove();
        });
      }

      // close attention dialogue
      $("#pc-tools-attention-dialogue .pc-close-dialogue-button").trigger(
        "click"
      );

      // unbind click event
      ok_button.unbind("click");
    });
  },

  root_checked_unique: function(event) {
    var syntax_data_container, clicked_root_input, internal_index_input, root_inputs_all;

    // get container for syntax data
    syntax_data_container = $("#syntax-data-container");

    // get clicked root checkbox
    clicked_root_input = event.target;

    // get internal index input
    internal_index_input = $(clicked_root_input).parent().parent().find('input[name="internal-index"]');

    if (clicked_root_input.checked) {
      // root relation will have internal index "root_relation"
      internal_index_input.val('root_relation');
    }
    else {
      // remove internal index since relation is no longer root relation
      internal_index_input.val('');
    }

    // get all root checkboxes
    root_inputs_all = syntax_data_container.find('input[name="root"]');
    root_inputs_all = $.makeArray(root_inputs_all);

    // remove clicked root checkbox from array of all root checkboxes
    root_inputs_all.splice(root_inputs_all.indexOf(clicked_root_input), 1);

    // uncheck checkboxes except the one clicked
    for (var i = 0; i < root_inputs_all.length; i++) {
      if (root_inputs_all[i].checked) {
        root_inputs_all[i].checked = false;
        // remove internal index since relation is no longer root relation
        $(root_inputs_all[i]).parent().parent().find('input[name="internal-index"]').val('');
      }
    }

  },

  internal_index_for_word: function(event) {
    var word_selectbox,
    selected_val,
    selected_index,
    selected_index_padded,
    word_inputs_wrapper,
    word_internal_index,
    internal_index_input;

    // get word selectbox
    word_selectbox = $(event.target);

    // get selected value
    selected_val = word_selectbox.val();

    // get word inputs wrapper el
    word_inputs_wrapper = word_selectbox;
    while (
      !word_inputs_wrapper.hasClass("word-inputs-block") ||
      word_inputs_wrapper[0] == document.body
    ) {
      word_inputs_wrapper = word_inputs_wrapper.parent();
    }

    // get internal index input
    if (word_inputs_wrapper.hasClass("word-inputs-block")) {
      internal_index_input = word_inputs_wrapper.find('input[name="internal-index"]'); 
    }

    // get selected index of word selectbox
    if (selected_val != "") {
      selected_index = word_selectbox[0].selectedIndex;

      // add zero padding to index
      selected_index_padded = ("000" + selected_index).slice(-3);

      // generate internal index for word
      word_internal_index = "w" + selected_index_padded;

      // put internal index for word into internal index input
      internal_index_input.val(word_internal_index);

    }
    else {
      // delet value from internal index input
      internal_index_input.val("");
    }

  },

  create_relation_inputs_html: function () {
    var relation_inputs_html = `
    <div class="relation-container">    
    <fieldset>
    <legend>Syntactic relation &#8645;</legend>
    <div>
    <div class="relation-inputs-block">
    <select title="Relation name" name="syntactic-relation">
    <option value="">Relation name</option>
    <option value="complementation">Complementation</option>
    <option value="coordination">Coordination</option>
    <option value="introduction">Introduction</option>
    <option value="specification">Specification</option>
    <option value="coordination-initial">Coordination initial</option>
    <option value="clausal-adjunction">Clausal adjunction</option>
    <option value="modification">Modification</option>
    <option value="relativization">Relativization</option>
    <option value="apposition">Apposition</option>
    <option value="parenthesis">Parenthesis</option>
    <option value="fork">Technical: Front fork</option>
    <option value="fork2">Technical: Back fork</option>
    <option value="hook">Technical: Hook</option>
    <option value="cable">Technical: Cable</option>
    </select>
    <textarea class="pc-width-100" name="resulting-phrase" title="Resulting phrase" placeholder="Resulting phrase"></textarea>
    <div class="pc-margin-top-8"><input type="checkbox" name="root" value="true"> Root relation</div>
    <input type="text" name="external-index" title="External index" placeholder="External index">
    <input type="text" name="internal-index" title="Internal index" placeholder="Internal index">
    <textarea class="pc-width-100" name="clause-type" title="Clause type" placeholder="Clause type"></textarea>
    <span class="popover-wrapper">
    <button class="show-popover w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey" data-role="popover" data-target="pc-info-popover">i</button>
    </span>
    <button class="add-word w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Word</button>
    <button class="add-phrase w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Phrase</button>
    <button class="cancel-relation w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Remove</button>
    
    </div>
    </div>
    </fieldset>
    </div>
    `;

    relation_inputs_html = $(relation_inputs_html);

    // attach function to open popover
    relation_inputs_html.find('[data-role="popover"]').popover();

    // attach function to update popover info about block-building phrases
    relation_inputs_html.find('[name="resulting-phrase"], [name="internal-index"], [name="external-index"]').bind("blur", ParsedClassicsDiagramGenerator.compilePopoverInfo);
    relation_inputs_html.find('[name="syntactic-relation"]').bind("change", ParsedClassicsDiagramGenerator.compilePopoverInfo);

    // attach function to generate automatically internal index of the phrase
    relation_inputs_html.find('[name="syntactic-relation"]').bind("change", ParsedClassicsDiagramGenerator.generatePhraseInternalIndex);

    return relation_inputs_html;
  },

  create_word_inputs_html: function () {
    var word_inputs_html, options_html;

    // create option el for each word in the sentence
    options_html = "";
    // if line numbers exist
    if (!$.isEmptyObject(ParsedClassicsDiagramGenerator.lines_arr)) {
      for (var line_num in ParsedClassicsDiagramGenerator.lines_arr) {
        options_html += '<optgroup label="' + line_num + '">\n';
        for (var i = 0; i < ParsedClassicsDiagramGenerator.lines_arr[line_num].length; i++) {
          options_html +=
            '<option value="' +
            ParsedClassicsDiagramGenerator.lines_arr[line_num][i] +
            '">' +
            ParsedClassicsDiagramGenerator.lines_arr[line_num][i] +
            "</option>\n";
        }
        options_html += '</optgroup>\n';
      }
    }
    else {
      for (var i = 0; i < ParsedClassicsDiagramGenerator.words_arr.length; i++) {
        options_html +=
          '<option value="' +
          ParsedClassicsDiagramGenerator.words_arr[i] +
          '">' +
          ParsedClassicsDiagramGenerator.words_arr[i] +
          "</option>\n";
      }
    }
    
    word_inputs_html = `
    <div class="word-inputs-block">
    <label>Word &rlarr;</label>
    <select title="Word form" name="word"> 
    <option value="">Word form</option>
    ${options_html}
    </select>
    <input type="text" name="word2" title="Word form" placeholder="Word form">
    <input type="text" name="syntactic-role" title="Syntactic role" placeholder="Syntactic role">
    <input type="text" name="external-index" title="External index" placeholder="External index">
    <input type="text" name="internal-index" title="Internal index" placeholder="Internal index">
    <input type="text" name="subscript" title="Subscript" placeholder="Subscript">
    <button class="cancel-word w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Remove</button>
    </div>
    `;
    word_inputs_html = $(word_inputs_html);

    // attach function to update popover info about inplicit and articular words
    word_inputs_html.find('[name="word2"], [name="internal-index"], [name="subscript"]').bind("blur", ParsedClassicsDiagramGenerator.compilePopoverInfo);

    return word_inputs_html;
  },

  create_phrase_inputs_html: function () {
    var phrase_inputs_html = `
    <div class="phrase-inputs-block">
    <label>Phrase &rlarr;</label>
    <textarea name="phrase" title="Phrase" placeholder="Phrase text"></textarea>
    <input type="text" name="syntactic-role" title="Syntactic role" placeholder="Syntactic role">
    <input type="text" name="external-index" title="External index" placeholder="External index">
    <input type="text" name="internal-index" title="Internal index" placeholder="Internal index">
    <button class="cancel-phrase w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Remove</button>
    </div>
    `;
    phrase_inputs_html = $(phrase_inputs_html);

    return phrase_inputs_html;
  },

  compilePopoverInfo: function(event) {
    var target_input, 
    target_inputs_block;

    if (!event) {
      // compile info about all articular and implicit words and put it into popover container
      ParsedClassicsDiagramGenerator.compile_words_info();
      // compile info about all block-building phrases and put it into popover container
      ParsedClassicsDiagramGenerator.compile_phrases_info();
      // compile info about all pronouns and their subscript indexes
      ParsedClassicsDiagramGenerator.compile_pronouns_info();
      // compile info about all clauses and their external indexes
      ParsedClassicsDiagramGenerator.compile_clauses_info();
      return;
    }

    // get blurred input
    target_input = $(event.target);
    // get inputs block
    target_inputs_block = target_input.parents("div.word-inputs-block, div.relation-inputs-block");

    // is this words inputs block?
    if (target_inputs_block.hasClass("word-inputs-block")) {
      
      // compile info about all articular and implicit words and put it into popover container
      ParsedClassicsDiagramGenerator.compile_words_info();
      // compile info about all pronouns and their subscript indexes
      ParsedClassicsDiagramGenerator.compile_pronouns_info();

    }
    // is this relation inputs block?
    else if (target_inputs_block.hasClass("relation-inputs-block")) {

      // compile info about all block-building phrases and put it into popover container
      ParsedClassicsDiagramGenerator.compile_phrases_info();
      // compile info about all clauses and their external indexes
      ParsedClassicsDiagramGenerator.compile_clauses_info();

    }
  },

  generatePhraseInternalIndex: function(e) {
    var selectbox, inner_index_input, inner_index_inputs_all, inner_index, padded_number, parsed_number, biggest_number, inner_index_new;

    // get target of "change" event
    selectbox = $(e.target);

    // define var
    biggest_number = 0;

    // get inner index input of syntactic relation
    inner_index_input = selectbox.parent().find('input[name="internal-index"]');

    // is inner index input of syntactic relation empty?
    if (inner_index_input.val().trim() == '') {
      // get all inner index inputs
      inner_index_inputs_all = $('div.relation-inputs-block').find('input[name="internal-index"]');
      for (var i = 0; i < inner_index_inputs_all.length; i++) {
        inner_index = $(inner_index_inputs_all[i]).val().trim();
        if (inner_index) {
          // get number from inner index
          padded_number = inner_index.match(/\d+/gi);
          if (!padded_number) {continue;}
          padded_number = padded_number.join('');
          // remove leading zeroes from number
          parsed_number = padded_number.replace(/^0+(?!\.|$)/, '');
          parsed_number = Number(parsed_number);
          //change found biggest number if parsed_number is biggest than current biggest number
          biggest_number = parsed_number > biggest_number ? parsed_number : biggest_number;
        }
      }
      // increase number of new inner index by 1
      inner_index_new = Number(biggest_number) + 1;
      // padd by zeroes new inner index
      inner_index_new = String(inner_index_new).padStart(3, '0');
      // add string 'phr' on the left
      inner_index_new = 'phr' + inner_index_new;
      inner_index_input.val(inner_index_new);
    }
  },

  compile_pronouns_info: function() {
    var word_inputs_blocks,
    word_form,
    word_subscript,
    info_obj,
    pronouns_info_container,
    info_html,
    popover_info_pronouns;

    popover_info_pronouns = [];
    // get all word inputs blocks
    word_inputs_blocks = $("div.word-inputs-block");
    for (var i = 0; i < word_inputs_blocks.length; i++) {
      // get word form
      word_form = $(word_inputs_blocks[i]).find('[name="word"]').val();
      word_form = word_form ? word_form : $(word_inputs_blocks[i]).find('[name="word2"]').val().trim();
      // get subscript
      word_subscript = $(word_inputs_blocks[i]).find('[name="subscript"]').val().trim();
      if (word_form && word_subscript) {
        // create info obj
        info_obj = {};
        info_obj.word_subscript = word_subscript;
        info_obj.word_form = word_form;
        // push info obj into popover info arr
        popover_info_pronouns.push(info_obj);
      }
    }
    // sort popover_info_pronouns arr
    popover_info_pronouns.sort((a, b) => (a.word_subscript < b.word_subscript ? -1 : 1));

    //get container to display info about pronouns
    pronouns_info_container = $("#pc-info-popover .pc-info-popover-pronouns");

    // generate word info html
    info_html = "";
    popover_info_pronouns.forEach((item) => {
      info_html += `<p>${item.word_subscript} - ${item.word_form}</p>\n`;
    });

    //add new info about words
    pronouns_info_container[0].innerHTML = info_html;
  },

  compile_clauses_info: function() {
    var relation_inputs_blocks,
    phrase,
    relation,
    phrase_external_index,
    info_obj,
    clauses_info_container,
    info_html,
    popover_info_clauses;

    popover_info_clauses = [];
    // get all relation inputs blocks
    relation_inputs_blocks = $("div.relation-inputs-block");
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      // get resulting phrase form
      phrase = $(relation_inputs_blocks[i]).find('[name="resulting-phrase"]').val().trim();
      // get internal index of resulting phrase
      phrase_external_index = $(relation_inputs_blocks[i]).find('[name="external-index"]').val().trim();
      // get relation
      relation = $(relation_inputs_blocks[i]).find('[name="syntactic-relation"]').val();
      if (phrase_external_index && relation == "complementation" && phrase) {
        // create info obj
        info_obj = {};
        info_obj.phrase_external_index = phrase_external_index;
        info_obj.phrase = phrase;
        // push info obj into popover info arr
        popover_info_clauses.push(info_obj);
      }
    }
    // sort popover_info_clauses arr
    popover_info_clauses.sort((a, b) => (a.phrase_external_index < b.phrase_external_index ? -1 : 1));
    //get container to display info about clauses
    clauses_info_container = $("#pc-info-popover .pc-info-popover-clauses");
    // generate clauses info html
    info_html = "";
    popover_info_clauses.forEach((item) => {
      info_html += `<p>${item.phrase_external_index} - ${item.phrase}</p>\n`;
    });
    //add new info about clauses
    clauses_info_container[0].innerHTML = info_html;
  },

  compile_words_info: function() {
    var word_inputs_blocks,
    word_form,
    word_internal_index,
    info_obj,
    word_info_container,
    heading,
    info_html,
    popover_info_words;
    
    popover_info_words = [];
    // get all word inputs blocks
    word_inputs_blocks = $("div.word-inputs-block");
    for (var i = 0; i < word_inputs_blocks.length; i++) {
      // get word form
      word_form = $(word_inputs_blocks[i]).find('[name="word2"]').val().trim();
      // get internal index of word
      word_internal_index = $(word_inputs_blocks[i]).find('[name="internal-index"]').val().trim();
      if (word_form && word_internal_index) {
        // create info obj
        info_obj = {};
        info_obj.word_internal_index = word_internal_index;
        info_obj.word_form = word_form;
        // push info obj into popover info arr
        popover_info_words.push(info_obj);
      }
    }
    // remove duplicates from popover_info_words arr
    popover_info_words = [...new Map(popover_info_words.map(item => [item.word_internal_index, item])).values()];
    // sort popover_info_words arr
    popover_info_words.sort((a, b) => (a.word_internal_index < b.word_internal_index ? -1 : 1));

    //get container to display info about words
    word_info_container = $("#pc-info-popover .pc-info-popover-words");
    // get list heading's outer html
    heading = word_info_container.find(".list-heading")[0].outerHTML;
    // generate word info html
    info_html = "";
    popover_info_words.forEach((item) => {
      info_html += `<p>${item.word_internal_index} - ${item.word_form}</p>\n`;
    });
    //add new info about words
    word_info_container[0].innerHTML = heading + "\n" + info_html;
  },

  compile_phrases_info: function() {
    var relation_inputs_blocks,
    phrase,
    relation,
    phrase_internal_index,
    info_obj,
    phrases_info_container,
    heading,
    info_html,
    popover_info_phrases,
    root_relation;
    
    popover_info_phrases = [];
    // get all relation inputs blocks
    relation_inputs_blocks = $("div.relation-inputs-block");
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      // get resulting phrase form
      phrase = $(relation_inputs_blocks[i]).find('[name="resulting-phrase"]').val().trim();
      // get internal index of resulting phrase
      phrase_internal_index = $(relation_inputs_blocks[i]).find('[name="internal-index"]').val().trim();
      // get relation
      relation = $(relation_inputs_blocks[i]).find('[name="syntactic-relation"]').val();
      if (relation && $.inArray(relation, ["complementation", "coordination", "coordination-initial", "specification", "introduction", "clausal-adjunction", "hook"]) !== -1 && phrase && phrase_internal_index) {
        // create info obj
        info_obj = {};
        info_obj.phrase_internal_index = phrase_internal_index;
        info_obj.phrase = phrase;
        if (phrase_internal_index != 'root_relation') {
          // push info obj into popover info arr
        popover_info_phrases.push(info_obj);
        }
        else {
          root_relation = info_obj;
        }
      }
    }

    // remove duplicates from popover_info_phrases arr
    popover_info_phrases = [...new Map(popover_info_phrases.map(item => [item.phrase_internal_index, item])).values()];
    // sort popover_info_phrases arr
    popover_info_phrases.sort((a, b) => (a.phrase_internal_index < b.phrase_internal_index ? -1 : 1));
    // add root relation at the start of arr
    if (root_relation) {
      popover_info_phrases.unshift(root_relation);
    }
    //get container to display info about phrases
    phrases_info_container = $("#pc-info-popover .pc-info-popover-phrases");
    // get list heading's outer html
    heading = phrases_info_container.find(".list-heading")[0].outerHTML;
    // generate phrases info html
    info_html = "";
    popover_info_phrases.forEach((item) => {
      info_html += `<p>${item.phrase_internal_index} - ${item.phrase}</p>\n`;
    });
    //add new info about words
    phrases_info_container[0].innerHTML = heading + "\n" + info_html;
  },

  init: function () {
    var load_sentence_button, generate_diagram_button, load_form_values_button, load_from_storage_button, options_checkbox, save_options_button;

    ParsedClassicsDiagramGenerator.initAllCloseDialogueButtons();
    ParsedClassicsDiagramGenerator.prefillOptionsInputs();

    load_sentence_button = $("#load-sentence-button");
    load_sentence_button.bind(
      "click",
      ParsedClassicsDiagramGenerator.load_sentence
    );

    generate_diagram_button = $("#generate-diagram-button");
    generate_diagram_button.bind(
      "click",
      ParsedClassicsDiagramGenerator.generate_diagram
    );

    load_form_values_button = $("#load-form-values-button");
    load_form_values_button.bind(
      "click",
      ParsedClassicsDiagramGenerator.load_form_values_from_json
    );

    load_from_storage_button = $("#load-json-from-storage");
    load_from_storage_button.bind(
      "click",
      ParsedClassicsDiagramGenerator.load_json_from_storage
    );

    options_checkbox = $("#options-checkbox");
    options_checkbox.bind(
      "change",
      ParsedClassicsDiagramGenerator.show_options_panel
    );

    save_options_button = $("#save-options-button");
    save_options_button.bind(
      "click",
      ParsedClassicsDiagramGenerator.save_options
    );
  },

  generate_json: function () {
    var validate_msg,
      sentence_container,
      sentence_html,
      sentence_text,
      json_obj,
      json_string,
      output_textarea,
      relation_containers,
      rel_obj,
      relation_inputs_block,
      word_phrase_blocks,
      word_phrase_obj;

    validate_msg = ParsedClassicsDiagramGenerator.validate_syntax_inputs();

    if (validate_msg == "invalidated") {
      return;
    }

    json_obj = {};

    // get sentence container
    sentence_container = $("#sentence-text-container");

    // get sentence html and clone it
    sentence_html = sentence_container.html();
    sentence_html = $(sentence_html).clone();

    // remove sentence numbers from sentence
    sentence_html.find(".line-number").remove();

    // get sentence text
    sentence_text = $.trim(sentence_html.text());

    // put diagrammer's version, sentence text and html, options to json obj
    json_obj["diagrammer_version"] = ParsedClassicsDiagramGenerator.diagrammer_version;
    json_obj["sentence"] = sentence_text;
    json_obj["sentence_html"] = sentence_container.html().replace('"', '\"');
    json_obj["options"] = {
      "column_left_distance": ParsedClassicsDiagramGenerator.column_left_distance
    };

    // get all relation containers
    relation_containers = $("#syntax-data-container .relation-container");

    json_obj["syntactic_relations"] = [];

    for (var i = 0; i < relation_containers.length; i++) {
      // create empty obj to hold info about syntactic relation
      rel_obj = {};
      // get relation block
      relation_inputs_block = $(relation_containers[i]).find(
        ".relation-inputs-block"
      );
      // get values from inputs in relation block
      rel_obj["relation"] = relation_inputs_block.find('select[name="syntactic-relation"]').val();
      rel_obj["resulting_phrase"] = relation_inputs_block.find('textarea[name="resulting-phrase"]').val().trim();
      rel_obj["root"] = relation_inputs_block.find('input[name="root"]').is(":checked") ? true : false;
      rel_obj["external_index"] = relation_inputs_block.find('input[name="external-index"]').val().trim();
      rel_obj["internal_index"] = relation_inputs_block.find('input[name="root"]').is(":checked") ? "root_relation" : relation_inputs_block.find('input[name="internal-index"]').val().trim();
      rel_obj["clause_type"] = relation_inputs_block.find('textarea[name="clause-type"]').val().trim();

      // create array to hold info about words and phrases
      rel_obj["words_and_phrases"] = [];

      // get blocks for words and phrases
      word_phrase_blocks = $(relation_containers[i]).find(
        ".word-inputs-block, .phrase-inputs-block"
      );

      for (var j = 0; j < word_phrase_blocks.length; j++) {
        // create empty obj to hold info about word or phrase
        word_phrase_obj = {};
        // default values
        word_phrase_obj["word"] = "";
        word_phrase_obj["word2"] = "";
        word_phrase_obj["phrase"] = "";
        word_phrase_obj["subscript"] = "";
        if ($(word_phrase_blocks[j]).hasClass("word-inputs-block")) {
          word_phrase_obj["word"] = $(word_phrase_blocks[j]).find('select[name="word"]').val();
          word_phrase_obj["word2"] = $(word_phrase_blocks[j]).find('input[name="word2"]').val().trim();
          word_phrase_obj["subscript"] = $(word_phrase_blocks[j]).find('input[name="subscript"]').val().trim();
        }
        if ($(word_phrase_blocks[j]).hasClass("phrase-inputs-block")) {
          word_phrase_obj["phrase"] = $(word_phrase_blocks[j]).find('textarea[name="phrase"]').val().trim();
        }
        word_phrase_obj["syntactic_role"] = $(word_phrase_blocks[j]).find('input[name="syntactic-role"]').val().trim();
        word_phrase_obj["external_index"] = $(word_phrase_blocks[j]).find('input[name="external-index"]').val().trim();
        word_phrase_obj["internal_index"] = $(word_phrase_blocks[j]).find('input[name="internal-index"]').val().trim();

        rel_obj["words_and_phrases"].push(word_phrase_obj);
      }

      // push object holding info about syntactic relation to arr
      json_obj["syntactic_relations"].push(rel_obj);
    }

    // calculate recursion levels for these syntactic relations:
    // (a) complementation, (b) coordination, (c) coordination-initial (d) introduction, (e) clausal adjunction
    // if error encountered, display error dialogue and return false
    json_obj = ParsedClassicsDiagramGenerator.calculate_recursion_levels(json_obj);

    // convert generated json obj to string
    json_string = JSON.stringify(json_obj);

    // get json output textarea
    output_textarea = $("#json-output-textarea");

    // put json string to output textarea
    output_textarea.val(json_string);

    // save generated json in local storage
    localStorage.setItem("diagram_json", json_string);
  },

  load_json_from_storage: function() {
    var json_string,
    not_found_msg,
    json,
    ok_button,
    sentence_input_textarea,
    sentence_text_container;

    not_found_msg = "No valid JSON found in local storage.";

    // get saved json from local storage
    json_string = localStorage.getItem("diagram_json");

    if (!json_string) {
      ParsedClassicsDiagramGenerator.show_error_msg(not_found_msg);
      return;
    }

    try {
      json = JSON.parse(json_string);
    } 
    catch (error) {
      ParsedClassicsDiagramGenerator.show_error_msg(not_found_msg);
      return;
    }

    ParsedClassicsDiagramGenerator.show_attention_msg("Do you really want to load JSON from local storage?");

    // get "OK" button in attention dialogue
    ok_button = $("#ok-action-button");

    ok_button.bind("click", function() {
      // get syntax data container
      syntax_data_container = $("#syntax-data-container");

      // remove html from syntax data container
      syntax_data_container.html("");

      // get button container
      btn_container = $("#syntax-data-btn-container");

      // remove html from button container
      btn_container.html("");

      // remove data from sentence input textarea
      sentence_input_textarea = $("#sentence-input-textarea");
      sentence_input_textarea.val("");

      // remove text from text container
      sentence_text_container = $("#sentence-text-container");
      sentence_text_container.html("");

      // put json to json output textarea
      $("#json-output-textarea").val(json_string);

      // close attention dialogue
      $("#pc-tools-attention-dialogue .pc-close-dialogue-button").trigger(
        "click"
      );
      
      // unbind click event
      ok_button.unbind("click");
    });
  },

  load_form_values_from_json: function () {
    var json_textarea, 
    sentence_textarea, 
    json, 
    ok_button, 
    syntax_data_container,
    btn_container, 
    new_relation_button,
    relation_container,
    new_word_button,
    new_phrase_button,
    word_or_phrase_container,
    sentence_text_container,
    options_container;

    json_textarea = $("#json-output-textarea");

    json = json_textarea.val();

    try {
      json = JSON.parse(json);
    } 
    catch (error) {
      ParsedClassicsDiagramGenerator.show_error_msg("No valid JSON found in the field.");
      return;
    }
    
    ParsedClassicsDiagramGenerator.show_attention_msg("Do you really want to load form values from JSON?");

    // get "OK" button in attention dialogue
    ok_button = $("#ok-action-button");

    ok_button.bind("click", function() {
      
      // get syntax data container
      syntax_data_container = $("#syntax-data-container");

      // remove html from syntax data container
      syntax_data_container.html("");

      // get button container
      btn_container = $("#syntax-data-btn-container");

      // remove html from button container
      btn_container.html("");

      // get sentence textarea
      sentence_textarea = $("#sentence-input-textarea");

      // remove data from sentence input textarea
      sentence_textarea.val("");

      // remove text from text container
      sentence_text_container = $("#sentence-text-container");
      sentence_text_container.html("");

      // get options container and restore options values
      options_container = $("#options-panel");
      if (typeof json.options != "undefined" && typeof json.options.column_left_distance != "undefined" && $.isArray(json.options.column_left_distance) && json.options.column_left_distance.length > 0) {
        options_container.find('input[name="column-left-distance"]').val(json.options.column_left_distance.join("|"));
        //localStorage.setItem("column_left_distance", json.options.column_left_distance.join("|"));
        ParsedClassicsDiagramGenerator.column_left_distance = json.options.column_left_distance;
      }

      if (typeof json.sentence_html != "undefined" && json.sentence_html) {
        
        // put sentence html into sentence textarea
        sentence_textarea.val(json.sentence_html);
        // load sentence
        ParsedClassicsDiagramGenerator.load_sentence();
        // get new relation button
        new_relation_button = $("#new-syntactic-relation-button");

        // loop through syntactic relations
        for (var i = 0; i < json.syntactic_relations.length; i++) {
          if (i > 0) {
            // create fieldset for relation
            new_relation_button.trigger("click");
          }
          // get fieldset for syntactic relation
          relation_container = syntax_data_container.find(".relation-container").last();
          // set syntactic relation value
          relation_container.find('select[name="syntactic-relation"] > option[value="' + json.syntactic_relations[i].relation + '"]').prop('selected', true);
          // set resulting phrase value
          relation_container.find('textarea[name="resulting-phrase"]').val(json.syntactic_relations[i].resulting_phrase);
          // set root relation
          relation_container.find('input[name="root"]').prop('checked', json.syntactic_relations[i].root);
          // set external index
          relation_container.find('input[name="external-index"]').val(json.syntactic_relations[i].external_index);
          // set internal index
          relation_container.find('input[name="internal-index"]').val(json.syntactic_relations[i].internal_index);
          // set clause type
          relation_container.find('textarea[name="clause-type"]').val(json.syntactic_relations[i].clause_type);

          // get new word button
          new_word_button = relation_container.find('button.add-word');
          // get new phrase button
          new_phrase_button = relation_container.find('button.add-phrase');

          // loop through words and phrases
          for (var j = 0; j < json.syntactic_relations[i].words_and_phrases.length; j++) {
            // create fieldset for word or phrase
            if ($.trim(json.syntactic_relations[i].words_and_phrases[j].phrase)) {
              new_phrase_button.trigger("click");
            }
            else {
              new_word_button.trigger("click");
            }
            word_or_phrase_container = relation_container.find('div.word-inputs-block, div.phrase-inputs-block').last();
            // set word value
            if ($.trim(json.syntactic_relations[i].words_and_phrases[j].word)) {
              word_or_phrase_container.find('select[name="word"] option[value="' + $.trim(json.syntactic_relations[i].words_and_phrases[j].word) + '"]').prop('selected', true);
            }
            // set word2 value
            if ($.trim(json.syntactic_relations[i].words_and_phrases[j].word2)) {
              word_or_phrase_container.find('input[name="word2"]').val($.trim(json.syntactic_relations[i].words_and_phrases[j].word2));
            }
            // set phrase value
            if ($.trim(json.syntactic_relations[i].words_and_phrases[j].phrase)) {
              word_or_phrase_container.find('textarea[name="phrase"]').val($.trim(json.syntactic_relations[i].words_and_phrases[j].phrase));
            }
            // set subscript value
            if ($.trim(json.syntactic_relations[i].words_and_phrases[j].subscript)) {
              word_or_phrase_container.find('input[name="subscript"]').val($.trim(json.syntactic_relations[i].words_and_phrases[j].subscript));
            }
            // set syntactic role value
            if ($.trim(json.syntactic_relations[i].words_and_phrases[j].syntactic_role)) {
              word_or_phrase_container.find('input[name="syntactic-role"]').val($.trim(json.syntactic_relations[i].words_and_phrases[j].syntactic_role));
            }
            // set external index value
            if ($.trim(json.syntactic_relations[i].words_and_phrases[j].external_index)) {
              word_or_phrase_container.find('input[name="external-index"]').val($.trim(json.syntactic_relations[i].words_and_phrases[j].external_index));
            } 
            // set internal index value
            if ($.trim(json.syntactic_relations[i].words_and_phrases[j].internal_index)) {
              word_or_phrase_container.find('input[name="internal-index"]').val($.trim(json.syntactic_relations[i].words_and_phrases[j].internal_index));
            } 
          }
        }
        
        // compile popover info about articular words, implicit words and block-building phrases
        ParsedClassicsDiagramGenerator.compilePopoverInfo();

      }
      
      // close attention dialogue
      $("#pc-tools-attention-dialogue .pc-close-dialogue-button").trigger(
        "click"
      );
      
      // unbind click event
      ok_button.unbind("click");
    });
  },

  validate_syntax_inputs: function () {
    var validation_msg,
      invalidation_msg,
      relation_inputs_blocks,
      relation_containers,
      word_inputs_blocks,
      phrase_inputs_blocks,
      word_phrase_inputs_blocks,
      word_phrase_inputs_blocks_first,
      relation_name_selectbox,
      relation_name,
      resulting_phrase_textarea,
      resulting_phrase,
      center_pane,
      root_checkbox,
      root_value,
      role_input,
      role_value,
      root_num,
      word_selectbox,
      word_input,
      word_from_selectbox,
      word_from_input,
      phrase_textarea,
      phrase_from_textarea,
      external_index_input,
      external_index,
      internal_indexes_defined,
      internal_indexes_used,
      internal_index_input,
      internal_index,
      introduction_relation_containers,
      intro_rel_expr_1,
      intro_rel_expr_2,
      intro_rel_expr_1_arr,
      intro_rel_expr_2_arr,
      expr_non_unique_index,
      rel_non_unique_index,
      internal_index_arr,
      clause_type_textarea,
      clause_type;

    validation_msg = "validated";
    invalidation_msg = "invalidated";

    // get center pane in which all syntax inputs are placed
    center_pane = $(".ui-layout-center");

    // I. validate input blocks of syntactic relations

    // (a) at least one relation must be defined

    // get all relation input blocks
    relation_inputs_blocks = $("#syntax-data-container .relation-inputs-block");

    if (relation_inputs_blocks.length == 0) {
      ParsedClassicsDiagramGenerator.show_error_msg(
        "No syntactic relation defined!"
      );
      return invalidation_msg;
    }

    // (b) relation must contain word(s) or/and phrase(s)

    // get all relation containers
    relation_containers = $("#syntax-data-container .relation-container");

    for (var i = 0; i < relation_containers.length; i++) {
      word_inputs_blocks = $(relation_containers[i]).find(".word-inputs-block");
      phrase_inputs_blocks = $(relation_containers[i]).find(
        ".phrase-inputs-block"
      );
      if (word_inputs_blocks.length == 0 && phrase_inputs_blocks.length == 0) {
        ParsedClassicsDiagramGenerator.show_error_msg(
          "Syntactic relation must contain word(s) or/and phrase(s)!"
        );
        center_pane.scrollTo(relation_containers[i], 400);
        return invalidation_msg;
      }
    }

    // (c) relation name must be selected in each relation inputs block

    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      relation_name_selectbox = $(relation_inputs_blocks[i]).find(
        'select[name="syntactic-relation"]'
      );
      relation_name = relation_name_selectbox.val();
      if (!relation_name) {
        ParsedClassicsDiagramGenerator.show_error_msg(
          "The field Relation name has no value!"
        );
        center_pane.scrollTo(relation_name_selectbox, 400);
        return invalidation_msg;
      }
    }

    // (d) resulting phrase must be entered

    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      resulting_phrase_textarea = $(relation_inputs_blocks[i]).find(
        'textarea[name="resulting-phrase"]'
      );
      resulting_phrase = $.trim(resulting_phrase_textarea.val());
      if (!resulting_phrase) {
        ParsedClassicsDiagramGenerator.show_error_msg(
          "The field Resulting phrase has no value!"
        );
        center_pane.scrollTo(resulting_phrase_textarea, 400);
        return invalidation_msg;
      }
    }

    // (e) one and only one relation must be marked as root relation
    root_num = 0;
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      root_checkbox = $(relation_inputs_blocks[i]).find('input[name="root"]');
      root_value = root_checkbox.is(":checked");
      if (root_value == true) {
        root_num++;
      }
    }
    if (root_num != 1) {
      ParsedClassicsDiagramGenerator.show_error_msg(
        "One and only one relation must be marked as root relation!"
      );
      return invalidation_msg;
    }

    //(f) relations must have internal index and internal index must be unique
    internal_index_arr = [];
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      root_checkbox = $(relation_inputs_blocks[i]).find('input[name="root"]');
      root_value = root_checkbox.is(":checked");
      internal_index_input = $(relation_inputs_blocks[i]).find(
        'input[name="internal-index"]'
      );
      if (root_value != true) {
        internal_index = $.trim(internal_index_input.val());
        internal_index_arr.push(internal_index);
        if (!internal_index) {
          ParsedClassicsDiagramGenerator.show_error_msg(
            "Each relation must have internal index!"
          );
          center_pane.scrollTo(internal_index_input, 400);
          return invalidation_msg;
        }
        rel_non_unique_index = ParsedClassicsDiagramGenerator.find_last_non_unique_item(internal_index_arr);
        if (rel_non_unique_index != -1) {
          ParsedClassicsDiagramGenerator.show_error_msg("Internal index of each relation must be unique!");
          // find input of internal index of introductory word which is not unique
          internal_index_input = relation_inputs_blocks.find('input').filter(function() { return this.value == internal_index_arr[rel_non_unique_index] }).last(); 
          center_pane.scrollTo(internal_index_input, 400);
          return invalidation_msg;
        }
      }
      else {
        // inner index of root relation must be "root_relation"
        internal_index_input.val('root_relation');
      }
    }

    // (g) if relation has external index, it also must have clause type
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      external_index_input = $(relation_inputs_blocks[i]).find('input[name="external-index"]'); 
      external_index = external_index_input.val().trim();
      if (external_index) {
        clause_type_textarea = $(relation_inputs_blocks[i]).find('textarea[name="clause-type"]');
        clause_type = clause_type_textarea.val().trim();
        if (!clause_type) {
          ParsedClassicsDiagramGenerator.show_error_msg("Clause type of each clause must be defined!");
          center_pane.scrollTo(clause_type_textarea, 400);
          return invalidation_msg;
        }
      }
    }

    // II. validate input blocks of words

    // (a) word must be selected in each input block (in selectbox or in text input, but not in both)

    for (var i = 0; i < relation_containers.length; i++) {
      relation_name_selectbox = $(relation_containers[i]).find('select[name="syntactic-relation"]');
      relation_name = relation_name_selectbox.val();
      if (relation_name != "cable" && relation_name != "fork2") {
        word_inputs_blocks = $(relation_containers[i]).find(".word-inputs-block");
        for (var j = 0; j < word_inputs_blocks.length; j++) {
          word_selectbox = $(word_inputs_blocks[j]).find('select[name="word"]');
          word_input = $(word_inputs_blocks[j]).find('input[name="word2"]');
          word_from_selectbox = word_selectbox.val();
          word_from_input = $.trim(word_input.val());
          if (
            (!word_from_selectbox && !word_from_input) ||
            (word_from_selectbox && word_from_input)
          ) {
            ParsedClassicsDiagramGenerator.show_error_msg(
              "The word must be entered either through selectbox or through text input!"
            );
            center_pane.scrollTo(word_selectbox, 400);
            return invalidation_msg;
          }
        }
      }
      
    }

    // (b) word must have internal index
    for (var i = 0; i < relation_containers.length; i++) {
      word_inputs_blocks = $(relation_containers[i]).find(".word-inputs-block");
      for (var j = 0; j < word_inputs_blocks.length; j++) {
        word_selectbox = $(word_inputs_blocks[j]).find('select[name="word"]');
        word_input = $(word_inputs_blocks[j]).find('input[name="word2"]');
        word_from_selectbox = word_selectbox.val();
        word_from_input = $.trim(word_input.val());
        internal_index_input = $(word_inputs_blocks[j]).find('input[name="internal-index"]');
        internal_index = internal_index_input.val();
        if (internal_index == "") {
          ParsedClassicsDiagramGenerator.show_error_msg(
            "The word " + word_from_selectbox + word_from_input + " must have internal index!"
          );
          center_pane.scrollTo(internal_index_input, 400);
          return invalidation_msg;
        }
      }
    }

    // III. validate input blocks of phrases

    // (a) phrase must be entereded in each input block

    for (var i = 0; i < relation_containers.length; i++) {
      phrase_inputs_blocks = $(relation_containers[i]).find(
        ".phrase-inputs-block"
      );
      for (var j = 0; j < phrase_inputs_blocks.length; j++) {
        phrase_textarea = $(phrase_inputs_blocks[j]).find(
          'textarea[name="phrase"]'
        );
        phrase_from_textarea = $.trim(phrase_textarea.val());
        if (!phrase_from_textarea) {
          ParsedClassicsDiagramGenerator.show_error_msg(
            "The phrase text must be entered in the field!"
          );
          center_pane.scrollTo(phrase_textarea, 400);
          return invalidation_msg;
        }
      }
    }

    // (b) internal index must be entered in each phrase inputs block

    for (var i = 0; i < relation_containers.length; i++) {
      phrase_inputs_blocks = $(relation_containers[i]).find(
        ".phrase-inputs-block"
      );
      for (var j = 0; j < phrase_inputs_blocks.length; j++) {
        internal_index_input = $(phrase_inputs_blocks[j]).find(
          'input[name="internal-index"]'
        );
        internal_index = internal_index_input.val();
        if (!internal_index) {
          ParsedClassicsDiagramGenerator.show_error_msg(
            "Internal index must be entered for the phrase!"
          );
          center_pane.scrollTo(internal_index_input, 400);
          return invalidation_msg;
        }
      }
    }

    // (f) internal index of the phrase used but not defined
    internal_indexes_defined = [];
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      root_checkbox = $(relation_inputs_blocks[i]).find('input[name="root"]');
      root_value = root_checkbox.is(":checked");
      if (root_value != true) {
        internal_index_input = $(relation_inputs_blocks[i]).find(
          'input[name="internal-index"]'
        );
        internal_index = $.trim(internal_index_input.val());
        if (internal_index) {
          internal_indexes_defined.push(internal_index);
        }
      }
    }
    phrase_inputs_blocks = relation_containers.find(".phrase-inputs-block");
    for (var i = 0; i < phrase_inputs_blocks.length; i++) {
      internal_index_input = $(phrase_inputs_blocks[i]).find(
        'input[name="internal-index"]'
      );
      internal_index = $.trim(internal_index_input.val());
      if (
        internal_index &&
        $.inArray(internal_index, internal_indexes_defined) == -1
      ) {
        ParsedClassicsDiagramGenerator.show_error_msg(
          "Internal index '" + internal_index + "' used, but not defined!"
        );
        center_pane.scrollTo(internal_index_input, 400);
        return invalidation_msg;
      }
    }

    // IV. validate inputs of certain syntactic relations

    // (a) in complementation relation syntactic roles must be assigned to each word or phrase
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      relation_name_selectbox = $(relation_inputs_blocks[i]).find('select[name="syntactic-relation"]');
      relation_name = relation_name_selectbox.val();
      if (relation_name == "complementation") {
        word_phrase_inputs_blocks = $(relation_containers[i]).find(".word-inputs-block, .phrase-inputs-block");
        for (var j = 0; j < word_phrase_inputs_blocks.length; j++) {
          role_input = $(word_phrase_inputs_blocks[j]).find('input[name="syntactic-role"]');
          role_value = $.trim(role_input.val());
          if (!role_value) {
            ParsedClassicsDiagramGenerator.show_error_msg(
              "In complementation relation syntactic roles must be assigned to each word or phrase!"
            );
            center_pane.scrollTo(role_input, 400);
            return invalidation_msg;
          }
        }
      } 
    }

    // (b) in introduction relation syntactic role must be assigned to introductory word (translative) 
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      relation_name_selectbox = $(relation_inputs_blocks[i]).find('select[name="syntactic-relation"]');
      relation_name = relation_name_selectbox.val();
      if (relation_name == "introduction") {
        word_phrase_inputs_blocks_first = $(relation_containers[i]).find(".word-inputs-block, .phrase-inputs-block").first();
        role_input = $(word_phrase_inputs_blocks_first).find('input[name="syntactic-role"]');
        role_value = $.trim(role_input.val());
        if (!role_value) {
          ParsedClassicsDiagramGenerator.show_error_msg(
            "In introduction relation syntactic role must be assigned to first word of the relation!"
          );
          center_pane.scrollTo(role_input, 400);
          return invalidation_msg;
        }
      }
    }

    // (c) in clausal-adjunction relation syntactic role must be assigned to first word of the relation
    for (var i = 0; i < relation_inputs_blocks.length; i++) {
      relation_name_selectbox = $(relation_inputs_blocks[i]).find('select[name="syntactic-relation"]');
      relation_name = relation_name_selectbox.val();
      if (relation_name == "clausal-adjunction") {
        word_phrase_inputs_blocks_first = $(relation_containers[i]).find(".word-inputs-block, .phrase-inputs-block").first();
        role_input = $(word_phrase_inputs_blocks_first).find('input[name="syntactic-role"]');
        role_value = $.trim(role_input.val());
        if (!role_value) {
          ParsedClassicsDiagramGenerator.show_error_msg(
            "In clausal adjunction relation syntactic role must be assigned to first expression of the relation!"
          );
          center_pane.scrollTo(role_input, 400);
          return invalidation_msg;
        }
      }
    }

    // (d) in introduction relation:
    // - expression can play the role of introductory word only in one introduction relation 
    // - expression can ce second constituent only in one introduction relation

    // get all containers of introduction relation
    introduction_relation_containers = relation_containers.filter(function(index, element) {
      return $(element).find('option[value="introduction"]:selected').length === 1;
    });

    // find first and second expression of introduction relation and push them to respective arrays
    intro_rel_expr_1_arr = [];
    intro_rel_expr_2_arr = [];
    for (var i = 0; i < introduction_relation_containers.length; i++) {
      intro_rel_expr_1 = $(introduction_relation_containers[i]).find('input[name="internal-index"]').eq(1).val();
      intro_rel_expr_2 = $(introduction_relation_containers[i]).find('input[name="internal-index"]').eq(2).val();
      intro_rel_expr_1_arr.push(intro_rel_expr_1);
      intro_rel_expr_2_arr.push(intro_rel_expr_2);
    }

    // find if there is internal index of introductory word which is not unique
    expr_non_unique_index = ParsedClassicsDiagramGenerator.find_last_non_unique_item(intro_rel_expr_1_arr);
    if (expr_non_unique_index != -1) {
      ParsedClassicsDiagramGenerator.show_error_msg("The expression (internal index " + intro_rel_expr_1_arr[expr_non_unique_index] + ") can play the role of introductory word only in one introduction relation!");
      // find input of internal index of introductory word which is not unique
      internal_index_input = introduction_relation_containers.find('input').filter(function() { return this.value == intro_rel_expr_1_arr[expr_non_unique_index] }).last();      
      center_pane.scrollTo(internal_index_input, 400);
      return invalidation_msg;
    }
    // find if there is internal index of second constituent which is not unique
    expr_non_unique_index = ParsedClassicsDiagramGenerator.find_last_non_unique_item(intro_rel_expr_2_arr);
    if (expr_non_unique_index != -1) {
      ParsedClassicsDiagramGenerator.show_error_msg("The expression (internal index " + intro_rel_expr_1_arr[expr_non_unique_index] + ") can be second constituent in only one introduction relation!");
      // find input of internal index of second constituent which is not unique
      internal_index_input = introduction_relation_containers.find('input').filter(function() { return this.value == intro_rel_expr_2_arr[expr_non_unique_index] }).last();
      center_pane.scrollTo(internal_index_input, 400);
      return invalidation_msg;
    }

    return validation_msg;
  },

  find_last_non_unique_item: function(arr) {
    for (var i = 0; i < arr.length; i++) {
      if(arr.lastIndexOf(arr[i]) !== i) {
         return arr.lastIndexOf(arr[i]);
      };
    };
    return -1;
  },

  calculate_recursion_levels: function(json) {
    var block_forming_relations_names,
    block_forming_relations_arr,
    relation_name,
    words_and_phrases,
    words_and_phrases2,
    recursion_level_curr,
    recursion_level_prev,
    recursion_level_incr,
    each_passed,
    internal_index,
    iterator,
    loop_max;

    // array of all block generating syntactic relations (from values inside "Relation name" selectbox)
    block_forming_relations_names = ["complementation", "coordination", "coordination-initial", "specification", "introduction", "clausal-adjunction", "fork", "hook"];

    // push all block generating syntactic relations to arr
    block_forming_relations_arr = [];
    for (var i = 0; i < json.syntactic_relations.length; i++) {
      relation_name = json.syntactic_relations[i].relation;
      if ($.inArray(relation_name, block_forming_relations_names) > -1) {
        block_forming_relations_arr.push(json.syntactic_relations[i]);
      }
    }

    // assign all words to recursion_level 0
    for (var i = 0; i < block_forming_relations_arr.length; i++) {
      words_and_phrases = block_forming_relations_arr[i].words_and_phrases;
      for (var j = 0; j < words_and_phrases.length; j++) {
        if (words_and_phrases[j].word || words_and_phrases[j].word2) {
          words_and_phrases[j].recursion_level = 0;
        }
      }
    }

    // set starting recursion level
    recursion_level_curr = 1;
    // to prevent infinite loop set max num of loops
    loop_max = 500;
    // set iterator to count num of loops
    iterator = 0;
    do {
      iterator++;
      // by default recursion level will not be increased
      recursion_level_incr = false;
      // find previous recursion level
      recursion_level_prev = recursion_level_curr - 1;
      // loop through words
      for (var i = 0; i < block_forming_relations_arr.length; i++) {
        words_and_phrases = block_forming_relations_arr[i].words_and_phrases;
        // do each subexpression inside relation has (a )recursion level defined and (b) lower or equal to previous recursion level?
        for (var j = 0; j < words_and_phrases.length; j++) {
          if (typeof  words_and_phrases[j].recursion_level != "undefined" && words_and_phrases[j].recursion_level <= recursion_level_prev) {
            each_passed = true;
          }
          else {
            each_passed = false;
            break;
          }
          
          // we found that in relation each subexpression has (a) recursion level defined and (b) lower or equal to previous recursion level
          if (j == words_and_phrases.length - 1 && each_passed == true) {
            // is relation's recursion level defined?
            if (typeof block_forming_relations_arr[i].recursion_level == "undefined") {
              // add recursion level to relation
              block_forming_relations_arr[i].recursion_level = recursion_level_curr;
              // since there exists at least one relation having certain recursion level, we will need to check if there are relations having higher recursion level
              recursion_level_incr = true;
              // get internal index
              internal_index = block_forming_relations_arr[i].internal_index;
              // search for phrases having the same internal index
              for (var k = 0; k < block_forming_relations_arr.length; k++) {
                words_and_phrases2 = block_forming_relations_arr[k].words_and_phrases;
                for (var l = 0; l < words_and_phrases2.length; l++) {
                  // is there phrase having (a) recursion level undefined and (b) the same internal index?
                  if (typeof  words_and_phrases2[l].phrase != "undefined" && words_and_phrases2[l].internal_index == internal_index) {
                    // add recursion level to phrase
                    words_and_phrases2[l].recursion_level = recursion_level_curr;
                  }
                }
              }
            }
          }
        }
      }
      if (recursion_level_incr === true) {
        recursion_level_curr = recursion_level_curr + 1;
      }
    } while (recursion_level_incr === true || iterator == loop_max)

    return json;
  },

  generate_diagram: function () {
    var json_output_textarea,
    json,
    draw,
    svg_diagram_container,
    resulting_group;
      
    json_output_textarea = $("#json-output-textarea");
    json = $.trim(json_output_textarea.val());

    // is the string in json output textarea really json string?
    try {
      json = JSON.parse(json)
    } catch (err) {
      ParsedClassicsDiagramGenerator.show_error_msg(
        "No JSON found in JSON output textarea!"
      );
      return;
    }

    // second check if the string in json output textarea really needed json string
    if (!json || typeof json.syntactic_relations == "undefined") {
      ParsedClassicsDiagramGenerator.show_error_msg(
        "No JSON found in JSON output textarea!"
      );
      return;
    }

    if (json) {
      // get diagram container
      svg_diagram_container = $("#svg-diagram-container");

      // remove existing SVG diagram from diagram container
      svg_diagram_container.find("svg").remove();

      // initialize SVG.js 
      var draw = SVG().addTo("#svg-diagram-container");
      //draw.size(2500, 5500)

      // Phase 0.: generate <text> el for each word and mark hotspots
      ParsedClassicsDiagramGenerator.draw_phase_0(draw, json);

      // Phase 1.: generate blocks for block-building relations: (a) complementation, (b) coordination, (c) coordination-initial (d) introduction, (e) specification, (f) clausal adjunction
      ParsedClassicsDiagramGenerator.draw_phase_1(draw, json);

      // Phase 2.: generate columns from expressions participating in block-non-building relations: (a) modification, (b) apposition, (c) relativization
      resulting_group = draw.group();
      resulting_group.attr("id", "mrk_diagram");
      ParsedClassicsDiagramGenerator.draw_phase_2(draw, json, null, resulting_group);

      if (!ParsedClassicsDiagramGenerator.debug) {
        // display diagram container
        svg_diagram_container.css("position", "static");
      }
    }
    
    
  },

  draw_phase_0: function(draw, json) {
    var svg_diagram_container,
    phase_info_el,
    relations,
    rel_info,
    expressions,
    exp_info,
    word_text,
    text_el,
    bbox,
    bbox2,
    text_x_coord,
    text_y_coord,
    word_internal_index,
    word_external_index,
    group_el,
    group_new,
    rect,
    rect2,
    hotspot_l,
    hotspot_lb,
    hotspot_tc,
    hotspot_bc,
    hotspot_tr,
    hotspot_br,
    hotspot_r1,
    hotspot_r2,
    hotspot_r3,
    hotspot_r4,
    hotspot_r5,
    index_el,
    word_els,
    circle;

    if (ParsedClassicsDiagramGenerator.debug) {
      // get diagram container
      svg_diagram_container = $("#svg-diagram-container");
      // display diagram container
      svg_diagram_container.css("position", "static");
    }
    
    relations = json.syntactic_relations;

    for (var i = 0; i < relations.length; i++) {
      rel_info = relations[i];
      expressions = rel_info.words_and_phrases;

      for (var j = 0; j < expressions.length; j++) {
        exp_info = expressions[j];
        // is expression a word?
        if (exp_info.word || exp_info.word2) {
          // combine word text and syntactic role info
          word_text = exp_info.word2 ? exp_info.word2 : exp_info.word;
          word_text = exp_info.syntactic_role ? " " + exp_info.syntactic_role + " " + word_text : " " + word_text;
          word_text = (typeof exp_info.subscript == 'undefined' || !exp_info.subscript) ? word_text + " " : word_text;

          // get word's internal index
          word_internal_index = exp_info.internal_index;
          // get word's external index
          word_external_index = exp_info.external_index;

          // find if there is svg group having its "id" equal to word_internal_index
          group_el = draw.find("#" + word_internal_index);
          // there are no such svg group
          if (group_el.length == 0) {
            // create the text element
            text_el = draw.text(word_text);
            // add subscript
            if (typeof exp_info.subscript != 'undefined' && exp_info.subscript) {
              text_el.build(true);
              text_el.tspan(exp_info.subscript).attr('style', `baseline-shift: ${ParsedClassicsDiagramGenerator.subscript_shift}; font-size: ${ParsedClassicsDiagramGenerator.subscript_font_size}`);
              text_el.tspan(' ');
            }
            text_el.attr(
              "xml:space",
              "preserve",
              "http://www.w3.org/XML/1998/namespace"
            );

            // find dimensions of text el
            bbox = text_el.node.getBBox();

            // draw rectangle around the word
            rect = draw
            .rect(bbox.width, bbox.height + 10) // "10" needed to add 5px top and bottom padding around text
            .attr("fill", ParsedClassicsDiagramGenerator.fill_color)
            .attr("fill-opacity", ParsedClassicsDiagramGenerator.fill_opacity)
            .attr("stroke", ParsedClassicsDiagramGenerator.line_color)
            .attr("stroke-width", ParsedClassicsDiagramGenerator.word_border_width + "px")
            .attr("rx", 1.5)
            .move(bbox.x, bbox.y - 5); // "5" needed to add 5px top and bottom padding around text

            // draw left hotspot
            hotspot_l = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_l");
            // draw left bottom hotspot
            hotspot_lb = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_lb");
            // draw top center hotspot
            hotspot_tc = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_tc");
            // draw top right hotspot
            hotspot_tr = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_tr");
            // draw bottom center hotspot
            hotspot_bc = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_bc");
            // draw bottom right hotspot
            hotspot_br = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_br");
            // draw right first hotspot
            hotspot_r1 = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_r1");
            // draw right second hotspot
            hotspot_r2 = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_r2");
            // draw right third hotspot
            hotspot_r3 = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_r3");
            // draw right fourth hotspot
            hotspot_r4 = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_r4");
            // draw right fifth hotspot
            hotspot_r5 = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_r5");

            // add external index
            if (word_external_index) {
              index_el = draw.text(word_external_index);
              index_el.attr(
                "xml:space",
                "preserve",
                "http://www.w3.org/XML/1998/namespace"
              );
              index_el.attr("font-size", ParsedClassicsDiagramGenerator.font_size_small);
              index_el.attr("text-anchor", "end");
              index_el.attr("class", "external_index");
              // find dimensions of text el
              bbox = hotspot_l.node.getBBox();
              bbox2 = index_el.node.getBBox();
              index_el.move(bbox.x - (bbox2.width + 4), bbox.y + ParsedClassicsDiagramGenerator.word_border_width + 3);
              // draw rectangle around index el to control correctness of placing of external index
              bbox2 = index_el.node.getBBox();
              rect2 = draw
              .rect(bbox2.width, bbox2.height)
              .attr("fill", "transparent") 
              .attr("fill-opacity", ParsedClassicsDiagramGenerator.fill_opacity)
              .attr("stroke", ParsedClassicsDiagramGenerator.line_color)
              .attr("stroke-width", 0)
              .move(bbox2.x, bbox2.y);
            }
            
            // join rectangle, text, hotspots, external index into group
            group_new = draw.group();
            group_new.add(text_el);
            group_new.add(rect);
            group_new.add(hotspot_l);
            group_new.add(hotspot_lb);
            group_new.add(hotspot_tc);
            group_new.add(hotspot_tr);
            group_new.add(hotspot_bc);
            group_new.add(hotspot_br);
            group_new.add(hotspot_r1);
            group_new.add(hotspot_r2);
            group_new.add(hotspot_r3);
            group_new.add(hotspot_r4);
            group_new.add(hotspot_r5);
            if (word_external_index) {
              group_new.add(index_el);
              group_new.add(rect2); 
            }
            group_new.attr("id", word_internal_index);
            group_new.attr("class", "word");
            group_new.attr("data-recursion-level", "0");

          }
        }
        // it is not word, it is secon "expression" of "technical" relation "cable"
        else if (rel_info.relation == "cable") {
          // get word's internal index
          word_internal_index = exp_info.internal_index;
          // find if there is svg group having its "id" equal to word_internal_index
          group_el = draw.find("#" + word_internal_index);
          // there are no such svg group
          if (group_el.length == 0) {
            circle = draw
            .circle(ParsedClassicsDiagramGenerator.word_border_width)
            .fill(ParsedClassicsDiagramGenerator.hotspot_color) 
            .attr("class", "hotspot_r3 hotspot_l")
            .attr("data-recursion-level", "0");

            group_new = draw.group();
            group_new.add(circle);
            group_new.attr("id", word_internal_index);
            group_new.attr("class", "word");
            group_new.attr("data-recursion-level", "0");
          } 
        }
         
      }
    }

    // display words one below another
    text_x_coord = ParsedClassicsDiagramGenerator.left_padding;
    text_y_coord = 0;
    word_els = SVG.find('g[data-recursion-level="0"]');
    for (var i = 0; i < word_els.length; i++) {
      // get dimentions of the group
      if (i > 0) {
        bbox = word_els[i - 1].node.getBBox();
      }
      
      // place words exactly one below other
      text_y_coord += ( i > 0 ? bbox.height : 0);
      // add some vertical space between words
      text_y_coord += ParsedClassicsDiagramGenerator.space_y_between_words;

      word_els[i].move(text_x_coord, text_y_coord);
    }
    
  },

  draw_phase_1: function(draw, json) {
    var phase_info_el,
    syntactic_relations,
    recursion_level_max,
    recursion_level_curr,
    prev_level_els,
    most_bottom_el,
    bbox,
    y_coord_max,
    group_new;

    syntactic_relations = json.syntactic_relations;

    // find highest recursion number
    recursion_level_max = 0;
    for (var i = 0; i < syntactic_relations.length; i++) {
      if (syntactic_relations[i].recursion_level != "undefined" && syntactic_relations[i].recursion_level > recursion_level_max) {
        recursion_level_max = syntactic_relations[i].recursion_level;
      }
    }

    // get all <g> els produced in preparatory phase
    prev_level_els = SVG.find('g[data-recursion-level="0"]');

    // find most bottom <g> el produced in preparatory phase
    most_bottom_el = prev_level_els[0];
    bbox =  most_bottom_el.node.getBBox();
    y_coord_max = bbox.y;
    for (var j = 1; j < prev_level_els.length; j++) {
      bbox =  prev_level_els[j].node.getBBox();
      if (bbox.y > y_coord_max) {
        most_bottom_el = prev_level_els[j];
      }
    }

    // loop recursion levels
    for (recursion_level_curr = 1; recursion_level_curr <= recursion_level_max; recursion_level_curr++) {
      
      //if (recursion_level_curr > 4) {return;}

      // loop through all syntactic relations
      for (var i = 0; i < syntactic_relations.length; i++) {
        
        // if rel is block-forming, fire draw_block_forming_relation()
        if (syntactic_relations[i].recursion_level == recursion_level_curr 
          && (syntactic_relations[i].relation == "complementation" 
              || syntactic_relations[i].relation == "coordination" 
              || syntactic_relations[i].relation == "coordination-initial" 
              || syntactic_relations[i].relation == "specification" 
              || syntactic_relations[i].relation == "introduction"
              || syntactic_relations[i].relation == "clausal-adjunction"
              || syntactic_relations[i].relation == "hook")) {
          
          // newly generated <g> el contains diagram of complementation or coordination or ...
          group_new = ParsedClassicsDiagramGenerator.draw_block_forming_relation(draw, {
            syntactic_relation: syntactic_relations[i], 
            most_bottom_el: most_bottom_el, 
            recursion_level_curr: recursion_level_curr,
            json: json
          });
          // newly generated <g> el containing complementation diagram is now most bottom el
          if (group_new) {
            most_bottom_el = group_new;
          }
        }

      }
    }
    
  },

  draw_block_forming_relation(draw, argsObj) {
    var syntactic_relation,
    most_bottom_el,
    recursion_level_curr,
    recursion_level_block,
    json,
    relation_name,
    x_coord,
    y_coord,
    blocks_arr,
    internal_index,
    syntactic_role,
    block,
    bbox,
    group_new,
    hotspot_l;

    syntactic_relation = argsObj.syntactic_relation;
    most_bottom_el = argsObj.most_bottom_el;
    recursion_level_curr = argsObj.recursion_level_curr;
    json = argsObj.json;

    // get relation name
    relation_name = syntactic_relation.relation;

    // x coord of the blocks
    x_coord = ParsedClassicsDiagramGenerator.left_padding;

    // arr to hold blocks containing words or phrases
    blocks_arr = [];

    // loop through words and phrases contained in syntactic relation
    for (var j = 0; j < syntactic_relation.words_and_phrases.length; j++) {
      // get internal index of the expression
      internal_index = syntactic_relation.words_and_phrases[j].internal_index;
      // get syntactic role of the expression
      syntactic_role = syntactic_relation.words_and_phrases[j].syntactic_role;

      // do we have complementation or coordination? - then we need to order expressions one below the other
      if (relation_name == "complementation" || relation_name == "coordination" || relation_name == "coordination-initial") {

        // if current recursion level is bigger than 1 and we draw complementation relation, we need to add technical crowbar symbol
        if (recursion_level_curr > 1 && relation_name == "complementation") {
          ParsedClassicsDiagramGenerator.draw_crowbar(draw, {internal_index: internal_index, syntactic_role: syntactic_role, json: json});
        }

        // get <g> el
        block = SVG.find('g[id="' + internal_index + '"]');
        // if the block was not found, it must be some error in json, so let' exit
        if(block.length == 0) {return;}

        // coords of most bottom el 
        bbox =  most_bottom_el.node.getBBox();
        // calculate new y coord of the <g> el relative to most bottom el
        y_coord = bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words;
        // move <g> el
        block[0].move(x_coord, y_coord);

        // correct placing of the block relative to hotsot_l (this is needed because block might have external index in front of it)
        // get val of attr "data-recursion-level"
        recursion_level_block = SVG(block[0]).attr("data-recursion-level");
        // find hotspot_l
        hotspot_l = SVG(block[0]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
        bbox =  hotspot_l.node.getBBox();
        block[0].move(x_coord - (bbox.x - x_coord), y_coord);

        // after move the <g> el is the most bottom el
        most_bottom_el = block[0];
        // push <g> el to arr
        blocks_arr.push(block[0]);
        // check if all elements of the previous recursion levels are moved
        if (j == syntactic_relation.words_and_phrases.length - 1) {
          // add blocks_arr to arguments obj
          argsObj.blocks_arr = blocks_arr;
          // fire function to draw complementation relation
          if (relation_name == "complementation") {
            group_new = ParsedClassicsDiagramGenerator.draw_complementation(draw, argsObj);
          }
          // fire function to draw coordination relation
          else if (relation_name == "coordination" || relation_name == "coordination-initial") {
            group_new = ParsedClassicsDiagramGenerator.draw_coordination(draw, argsObj);
          }
        }
      }
      // do we have specification? - then we need get both expressions
      else if (relation_name == "specification") {
        // get <g> el
        block = SVG.find('g[id="' + internal_index + '"]');
        // if the block was not found, it must be some error in json, so let' exit
        if(block.length == 0) {return;}
        // push <g> el to arr
        blocks_arr.push(block[0]);
        // is this the last expression of this relation?
        if (j == syntactic_relation.words_and_phrases.length - 1) {
          // coords of most bottom el 
          bbox =  most_bottom_el.node.getBBox();
          // calculate new y coord of the <g> el relative to most bottom el
          y_coord = bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words;
          // move <g> el
          block.move(x_coord, y_coord);
          // after move the <g> el is the most bottom el
          most_bottom_el = block[0];
          // add blocks_arr to arguments obj
          argsObj.blocks_arr = blocks_arr;
          // draw specification relation
          group_new = ParsedClassicsDiagramGenerator.draw_specification(draw, argsObj);
        }
        
      }
      // do we have introduction? - then we need get both expressions
      if (relation_name == "introduction") {
        // get <g> el
        block = SVG.find('g[id="' + internal_index + '"]');
        // if the block was not found, it must be some error in json, so let' exit
        if(block.length == 0) {return;}
        // push <g> el to arr
        blocks_arr.push(block[0]);
        // is this the last expression of this relation?
        if (j == syntactic_relation.words_and_phrases.length - 1) {
          // add blocks_arr to arguments obj
          argsObj.blocks_arr = blocks_arr;
          // draw introduction relation
          group_new = ParsedClassicsDiagramGenerator.draw_introduction(draw, argsObj);
        }

      }
      // do we have clausal adjunction? - then we need get both expressions
      if (relation_name == "clausal-adjunction") {
        // if clausal adjunction expression is phrase (i.e. not single word), the we need to add crowbar symbol
        if (j == 0) {
          // get <g> el
          block = SVG.find('g[id="' + internal_index + '"]');
          // get val of attr "data-recursion-level"
          recursion_level_block = SVG(block[0]).attr("data-recursion-level");
          // is expression a phrase?
          if (recursion_level_block && recursion_level_block != "0") {
            //  the crowbar (if it is needed) must be drawn down-top
            ParsedClassicsDiagramGenerator.draw_crowbar(draw, {internal_index: internal_index, syntactic_role: syntactic_role, json: json, crowbar_position: "down-top"});
          }
        }
        // get <g> el
        block = SVG.find('g[id="' + internal_index + '"]');
        // if the block was not found, it must be some error in json, so let' exit
        if(block.length == 0) {return;}
        // push <g> el to arr
        blocks_arr.push(block[0]);
        // is this the last expression of this relation?
        if (j == syntactic_relation.words_and_phrases.length - 1) {
          // add blocks_arr to arguments obj
          argsObj.blocks_arr = blocks_arr;
          // draw introduction relation
          group_new = ParsedClassicsDiagramGenerator.draw_clausal_adjunction(draw, argsObj);
        }
      }
      if (relation_name == "hook") {
        // get <g> el
        block = SVG.find('g[id="' + internal_index + '"]');
        // if the block was not found, it must be some error in json, so let' exit
        if(block.length == 0) {return;}
        // push <g> el to arr
        blocks_arr.push(block[0]);
        if (j == syntactic_relation.words_and_phrases.length - 1) {
          // add blocks_arr to arguments obj
          argsObj.blocks_arr = blocks_arr;
          // draw introduction relation
          group_new = ParsedClassicsDiagramGenerator.draw_hook(draw, argsObj);
        }
      }
    }

    return group_new;
  },

  draw_complementation: function(draw, argsObj) {
    var syntactic_relation,
    recursion_level_curr,
    blocks_arr,
    recursion_level_block,
    rel_internal_index,
    rel_external_index,
    rel_clause_type,
    x_coord,
    bbox,
    top_corner,
    top_corner_x,
    top_corner_y,
    bottom_corner,
    bottom_corner_x,
    bottom_corner_y,
    left_corner_x,
    left_corner_y,
    group_new,
    hotspot_l,
    line,
    path,
    path_length,
    path_length_needed,
    point,
    external_index_x,
    external_index_y,
    hotspot_external_index,
    text_el,
    title_el,
    rect;

    syntactic_relation = argsObj.syntactic_relation;
    recursion_level_curr = argsObj.recursion_level_curr;
    blocks_arr = argsObj.blocks_arr;

    // get internal index of the relation
    rel_internal_index = syntactic_relation.internal_index;

    // get external index of the relation
    rel_external_index = syntactic_relation.external_index;

    // get clause type of the relation
    rel_clause_type = syntactic_relation.clause_type;

    // x coord of the blocks
    x_coord = ParsedClassicsDiagramGenerator.left_padding;

    // 1. get xy coord of top corner of complementation symbol
    // get recursion level of the top block
    recursion_level_block = SVG(blocks_arr[0]).attr("data-recursion-level");
    // top corner is first block's hotspot having class "hotspot_l" and block's recursion level num in its attr
    top_corner = SVG(blocks_arr[0]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
    bbox = top_corner.node.getBBox();
    top_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;
    top_corner_x = x_coord + ParsedClassicsDiagramGenerator.word_border_width/2;

    // 2. get xy coord of bottom corner of complementation symbol
    // get recursion level of the bottom block
    recursion_level_block = SVG(blocks_arr[blocks_arr.length - 1]).attr("data-recursion-level");
    // bottom corner is bottom block's hotspot having class "hotspot_l" and block's recursion level num in its attr
    bottom_corner = SVG(blocks_arr[blocks_arr.length - 1]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');

    bbox = bottom_corner.node.getBBox();
    bottom_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;
    bottom_corner_x = x_coord + ParsedClassicsDiagramGenerator.word_border_width/2;

    // 3. get xy coord of left corner of complementation symbol
    left_corner_y = top_corner_y + (bottom_corner_y - top_corner_y)/2;
    left_corner_x = x_coord - ParsedClassicsDiagramGenerator.compl_sign_width;

    // 4. draw lines from left hotspots to left corner
    group_new = draw.group();
    for (var k = 0; k < blocks_arr.length; k++) {
      // add to group each block containing word or phrase
      group_new.add(blocks_arr[k]);
      // is this neither first nor the last block?
      if (k > 0 && k < blocks_arr.length - 1) {
        // get recursion level of the block
        recursion_level_block = SVG(blocks_arr[k]).attr("data-recursion-level");
        // get left hotspot - it is block's hotspot having class "hotspot_l" and block's recursion level num in its attr
        hotspot_l = SVG(blocks_arr[k]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
        // get left hotspot's coords
        bbox =  hotspot_l.node.getBBox();
        // (a) draw line from left hotspot to complementation symbol's left corner
        line = draw
        .line(bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2, bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2, left_corner_x, left_corner_y)
        .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color});
        group_new.add(line);
      }
      // is this the last block?
      else if (k == blocks_arr.length - 1) {
        
        // (b) draw path connecting top, left and bottom corners of complementation symbol
        path = draw
        .path(`M ${top_corner_x} ${top_corner_y} ${left_corner_x} ${left_corner_y} ${bottom_corner_x} ${bottom_corner_y}`)
        .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color})
        .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
        .fill('none');
        group_new.add(path);
        
        // (c) draw external index
        if (rel_external_index) {
          // calculate xy coords for external index
          path_length = path.length(); //
          path_length_needed = path_length/2 + ParsedClassicsDiagramGenerator.external_index_pos;
          point = path.pointAt(path_length_needed);
          external_index_x = point.x - ParsedClassicsDiagramGenerator.word_border_width/2;
          external_index_y = point.y - ParsedClassicsDiagramGenerator.word_border_width/2;
          //hypotenuse_len = Math.sqrt((bottom_corner_x - left_corner_x) ** 2 + (bottom_corner_y - left_corner_y) ** 2);
          //coords_ratio = ParsedClassicsDiagramGenerator.external_index_pos / hypotenuse_len;
          //external_index_x = (left_corner_x + (bottom_corner_x - left_corner_x) * coords_ratio) - ParsedClassicsDiagramGenerator.word_border_width/3;
          //external_index_y = left_corner_y + (bottom_corner_y - left_corner_y) * coords_ratio;
          // add hotspot to control correctness of placing of external index
          hotspot_external_index =  ParsedClassicsDiagramGenerator.generate_hotspot(draw, { 
            diameter: ParsedClassicsDiagramGenerator.word_border_width,
            color: ParsedClassicsDiagramGenerator.hotspot_color,  
            recursion_level: recursion_level_curr,
            x_coord: external_index_x,
            y_coord: external_index_y,
            class_name: "hotspot_external_index"
          });
          group_new.add(hotspot_external_index);
          // create the text element
          text_el = draw.text(rel_external_index);
          text_el.attr(
            "xml:space",
            "preserve",
            "http://www.w3.org/XML/1998/namespace"
          );
          text_el.attr("font-size", ParsedClassicsDiagramGenerator.font_size_small);
          text_el.attr("text-anchor", "end");
          text_el.attr("class", "external_index");
          // find dimensions of text el
          bbox = text_el.node.getBBox();
          // move text el to complementation sign 
          text_el.move(external_index_x - (bbox.width + ParsedClassicsDiagramGenerator.word_border_width), external_index_y + ParsedClassicsDiagramGenerator.word_border_width/2);
          group_new.add(text_el);
          bbox = text_el.node.getBBox();
          // draw rectangle around text el to control correctness of placing of external index
          rect = draw
          .rect(bbox.width, bbox.height)
          .attr("fill", "white") 
          .attr("fill-opacity", ParsedClassicsDiagramGenerator.fill_opacity)
          .attr("stroke", ParsedClassicsDiagramGenerator.line_color)
          .attr("stroke-width", 0)
          .move(bbox.x, bbox.y);
          // add tooltip displaying clause type
          if (rel_clause_type) {
            title_el = draw.element('title').words(rel_clause_type);
            title_el.putIn(rect);
          }
          group_new.add(rect);
        }
      }
    }
    // draw left hotspot for <g> el containing diagram of complementation relation
    hotspot_l = ParsedClassicsDiagramGenerator.generate_hotspot(draw, { 
      diameter: ParsedClassicsDiagramGenerator.word_border_width,
      color: ParsedClassicsDiagramGenerator.hotspot_color,
      recursion_level: recursion_level_curr,
      x_coord: left_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2,
      y_coord: left_corner_y - ParsedClassicsDiagramGenerator.word_border_width/2,
      class_name: "hotspot_l"
    });
    // add left hotspot to <g> el containing diagram of complementation relation
    group_new.add(hotspot_l);
    // "id" attr will be internal index of the syntactic relation
    group_new.attr("id", rel_internal_index);
    // recursion level in attr
    group_new.attr("data-recursion-level", recursion_level_curr);
    // move <g> el containing diagram of complementation relation to x coord of the blocks
    group_new.x(ParsedClassicsDiagramGenerator.left_padding);

    return group_new;
  },

  draw_coordination: function(draw, argsObj) {
    var blocks_arr,
    syntactic_relation,
    x_coord,
    recursion_level_block,
    rel_internal_index,
    x_coord,
    bbox,
    top_right_corner,
    top_right_corner_x,
    top_right_corner_y,
    bottom_right_corner,
    bottom_right_corner_x,
    bottom_right_corner_y,
    top_left_corner_x,
    top_left_corner_y,
    bottom_left_corner_x,
    bottom_left_corner_y,
    hotspot_l,
    polyline,
    line,
    junctors_arr,
    junctor_obj,
    index,
    junctor_id,
    junctor_el,
    recursion_level,
    new_hotspot_x,
    new_hotspot_y;

    syntactic_relation = argsObj.syntactic_relation;
    recursion_level_curr = argsObj.recursion_level_curr;
    blocks_arr = argsObj.blocks_arr;

    // get internal index of the relation
    rel_internal_index = syntactic_relation.internal_index;

    // x coord of the blocks
    x_coord = ParsedClassicsDiagramGenerator.left_padding;

    // 1. get xy coord of top right corner of coordination symbol

    // get recursion level of the top block
    recursion_level_block = SVG(blocks_arr[0]).attr("data-recursion-level");
    // top right corner is first block's hotspot having class "hotspot_l" and block's recursion level num in its attr
    top_right_corner = SVG(blocks_arr[0]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
    // get hotspot's coords
    bbox = top_right_corner.node.getBBox();
    // calculate coords of top right corner
    top_right_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;
    top_right_corner_x = x_coord + ParsedClassicsDiagramGenerator.word_border_width/2;

    // 2. get xy coord of bottom right corner of complementation symbol

    // get recursion level of the bottom block
    recursion_level_block = SVG(blocks_arr[blocks_arr.length - 1]).attr("data-recursion-level");
    // bottom corner is bottom block's hotspot having class "hotspot_l" and block's recursion level num in its attr
    bottom_right_corner = SVG(blocks_arr[blocks_arr.length - 1]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
    // get hotspot's coords
    bbox = bottom_right_corner.node.getBBox();
    // calculate coords of bottom right corner
    bottom_right_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;
    bottom_right_corner_x = x_coord + ParsedClassicsDiagramGenerator.word_border_width/2;

    // 3. get xy coord of top left corner of complementation symbol
    top_left_corner_y = top_right_corner_y;
    top_left_corner_x = x_coord - ParsedClassicsDiagramGenerator.coord_sign_width;

    // 4. get xy coord of bottom left corner of complementation symbol
    bottom_left_corner_x = top_left_corner_x;
    bottom_left_corner_y = bottom_right_corner_y;

    // 5. draw coordination symbol
    group_new = draw.group();
    for (var k = 0; k < blocks_arr.length; k++) {
      // add to group each block containing word or phrase
      group_new.add(blocks_arr[k]);
      // is this neither first nor the last block?
      if (k > 0 && k < blocks_arr.length - 1) {
        // get recursion level of the block
        recursion_level_block = SVG(blocks_arr[k]).attr("data-recursion-level");
        // get left hotspot - it is block's hotspot having class "hotspot_l" and block's recursion level num in its attr
        hotspot_l = SVG(blocks_arr[k]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
        // get left hotspot's coords
        bbox =  hotspot_l.node.getBBox();
        // (a) draw line from left hotspot to coordination symbol's vertical line
        line = draw
        .line(bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2, bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2, (bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2) - ParsedClassicsDiagramGenerator.coord_sign_width, bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2)
        .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color});
        group_new.add(line);
      }
      // is this the last block?
      else if (k == blocks_arr.length - 1) {
        // draw line from bottom right corner to bottom left, to top left, to top right corner of coordination symbol
        polyline = draw
        .polyline([[bottom_right_corner_x,bottom_right_corner_y], [bottom_left_corner_x,bottom_left_corner_y], [top_left_corner_x,top_left_corner_y], [top_right_corner_x, top_right_corner_y]])
        .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color})
        .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
        .fill('none');
        group_new.add(polyline);
        // draw coordination-initial sign
        if (syntactic_relation.relation == "coordination-initial") {
          line = draw
          .line(top_left_corner_x, top_left_corner_y, top_left_corner_x, top_left_corner_y - ParsedClassicsDiagramGenerator.coord_initial_sign_height/5*3)
          .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color});
          group_new.add(line);
          line = draw
          .line(top_left_corner_x, top_left_corner_y - ParsedClassicsDiagramGenerator.coord_initial_sign_height/5*3, top_left_corner_x, top_left_corner_y - ParsedClassicsDiagramGenerator.coord_initial_sign_height,)
          .attr("style", "stroke-dasharray: 3, 1")
          .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color});
          group_new.add(line);
        }
      }
    }
    // 6. draw left hotspot for <g> el containing diagram of coordination relation
    // a) find how many junctors we have in coordination relation
    junctors_arr = [];
    if (syntactic_relation.relation != "coordination-initial") {
      for (var i = 0; i < syntactic_relation.words_and_phrases.length; i++) {
        if ($.trim(syntactic_relation.words_and_phrases[i].syntactic_role) != "") {
          junctors_arr.push(syntactic_relation.words_and_phrases[i]);
        }
      }
    }

    // b) the case junctors' number is odd
    if (junctors_arr.length % 2 == 1) {
      // in this case hotspot_l must be at the level of middle junctor
      index = Math.floor(junctors_arr.length / 2);
      junctor_obj = junctors_arr[index];
      // get id of junctor's <g> el
      junctor_id = junctor_obj.internal_index;
      // get recursion level
      recursion_level = junctor_obj.recursion_level;
      // get junctor el
      junctor_el = SVG.find('g[id="' + junctor_id + '"]');
      // get hotspot_l inside junctor el
      hotspot_l = SVG(junctor_el[0]).findOne('[data-recursion-level="' + recursion_level + '"].hotspot_l');
      // get left hotspot's coords
      bbox =  hotspot_l.node.getBBox();
      // calculate coords for left hotspot for <g> el containing diagram of coordination relation
      new_hotspot_x = top_left_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2;
      new_hotspot_y = bbox.y;
    }
    // c) the case there are no junctors or junctor's number is even
    else {
      // in this case hotspot_l must be at the middle of vertical line of coordination symbol
      new_hotspot_x = top_left_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2;
      new_hotspot_y = top_left_corner_y + (bottom_left_corner_y - top_left_corner_y)/2 - ParsedClassicsDiagramGenerator.word_border_width/2;
    }
    hotspot_l = ParsedClassicsDiagramGenerator.generate_hotspot(draw, { 
      diameter: ParsedClassicsDiagramGenerator.word_border_width,
      color: ParsedClassicsDiagramGenerator.hotspot_color,
      recursion_level: recursion_level_curr,
      x_coord: new_hotspot_x,
      y_coord: new_hotspot_y,
      class_name: "hotspot_l"
    });
    // add left hotspot to <g> el containing diagram of coordination relation
    group_new.add(hotspot_l);
    // "id" attr will be internal index of the syntactic relation
    group_new.attr("id", rel_internal_index);
    // recursion level in attr
    group_new.attr("data-recursion-level", recursion_level_curr);
    // move <g> el containing diagram of complementation relation to x coord of the blocks
    group_new.x(ParsedClassicsDiagramGenerator.left_padding);

    return group_new;
  },

  draw_specification: function(draw, argsObj) {
    var syntactic_relation,
    recursion_level_curr,
    blocks_arr,
    group_new,
    rel_internal_index,
    x_coord,
    recursion_level_block,
    right_corner,
    right_corner_x,
    right_corner_y,
    left_corner,
    left_corner_x,
    left_corner_y,
    bbox,
    specifier_x,
    specifier_y,
    line,
    hotspot_l;

    syntactic_relation = argsObj.syntactic_relation;
    recursion_level_curr = argsObj.recursion_level_curr;
    blocks_arr = argsObj.blocks_arr;

    // get internal index of the relation
    rel_internal_index = syntactic_relation.internal_index;

    // x coord of the blocks
    x_coord = ParsedClassicsDiagramGenerator.left_padding;

    // create group to display specification relation
    group_new = draw.group();

    // 1. get xy coord of right corner of specification symbol
    // get recursion level of the block
    recursion_level_block = SVG(blocks_arr[1]).attr("data-recursion-level");
    // right corner is first block's hotspot having class "hotspot_l" and block's recursion level num in its attr
    right_corner = SVG(blocks_arr[1]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
    bbox = right_corner.node.getBBox();
    right_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;
    right_corner_x = bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2;
    group_new.add(blocks_arr[1]);

    // 2. get xy of the specifier block relative to right corner and move specifier block
    bbox = blocks_arr[0].node.getBBox();
    specifier_x = (right_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2) - (bbox.width + ParsedClassicsDiagramGenerator.spec_sign_width);
    specifier_y = right_corner_y - bbox.height/2; 
    blocks_arr[0].move(specifier_x, specifier_y);
    group_new.add(blocks_arr[0]);

    // 3. get xy coords of left corner of specification symbol
    // get recursion level of the block
    recursion_level_block = SVG(blocks_arr[0]).attr("data-recursion-level");
    left_corner = SVG(blocks_arr[0]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_r3');
    bbox = left_corner.node.getBBox();
    left_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;
    left_corner_x = bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2;

    // 4. draw specification symbol
    line = draw
    .line(left_corner_x, left_corner_y, right_corner_x, right_corner_y)
    .stroke({ width: ParsedClassicsDiagramGenerator.spec_sign_line_width, color: ParsedClassicsDiagramGenerator.line_color});
    group_new.add(line);

    // 5. now hotspot_l of specifier should be hotspot_l of the new group, so change recursion level of specifier's hotspot_l
    recursion_level_block = SVG(blocks_arr[0]).attr("data-recursion-level");
    hotspot_l = SVG(blocks_arr[0]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
    hotspot_l.attr("data-recursion-level", recursion_level_curr);

    // "id" attr will be internal index of the syntactic relation
    group_new.attr("id", rel_internal_index);
    // recursion level in attr
    group_new.attr("data-recursion-level", recursion_level_curr);
    // move <g> el containing diagram of complementation relation to x coord of the blocks
    group_new.x(x_coord);

    return group_new;
  },

  draw_introduction: function(draw, argsObj) {
    var syntactic_relation,
    relations,
    recursion_level_curr,
    blocks_arr,
    json,
    group_new,
    rel_internal_index,
    x_coord,
    bbox,
    recursion_level_block,
    right_corner,
    right_corner_x,
    right_corner_y,
    text_el_x,
    text_el_y,
    left_bottom_corner_x,
    left_bottom_corner_y,
    left_top_corner,
    left_top_corner_x,
    left_top_corner_y,
    polyline,
    hotspot_l,
    hotspot_fork_left,
    hotspot_fork_right,
    intro_sign_width,
    draw_fork,
    id1,
    id2,
    internal_index_1,
    internal_index_2,
    fork_point_id,
    fork_point_recursion_level,
    fork_point_group,
    path_length, 
    path_length_needed,
    hotspot_fork1,
    hotspot_fork3,
    hotspot_fork4,
    d_string,
    circle_length,
    circle_hotspot_coords,
    circle_hotspot_coords2,
    circle_hotspot_coords3,
    additional_width; 

    syntactic_relation = argsObj.syntactic_relation;
    relations = argsObj.json.syntactic_relations;
    recursion_level_curr = argsObj.recursion_level_curr;
    blocks_arr = argsObj.blocks_arr;
    json = argsObj.json;

    // get internal index of the relation
    rel_internal_index = syntactic_relation.internal_index;

    // x coord of the blocks
    x_coord = ParsedClassicsDiagramGenerator.left_padding;

    // find id attr of both expressions
    id1 = blocks_arr[0].attr("id");
    id2 = blocks_arr[1].attr("id");

    // 00. find, if indroductory word is in reletions of modification, adjunction, relativization 
    // and we should add additional width to introduction sign
    additional_width = 0;
    for (var i = 0; i < relations.length; i++) {
      if ($.inArray(relations[i].relation, ["modification", "apposition", "relativization"]) != -1 && relations[i].words_and_phrases[0].internal_index == id1) {
          additional_width = ParsedClassicsDiagramGenerator.intro_sign_width_additional;
          break;
      }
    }

    // 0. find if in addition a fork symbol must be drawn
    draw_fork = false;
    
    // loop through relations, find fork relations
    for (var i = 0; i < json.syntactic_relations.length; i++) {
      if (json.syntactic_relations[i].relation == "fork") {
        internal_index_1 = json.syntactic_relations[i].words_and_phrases[0].internal_index;
        internal_index_2 = json.syntactic_relations[i].words_and_phrases[1].internal_index;
        // have fork relation the same constituents as introduction relation?
        if ((internal_index_1 == id1 || internal_index_1 == id2) && (internal_index_2 == id1 || internal_index_2 == id2)) {
          // constituents are the same, so, fork symbol must be drawn
          draw_fork = true;
          fork_point_id = json.syntactic_relations[i].internal_index;
          fork_point_recursion_level = json.syntactic_relations[i].recursion_level;
          break;
        }
      }
    }

    // create group to display specification relation
    group_new = draw.group();

    // 1. get xy coord of right corner of introduction symbol
    // get recursion level of the block
    recursion_level_block = SVG(blocks_arr[1]).attr("data-recursion-level");
    // right corner is second block's hotspot having class "hotspot_l" and block's recursion level num in its attr
    right_corner = SVG(blocks_arr[1]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
    bbox = right_corner.node.getBBox();
    right_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;
    right_corner_x = bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2;
    
    // 2. calculate xy of the introduction expression relative to right corner of the introduction symbol and move it there
    bbox = blocks_arr[0].node.getBBox();
    intro_sign_width = draw_fork ? ParsedClassicsDiagramGenerator.intro_sign_width + ParsedClassicsDiagramGenerator.fork_point_intro_width : (additional_width ? ParsedClassicsDiagramGenerator.intro_sign_width + additional_width : ParsedClassicsDiagramGenerator.intro_sign_width);
    text_el_x = (right_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2) - (bbox.width + intro_sign_width);
    text_el_y = right_corner_y - (ParsedClassicsDiagramGenerator.intro_sign_height + bbox.height);
    blocks_arr[0].move(text_el_x, text_el_y);

    // 3. calculate xy of the top left corner of introduction symbol
    // get recursion level of the block
    recursion_level_block = SVG(blocks_arr[0]).attr("data-recursion-level");
    // top left corner is first block's hotspot having class "hotspot_lb" and block's recursion level num in its attr
    left_top_corner = SVG(blocks_arr[0]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_lb');
    bbox = left_top_corner.node.getBBox();
    left_top_corner_x = bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2;
    left_top_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;

    // 4. xy of the bottom left corner of introduction symbol
    left_bottom_corner_x = left_top_corner_x;
    left_bottom_corner_y = right_corner_y;

    // 5. draw introduction symbol
    polyline = draw
    .polyline([[right_corner_x,right_corner_y], [left_bottom_corner_x,left_bottom_corner_y], [left_top_corner_x,left_top_corner_y]])
    .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color})
    .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
    .fill('none');

    // 6. add hotspot_l in bottom left corner of introduction symbol
    hotspot_l = ParsedClassicsDiagramGenerator.generate_hotspot(draw, { 
      diameter: ParsedClassicsDiagramGenerator.word_border_width,
      color: ParsedClassicsDiagramGenerator.hotspot_color,
      recursion_level: recursion_level_curr,
      x_coord: left_bottom_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2,
      y_coord: left_bottom_corner_y - ParsedClassicsDiagramGenerator.word_border_width/2,
      class_name: "hotspot_l"
    });

    // 7. draw fork
    if (draw_fork) {
      // add hotspots for drawing fork symbol
      hotspot_fork_left = ParsedClassicsDiagramGenerator.generate_hotspot(draw, { 
        diameter: ParsedClassicsDiagramGenerator.word_border_width,
        color: ParsedClassicsDiagramGenerator.hotspot_color,
        recursion_level: recursion_level_curr,
        x_coord: left_top_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2,
        y_coord: left_top_corner_y + 10,
        class_name: "hotspot_fork_left"
      });
  
      hotspot_fork_right = ParsedClassicsDiagramGenerator.generate_hotspot(draw, { 
        diameter: ParsedClassicsDiagramGenerator.word_border_width,
        color: ParsedClassicsDiagramGenerator.hotspot_color,
        recursion_level: recursion_level_curr,
        x_coord: right_corner_x - 10,
        y_coord: right_corner_y - ParsedClassicsDiagramGenerator.word_border_width/2,
        class_name: "hotspot_fork_right"
      });
      // draw path
      path = draw.path(`M${left_top_corner_x} ${left_top_corner_y + ParsedClassicsDiagramGenerator.word_border_width/2 + 10} Q ${right_corner_x - (right_corner_x - left_top_corner_x)/10} ${left_top_corner_y - (left_top_corner_y - right_corner_y)/10}, ${right_corner_x + ParsedClassicsDiagramGenerator.word_border_width/2 - 10} ${right_corner_y}`)
      .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color})
      .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
      .fill('none');

      // draw point on the path
      path_length = path.length();
      path_length_needed = path_length - ParsedClassicsDiagramGenerator.fork_point_intro_pos;
      d_string = ParsedClassicsDiagramGenerator.circle_to_path_converter(path.pointAt(path_length_needed).x, path.pointAt(path_length_needed).y, ParsedClassicsDiagramGenerator.fork_point_radius/2);
      
      circle = draw
      .path(d_string)
      .attr("stroke", ParsedClassicsDiagramGenerator.line_color)
      .attr("stroke-width", ParsedClassicsDiagramGenerator.line_width)
      .fill(ParsedClassicsDiagramGenerator.line_color)
      .attr("id", fork_point_id)
      .attr("data-recursion-level", fork_point_recursion_level)
      .attr("class", "fork_point");
      

      // draw hotspots on forkpoint
      circle_length = circle.length();

      circle_hotspot_coords = circle.pointAt(circle_length*0.7);
      hotspot_fork3 = draw
      .circle(ParsedClassicsDiagramGenerator.word_border_width)
      .fill(ParsedClassicsDiagramGenerator.hotspot_color)
      .attr("class", "hotspot_r3")
      .attr("data-recursion-level", fork_point_recursion_level)
      .move(circle_hotspot_coords.x - ParsedClassicsDiagramGenerator.word_border_width/2, circle_hotspot_coords.y - ParsedClassicsDiagramGenerator.word_border_width/2);
      circle_hotspot_coords2 = circle.pointAt(circle_length*0.7 + ParsedClassicsDiagramGenerator.word_border_width*2);
      hotspot_fork1 = draw
      .circle(ParsedClassicsDiagramGenerator.word_border_width)
      .fill(ParsedClassicsDiagramGenerator.hotspot_color)
      .attr("class", "hotspot_tr hotspot_r1 hotspot_r2")
      .attr("data-recursion-level", fork_point_recursion_level)
      .move(circle_hotspot_coords2.x - ParsedClassicsDiagramGenerator.word_border_width/2, circle_hotspot_coords2.y - ParsedClassicsDiagramGenerator.word_border_width/2);
      circle_hotspot_coords3 = circle.pointAt(circle_length*0.7 - ParsedClassicsDiagramGenerator.word_border_width*2);
      hotspot_fork5 = draw
      .circle(ParsedClassicsDiagramGenerator.word_border_width)
      .fill(ParsedClassicsDiagramGenerator.hotspot_color)
      .attr("class", "hotspot_r4 hotspot_r5 hotspot_br")
      .attr("data-recursion-level", fork_point_recursion_level)
      .move(circle_hotspot_coords3.x - ParsedClassicsDiagramGenerator.word_border_width/2, circle_hotspot_coords3.y - ParsedClassicsDiagramGenerator.word_border_width/2);
    }

    group_new.add(blocks_arr[0]);
    group_new.add(blocks_arr[1]);
    group_new.add(polyline);
    group_new.add(hotspot_l);
    if (draw_fork) {
      group_new.add(hotspot_fork_left);
      group_new.add(hotspot_fork_right);
      group_new.add(path); 

      fork_point_group = draw.group()
      .attr("id", fork_point_id)
      .attr("class", "fork_point")
      .attr("data-recursion-level", fork_point_recursion_level);
      fork_point_group.add(circle);
      fork_point_group.add(hotspot_fork3);
      fork_point_group.add(hotspot_fork1);
      fork_point_group.add(hotspot_fork5);

      group_new.add(fork_point_group);
    }
     
    // "id" attr will be internal index of the syntactic relation
    group_new.attr("id", rel_internal_index);
    // recursion level in attr
    group_new.attr("data-recursion-level", recursion_level_curr);
    // move <g> el containing diagram of complementation relation to x coord of the blocks
    group_new.x(x_coord);

    return group_new;
  },

  draw_clausal_adjunction: function(draw, argsObj) {
    var syntactic_relation,
    relations,
    recursion_level_curr,
    blocks_arr,
    group_new,
    rel_internal_index,
    rel_external_index,
    rel_clause_type,
    x_coord,
    bbox,
    recursion_level_block,
    bottom_right_corner,
    bottom_right_corner_x,
    bottom_right_corner_y,
    text_el_x,
    text_el_y,
    bottom_left_corner_x,
    bottom_left_corner_y,
    top_left_corner_x,
    top_left_corner_y,
    top_right_corner_x,
    top_right_corner_y,
    polyline,
    hotspot_l,
    index_el,
    title_el,
    rect,
    expr_els_arr,
    lowest_word_el_id,
    lowest_word_el_bbox,
    additional_width; 

    syntactic_relation = argsObj.syntactic_relation;
    relations = argsObj.json.syntactic_relations;
    recursion_level_curr = argsObj.recursion_level_curr;
    blocks_arr = argsObj.blocks_arr;

    // get internal index of the relation
    rel_internal_index = syntactic_relation.internal_index;

    // get external index of the relation
    rel_external_index = syntactic_relation.external_index;

    // get clause type of the relation
    rel_clause_type = syntactic_relation.clause_type;

    // x coord of the blocks
    x_coord = ParsedClassicsDiagramGenerator.left_padding;

    // create group to display specification relation
    group_new = draw.group();

    // 0. find, if words of clausal adjunction phrase are themselves in reletions of modification, adjunction, relativization 
    // and we should add additional width to clausal adjunction sign
    additional_width = 0;
    expr_els_arr = ParsedClassicsDiagramGenerator.expressions_by_y_axis({block: blocks_arr[0]});
    for (var i = 0; i < relations.length; i++) {
      if ($.inArray(relations[i].relation, ["modification", "apposition", "relativization"]) != -1) {
        if ($.inArray(relations[i].words_and_phrases[0].internal_index, expr_els_arr)) {
          additional_width = ParsedClassicsDiagramGenerator.cl_adj_sign_width_additional;
          break;
        }
      }
    }

    // 1. get xy coord of bottom right corner of introduction symbol
    if (typeof blocks_arr[1] != "undefined") {
      // get recursion level of the block
      recursion_level_block = SVG(blocks_arr[1]).attr("data-recursion-level");
      // bottom right corner is second block's hotspot having class "hotspot_l" and block's recursion level num in its attr
      bottom_right_corner = SVG(blocks_arr[1]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');
      bbox = bottom_right_corner.node.getBBox();
      bottom_right_corner_y = bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;
      bottom_right_corner_x = bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2;
    }
    // incomplete clause consists of only clausal adjunction expression
    else {
      bottom_right_corner_x = x_coord;
      bottom_right_corner_y = bottom_right_corner_x;
    }

    // 2. calculate xy of the clausal adjunction expression relative to bottom right corner of the introduction symbol and move it there
    bbox = blocks_arr[0].node.getBBox();
    text_el_x = (bottom_right_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2) - (bbox.width + ParsedClassicsDiagramGenerator.cl_adj_sign_width + additional_width);
    text_el_y = bottom_right_corner_y - (ParsedClassicsDiagramGenerator.intro_sign_height + bbox.height);
    blocks_arr[0].move(text_el_x, text_el_y);

    // 3. calculate xy of the top left corner of clausal adjunction symbol
    top_left_corner_x = text_el_x + ParsedClassicsDiagramGenerator.word_border_width/2;
    top_left_corner_y = bottom_right_corner_y - (ParsedClassicsDiagramGenerator.intro_sign_height - ParsedClassicsDiagramGenerator.cl_adj_sign_gap);

    // 4. calculate xy of the bottom left corner of clausal adjunction symbol
    bottom_left_corner_x = top_left_corner_x;
    bottom_left_corner_y = bottom_right_corner_y;

    // 5. calculate xy of the top right corner of clausal adjunction symbol
    lowest_word_el_id = expr_els_arr[expr_els_arr.length - 1];
    lowest_word_el = SVG.find('g[id="' + lowest_word_el_id + '"]');
    lowest_word_el_bbox = lowest_word_el[0].node.getBBox();

    //top_right_corner_x = (top_left_corner_x + bbox.width) - ParsedClassicsDiagramGenerator.word_border_width/2;
    top_right_corner_x = (lowest_word_el_bbox.x +lowest_word_el_bbox.width);
    top_right_corner_y = top_left_corner_y;

    // 6. draw introduction symbol
    polyline = draw
    .polyline([[bottom_right_corner_x,bottom_right_corner_y], [bottom_left_corner_x,bottom_left_corner_y], [top_left_corner_x,top_left_corner_y], [top_right_corner_x, top_right_corner_y]])
    .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color})
    .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
    .fill('none');

    // 7. add hotspot_l in bottom left corner of clausal adjunction symbol
    hotspot_l = ParsedClassicsDiagramGenerator.generate_hotspot(draw, { 
      diameter: ParsedClassicsDiagramGenerator.word_border_width,
      color: ParsedClassicsDiagramGenerator.hotspot_color,
      recursion_level: recursion_level_curr,
      x_coord:  bottom_left_corner_x - ParsedClassicsDiagramGenerator.word_border_width/2,
      y_coord: bottom_left_corner_y - ParsedClassicsDiagramGenerator.word_border_width/2,
      class_name: "hotspot_l"
    });

    // add external index
    if (rel_external_index) {
      index_el = draw.text(rel_external_index);
      index_el.attr(
        "xml:space",
        "preserve",
        "http://www.w3.org/XML/1998/namespace"
      );
      index_el.attr("font-size", ParsedClassicsDiagramGenerator.font_size_small);
      index_el.attr("text-anchor", "end");
      index_el.attr("class", "external_index");
      // find dimensions of text el
      bbox = index_el.node.getBBox();
      index_el.move(bottom_left_corner_x - (ParsedClassicsDiagramGenerator.word_border_width/2 + bbox.width/2), bottom_left_corner_y + 3);
      // draw rectangle around index el to control correctness of placing of external index
      bbox = index_el.node.getBBox();
      rect = draw
      .rect(bbox.width, bbox.height)
      .attr("fill", "transparent") 
      .attr("fill-opacity", ParsedClassicsDiagramGenerator.fill_opacity)
      .attr("stroke", ParsedClassicsDiagramGenerator.line_color)
      .attr("stroke-width", 0)
      .move(bbox.x, bbox.y);
      // add tooltip displaying clause type
      if (rel_clause_type) {
        title_el = draw.element('title').words(rel_clause_type);
        title_el.putIn(rect);
      }
    }

    group_new.add(blocks_arr[0]);
    if (typeof blocks_arr[1] != "undefined") {
      group_new.add(blocks_arr[1]);
    }
    group_new.add(polyline);
    group_new.add(hotspot_l);
    if (rel_external_index) {
      group_new.add(index_el);
      group_new.add(rect);
    }
    // "id" attr will be internal index of the syntactic relation
    group_new.attr("id", rel_internal_index);
    // recursion level in attr
    group_new.attr("data-recursion-level", recursion_level_curr);
    // move <g> el containing diagram of complementation relation to x coord of the blocks
    group_new.x(x_coord);

    return group_new;
  },

  draw_hook: function(draw, argsObj) {
    var syntactic_relation,
    relations,
    recursion_level_curr,
    json,
    clause_to_be_hooked_parent_internal_index,
    clause_to_be_hooked_parent_el,
    clause_to_be_hooked_parent_bbox,
    clause_to_be_hooked_int_index,
    block,
    recursion_level,
    hotspot_l,
    hotspot_l_bbox,
    point1_x,
    point1_y,
    point2_x,
    point2_y,
    point3_x,
    point3_y,
    d_string,
    polyline,
    hotspot_l_new,
    group_new;

    syntactic_relation = argsObj.syntactic_relation;
    recursion_level_curr = argsObj.recursion_level_curr;
    json = argsObj.json;
    
    relations = json.syntactic_relations;

    //info about parent expression of the clause to be hooked
    clause_to_be_hooked_parent_internal_index = syntactic_relation.words_and_phrases[0].internal_index;
    // find parent expression of the clause to be hooked
    clause_to_be_hooked_parent_el = SVG.find('g[id="' + clause_to_be_hooked_parent_internal_index + '"]');
    // get dimensions of parent expression of the clause to be hooked
    clause_to_be_hooked_parent_bbox = clause_to_be_hooked_parent_el[0].node.getBBox();

    // find info about clause to be hooked
    clause_to_be_hooked_int_index = "";
    for (var i = 0; i < relations.length; i++) {
      if (relations[i].internal_index == clause_to_be_hooked_parent_internal_index) {
        clause_to_be_hooked_int_index = relations[i].words_and_phrases[0].internal_index;
        break;
      }
    }

    if (clause_to_be_hooked_int_index) {
      // find clause to be hooked
      block = SVG.find('g[id="' + clause_to_be_hooked_int_index + '"]'); 
      // if the block was not found, it must be some error in json, so let' exit
      if(block.length == 0) {return;}
      // find recursion level
      recursion_level = block[0].attr("data-recursion-level");
      //find hotspot_l
      hotspot_l = SVG(block[0]).findOne('[data-recursion-level="' + recursion_level + '"].hotspot_l');
      hotspot_l_bbox = hotspot_l.node.getBBox();
    }

    // calculate coords for hook polyline
    point1_x = hotspot_l_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2;
    point1_y = hotspot_l_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2;

    point2_x = clause_to_be_hooked_parent_bbox.x + (hotspot_l_bbox.x - clause_to_be_hooked_parent_bbox.x)/100*80;
    point2_y = hotspot_l_bbox.y - ParsedClassicsDiagramGenerator.space_y_between_words/2;

    point3_x = clause_to_be_hooked_parent_bbox.x
    point3_y = hotspot_l_bbox.y - (ParsedClassicsDiagramGenerator.space_y_between_words - ParsedClassicsDiagramGenerator.space_y_between_words/100*45);

    // draw hook polyline
    d_string = `M ${point1_x} ${point1_y} L ${point2_x} ${point2_y} ${point3_x} ${point3_y}`;
    d_string = svgPathRoundedCorners.path_round_corners_coords(d_string);
    polyline = draw
    .path(d_string)
    .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color})
    .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
    .fill('none')
    .attr('style', 'stroke-dasharray: ' + ParsedClassicsDiagramGenerator.relat_line_dasharray);

    // add new hotspot_l
    hotspot_l_new = draw
    .circle(ParsedClassicsDiagramGenerator.word_border_width)
    .fill(ParsedClassicsDiagramGenerator.hotspot_color)
    .attr("class", "hotspot_l")
    .attr("data-recursion-level", recursion_level_curr)
    .move(point3_x, point3_y - ParsedClassicsDiagramGenerator.word_border_width/2);

    // create group to display hook "relation"
    group_new = draw.group();
    group_new.add(clause_to_be_hooked_parent_el[0]);
    group_new.add(polyline);
    group_new.add(hotspot_l_new);
    group_new.attr("data-recursion-level", recursion_level_curr);
    group_new.attr("id", syntactic_relation.internal_index);
  },

  draw_crowbar: function(draw, argsObj) {
    var internal_index, 
    syntactic_role,
    json,
    block,
    syntactic_relations,
    relation_name,
    recursion_level_block,
    text_el,
    bbox,
    rect,
    hotspot_l,
    hotspot_r3,
    block_x_coord,
    block_y_coord,
    text_x_coord,
    text_y_coord,
    group_new,
    text_rect,
    hotspot_l,
    hotspot_r3,
    hotspot_r3_x_coord,
    hotspot_r3_y_coord,
    hotspot_l_x_coord,
    hotspot_l_y_coord,
    crowbar_left_x,
    crowbar_left_y,
    crowbar_middle_top_x,
    crowbar_middle_top_y,
    crowbar_middle_bottom_x,
    crowbar_middle_bottom_y,
    crowbar_right_x,
    crowbar_right_y,
    polyline,
    id_attr,
    recursion_level_attr,
    phrase_block_height,
    text_rect_height;

    internal_index = argsObj.internal_index;
    syntactic_role = argsObj.syntactic_role;
    json = argsObj.json;

    // get <g> el picturing phrase
    block = SVG.find('g[id="' + internal_index + '"]');

    if (typeof block[0] != "undefined") {

      // find which syntactic relation was used to contruct this phrase
      relation_name = "";
      syntactic_relations = json.syntactic_relations;
      for (var i= 0; i < syntactic_relations.length; i++) {
        if (syntactic_relations[i].internal_index === internal_index) {
          relation_name = syntactic_relations[i].relation;
          recursion_level_block = syntactic_relations[i].recursion_level;
          break;
        }
      }
      
      // in case of complementation or coordination we need to add technical crowbar symbol 
      if (relation_name == "complementation" || relation_name == "coordination" || relation_name == "coordination-initial" || relation_name == "specification" || relation_name == "introduction" || relation_name == "clausal-adjunction") {
        // get coords of the <g> el picturing phrase
        bbox = block[0].node.getBBox();
        block_x_coord = bbox.x;
        block_y_coord = bbox.y;
        phrase_block_height = bbox.height;

        // create the text element for syntactic role abbreviation
        text_el = draw.text(" " + syntactic_role + " ");
        text_el.attr(
          "xml:space",
          "preserve",
          "http://www.w3.org/XML/1998/namespace"
        );
        // find dimensions of text el
        bbox = text_el.node.getBBox();
        // draw rectangle around the word
        rect = draw
        .rect(bbox.width, bbox.height + 10) // "10" needed to add 5px top and bottom padding around text
        .attr("fill", ParsedClassicsDiagramGenerator.fill_color)
        .attr("fill-opacity", ParsedClassicsDiagramGenerator.fill_opacity)
        .attr("stroke", ParsedClassicsDiagramGenerator.line_color)
        .attr("stroke-width", ParsedClassicsDiagramGenerator.word_border_width + "px")
        .attr("rx", 1.5)
        .move(bbox.x, bbox.y - 5); // "5" needed to add 5px top and bottom padding around text

        // draw left hotspot
        hotspot_l = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_l", recursion_level_block);
        // draw right third hotspot
        hotspot_r3 = ParsedClassicsDiagramGenerator.mark_word_hotspots(draw, rect, "hotspot_r3", recursion_level_block);

        // join rectangle, text and hotspots into group
        text_rect = draw.group();
        text_rect.add(text_el);
        text_rect.add(rect);
        text_rect.add(hotspot_l);
        text_rect.add(hotspot_r3);

        // calculate coords of text rect <g> el relative to <g> el picturing phrase
        bbox = text_rect.node.getBBox();
        text_x_coord =  block_x_coord - (bbox.width + ParsedClassicsDiagramGenerator.crowbar_sign_width);
        text_y_coord = block_y_coord + ParsedClassicsDiagramGenerator.word_border_width/2;
        text_rect_height = bbox.height;
        if (typeof argsObj.crowbar_position != "undefined" && argsObj.crowbar_position == "down-top") {
          text_y_coord = (block_y_coord - ParsedClassicsDiagramGenerator.word_border_width/2) + (phrase_block_height - text_rect_height);
        }

        // move text rect <g> el to the left of the block
        text_rect.move(text_x_coord, text_y_coord);
        
        // get hotspot_r3 inside text rect <g> el
        hotspot_r3 = SVG(text_rect).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_r3');

        // get hotspot_r3 coords
        bbox = hotspot_r3.node.getBBox();
        hotspot_r3_x_coord = bbox.x;
        hotspot_r3_y_coord = bbox.y;

        // get hotspot_l inside <g> el picturing phrase
        hotspot_l = SVG(block[0]).findOne('[data-recursion-level="' + recursion_level_block + '"].hotspot_l');

        // get hotspot_l coords
        bbox = hotspot_l.node.getBBox();
        hotspot_l_x_coord = bbox.x;
        hotspot_l_y_coord = bbox.y;

        //calculate crowbar's coords
        crowbar_left_x = hotspot_r3_x_coord + ParsedClassicsDiagramGenerator.word_border_width/2;
        crowbar_left_y = hotspot_r3_y_coord + ParsedClassicsDiagramGenerator.word_border_width/2;
        crowbar_right_x = hotspot_l_x_coord + ParsedClassicsDiagramGenerator.word_border_width/2;
        crowbar_right_y = hotspot_l_y_coord + ParsedClassicsDiagramGenerator.word_border_width/2;
        crowbar_middle_top_x = crowbar_left_x + ParsedClassicsDiagramGenerator.crowbar_sign_width/2 + ParsedClassicsDiagramGenerator.word_border_width/2;
        crowbar_middle_top_y = crowbar_left_y;
        crowbar_middle_bottom_x = crowbar_middle_top_x;
        crowbar_middle_bottom_y = crowbar_right_y;

        // draw crowbar symbol
        polyline = draw
        .polyline([[crowbar_left_x,crowbar_left_y], [crowbar_middle_top_x,crowbar_middle_top_y], [crowbar_middle_bottom_x,crowbar_middle_bottom_y], [crowbar_right_x, crowbar_right_y]])
        .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color})
        .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
        .fill('none');

        // join text rect <g> el, crowbar symbol, <g> el picturing phrase
        group_new = draw.group();
        group_new.add(text_rect);
        group_new.add(block[0]);
        group_new.add(polyline);

        // remove from hotspot_l the attr "data-recursion-level" - now hotspot_l of this recursion level will be hotspot_l of text_rect
        hotspot_l.attr("data-recursion-level", null);

        // remove "id" and "data-recursion-level" attr from <g> el picturing phrase and add it to new group 
        id_attr = block[0].attr("id");
        block[0].attr("id", null);
        group_new.attr("id", id_attr);

        recursion_level_attr = block[0].attr("data-recursion-level");
        block[0].attr("data-recursion-level", null);
        group_new.attr("data-recursion-level", recursion_level_attr);
      }

    }
    
  },

  mark_word_hotspots: function(draw, rect, hotspot_name, recursion_level) {
    var bbox, hotspot, x_coord, y_coord;
    
    bbox = rect.node.getBBox();

    // xy coordinates of left hotspot
    if (hotspot_name == "hotspot_l") {
      x_coord = bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2;
      y_coord = (bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.height/2;
    }

    // xy coordinates of left bottom hotspot
    if (hotspot_name == "hotspot_lb") {
      x_coord = bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2;
      y_coord = (bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.height;
    }

    // xy coordinates of top center hotspot 
    else if (hotspot_name == "hotspot_tc") {
      x_coord = bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2 + bbox.width/2;
      y_coord = bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2;
    }

     // xy coordinates of top right hotspot
     else if (hotspot_name == "hotspot_tr") {
      x_coord = (bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2) + (bbox.width - bbox.height/4);
      y_coord = bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2;
     }

    // xy coordinates of bottom center hotspot
    else if (hotspot_name == "hotspot_bc") {
      x_coord = bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2 + bbox.width/2;
      y_coord = (bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.height;
    }

    // xy coordinates of bottom right hotspot
    else if (hotspot_name == "hotspot_br") {
      x_coord = (bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2) + (bbox.width - bbox.height/4);
      y_coord = (bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.height;
    }

    // xy coordinates of right first hotspot
    else if (hotspot_name == "hotspot_r1") {
      x_coord = (bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.width;
      y_coord = bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2;
    }

    // xy coordinates of right second hotspot
    else if (hotspot_name == "hotspot_r2") {
      x_coord = (bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.width;
      y_coord = (bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.height/4;
    }

    // xy coordinates of right third hotspot
    else if (hotspot_name == "hotspot_r3") {
      x_coord = (bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.width;
      y_coord = (bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.height/2;
    }

    // xy coordinates of right fourth hotspot
    else if (hotspot_name == "hotspot_r4") {
      x_coord = (bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.width;
      y_coord = (bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2) + (bbox.height/4)*3;
    }

    // xy coordinates of right fifth hotspot
    else if (hotspot_name == "hotspot_r5") {
      x_coord = (bbox.x - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.width;
      y_coord = (bbox.y - ParsedClassicsDiagramGenerator.word_border_width/2) + bbox.height;
    }

    // draw hotspot
    if (typeof recursion_level == "undefined"){
      recursion_level = 0;
    }

    hotspot =  ParsedClassicsDiagramGenerator.generate_hotspot(draw, { 
      diameter: ParsedClassicsDiagramGenerator.word_border_width,
      color: ParsedClassicsDiagramGenerator.hotspot_color,
      recursion_level: recursion_level,
      x_coord: x_coord,
      y_coord: y_coord,
      class_name: hotspot_name
    });

    return hotspot;
  },

  generate_hotspot(draw, argsObj) {
    var hotspot;

    hotspot = draw
    .circle(argsObj.diameter)
    .attr("fill", argsObj.color)
    .attr("data-recursion-level", argsObj.recursion_level)
    .move(argsObj.x_coord, argsObj.y_coord)
    .attr("class", argsObj.class_name);

    return hotspot;
  },

  draw_phase_2: function(draw, json, root_block, resulting_group, counter = 0) {
    var nonblock_root_relation,
    args_obj,
    expr_els_all_arr,
    expr_els_cl_adjunct_arr,
    expr_els_cl_adjunct_arr2,
    expr_els_intro_marker_arr,
    expr_els_intro_marker_arr2,
    syntactic_relations,
    relations_non_block_forming,
    cl_adjunct_relations,
    intro_relations,
    intro_relation_block,
    fork_relations,
    fork_point,
    fork_point_id,
    fork_point_arr,
    first_block,
    second_block,
    expr_el_highest,
    expr_internal_index,
    expr_internal_index_next,
    expr_internal_index_prev,
    index,
    info_obj,
    word_el,
    expr_el,
    bbox,
    bbox2,
    block_last_bbox,
    expr_els_in_rels_arr,
    expr_els_in_rels_arr_clone,
    expr_els_in_rels_arr2,
    column_x,
    cumulative_height,
    block,
    block_last,
    enough_space_bottom,
    enough_space_top,
    new_root_block,
    left_expr_id,
    right_expr_order,
    relations_non_block_forming_of_word,
    fork2_relations,
    expr_id,
    hotspot_r3,
    hotspot_r3_bbox,
    recursion_level,
    fork_point_hotspot_r3,
    fork_point_hotspot_r3_bbox,
    svg_output_textarea,
    svg_code,
    json_textarea,
    json_from_textarea,
    column_left_distance_arr,
    column_left_distance;

    syntactic_relations = json.syntactic_relations;

    // get column left distance for current call of function draw_phase_2
    column_left_distance_arr = typeof json.options != "undefined" && typeof json.options.column_left_distance != "undefined" ? json.options.column_left_distance : ParsedClassicsDiagramGenerator.column_left_distance;
    column_left_distance = typeof column_left_distance_arr[counter] != "undefined" ? column_left_distance_arr[counter] : column_left_distance_arr[column_left_distance_arr.length - 1];

    // find block of root relation
    if (root_block === null) {
      root_block = SVG.find('g[id="root_relation"]');
      //exists there  root relation of the block-building kind?
      if (root_block.length == 1) {
        resulting_group.add(root_block[0]);
      }
      // exists there root relation of the non-block-building kind?
      else if (root_block.length == 0) {
        nonblock_root_relation = json.syntactic_relations.filter((item) => item.internal_index == "root_relation");
        if (nonblock_root_relation.length == 1 && $.inArray(nonblock_root_relation[0].relation, ["modification", "apposition", "relativization"]) != -1) { 
          root_block = SVG.find('g[id="' + nonblock_root_relation[0].words_and_phrases[0].internal_index + '"]');
          if (root_block.length == 1) {
            resulting_group.add(root_block[0]);
          }
        }
      }
    }

    // block of root relation was found
    if (root_block.length == 1) {

      // find x coord of the new column
      bbox = root_block[0].node.getBBox();
      column_x = bbox.x + bbox.width + column_left_distance;

      // object to hold info needed for phase 2
      json.phase_2 = {};
      
      // I. find order of expression blocks in root relation

      // (a)  find order of ALL word blocks by y axis
      args_obj = {};
      args_obj.block = root_block[0];
      expr_els_all_arr = ParsedClassicsDiagramGenerator.expressions_by_y_axis(args_obj);

      // create info obj for each word block
      expr_els_all_arr.forEach(id => json.phase_2[id] = {});

      // (b) find words in clausal adjunct blocks and correct their place in expr_els_all_arr
      cl_adjunct_relations = syntactic_relations.filter(item => item.relation == "clausal-adjunction");
      cl_adjunct_relations = cl_adjunct_relations.filter(item =>  (counter == 0 && item.internal_index == 'root_relation') || SVG(root_block[0]).find('g[id="' + item.internal_index + '"]').length === 1);
      for (var i = 0; i < cl_adjunct_relations.length; i++) {
        // get first and second block of clausal adjunction group
        first_block = SVG.find('g[id="' + cl_adjunct_relations[i].words_and_phrases[0].internal_index + '"]');
        // is there second block?
        if (cl_adjunct_relations[i].words_and_phrases.length > 1) {
          second_block = SVG.find('g[id="' + cl_adjunct_relations[i].words_and_phrases[1].internal_index + '"]');
        }
        // find order of words in the first block
        args_obj = {};
        args_obj.block = first_block[0];
        expr_els_cl_adjunct_arr = ParsedClassicsDiagramGenerator.expressions_by_y_axis(args_obj);
        // modifiers of the words in first block should go around  the second block
        if (cl_adjunct_relations[i].words_and_phrases.length > 1) {
          expr_els_cl_adjunct_arr.forEach(id => json.phase_2[id].block_around = cl_adjunct_relations[i].words_and_phrases[1].internal_index);
        }
        // modifiers of the words in first block should be drawn relative the first block, which we name here "root_block_local"
        expr_els_cl_adjunct_arr.forEach(id => json.phase_2[id].root_block_local = cl_adjunct_relations[i].words_and_phrases[0].internal_index);
        // find order of words in the second block
        if (second_block) {
          args_obj = {};
          args_obj.block = second_block[0];
          expr_els_cl_adjunct_arr2 = ParsedClassicsDiagramGenerator.expressions_by_y_axis(args_obj);
        }
        // remove from expr_els_all_arr all words present in first block
        expr_els_all_arr = expr_els_all_arr.filter(item => expr_els_cl_adjunct_arr.includes(item) === false);
        if (second_block) {
          // find the highest word el in second block
          expr_el_highest = expr_els_cl_adjunct_arr2[0];
          // get index of the highest word from second block in all words arr
          index = expr_els_all_arr.indexOf(expr_el_highest);
          // put removed words in their place, i.e. before the highest word from second block
          expr_els_cl_adjunct_arr.reverse().forEach(item => expr_els_all_arr.splice(index, 0, item));
        }
      }

      // (c) find words in introduction marker blocks and correct their place in expr_els_all_arr
      intro_relations = syntactic_relations.filter(item => item.relation == "introduction");
      intro_relations = intro_relations.filter(item => (counter == 0 && item.internal_index == 'root_relation') || SVG(root_block[0]).find('g[id="' + item.internal_index + '"]').length === 1);
      for (var i = 0; i < intro_relations.length; i++) {
        // get first and second block of introduction group
        first_block = SVG.find('g[id="' + intro_relations[i].words_and_phrases[0].internal_index + '"]');
        second_block = SVG.find('g[id="' + intro_relations[i].words_and_phrases[1].internal_index + '"]');
        // find order of words in the first block
        args_obj = {};
        args_obj.block = first_block[0];
        expr_els_intro_marker_arr = ParsedClassicsDiagramGenerator.expressions_by_y_axis(args_obj);
        // modifiers of the word in first block should be drawn relative the first block, which we name here "root_block_local"
        expr_els_intro_marker_arr.forEach(id => {
          if (typeof json.phase_2[id] != "undefined") {
            json.phase_2[id].root_block_local = intro_relations[i].words_and_phrases[0].internal_index;
          }
        });
        // find if there is fork point inside introduction relation block
        var fork_relations = syntactic_relations.filter(item => item.relation == "fork");
        fork_relations = fork_relations.filter(item => item.words_and_phrases[0].internal_index == intro_relations[i].words_and_phrases[0].internal_index && item.words_and_phrases[1].internal_index == intro_relations[i].words_and_phrases[1].internal_index);
        if (fork_relations.length == 1) {
          fork_point_id = fork_relations[0].internal_index;
          expr_els_intro_marker_arr.push(fork_point_id);
          json.phase_2[fork_point_id] = {};
          json.phase_2[fork_point_id].fork_point = true;
        }
        // modifiers of the words in first block should go around  the second block
        expr_els_intro_marker_arr.forEach(id => {
          if (typeof json.phase_2[id] !== "undefined") {
            json.phase_2[id].block_around = intro_relations[i].words_and_phrases[1].internal_index;
          }
        });
        // find order of words in the second block
        args_obj = {};
        args_obj.block = second_block[0];
        expr_els_intro_marker_arr2 = ParsedClassicsDiagramGenerator.expressions_by_y_axis(args_obj);
        // remove from expr_els_all_arr all words present in first block
        expr_els_all_arr = expr_els_all_arr.filter(item => expr_els_intro_marker_arr.includes(item) === false);
        // find the highest word el in second block
        expr_el_highest = expr_els_intro_marker_arr2[0];
        // get index of the highest word from second block in all words arr
        index = expr_els_all_arr.indexOf(expr_el_highest);
        // put removed words in their place, i.e. before the highest word from second block
        expr_els_intro_marker_arr.reverse().forEach(item => expr_els_all_arr.splice(index, 0, item));
      }

      // (d) find words of this column present in non-block-building relations (modification, apposition, relativization, parenthesis, fork2, cable)
      relations_non_block_forming = syntactic_relations.filter(item => ["modification", "apposition", "relativization", "parenthesis", "fork2", "cable"].includes(item.relation));
      // loop through all words of this block
      for (var i = 0; i < expr_els_all_arr.length; i++) {
        expr_internal_index = expr_els_all_arr[i];
        if (typeof json.phase_2[expr_internal_index] !== "undefined") {
          json.phase_2[expr_internal_index].related_to = [];
        }
        // loop through all non-block-building relations and find relations of current word
        relations_non_block_forming_of_word = [];
        for (var j = 0; j < relations_non_block_forming.length; j++) {
          if (relations_non_block_forming[j].relation != "fork2") {
            if (expr_internal_index == relations_non_block_forming[j].words_and_phrases[0].internal_index) {
              relations_non_block_forming_of_word.push(relations_non_block_forming[j]);
            }
          }
          else {
            for(var k = 0; k < relations_non_block_forming[j].words_and_phrases.length; k++) {
              if (expr_internal_index == relations_non_block_forming[j].words_and_phrases[k].internal_index) {
                relations_non_block_forming_of_word.push(relations_non_block_forming[j]);
              }
            }
          }
        }
        // loop through all non-block-building relations of current word
        cumulative_height = 0;
        for (var j = 0; j < relations_non_block_forming_of_word.length; j++) {
          // get current word el
          word_el = SVG.find('#' + expr_internal_index);
          bbox = word_el[0].node.getBBox();
          
          if (relations_non_block_forming_of_word[j].relation != "fork2") {
            // get expression the current word is in relation to
            expr_el =  SVG.find('#' + relations_non_block_forming_of_word[j].words_and_phrases[1].internal_index);
            if (expr_el.length > 0) {
              bbox2 = expr_el[0].node.getBBox();
              // calculate cumulative height of all expressions the current word is in relation to
              cumulative_height += bbox2.height;
            }
          }
          
          if (j == relations_non_block_forming_of_word.length - 1) {
            cumulative_height += ParsedClassicsDiagramGenerator.space_y_between_words * (relations_non_block_forming_of_word.length - 1);
          }
          // form info object about the expression the current word is in relation to
          info_obj = {};
          info_obj.internal_index = relations_non_block_forming_of_word[j].relation != "fork2" ? relations_non_block_forming_of_word[j].words_and_phrases[1].internal_index : relations_non_block_forming_of_word[j].internal_index;
          info_obj.relation = relations_non_block_forming_of_word[j].relation;
          info_obj.bbox = bbox2;
          if (typeof json.phase_2[expr_internal_index] != "undefined") {
            json.phase_2[expr_internal_index].related_to.push(info_obj);
            json.phase_2[expr_internal_index].bbox = bbox;
            json.phase_2[expr_internal_index].cumulative_height = cumulative_height;
          }
        }
      }
      // clean  expr_els_all_arr to leave only those which are in at least one non-block-building relation
      expr_els_in_rels_arr =  expr_els_all_arr.filter(item => {
        if (typeof json.phase_2[item] !== "undefined") {
          return json.phase_2[item].related_to.length > 0;
        }
      });

      // no expressions in expr_els_in_rels_arr? then put resulting diagram in place, set its dimensions and end the recursion
      if (expr_els_in_rels_arr.length == 0) {
        // move resulting group
        resulting_group.move(0, 0);
        // set resulting group dimensions
        bbox = resulting_group.node.getBBox();
        draw.size(bbox.width, bbox.height);
        // output svg code together with json code
        json_textarea = $("#json-output-textarea");
        json_from_textarea = "<!--" + json_textarea.val() + "-->\n\n";
        svg_code = '<div class="svg-diagram-container">' + draw.svg() + '</div>';
        svg_output_textarea = $("#svg-output-textarea");
        svg_output_textarea.val(json_from_textarea + svg_code);
        
        return;
      }

      // draw forkpoints for all fork2 technical "relations" for this column 
      fork2_relations = syntactic_relations.filter(item => item.relation == "fork2");

      fork2_relations = fork2_relations.filter(item => SVG(root_block[0]).find('g[id="' + item.words_and_phrases[0].internal_index + '"]').length === 1);

      fork_point_arr = [];
      for (var i = 0; i < fork2_relations.length; i++) {
        fork_point_id = ParsedClassicsDiagramGenerator.draw_fork_point(draw, fork2_relations[i], json.phase_2,  root_block, resulting_group);
        fork_point_arr.push(fork_point_id);
        // find forkpoint el
        fork_point = SVG.find('g[id="' + fork_point_id + '"]');
        // find hotspot_r3 inside forkpoint el
        recursion_level = fork_point[0].attr("data-recursion-level");
        fork_point_hotspot_r3 = SVG(fork_point[0]).findOne('[data-recursion-level="' + recursion_level + '"].hotspot_r3');
        fork_point_hotspot_r3_bbox = fork_point_hotspot_r3.node.getBBox();
        // put forkpoint id into expr_els_in_rels_arr 
        expr_els_in_rels_arr_clone = [...expr_els_in_rels_arr];
        for (var j = 0; j < expr_els_in_rels_arr.length; j++) {
          expr_id = expr_els_in_rels_arr[j];
          expr_el = SVG.find('g[id="' + expr_id + '"]');
          recursion_level = expr_el[0].attr("data-recursion-level");
          hotspot_r3 = SVG(expr_el[0]).findOne('[data-recursion-level="' + recursion_level + '"].hotspot_r3');
          hotspot_r3_bbox = hotspot_r3.node.getBBox();
          
          if (j === 0) {
            if (fork_point_hotspot_r3_bbox.y < hotspot_r3_bbox.y) {
              expr_els_in_rels_arr_clone.splice(j, 0, fork_point_id);
            }
          }
          else {
            if (fork_point_hotspot_r3_bbox.y > hotspot_r3_bbox_prev.y && fork_point_hotspot_r3_bbox.y < hotspot_r3_bbox.y) {
              expr_els_in_rels_arr_clone.splice(j, 0, fork_point_id);
            }
          }
          hotspot_r3_bbox_prev = hotspot_r3_bbox;
        }
        expr_els_in_rels_arr = expr_els_in_rels_arr_clone;
      }

      // update json.phase_2 with info about all relations (modification, apposition, relativization) related to fork2 "relations" 
      relations_non_block_forming = syntactic_relations.filter(item => ["modification", "apposition", "relativization", "parenthesis"].includes(item.relation));
      // loop through all forkpoints of this column
      for (var i = 0; i < fork_point_arr.length; i++) {
        expr_internal_index = fork_point_arr[i];
        json.phase_2[expr_internal_index] = {};
        json.phase_2[expr_internal_index].related_to = [];
        // loop through all non-block-building relations and find relations of current fork point
        relations_non_block_forming_of_word = [];
        for (var j = 0; j < relations_non_block_forming.length; j++) {
          if (expr_internal_index == relations_non_block_forming[j].words_and_phrases[0].internal_index) {
            relations_non_block_forming_of_word.push(relations_non_block_forming[j]);
          }
        }
        // loop through all non-block-building relations of current fork point
        cumulative_height = 0;
        for (var j = 0; j < relations_non_block_forming_of_word.length; j++) {
          // get current fork point
          word_el = SVG.find('#' + expr_internal_index);
          bbox = word_el[0].node.getBBox();

          // get expression the current word is in relation to
          expr_el =  SVG.find('#' + relations_non_block_forming_of_word[j].words_and_phrases[1].internal_index);
          bbox2 = expr_el[0].node.getBBox();
          // calculate cumulative height of all expressions the current word is in relation to
          cumulative_height += bbox2.height;

          if (j == relations_non_block_forming_of_word.length - 1) {
            cumulative_height += ParsedClassicsDiagramGenerator.space_y_between_words * (relations_non_block_forming_of_word.length - 1);
          }

          // form info object about the expression the current word is in relation to
          info_obj = {};
          info_obj.internal_index = relations_non_block_forming_of_word[j].words_and_phrases[1].internal_index;
          info_obj.relation = relations_non_block_forming_of_word[j].relation;
          info_obj.to_forkpoint = true;
          info_obj.bbox = bbox2;
          json.phase_2[expr_internal_index].related_to.push(info_obj);
          json.phase_2[expr_internal_index].bbox = bbox;
          json.phase_2[expr_internal_index].cumulative_height = cumulative_height;
        }
      }

      // remove from expr_els_in_rels_arr those, which participate in only one relation AND that relation in fork2 relation 
      expr_els_in_rels_arr2 = [];
      for (var i = 0; i < expr_els_in_rels_arr.length; i++) {
        expr_internal_index = expr_els_in_rels_arr[i];
        if (json.phase_2[expr_internal_index].related_to.length > 1 || (typeof json.phase_2[expr_internal_index].related_to[0] != "undefined" && json.phase_2[expr_internal_index].related_to[0].relation != "fork2")) {
          expr_els_in_rels_arr2.push(expr_internal_index);
        }
      }
      expr_els_in_rels_arr = expr_els_in_rels_arr2;

      // (e) put second expressions of non-block-building relations in a column
      new_root_block = draw.group();
      for (var i = 0; i < expr_els_in_rels_arr.length; i++) {
        expr_internal_index = expr_els_in_rels_arr[i];
        if (i < expr_els_in_rels_arr.length - 1) {
          expr_internal_index_next = expr_els_in_rels_arr[i + 1];
        }
        if (i > 0) {
          expr_internal_index_prev = expr_els_in_rels_arr[i - 1];
        }

        if (typeof block_last != "undefined") {
          block_last_bbox = block_last.node.getBBox();
        }
        //is there enough space on DOWN direction on y axis for right-side expressions of the non-block-building relations of current left-side expression ?
        enough_space_bottom = typeof expr_internal_index_next == "undefined" || json.phase_2[expr_internal_index].bbox.y + json.phase_2[expr_internal_index].cumulative_height + ParsedClassicsDiagramGenerator.space_y_between_words < json.phase_2[expr_internal_index_next].bbox.y;

        //is there enough space on UP direction on y axis for right-side expressions of the non-block-building relations of current left-side expression ?
        enough_space_top = typeof block_last == "undefined" ||  block_last_bbox.y +  block_last_bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words < json.phase_2[expr_internal_index].bbox.y;

        // (e-1) right-side expressions of the non-block-building relations of FIRST left-side expression can go UP as needed
        if (i == 0) {
          //(e-1a) is there enough space on DOWN direction?
          if  (enough_space_bottom) {
            for (j = 0; j < json.phase_2[expr_internal_index].related_to.length; j++) {
              if (json.phase_2[expr_internal_index].related_to[j].relation != "fork2") {
                block = SVG.find("#" + json.phase_2[expr_internal_index].related_to[j].internal_index);
                if (block.length > 0) {
                  if (j == 0) {
                    block[0].move(column_x, json.phase_2[expr_internal_index].bbox.y);
                  }
                  else {
                    bbox = block_last.node.getBBox();
                    block[0].move(column_x, bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words);
                  }
                  new_root_block.add(block[0]);
                  block_last = block[0];
                }
              }
            }
          }
          // (e-1b) there is not enough space on DOWN direction
          else {
            for (j = 0; j < json.phase_2[expr_internal_index].related_to.length; j++) {
              if (json.phase_2[expr_internal_index].related_to[j].relation != "fork2") {
                block = SVG.find("#" + json.phase_2[expr_internal_index].related_to[j].internal_index);
                if (j == 0) {
                  block[0].move(column_x, json.phase_2[expr_internal_index_next].bbox.y - (ParsedClassicsDiagramGenerator.space_y_between_words + json.phase_2[expr_internal_index].cumulative_height));
                }
                else {
                  bbox = block_last.node.getBBox();
                  block[0].move(column_x, bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words);
                }
                new_root_block.add(block[0]);
                block_last = block[0];
              }
            }
          }
        }

        // (e-2) right-side expressions of the non-block-building relations of NOT FIRST and NOT LAST left-side expression
        if (i != 0 && i != expr_els_in_rels_arr.length - 1) {
          // (e-2a) there is enough space in DOWN direction and there is enough space in UP direction
          if (enough_space_bottom && enough_space_top) {
            for (j = 0; j < json.phase_2[expr_internal_index].related_to.length; j++) {
              if (json.phase_2[expr_internal_index].related_to[j].relation != "fork2") {
                block = SVG.find("#" + json.phase_2[expr_internal_index].related_to[j].internal_index);
                if (j == 0) {
                  block[0].move(column_x, json.phase_2[expr_internal_index].bbox.y);
                }
                else {
                  bbox = block_last.node.getBBox();
                  if (bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words < json.phase_2[expr_internal_index].bbox.y) {
                    block[0].move(column_x, json.phase_2[expr_internal_index].bbox.y);
                  }
                  else {
                    block[0].move(column_x, bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words);
                  }
                }
                new_root_block.add(block[0]);
                block_last = block[0];
              }
            }
          }
          // (e-2b) there is not enough space in DOWN direction but there is enough space in UP direction
          else if (!enough_space_bottom && enough_space_top) {
            for (j = 0; j < json.phase_2[expr_internal_index].related_to.length; j++) {
              if (json.phase_2[expr_internal_index].related_to[j].relation != "fork2") {
                block = SVG.find("#" + json.phase_2[expr_internal_index].related_to[j].internal_index);
                if (j == 0) {
                  bbox = block_last.node.getBBox();
                  if (bbox.y < json.phase_2[expr_internal_index_next].bbox.y - (ParsedClassicsDiagramGenerator.space_y_between_words + json.phase_2[expr_internal_index].cumulative_height)) {
                    block[0].move(column_x, json.phase_2[expr_internal_index_next].bbox.y - (ParsedClassicsDiagramGenerator.space_y_between_words + json.phase_2[expr_internal_index].cumulative_height));
                  }
                  else {
                    block[0].move(column_x, bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words);
                  }
                }
                else {
                  bbox = block_last.node.getBBox();
                  block[0].move(column_x, bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words);
                }
                new_root_block.add(block[0]);
                block_last = block[0];
              }
            }
          }
          // (e-2c) there is not enough space in DOWN direction and there is not enough space in UP direction
          else {
            for (j = 0; j < json.phase_2[expr_internal_index].related_to.length; j++) {
              if (json.phase_2[expr_internal_index].related_to[j].relation != "fork2") {
                block = SVG.find("#" + json.phase_2[expr_internal_index].related_to[j].internal_index);
                bbox = block_last.node.getBBox();
                block[0].move(column_x, bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words);
                new_root_block.add(block[0]);
                block_last = block[0];
              }
            }
          }
        }

        // (e-3)right-side expressions of the non-block-building relations of LAST left-side expression can go DOWN as needed
        if (i == expr_els_in_rels_arr.length - 1) {
          // (e-3a)there is enough space in UP direction
          if (enough_space_top) {
            for (j = 0; j < json.phase_2[expr_internal_index].related_to.length; j++) {
              if (json.phase_2[expr_internal_index].related_to[j].relation != "fork2") {
                block = SVG.find("#" + json.phase_2[expr_internal_index].related_to[j].internal_index);
                if (block.length > 0) {
                  if (j == 0) {
                    block[0].move(column_x, json.phase_2[expr_internal_index].bbox.y);
                  }
                  else {
                    bbox = block_last.node.getBBox();
                    block[0].move(column_x, bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words);
                  }
                  new_root_block.add(block[0]);
                  block_last = block[0];
                }
              }
            }
          }
          // (e-3b)there is not enough space in UP direction
          else {
            for (j = 0; j < json.phase_2[expr_internal_index].related_to.length; j++) {
              if (json.phase_2[expr_internal_index].related_to[j].relation != "fork2") {
                block = SVG.find("#" + json.phase_2[expr_internal_index].related_to[j].internal_index);
                bbox = block_last.node.getBBox();
                block[0].move(column_x, bbox.y + bbox.height + ParsedClassicsDiagramGenerator.space_y_between_words);
                new_root_block.add(block[0]);
                block_last = block[0];
              }
            }
          }
        }
      }

      // (f) prepare json.phase_2 obj
      // clean  json.phase_2 obj to leave only those keys which are in at least one non-block-building relation
      json.phase_2 = Object.entries(json.phase_2).filter(item => item[1].related_to.length > 0);
      json.phase_2 = Object.fromEntries(json.phase_2);

      // find left side hotspot names
      ParsedClassicsDiagramGenerator.left_side_hotspots(json.phase_2);

      // find order numbers of block-around lines
      ParsedClassicsDiagramGenerator.block_around_order(json.phase_2, expr_els_in_rels_arr);

      // draw forklines for all fork2 technical "relations" for this column
      for (var i = 0; i < fork2_relations.length; i++) {
        ParsedClassicsDiagramGenerator.draw_fork_lines(draw, fork2_relations[i], json.phase_2,  root_block, resulting_group);
      }

      // (g) draw lines between expressions on the left and expressions on the right
      for (var i = 0; i < expr_els_in_rels_arr.length; i++) {
        expr_internal_index = expr_els_in_rels_arr[i];
        for (var j = 0; j < json.phase_2[expr_internal_index].related_to.length; j++) {
          left_expr_id = expr_internal_index;
          right_expr_order = j;
          // draw modification, apposition, relativization
          if (json.phase_2[expr_internal_index].related_to[j].relation == "modification" || json.phase_2[expr_internal_index].related_to[j].relation == "apposition" || json.phase_2[expr_internal_index].related_to[j].relation == "relativization" || json.phase_2[expr_internal_index].related_to[j].relation == "cable") {
            ParsedClassicsDiagramGenerator.draw_modif_appos_rel_cable(draw, json.phase_2, left_expr_id, right_expr_order, root_block[0], resulting_group);
          }
          else if (json.phase_2[expr_internal_index].related_to[j].relation == "parenthesis") {
            ParsedClassicsDiagramGenerator.draw_parenthesis(draw, json.phase_2, left_expr_id, right_expr_order, root_block[0], resulting_group);
          }
        }

      }

      // add new root block to resulting group
      resulting_group.add(new_root_block);

      // run current function in respect of the new_root_block just formed
      root_block = [];
      root_block[0] = new_root_block;
      ParsedClassicsDiagramGenerator.draw_phase_2(draw, json, root_block, resulting_group, counter + 1);
    }
  },

  expressions_by_y_axis: function(args_obj) {
    var block,
    expr_els_arr,
    word_els,
    word_obj,
    bbox;

    block = args_obj.block;

    word_els = [];
    expr_els_arr = [];

    // is the block a single word?
    if (block.hasClass("word")) {
      // we will have to deal with single block
      word_els.push(block);
    }
    else {
      // get all word blocks
      word_els = SVG(block).find("g.word");
    }
    // get id and bbox
    for (var i = 0; i < word_els.length; i++) {
      word_obj = {};
      word_obj.id = word_els[i].attr("id");
      bbox = word_els[i].node.getBBox();
      word_obj.bbox = bbox;
      expr_els_arr.push(word_obj);
    }
    // sort by position on y axis
    expr_els_arr.sort((a,b) => a.bbox.y - b.bbox.y);
    // arr items will be id attributes of word els
    expr_els_arr.forEach((item, index, arr) => arr[index] = item.id);

    return expr_els_arr;
  },

  left_side_hotspots: function(phase2_obj) {
    var hotspot_names, relations, related_filtered, pos, hotspot_names_def;

    hotspot_names = [];
    hotspot_names[0] = ["hotspot_r3"];
    hotspot_names[1] = ["hotspot_r2", "hotspot_r4"];
    hotspot_names[2] = ["hotspot_r1", "hotspot_r3", "hotspot_r5"];
    hotspot_names[3] = ["hotspot_r1", "hotspot_r2", "hotspot_r3", "hotspot_r4"];
    hotspot_names[4] = ["hotspot_r1", "hotspot_r2", "hotspot_r3", "hotspot_r4", "hotspot_r5"];
    hotspot_names[5] = ["hotspot_tr", "hotspot_r1", "hotspot_r2", "hotspot_r3", "hotspot_r4", "hotspot_r5"];
    hotspot_names[6] = ["hotspot_tr", "hotspot_r1", "hotspot_r2", "hotspot_r3", "hotspot_r4", "hotspot_r5", "hotspot_br"];

    for (var item in phase2_obj) {
      relations = phase2_obj[item];
      related_filtered = [];
      for (var i = 0; i < relations.related_to.length; i++) {
        if (relations.related_to[i].relation != "parenthesis") {
          related_filtered.push(relations.related_to[i]);
        }
      }
      pos = related_filtered.length - 1;
      hotspot_names_def = pos >= 0 ? hotspot_names[pos] : [];
      for (var i = 0; i < related_filtered.length; i++) {
        related_filtered[i].left_hotspot = hotspot_names_def[i];
      }
    }

  },

  block_around_order: function(phase2_obj, expr_els_in_rels_arr) {
    var expr_internal_index,
    block_around_curr,
    block_around_count,
    block_arr;

    block_around_curr = "";
    block_arr = [];
    
    for (var i = 0; i < expr_els_in_rels_arr.length; i++) {
      expr_internal_index = expr_els_in_rels_arr[i];
      // property "block_around" defined
      if (typeof phase2_obj[expr_internal_index].block_around != "undefined" && typeof phase2_obj[expr_internal_index].block_around) {
        if (block_around_curr != phase2_obj[expr_internal_index].block_around) {
          block_around_curr = phase2_obj[expr_internal_index].block_around;
          block_around_count = 0;
          block_arr = [];
        }
        for (var j = 0; j < phase2_obj[expr_internal_index].related_to.length; j++) {
          if (phase2_obj[expr_internal_index].related_to[j].relation != "parenthesis") {
            block_around_count += 1;
            phase2_obj[expr_internal_index].related_to[j].block_around_count = block_around_count;
          } 
        }

        // push items having property "block_around" defined to arr
        block_arr.push(expr_internal_index);
        // add property "block_around_total"
        block_arr.forEach((item, index, arr) => {phase2_obj[item].block_around_total = block_around_count});
      }
      
    }
  },

  draw_modif_appos_rel_cable: function(draw, argsObj, left_block_id, right_block_order, root_block, resulting_group) {
    var relation,
    left_block,
    left_block_hotspot_class,
    left_block_hotspot,
    left_block_rec_level,
    left_block_hotspot_bbox,
    right_block_id,
    right_block,
    right_block_hotspot,
    right_block_hotspot_bbox,
    right_block_rec_level,
    root_block_bbox,
    point1,
    point1_coords,
    point2,
    point2_coords,
    point3,
    point3_coords,
    point4,
    point4_coords,
    block_around_id,
    root_block_local,
    root_block_local_bbox,
    block_around,
    block_around_bbox,
    polyline,
    polyline2,
    path_temp,
    path_temp2,
    path_length_needed,
    line_width,
    d_string,
    left_block_hotspot_coords,
    coords_string,
    to_forkpoint,
    marker;
    
    relation = argsObj[left_block_id].related_to[right_block_order].relation;
    line_width = relation == "apposition" ? ParsedClassicsDiagramGenerator.appos_line_width : ParsedClassicsDiagramGenerator.line_width;
    to_forkpoint = typeof argsObj[left_block_id].related_to[right_block_order].to_forkpoint == "undefined" ? false : argsObj[left_block_id].related_to[right_block_order].to_forkpoint;

    right_block_id = argsObj[left_block_id].related_to[right_block_order].internal_index;

    left_block_hotspot_class = argsObj[left_block_id].related_to[right_block_order].left_hotspot;
    // get  left and right blocks
    left_block = SVG.find('g[id="' + left_block_id + '"]');
    right_block = SVG.find('g[id="' + right_block_id + '"]');

    // define marker
    marker = draw.marker(9, 6, function(add) {
      add.path('M0,0 L0,6 L9,3 z');
      this.fill(ParsedClassicsDiagramGenerator.line_color);
    }).ref(9, 3);

    if (typeof left_block[0] != "undefined" && typeof right_block[0] != "undefined") {
      // find recursion levels of left and right block
      left_block_rec_level = SVG(left_block[0]).attr("data-recursion-level");
      right_block_rec_level = SVG(right_block[0]).attr("data-recursion-level");
      // find hotspots in left and right blocks
      left_block_hotspot = SVG(left_block[0]).findOne('circle[data-recursion-level="' + left_block_rec_level + '"].' + left_block_hotspot_class);
      right_block_hotspot = SVG(right_block[0]).findOne('circle[data-recursion-level="' + right_block_rec_level + '"].hotspot_l');
      // get coords of the hotspots
      left_block_hotspot_bbox = left_block_hotspot.node.getBBox();
      right_block_hotspot_bbox = right_block_hotspot.node.getBBox();
      // get block araound id
      block_around_id = (typeof argsObj[left_block_id].block_around != "undefined") ? argsObj[left_block_id].block_around : "";

      if (typeof left_block_hotspot != "undefined" && typeof right_block_hotspot != "undefined") {
        
        root_block_bbox = root_block.node.getBBox();
        
        // I. there is no block which the line should go around
        if (!block_around_id) {
          // point3 coords
          point3_coords = {};
          point3_coords.x = root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos; 
          point3_coords.y = left_block_hotspot_bbox.y;

          // draw point3
          point3 = draw
          .circle(ParsedClassicsDiagramGenerator.word_border_width)
          .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color) 
          .move(point3_coords.x, point3_coords.y);
          resulting_group.add(point3);

          //point4 coords
          point4_coords = {};
          point4_coords.x = right_block_hotspot_bbox.x - ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos;
          point4_coords.y = right_block_hotspot_bbox.y;

          // draw point4
          point4 = draw
          .circle(ParsedClassicsDiagramGenerator.word_border_width)
          .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color)  
          .move(point4_coords.x, point4_coords.y);
          resulting_group.add(point4);

          // draw polyline

          // is point3 and point4 not on the same horizontal line?
          if (point3_coords.y != point4_coords.y) {
            // draw curved line
            if (!to_forkpoint) {
              d_string = `M ${right_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2} L ${point4_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point4_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${point3_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point3_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/3*2} ${left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2}`;
            }
            else {
              d_string = `M ${right_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2} L ${point4_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point4_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/3*2} ${left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2}`;
            }
            d_string = svgPathRoundedCorners.path_round_corners_coords(d_string);
            polyline = draw
            .path(d_string)
            .stroke({ width: line_width, color: ParsedClassicsDiagramGenerator.line_color})
            .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
            .fill('none');
            if (relation == "modification") {
              polyline.marker("end", marker);
            }
            if (relation == "relativization") {
              polyline.attr('style', 'stroke-dasharray: ' + ParsedClassicsDiagramGenerator.relat_line_dasharray)
            }
            resulting_group.add(polyline);
            if (relation == "apposition") {
              polyline2 = draw
              .path(d_string)
              .stroke({ width: ParsedClassicsDiagramGenerator.appos_line_width2, color: ParsedClassicsDiagramGenerator.appos_line_color2})
              .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
              .fill('none');
              resulting_group.add(polyline2);
            }
            
          }
          //point3 and point4 is on the same horizontal line
          else {
            // draw straight line
            polyline = draw
            .polyline([[right_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2, right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2], 
              [left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/3, left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2]])
            .stroke({ width: line_width, color: ParsedClassicsDiagramGenerator.line_color})
            .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
            .fill('none');
            if (relation == "modification") {
              polyline.marker("end", marker);
            }
            if (relation == "relativization") {
              polyline.attr('style', 'stroke-dasharray: ' + ParsedClassicsDiagramGenerator.relat_line_dasharray)
            }
            resulting_group.add(polyline);
            if (relation == "apposition") {
              polyline2 = draw
              .polyline([[right_block_hotspot_bbox.x, right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2], 
                [left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width, left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2]])
              .stroke({ width: ParsedClassicsDiagramGenerator.appos_line_width2, color: ParsedClassicsDiagramGenerator.appos_line_color2})
              .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
              .fill('none');
              resulting_group.add(polyline2);
            }
            
          }
          
        }
        // II. there is a block which the line should go around
        else {
          block_around = SVG.find('g[id="' + argsObj[left_block_id].block_around + '"]');
          block_around_bbox = block_around[0].node.getBBox();
          // (a) the line on the left starts not from fork point
          if (typeof argsObj[left_block_id].fork_point == "undefined" || !argsObj[left_block_id].fork_point) {
            // point1 coords
            point1_coords = {};
            root_block_local = SVG.find('g[id="' + argsObj[left_block_id].root_block_local + '"]');
            root_block_local_bbox = root_block_local[0].node.getBBox();
            point1_coords.x = root_block_local_bbox.x + root_block_local_bbox.width + ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos;
            point1_coords.y = left_block_hotspot_bbox.y;
            
            // point2 and point3 should go straight?
            if (left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width < block_around_bbox.y - ParsedClassicsDiagramGenerator.space_y_between_words) {
              // draw straight polyline
              polyline = draw
              .polyline([[right_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2, right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2], 
                [left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2, left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2]])
              .stroke({ width: line_width, color: ParsedClassicsDiagramGenerator.line_color})
              .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
              .fill('none');
              if (relation == "modification") {
                polyline.marker("end", marker);
              }
              if (relation == "relativization") {
                polyline.attr('style', 'stroke-dasharray: ' + ParsedClassicsDiagramGenerator.relat_line_dasharray)
              }
              resulting_group.add(polyline);
              if (relation == "apposition") {
                polyline2 = draw
                .polyline([[right_block_hotspot_bbox.x, right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2], 
                  [left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width, left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2]])
                .stroke({ width: ParsedClassicsDiagramGenerator.appos_line_width2, color: ParsedClassicsDiagramGenerator.appos_line_color2})
                .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
                .fill('none');
                resulting_group.add(polyline2);
              }
              
            }
            // point2 and point3 should go around the block-around
            else {
              // draw point1
              point1 = draw
              .circle(ParsedClassicsDiagramGenerator.word_border_width*3)
              .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color)
              .move(point1_coords.x, point1_coords.y);
              resulting_group.add(point1);

              //point4 coords
              point4_coords = {};
              point4_coords.x = right_block_hotspot_bbox.x - ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos;
              point4_coords.y = right_block_hotspot_bbox.y;

              // draw point4
              point4 = draw
              .circle(ParsedClassicsDiagramGenerator.word_border_width*3)
              .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color)
              .move(point4_coords.x, point4_coords.y);
              resulting_group.add(point4);

              // draw temporal path on which to place point2
              path_temp = draw
              .path(`M ${block_around_bbox.x - ParsedClassicsDiagramGenerator.space_y_between_words}, ${block_around_bbox.y - ParsedClassicsDiagramGenerator.space_y_between_words} L ${block_around_bbox.x}, ${block_around_bbox.y}`)
              .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.temp_path_color})
              .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
              .attr('stroke-opacity', 0.2)
              .fill('none');
              resulting_group.add(path_temp);

              // draw temporal path on which to place point3
              if (point1_coords.y < point4_coords.y) {
                coords_string = `M ${root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.space_y_between_words + ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos}, ${block_around_bbox.y - ParsedClassicsDiagramGenerator.space_y_between_words} L ${root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos}, ${block_around_bbox.y}`; 
              }
              else {
                coords_string = `M ${root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos}, ${block_around_bbox.y - ParsedClassicsDiagramGenerator.space_y_between_words} L ${root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.space_y_between_words + ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos}, ${block_around_bbox.y}`; 
              }
              
              path_temp2 = draw
              .path(coords_string)
              .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.temp_path_color})
              .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
              .attr('stroke-opacity', 0.2)
              .fill('none');
              resulting_group.add(path_temp2);

              // find needed path length to place point2 and point3
              path_length_needed = Math.sqrt(ParsedClassicsDiagramGenerator.space_y_between_words**2 + ParsedClassicsDiagramGenerator.space_y_between_words**2);
              path_length_needed = (path_length_needed/(argsObj[left_block_id].block_around_total + 1)) * argsObj[left_block_id].related_to[right_block_order].block_around_count;

              // point2 coords
              point2_coords = {};
              point2_coords.x = path_temp.pointAt(path_length_needed).x - ParsedClassicsDiagramGenerator.word_border_width/2;
              point2_coords.y = path_temp.pointAt(path_length_needed).y - ParsedClassicsDiagramGenerator.word_border_width/2;

              // draw point2
              point2 = draw
              .circle(ParsedClassicsDiagramGenerator.word_border_width)
              .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color)
              .move(point2_coords.x, point2_coords.y);
              resulting_group.add(point2);

              //point3 coords
              point3_coords = {};
              point3_coords.x = path_temp2.pointAt(path_length_needed).x - ParsedClassicsDiagramGenerator.word_border_width/2;
              point3_coords.y = path_temp2.pointAt(path_length_needed).y - ParsedClassicsDiagramGenerator.word_border_width/2;

              // draw point3
              point3 = draw
              .circle(ParsedClassicsDiagramGenerator.word_border_width)
              .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color)
              .move(point3_coords.x, point3_coords.y);
              resulting_group.add(point3);

              // draw polyline

              // is point2 lower than point1? but point4 not lower than point2?
              if (point1_coords.y < point2_coords.y && !(point2_coords.y < point4_coords.y)) {
                // draw straight line
                polyline = draw
                .polyline([[right_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2, right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2], 
                  [left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width, left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2]])
                .stroke({ width: line_width, color: ParsedClassicsDiagramGenerator.line_color})
                .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
                .fill('none');
                if (relation == "modification") {
                  polyline.marker("end", marker);
                }
                if (relation == "relativization") {
                  polyline.attr('style', 'stroke-dasharray: ' + ParsedClassicsDiagramGenerator.relat_line_dasharray)
                }
                resulting_group.add(polyline);
                if (relation == "apposition") {
                  polyline2 = draw
                  .polyline([[right_block_hotspot_bbox.x, right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2],
                    [left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width, left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2]])
                  .stroke({ width: ParsedClassicsDiagramGenerator.appos_line_width2, color: ParsedClassicsDiagramGenerator.appos_line_color2})
                  .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
                  .fill('none');
                  resulting_group.add(polyline2);
                }
                
              }
              // point2 is not lower than point1
              else {
                // draw curved line
                d_string = `M ${right_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2} L ${point4_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point4_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${point3_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point3_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${point2_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point2_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${point1_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point1_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/3*2} ${left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2}`;
                d_string = svgPathRoundedCorners.path_round_corners_coords(d_string);
                polyline = draw
                .path(d_string)
                .stroke({ width: line_width, color: ParsedClassicsDiagramGenerator.line_color})
                .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
                .fill('none');
                if (relation == "modification") {
                  polyline.marker("end", marker);
                }
                if (relation == "relativization") {
                  polyline.attr('style', 'stroke-dasharray: ' + ParsedClassicsDiagramGenerator.relat_line_dasharray)
                }
                resulting_group.add(polyline);
                if (relation == "apposition") {
                  polyline2 = draw
                  .path(d_string)
                  .stroke({ width: ParsedClassicsDiagramGenerator.appos_line_width2, color: ParsedClassicsDiagramGenerator.appos_line_color2})
                  .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
                  .fill('none');
                  resulting_group.add(polyline2);
                }
                
              }


            }
          }
          // (b) the line on the left starts from fork point
          else {
            // draw temporal path on which to place point2
            path_temp = draw
            .path(`M ${block_around_bbox.x - ParsedClassicsDiagramGenerator.space_y_between_words}, ${block_around_bbox.y - ParsedClassicsDiagramGenerator.space_y_between_words} L ${block_around_bbox.x}, ${block_around_bbox.y}`)
            .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.temp_path_color})
            .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
            .attr('stroke-opacity', 0.2)
            .fill('none');
            resulting_group.add(path_temp);

            // draw temporal path on which to place point3
            path_temp2 = draw
            .path(`M ${root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.space_y_between_words + ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos}, ${block_around_bbox.y - ParsedClassicsDiagramGenerator.space_y_between_words} L ${root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos}, ${block_around_bbox.y}`)
            .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.temp_path_color})
            .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
            .attr('stroke-opacity', 0.2)
            .fill('none');
            resulting_group.add(path_temp2);

            // find needed path length to place point2 and point3
            path_length_needed = Math.sqrt(ParsedClassicsDiagramGenerator.space_y_between_words**2 + ParsedClassicsDiagramGenerator.space_y_between_words**2);
            path_length_needed = (path_length_needed/(argsObj[left_block_id].block_around_total + 1)) * argsObj[left_block_id].related_to[right_block_order].block_around_count;

            // point2 coords
            point2_coords = {};
            point2_coords.x = path_temp.pointAt(path_length_needed).x - ParsedClassicsDiagramGenerator.word_border_width/2;
            point2_coords.y = path_temp.pointAt(path_length_needed).y - ParsedClassicsDiagramGenerator.word_border_width/2;

            // draw point2
            point2 = draw
            .circle(ParsedClassicsDiagramGenerator.word_border_width)
            .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color)
            .move(point2_coords.x, point2_coords.y);
            resulting_group.add(point2);

            //point3 coords
            point3_coords = {};
            point3_coords.x = path_temp2.pointAt(path_length_needed).x - ParsedClassicsDiagramGenerator.word_border_width/2;
            point3_coords.y = path_temp2.pointAt(path_length_needed).y - ParsedClassicsDiagramGenerator.word_border_width/2;

            // draw point3
            point3 = draw
            .circle(ParsedClassicsDiagramGenerator.word_border_width)
            .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color)
            .move(point3_coords.x, point3_coords.y);
            resulting_group.add(point3);

            //point4 coords
            point4_coords = {};
            point4_coords.x = right_block_hotspot_bbox.x - ParsedClassicsDiagramGenerator.intercolumn_direction_change_pos;
            point4_coords.y = right_block_hotspot_bbox.y;

            // draw point4
            point4 = draw
            .circle(ParsedClassicsDiagramGenerator.word_border_width)
            .attr("fill", ParsedClassicsDiagramGenerator.temp_hotspot_color)
            .move(point4_coords.x, point4_coords.y);
            resulting_group.add(point4);

            // draw polyline
            d_string = `M ${right_block_hotspot_bbox.x} ${right_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2} L ${point4_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point4_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${point3_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point3_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${point2_coords.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${point2_coords.y + ParsedClassicsDiagramGenerator.word_border_width/2} ${left_block_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${left_block_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2}`;
            d_string = svgPathRoundedCorners.path_round_corners_coords(d_string);
            polyline = draw
            .path(d_string)
            .stroke({ width: line_width, color: ParsedClassicsDiagramGenerator.line_color}) 
            .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
            .fill('none');
            if (relation == "modification") {
              polyline.marker("end", marker);
            }
            if (relation == "relativization") {
              polyline.attr('style', 'stroke-dasharray: ' + ParsedClassicsDiagramGenerator.relat_line_dasharray)
            }
            resulting_group.add(polyline);
            if (relation == "apposition") {
              polyline2 = draw
              .path(d_string)
              .stroke({ width: ParsedClassicsDiagramGenerator.appos_line_width2, color: ParsedClassicsDiagramGenerator.appos_line_color2})
              .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
              .fill('none');
              resulting_group.add(polyline2);
            }
             
          }
          
        }

      }
    }
  },

  draw_parenthesis: function(draw, argsObj, left_block_id, right_block_order, root_block, resulting_group) {
    var right_block_id, 
    right_block, 
    right_block_bbox, 
    polyline,
    top_right_point_x,
    top_right_point_y,
    top_left_point_x,
    top_left_point_y,
    bottom_left_point_x,
    bottom_left_point_y,
    bottom_right_point_x,
    bottom_right_point_y,
    sign_block_gap;

    right_block_id = argsObj[left_block_id].related_to[right_block_order].internal_index;
    right_block = SVG.find('g[id="' + right_block_id + '"]');
    right_block_bbox = right_block[0].node.getBBox();

    sign_block_gap = 5;
    right_block[0].move(right_block_bbox.x + ParsedClassicsDiagramGenerator.parenthesis_sign_width + sign_block_gap, right_block_bbox.y);

    top_right_point_x = right_block_bbox.x + ParsedClassicsDiagramGenerator.parenthesis_sign_width;
    top_right_point_y = right_block_bbox.y;
    top_left_point_x = right_block_bbox.x;
    top_left_point_y = right_block_bbox.y;
    bottom_left_point_x = right_block_bbox.x;
    bottom_left_point_y = right_block_bbox.y + right_block_bbox.height;
    bottom_right_point_x = right_block_bbox.x + ParsedClassicsDiagramGenerator.parenthesis_sign_width;
    bottom_right_point_y = right_block_bbox.y + right_block_bbox.height;

    polyline = draw
    .polyline([[top_right_point_x,top_right_point_y], [top_left_point_x,top_left_point_y], [bottom_left_point_x,bottom_left_point_y], [bottom_right_point_x, bottom_right_point_y]])
    .stroke({ width: ParsedClassicsDiagramGenerator.line_width*1.5, color: ParsedClassicsDiagramGenerator.line_color})
    .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
    .fill('none');

    // add to group
    right_block[0].add(polyline);
  },

  draw_fork_point: function(draw, argsObj, phase_2_json, root_block, resulting_group) {
    var first_expr_int_index,
    exp_num,
    first_expr,
    first_hotspot_r3,
    first_hotspot_r3_bbox,
    last_expr_int_index,
    last_expr,
    last_hotspot_r3,
    recursion_level,
    last_hotspot_r3_bbox,
    root_block_bbox,
    forkpoint_coords,
    d_string,
    circle,
    circle_length,
    circle_hotspot_coords,
    circle_hotspot_coords2,
    circle_hotspot_coords3,
    hotspot_fork3,
    hotspot_fork1,
    hotspot_fork5,
    related_to,
    forkpoint_id,
    fork_point_group;
    
    forkpoint_id = argsObj.internal_index;

    // get coords of hotspot_r3 of the first word in fork relation
    first_expr_int_index = argsObj.words_and_phrases[0].internal_index;
    first_expr = SVG.find('#' + first_expr_int_index);
    recursion_level = first_expr[0].attr("data-recursion-level");
    first_hotspot_r3 = SVG(first_expr[0]).findOne('[data-recursion-level="' + recursion_level + '"].hotspot_r3');
    first_hotspot_r3_bbox = first_hotspot_r3.node.getBBox();

    // get coords of hotspot_r3 of the last word in fork relation
    exp_num = argsObj.words_and_phrases.length;
    last_expr_int_index = argsObj.words_and_phrases[exp_num - 1].internal_index;
    last_expr = SVG.find('#' + last_expr_int_index);
    recursion_level = last_expr[0].attr("data-recursion-level");
    last_hotspot_r3 = SVG(last_expr[0]).findOne('[data-recursion-level="' + recursion_level + '"].hotspot_r3');
    last_hotspot_r3_bbox = last_hotspot_r3.node.getBBox();

    // get coords of root block
    root_block_bbox = root_block[0].node.getBBox();

    // get forkpoint coords
    forkpoint_coords = {};
    forkpoint_coords.x = root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.fork_point_back_pos;
    forkpoint_coords.y = first_hotspot_r3_bbox.y + (last_hotspot_r3_bbox.y - first_hotspot_r3_bbox.y)/2;

    // draw forkpoint
    d_string = ParsedClassicsDiagramGenerator.circle_to_path_converter(forkpoint_coords.x, forkpoint_coords.y, ParsedClassicsDiagramGenerator.fork_point_radius/2);
    circle = draw
    .path(d_string)
    .attr("stroke", ParsedClassicsDiagramGenerator.line_color)
    .attr("stroke-width", ParsedClassicsDiagramGenerator.line_width)
    .fill(ParsedClassicsDiagramGenerator.line_color)  
    .attr("id", forkpoint_id)
    .attr("data-recursion-level", recursion_level + 1)
    .attr("class", "fork_point");

    // draw hotspots on forkpoint
    circle_length = circle.length();

    circle_hotspot_coords = circle.pointAt(circle_length/2);
    hotspot_fork3 = draw
    .circle(ParsedClassicsDiagramGenerator.word_border_width)
    .fill(ParsedClassicsDiagramGenerator.hotspot_color)
    .attr("class", "hotspot_r3")
    .attr("data-recursion-level", recursion_level + 1)
    .move(circle_hotspot_coords.x - ParsedClassicsDiagramGenerator.word_border_width/2, circle_hotspot_coords.y - ParsedClassicsDiagramGenerator.word_border_width/2);
    circle_hotspot_coords2 = circle.pointAt(circle_length/2 + ParsedClassicsDiagramGenerator.word_border_width*2);
    hotspot_fork1 = draw
    .circle(ParsedClassicsDiagramGenerator.word_border_width)
    .fill(ParsedClassicsDiagramGenerator.hotspot_color)
    .attr("class", "hotspot_tr hotspot_r1 hotspot_r2")
    .attr("data-recursion-level", recursion_level + 1)
    .move(circle_hotspot_coords2.x - ParsedClassicsDiagramGenerator.word_border_width/2, circle_hotspot_coords2.y - ParsedClassicsDiagramGenerator.word_border_width/2);
    circle_hotspot_coords3 = circle.pointAt(circle_length/2 - ParsedClassicsDiagramGenerator.word_border_width*2);
    hotspot_fork5 = draw
    .circle(ParsedClassicsDiagramGenerator.word_border_width)
    .fill(ParsedClassicsDiagramGenerator.hotspot_color)
    .attr("class", "hotspot_r4 hotspot_r5 hotspot_br")
    .attr("data-recursion-level", recursion_level + 1)
    .move(circle_hotspot_coords3.x - ParsedClassicsDiagramGenerator.word_border_width/2, circle_hotspot_coords3.y - ParsedClassicsDiagramGenerator.word_border_width/2);

    fork_point_group = draw.group()
    .attr("id", forkpoint_id)
    .attr("class", "fork_point")
    .attr("data-recursion-level", recursion_level + 1);
    fork_point_group.add(circle);
    fork_point_group.add(hotspot_fork3);
    fork_point_group.add(hotspot_fork1);
    fork_point_group.add(hotspot_fork5);

    resulting_group.add(fork_point_group);

    return forkpoint_id;
  },

  draw_fork_lines: function(draw, argsObj, phase_2_json, root_block, resulting_group) {
    var key_arr,
    key,
    left_expr,
    left_hotspot,
    left_hotspot_bbox,
    path,
    forkpoint_id,
    forkpoint_coords,
    root_block_bbox,
    first_expr_int_index,
    exp_num,
    first_expr,
    first_hotspot_r3,
    first_hotspot_r3_bbox,
    last_expr_int_index,
    last_expr,
    last_hotspot_r3,
    recursion_level,
    last_hotspot_r3_bbox,
    middlepoint_coords,
    middlepoint2_coords,
    d_string;

    forkpoint_id = argsObj.internal_index;

    // get coords of hotspot_r3 of the first word in fork relation
    first_expr_int_index = argsObj.words_and_phrases[0].internal_index;
    first_expr = SVG.find('#' + first_expr_int_index);
    recursion_level = first_expr[0].attr("data-recursion-level");
    first_hotspot_r3 = SVG(first_expr[0]).findOne('[data-recursion-level="' + recursion_level + '"].hotspot_r3');
    first_hotspot_r3_bbox = first_hotspot_r3.node.getBBox();

    // get coords of hotspot_r3 of the last word in fork relation
    exp_num = argsObj.words_and_phrases.length;
    last_expr_int_index = argsObj.words_and_phrases[exp_num - 1].internal_index;
    last_expr = SVG.find('#' + last_expr_int_index);
    recursion_level = last_expr[0].attr("data-recursion-level");
    last_hotspot_r3 = SVG(last_expr[0]).findOne('[data-recursion-level="' + recursion_level + '"].hotspot_r3');
    last_hotspot_r3_bbox = last_hotspot_r3.node.getBBox();

    // get coords of root block
    root_block_bbox = root_block[0].node.getBBox();

    // get forkpoint coords
    forkpoint_coords = {};
    forkpoint_coords.x = root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.fork_point_back_pos;
    forkpoint_coords.y = first_hotspot_r3_bbox.y + (last_hotspot_r3_bbox.y - first_hotspot_r3_bbox.y)/2;

    // draw fork lines
    key_arr = Object.keys(phase_2_json);
    for (var i = 0; i < key_arr.length; i++) {
      key = key_arr[i];
      related_to = phase_2_json[key].related_to;
      for (var j = 0; j < related_to.length; j++) {
        if (related_to[j].internal_index == forkpoint_id && related_to[j].relation == "fork2") {
          // get left hotspot coords
          left_expr = SVG.find('#' + key);
          left_hotspot = left_expr[0].findOne("." + related_to[j].left_hotspot);

          left_hotspot_bbox = left_hotspot.node.getBBox();
          // get middle point2 coords
          middlepoint2_coords = {};
          middlepoint2_coords.x = root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.fork_point_back_pos*0.1;
          middlepoint2_coords.y = left_hotspot_bbox.y;
          // get middle point coords
          middlepoint_coords = {};
          middlepoint_coords.x = root_block_bbox.x + root_block_bbox.width + ParsedClassicsDiagramGenerator.fork_point_back_pos*0.8;
          middlepoint_coords.y = left_hotspot_bbox.y < forkpoint_coords.y ? left_hotspot_bbox.y + (forkpoint_coords.y - left_hotspot_bbox.y)*0.2 : forkpoint_coords.y + (left_hotspot_bbox.y - forkpoint_coords.y)*0.8;
          // draw line
          d_string = `M ${left_hotspot_bbox.x + ParsedClassicsDiagramGenerator.word_border_width/2} ${left_hotspot_bbox.y + ParsedClassicsDiagramGenerator.word_border_width/2} L ${middlepoint2_coords.x} ${middlepoint2_coords.y} ${middlepoint_coords.x} ${middlepoint_coords.y} ${forkpoint_coords.x} ${forkpoint_coords.y}`;
          d_string = svgPathRoundedCorners.path_round_corners_coords(d_string);
          path = draw
          .path(d_string)
          .stroke({ width: ParsedClassicsDiagramGenerator.line_width, color: ParsedClassicsDiagramGenerator.line_color})
          .attr('stroke-linejoin', 'round') // needed in order to get correct bbox dimensions; default value "miter" adds "padding" around polyline
          .fill('none');
          resulting_group.add(path);
        }
      }
    }
  },

  // from http://complexdan.com/svg-circleellipse-to-path-converter/ based on https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
  circle_to_path_converter: function(cx, cy, r) {
      cx = parseFloat(cx, 10); 		
      cy = parseFloat(cy, 10); 		 		
      r = parseFloat(r, 10); 		
      if (r>0){
        rx = r;
        ry = r;
      }
      var output = "M" + (cx-rx).toString() + "," + cy.toString();
      output += "a" + rx.toString() + "," + ry.toString() + " 0 1,0 " + (2 * rx).toString() + ",0";
      output += "a" + rx.toString() + "," + ry.toString() + " 0 1,0 " + (-2 * rx).toString() + ",0";
      return output;
  }
   
}; // end of ParsedClassicsDiagramGenerator


/*
Script svgPathRoundedCorners
based on https://dev.to/netsi1964/simple-add-round-corners-to-svg-path-using-quadratic-line-type-3iem
https://codepen.io/netsi1964/pen/LYGaOvv
*/

var svgPathRoundedCorners = {
  lineType: "Q", // "Q" for quadatic, "C" for cubic curve
  radius: 50,
  radius2: 0,

  path_round_corners_coords: function(originalPath) {
    let lines_coords = svgPathRoundedCorners.init(originalPath);
    let d = svgPathRoundedCorners.addRoundCorners(lines_coords);
    return d; 
  },

  init: function(path) {
    let coordinates = [];
    let lines = [];
    // get the points in an array
    let rawCoordinates = path.replace(/[mlz]/gi, "").split(" ").filter(c => c.trim() != "");

    for (let i = 0; i < rawCoordinates.length; i += 2) {
      const coor = { x: rawCoordinates[i], y: rawCoordinates[i + 1] };
      coordinates.push(coor);
    }

    const numberOfCoordinates = coordinates.length;
    let largestRadius = 0;
    for (let i = 0; i < numberOfCoordinates; i++) {
      const coorBefore =
      i === 0 ? coordinates[numberOfCoordinates - 1] : coordinates[i - 1];
      const coor = coordinates[i];
      const coorAfter =
      i === numberOfCoordinates - 1 ? coordinates[0] : coordinates[i + 1];

      //  construct temporary line path (beforLine) going from point to point before current point
      const lineBefore = svgPathRoundedCorners.getLine(coor, coorBefore);

      //  construct temporary line path (afterLine) going from point to point after current point
      const lineAfter = svgPathRoundedCorners.getLine(coor, coorAfter);

      // Line between two lines
      let lineBetween = svgPathRoundedCorners.getLine(coorBefore, coorAfter);
      let lineBetweenLength = lineBetween.getTotalLength();
      let middlePoint = lineBetween.getPointAtLength(lineBetweenLength / 2);
      lineBetween = svgPathRoundedCorners.getLine(coor, middlePoint);

      const maxRadius = parseInt(
      Math.min(lineBefore.getTotalLength(), lineAfter.getTotalLength()) / 2);

      largestRadius = maxRadius > largestRadius ? maxRadius : largestRadius;

      lines.push({ lineBefore, lineAfter, coor, lineBetween, maxRadius });
    }
    return {lines, coordinates};
  },

  addRoundCorners: function(lines_coords) {
    // for each point
    let lines = lines_coords.lines;
    let coordinates = lines_coords.coordinates;
    const numberOfCoordinates = coordinates.length;
    let d = "";
    for (let i = 0; i < numberOfCoordinates; i++) {
      let { lineBefore, lineAfter, coor, lineBetween, maxRadius } = lines[i];
      const minorRadius = Math.min(svgPathRoundedCorners.radius, maxRadius);
      const minorRadius2 = Math.min(svgPathRoundedCorners.radius2, maxRadius);
      const beforePoint = lineBefore.getPointAtLength(minorRadius);
      const afterPoint = lineAfter.getPointAtLength(minorRadius);
      const beforePoint2 = lineBefore.getPointAtLength(minorRadius2);
      const afterPoint2 = lineAfter.getPointAtLength(minorRadius2);

      coor = lineBetween.getPointAtLength(minorRadius2);

      // generate data to new rounded path
      switch (svgPathRoundedCorners.lineType) {
        case "Q":
          if (i== 0) {
            d += `M ${svgPathRoundedCorners.getCoordinates(coor)} `;
          }
          else if (i == numberOfCoordinates-1) {
            d += `L ${svgPathRoundedCorners.getCoordinates(coor)} `;
          }
          else {
            d += `${i === 0 ? "M" : "L"} ${svgPathRoundedCorners.getCoordinates(beforePoint)} ${svgPathRoundedCorners.lineType} ${svgPathRoundedCorners.getCoordinates(coor)} ${svgPathRoundedCorners.getCoordinates(afterPoint)} `;
          }
          break;
        case "C":
          if (i== 0) {
            d += `M ${svgPathRoundedCorners.getCoordinates(coor)} `;
          }
          else if (i == numberOfCoordinates-1) {
            d += `L ${svgPathRoundedCorners.getCoordinates(coor)} `;
          }
          else {
            d += `${i === 0 ? "M" : "L"} ${svgPathRoundedCorners.getCoordinates(beforePoint)} ${svgPathRoundedCorners.lineType} ${svgPathRoundedCorners.getCoordinates(beforePoint2)} ${svgPathRoundedCorners.getCoordinates(afterPoint2)} ${svgPathRoundedCorners.getCoordinates(afterPoint)} `;
          }
          break;
      }

    }
    
    return d; 
  },

  getCoordinates: function (point) {
    return `${Math.round(point.x)} ${Math.round(point.y)}`;
  },

  getLine: function(coor1, coor2) {
    const line = svgPathRoundedCorners.getElement("path");
    line.setAttribute("d", `M ${coor1.x} ${coor1.y} L  ${coor2.x} ${coor2.y}`);
    return line;
  },

  getElement: function(tagName, attrs) {
    const SVGNS = "http://www.w3.org/2000/svg";
    const ele = document.createElementNS(SVGNS, tagName);
    const sharedAttributes = {
      stroke: `black`,
      strokeWidth: `1`,
      fill: `none` 
    };
    const allAttributes = { ...sharedAttributes, ...attrs };
    Object.keys(allAttributes).forEach(att => {
      ele.setAttribute(att, allAttributes[att]);
    });
    return ele;
  }
}; // end of svgPathRoundedCorners