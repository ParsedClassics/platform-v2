/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
Scripts supporting ParsedClassics tools functionality
=====================================================
*/


/*

Word list generator script

*/

var ParsedClassicsWordList = {
	
	loadParsedText: function() {
			var textarea_el, parsed_text, parsed_text_container, msg_el;	
		
			// find input textarea
			textarea_el = $("#" + ParsedClassicsVars.inputTextareaId);
		
			// get parsed text code
			parsed_text = textarea_el.val();
		
			// trim parsed text string
			parsed_text = $.trim(parsed_text);
		
			// no parsed text? - then nothing to do, exept to display error msg
			if (parsed_text == "") {
					// find message el
					msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
					// put message text inside message el
					msg_el.html("No parsed text found inside Parsed text input!");
					// display modal dialogue
					ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
				
					return;
			}
			
			// find parsed text element
			parsed_text_container = $("#" + ParsedClassicsVars.appendCodeContainerId);
		
			// put parsed text code into paresed text element
			parsed_text_container.html(parsed_text);
		
			// display parsed text container
			parsed_text_container.slideDown(ParsedClassicsVars.animationSpeed);
			
	}
	
	, generateWordList: function() {
			var parsed_text_container, words_all, words_list_unordered, single_word, word_chars, chars_with_grave_accent, contains_grave_accent, output_textarea, words_list_array, words_list_ordered, language_form_el, language_radio_el, parsed_text_lang, msg_el;
		
			// find parsed text element
			parsed_text_container = $("#" + ParsedClassicsVars.appendCodeContainerId);

			// find language form and radio els
			language_form_el = document.forms[ParsedClassicsVars.languageFormName];
			language_radio_el = language_form_el[ParsedClassicsVars.languageRadioName];
		
			// find language of parsed text
			parsed_text_lang = language_radio_el.value;
		
			if (parsed_text_lang == ParsedClassicsVars.languageGreek) {
				ParsedClassicsVars.locale = "el";
			}
			else if (parsed_text_lang == ParsedClassicsVars.languageLatin) {
				ParsedClassicsVars.locale = "la";
			}
		
			// find all word els
			words_all = parsed_text_container.find("." + ParsedClassicsVars.wordClass);
		
			// no words found? - nothing to do, exept to display error msg
			if (words_all.length == 0) {
					// find message el
					msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
					// put message text inside message el
					msg_el.html("No parsed text has been loaded!");
					// display modal dialogue
					ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	
				
					return;
			}
		
			// define list string
			words_list_unordered = "|" + words_all.first().attr(ParsedClassicsVars.lemmaAttr) + "|";

			// define array consisting of symbols of greek vowels having grave accent
			chars_with_grave_accent = ['ὰ', 'ἂ', 'ἃ', 'ὲ', 'ἒ', 'ἓ', 'ὴ', 'ἢ', 'ἣ', 'ὶ', 'ἲ', 'ἳ', 'ὸ', 'ὂ', 'ὃ', 'ὺ', 'ὒ', 'ὓ', 'ὼ', 'ὢ', 'ὣ'];
			
			// put all words into pipe delimited string
			for (var i = 1; i < words_all.length; i++) {
				single_word = $(words_all[i]).attr(ParsedClassicsVars.lemmaAttr);
				
				if (ParsedClassicsVars.locale == "el") {
					// Check 1: check if there are in the Greek word a vowel with grave accent (there should be no grave accents in lemma)
					// get array of chars from lemma
					word_chars = single_word.split('');
					word_chars[0].toLowerCase();
					// find if lemma contains grave accent
					contains_grave_accent = chars_with_grave_accent.some(char => {
						return word_chars.includes(char);
					});
					// display error msg in case there is grave accent in lemma
					if (contains_grave_accent) {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("Grave accent found in lemma " + single_word + " !");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	
						return;
					}
					// Check 2: check if lemma of the article has double diacritic
					if (single_word == 'ὅ') {
						// display error msg
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("Double diacritic in article's lemma " + single_word + " !");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	
						return;
					}
					// Check 3: check if lemma of enclitic has accent
					if (single_word == 'τέ') {
						// display error msg
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("Accent in enclitic's lemma " + single_word + " !");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	
						return;
					}
				}
				// is word already in string?
				if (words_list_unordered.indexOf("|" + single_word + "|") == -1) {
						// if it is not, append it to string
						words_list_unordered += single_word + "|";
				}
			}
		
			// trim pipe char from beginning and end of the string
			words_list_unordered = words_list_unordered.substring(1, words_list_unordered.length - 1);
			
			// split words string into words array
			words_list_array = words_list_unordered.split("|");
		
			

			// sort words aphabetically
			words_list_array.sort(function(a, b) {return a.localeCompare(b, ParsedClassicsVars.locale, {sensitivity: 'base'}) });
		
			// convert sorted words list into pipe delimited string
			words_list_ordered = words_list_array.join("|");
		
			// find output textarea
			output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
		
			// put list string into output textarea
			output_textarea.val(words_list_ordered);
	}
	
	, checkForCompleteness: function() {
			var parsed_text_container, words_all, output_textarea, words_list_string, words_list_array, words_by_lemma, lemma, msg_el, not_included, txt;
		
			// find parsed text element
			parsed_text_container = $("#" + ParsedClassicsVars.appendCodeContainerId);
		
			// check if parsed text has been loaded; it is if we can find at least one word el
			words_all = parsed_text_container.find("." + ParsedClassicsVars.wordClass);
			
			// no parsed text loaded?- nothing to do, exept to display error msg
			if (words_all.length < 1) {
					// find message el
					msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
					// put message text inside message el
					msg_el.html("No parsed text has been loaded!");
					// display modal dialogue
					ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	
				
					return;
			}
		
			// find output textarea
			output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
		
			// get textarea value
			words_list_string = output_textarea.val();
		
			// trim words list
			words_list_string = $.trim(words_list_string);
		
			// no word list found? - nothing to do, exept to display error msg
			if (words_list_string == "") {
					// find message el
					msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
					// put message text inside message el
					msg_el.html("No pipe delimited word list was found in Output textarea!");
					// display modal dialogue
					ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	
				
					return;
			}
			
			// split words list into words array
			words_list_array = words_list_string.split("|");
		
			// color words included in words list in green
			for (var i = 0; i < words_list_array.length; i++) {
					lemma = words_list_array[i].replace("(", "\\(");
					lemma = lemma.replace(")", "\\)");
					words_by_lemma = parsed_text_container.find("[" + ParsedClassicsVars.lemmaAttr + "=" + lemma + "]");
					words_by_lemma.addClass("w3-pale-green");
			}

			// color words not included in words list
			not_included = parsed_text_container.find("." + ParsedClassicsVars.wordUrlAndCookieName).not(".w3-pale-green").addClass("w3-pale-red");
			// put words not included in concordance into square brackets
			for (var i = 0; i < not_included.length; i++) {
				txt = "[" + $(not_included[i]).html() + "]";
				$(not_included[i]).html(txt);
			}
			
	}
	
	, init: function() {
			var load_text_button, generate_list_button, check_if_complete_button;
		
			load_text_button = $("#" + ParsedClassicsVars.loadButtonId);
			generate_list_button = $("#" + ParsedClassicsVars.generateButtonId);
			check_if_complete_button	= $("#" + ParsedClassicsVars.checkButtonId);
		
			load_text_button.bind("click", ParsedClassicsWordList.loadParsedText);
			generate_list_button.bind("click", ParsedClassicsWordList.generateWordList);
			check_if_complete_button.bind("click", ParsedClassicsWordList.checkForCompleteness);
	}
	
};

/*

Concordance generator script

*/

var ParsedClassicsConcordance = {

	generateConcordance: function() {
				var parsed_text_container
				, concordance_container
				, concordance_output_textarea_el
				, words_all
				, word_list_textarea_el
				, words_list_string
				, msg_el
				, words_list_array
				, lemma
				, words_by_lemma
				, word_el
				, word_form
				, part_of_speech
				, parsing
				, word_form_prev
				, part_of_speech_prev
				, parsing_prev
				, word_form_next
				, part_of_speech_next
				, parsing_next
				, word_el_next
				, line_num
				, line_num_prev
				, html_line
				, result_html
				, result_js
				, line_num_class
				, book_abbr_el
				, book_abbr
				, first_item_in_list
				, language_form_el
				, language_radio_el
				, parsed_text_lang
				, chars_with_grave_accent
				, word_chars
				, contains_grave_accent
				, contains_double_diacritic;

				// find parsed text element
				parsed_text_container = $("#" + ParsedClassicsVars.appendCodeContainerId);
			
				// find concordance element
				concordance_container = $("#" + ParsedClassicsVars.appendCodeContainer2Id);
			
				// find output textarea
				concordance_output_textarea_el = $("#" + ParsedClassicsVars.outputTextareaId);

				// find book abbr input
				book_abbr_el = $("#" + ParsedClassicsVars.inputTextarea3Id);

				// get book abbr
				book_abbr = $.trim(book_abbr_el.val());
				
				// no book abbr found? - nothing to do, exept to display error msg
				if (!book_abbr) {
					// find message el
					msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
					// put message text inside message el
					msg_el.html("No abbreviation entered in Book abbreviation input!");
					// display modal dialogue
					ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

					return;
				}
			
				// find all word els
				words_all = parsed_text_container.find("." + ParsedClassicsVars.wordClass);
			
				// no words found? - nothing to do, exept to display error msg
				if (words_all.length == 0) {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No parsed text has been loaded!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

						return;
				}
			
				// find word list input textarea
				word_list_textarea_el = $("#" + ParsedClassicsVars.inputTextarea2Id);
			
				// get textarea value
				words_list_string = word_list_textarea_el.val();
		
				// trim words list
				words_list_string = $.trim(words_list_string);
			
				// no word list found? - nothing to do, exept to display error msg
				if (words_list_string == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No pipe delimited word list was found in Word list input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

						return;
				}

				// find language form and radio els
				language_form_el = document.forms[ParsedClassicsVars.languageFormName];
				language_radio_el = language_form_el[ParsedClassicsVars.languageRadioName];
			
				// find language of parsed text
				parsed_text_lang = language_radio_el.value;
			
				if (parsed_text_lang == ParsedClassicsVars.languageGreek) {
					ParsedClassicsConcordance.locale = "el";
				}
				else if (parsed_text_lang == ParsedClassicsVars.languageLatin) {
					ParsedClassicsConcordance.locale = "la";
				}
			
				// define output variables
				result_html = "";
				result_js = "";
				
				// split words string into words array
				words_list_array = words_list_string.split("|");

				// define array consisting of symbols of greek vowels having grave accent
				chars_with_grave_accent = ['ὰ', 'ἂ', 'ἃ', 'ὲ', 'ἒ', 'ἓ', 'ὴ', 'ἢ', 'ἣ', 'ὶ', 'ἲ', 'ἳ', 'ὸ', 'ὂ', 'ὃ', 'ὺ', 'ὒ', 'ὓ', 'ὼ', 'ὢ', 'ὣ'];
				
				// generate concordance html code
				for (var i = 0; i < words_list_array.length; i++) {
					// get lemma of single word
					lemma = words_list_array[i].replace("(", "\\(");
					lemma = lemma.replace(")", "\\)");
				
					// put lemma into result html and result js
					html_line = '<div class="' + ParsedClassicsVars.concordanceEntryClass + '"><h2><span class="' + ParsedClassicsVars.concordanceHeadingClass + '" ' + ParsedClassicsVars.lemmaAttr + '="' + words_list_array[i] + '">' + words_list_array[i] + '</span></h2>';
					result_html += html_line;
					result_js += "'" + html_line + "' + \n";
					
					// get jquery set of all words of the same lemma
					words_by_lemma = parsed_text_container.find("[" + ParsedClassicsVars.lemmaAttr + "=" + lemma + "]");
					// convert jquery set to array
					words_by_lemma = words_by_lemma.toArray();
				
					// sort words by their parsing
					words_by_lemma.sort(ParsedClassicsConcordance._sortWordsByParsing);

					// form output html
					word_form_prev = '';
					part_of_speech_prev = '';
					parsing_prev = '';
					word_form_next = '';
					part_of_speech_next = '';
					parsing_next = '';
					for (var j = 0; j < words_by_lemma.length; j++) {
						word_el = $(words_by_lemma[j]);
						// find word form, lemma 
						word_form = word_el.attr(ParsedClassicsVars.formAttr).trim();
						if (ParsedClassicsVars.locale == "el") {
							// Check 1: check if there are in the Greek word a vowel with grave accent (there should be no grave accents in word form)
							// get array of chars from lemma
							word_chars = word_form.split('');
							word_chars[0].toLowerCase();
							// find if lemma contains grave accent
							contains_grave_accent = chars_with_grave_accent.some(char => {
								return word_chars.includes(char);
							});
							// display error msg in case there is grave accent in lemma
							if (contains_grave_accent) {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("Grave accent found in word form " + word_form + " !");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	
								return;
							}
							// Check 2: check if article word form has double diacritic
							if (lemma == 'ὁ') {
								contains_double_diacritic = ['ὅ', 'ἥ', 'οἵ', 'αἵ'].includes(word_form);
							}
							// Check 3: check if word form of enclitic has accent
							if (word_form == 'τέ') {
								// display error msg
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("Accent in enclitic's word form " + single_word + " !");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	
								return;
							}
						}

						// find part of spreech, parsing of current word
						part_of_speech = word_el.attr(ParsedClassicsVars.partOfSpeechAttr).trim().replace(/\s+/g, ' ');
						parsing = word_el.attr(ParsedClassicsVars.parsingAttr).trim().replace(/\s+/g, ' ');
						// find word form, part of spreech, parsing of next word 
						if (j + 1 != words_by_lemma.length) {
							word_el_next = $(words_by_lemma[j + 1]);
							word_form_next = word_el_next.attr(ParsedClassicsVars.formAttr).trim();
							part_of_speech_next = word_el_next.attr(ParsedClassicsVars.partOfSpeechAttr).trim().replace(/\s+/g, ' ');
							parsing_next = word_el_next.attr(ParsedClassicsVars.parsingAttr).trim().replace(/\s+/g, ' ');
						}

						line_num = word_el.siblings("." + ParsedClassicsVars.verseNumberClass).first().text();

						//convert line number to line class
						line_num_class = ParsedClassicsData._findLineNumClass(line_num);

						// put info about certain word into output html
						if (j == 0 || word_form != word_form_prev || part_of_speech != part_of_speech_prev || parsing != parsing_prev) {
							html_line = '<span class="' + ParsedClassicsVars.concordanceVerseClass + '"><span class="' + ParsedClassicsVars.concordanceLinesButtonClass + ' ' + ParsedClassicsVars.concordanceLinesButtonCollapsedClass + '"></span><span class="' + ParsedClassicsVars.concordanceWordClass + '" ' +  ParsedClassicsVars.lemmaAttr + '="' + words_list_array[i] + '" ' + ParsedClassicsVars.formAttr + '="' + word_form + '" ' + ParsedClassicsVars.parsingAttr + '="' + parsing + '" ' + ParsedClassicsVars.partOfSpeechAttr + '="' + part_of_speech + '">' + word_form + " " + part_of_speech + " " + parsing;
							html_line += '<span class="' + ParsedClassicsVars.concordanceLinesListClass + '">';
							first_item_in_list = true;
							line_num_prev = '';
						}
						
						if (line_num != line_num_prev) {
							html_line += !first_item_in_list ? ', ' : '';
							html_line += '<span class="' + ParsedClassicsVars.concordanceLineNumClass + '" ' + ParsedClassicsVars.concordanceLineClassAttr + '="' + line_num_class + '">' + book_abbr + '&nbsp;' + line_num + '</span>';
						}
						first_item_in_list = false;

						if (j == words_by_lemma.length - 1 || word_form != word_form_next || part_of_speech != part_of_speech_next || parsing != parsing_next) {
							html_line += '</span>';
							html_line += '</span>';
							html_line += '</span>';
							result_html += html_line;
							result_js += "'" + html_line + "' + \n";
						}

						word_form_prev = word_form;
						part_of_speech_prev = part_of_speech;
						parsing_prev = parsing;
						line_num_prev = line_num;

					}

					html_line = '</div>'
					result_html += html_line;
					result_js += "'" + html_line + "' + \n";

				}
				// place output html into concordance container
				concordance_container.html(result_html);
				// display concordance container
				concordance_container.slideDown(ParsedClassicsVars.animationSpeed);
			
				// output generated code into concordance output textarea
				concordance_output_textarea_el.val(result_html);

				//delegate "click" event from els having class "concordance-lines-button" to concordance_container
				concordance_container.delegate("." + ParsedClassicsVars.concordanceLinesButtonClass, "click", ParsedClassicsConcordance.showConcordanceLines);


		}

		, showConcordanceLines: function(event) {
			var button
			, el
			, conc_word_container
			, lines_list_container;

			// initialize vars
			conc_word_container = "";

			// get clicked button
			button = $(event.target);

			// find concordance-word container
			el = button;
			while (!el.hasClass(ParsedClassicsVars.concordanceVerseClass) && el[0] != document.body) {
				el = el.parent();
				if (el[0] != document.body) {
					conc_word_container = el;
				}
			}

			if (conc_word_container) {
				lines_list_container = conc_word_container.find("." + ParsedClassicsVars.concordanceLinesListClass);
				if (button.hasClass(ParsedClassicsVars.concordanceLinesButtonCollapsedClass)) {
					lines_list_container.hide(ParsedClassicsVars.animationSpeed);
					button.removeClass(ParsedClassicsVars.concordanceLinesButtonCollapsedClass);
					button.addClass(ParsedClassicsVars.concordanceLinesButtonExpandedClass);
				}
				else {
					lines_list_container.show(ParsedClassicsVars.animationSpeed);
					lines_list_container.css("display", "block");
					button.removeClass(ParsedClassicsVars.concordanceLinesButtonExpandedClass);
					button.addClass(ParsedClassicsVars.concordanceLinesButtonCollapsedClass);
				}
			}
			
		} 
	
		, _sortWordsByParsing: function(word_span_1, word_span_2) {
			var return_val
			, part_of_speech_1
			, part_of_speech_2
			, word_form_1
			, word_form_2
			, parsing_1
			, parsing_2
			, number_1
			, number_2
			, case_1
			, case_2
			, gender_1
			, gender_2
			, degree_1
			, degree_2
			, verbtype_1
			, verbtype_2
			, tense_1
			, tense_2
			, mood_1
			, mood_2
			, voice_1
			, voice_2
			, person_1
			, person_2;
			
			// jquery wrap both word els
			word_span_1 = $(word_span_1);
			word_span_2 = $(word_span_2);
	
			// get forms of both words
			word_form_1 = word_span_1.attr(ParsedClassicsVars.formAttr);
			word_form_2 = word_span_2.attr(ParsedClassicsVars.formAttr);
			
			// get part of speech of both words
			part_of_speech_1 = word_span_1.attr(ParsedClassicsVars.partOfSpeechAttr);
			part_of_speech_2 = word_span_2.attr(ParsedClassicsVars.partOfSpeechAttr);
	
			// get parsing of both words
			parsing_1 = word_span_1.attr(ParsedClassicsVars.parsingAttr);
			parsing_2 = word_span_2.attr(ParsedClassicsVars.parsingAttr);
	
			// define variable
			return_val = 0;
	
			// conjunction having the same lemma as adverb should be placed first
			if (part_of_speech_1 == "conjunction" && part_of_speech_2 == "adverb") {
					return_val = -1;
			}
			else if (part_of_speech_1 == "adverb" && part_of_speech_2 == "conjunction") {
				return_val = 1;
			}

			// conjunction having the same lemma as particle should be placed first
			if (part_of_speech_1 == "conjunction" && part_of_speech_2 == "particle") {
				return_val = -1;
			}
			else if (part_of_speech_1 == "particle" && part_of_speech_2 == "conjunction") {
				return_val = 1;
			}

			// adverb having the same lemma as particle should be placed first
			if (part_of_speech_1 == "particle" && part_of_speech_2 == "adverb") {
				return_val = 1;
			}
			else if (part_of_speech_1 == "adverb" && part_of_speech_2 == "particle") {
				return_val = -1;
			}

			// particle adverb having the same lemma as interjection should be placed first
			if (part_of_speech_1 == "interjection" && part_of_speech_2 == "particle") {
				return_val = 1;
			}
			else if (part_of_speech_1 == "particle" && part_of_speech_2 == "interjection") {
				return_val = -1;
			}

			// adverb having the same lemma as preposition should be placed first
			if (part_of_speech_1 == "preposition" && part_of_speech_2 == "adverb") {
				return_val = 1;
			}
			else if (part_of_speech_1 == "adverb" && part_of_speech_2 == "preposition") {
				return_val = -1;
			}

			// conjunction having the same lemma as preposition should be placed first
			if (part_of_speech_1 == "conjunction" && part_of_speech_2 == "preposition") {
				return_val = -1;
			}
			else if (part_of_speech_1 == "preposition" && part_of_speech_2 == "conjunction") {
				return_val = 1;
			}
	
			// pronoun having the same lemma as adjective should be placed first
			if (part_of_speech_1.indexOf("pronoun") > -1 && part_of_speech_2 == "adjective") {
					return_val = -1;
			}
			else if (part_of_speech_1 == "adjective" && part_of_speech_2.indexOf("pronoun") > -1) {
				return_val = 1;
			}
	
			// Case 1. Both words are nouns, pronouns, articles, demonstratives, adjectives
			else if ((part_of_speech_1 == "noun" && part_of_speech_2 == "noun") || (part_of_speech_1.indexOf("pronoun") > -1 && part_of_speech_2.indexOf("pronoun") > -1) || (part_of_speech_1 == "article" && part_of_speech_2 == "article") || (part_of_speech_1 == "demonstrative pronoun" && part_of_speech_2 == "demonstrative pronoun") || (part_of_speech_1 == "adjective" && part_of_speech_2 == "adjective") ) {
					
				// if both words are adjectives, then convert their degrees to to math numbers and compare them
				if (part_of_speech_1 == "adjective" && part_of_speech_2 == "adjective") {
					degree_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.degreeNames, ParsedClassicsVars.degreeNums, ParsedClassicsVars.degreeNums[0]);
					degree_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.degreeNames, ParsedClassicsVars.degreeNums, ParsedClassicsVars.degreeNums[0]);
					return_val = degree_1 - degree_2;
				}
				
				// convert grammatical genders to math numbers and compare them	
				if (return_val === 0) {
					gender_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.genderNames, ParsedClassicsVars.genderNums);
					gender_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.genderNames, ParsedClassicsVars.genderNums);
					return_val = gender_1 - gender_2;
				}

				// if both words have the same grammatical gender, then convert grammatical numbers to math numbers and compare them
				if (return_val === 0) {
					number_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.numberNames, ParsedClassicsVars.numberNums);	
					number_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.numberNames, ParsedClassicsVars.numberNums);
					return_val = number_1 - number_2;
				}
					
				// if both words have the same grammatical number, then convert grammatical cases to math numbers and compare them
				if (return_val === 0) {
						case_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.caseNames, ParsedClassicsVars.caseNums);
						case_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.caseNames, ParsedClassicsVars.caseNums);
						return_val = case_1 - case_2;
				}

				// accented version of the pronoun sould be placed first, unaccented version should be placed second
				if (return_val === 0 && part_of_speech_1.indexOf("pronoun") > -1 && part_of_speech_2.indexOf("pronoun") > -1) {
					if (ParsedClassicsConcordance._isPronounAccented(word_form_1) === false && ParsedClassicsConcordance._isPronounAccented(word_form_2) === true) {
						return_val = 1;
					}
					else if (ParsedClassicsConcordance._isPronounAccented(word_form_1) === true && ParsedClassicsConcordance._isPronounAccented(word_form_2) === false) {
						return_val = -1;
					}
				}
			
			}

			// Case 2. Both words are adverbs
			else if (part_of_speech_1 == "adverb" && part_of_speech_2 == "adverb") {
						// convert their degrees to to math numbers and compare them
						degree_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.degreeNames, ParsedClassicsVars.degreeNums, ParsedClassicsVars.degreeNums[0]);
						degree_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.degreeNames, ParsedClassicsVars.degreeNums, ParsedClassicsVars.degreeNums[0]);
						return_val = degree_1 - degree_2;
			}
			
			// Case 3. Both words are verbs
			else if (part_of_speech_1 == "verb" && part_of_speech_2 == "verb") {
				
				// there may be verbs which have the same parsing, but different word forms
				if (parsing_1 == parsing_2 && word_form_1 != word_form_2) {
					return_val = word_form_1.localeCompare(word_form_2, ParsedClassicsVars.locale, {sensitivity: 'base'});
				}

				// at first convert grammatical verb types (simpleverb, infinitive, participle, verbal) to math numbers and compare them
				if (return_val === 0) {
					verbtype_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.verbtypeNames, ParsedClassicsVars.verbtypeNums, ParsedClassicsVars.verbtypeNums[0]);
					verbtype_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.verbtypeNames, ParsedClassicsVars.verbtypeNums, ParsedClassicsVars.verbtypeNums[0]);
					return_val = verbtype_1 - verbtype_2;
				}
			
				// if both words have the same grammatical verb type, then convert grammatical moods to math numbers and compare them
				if (return_val === 0) {
						mood_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.moodNames, ParsedClassicsVars.moodNums);
						mood_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.moodNames, ParsedClassicsVars.moodNums);
						return_val = mood_1 - mood_2;
				}
				
				// if both words have the same grammatical mood, then convert grammatical tenses to math numbers and compare them
				if (return_val === 0) {
						tense_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.tensesNames, ParsedClassicsVars.tensesNums);
						tense_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.tensesNames, ParsedClassicsVars.tensesNums);
						return_val = tense_1 - tense_2;
				}
				
				// if both words have the same grammatical tense, then convert grammatical voice to math numbers and compare them
				if (return_val === 0) {
						voice_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.voiceNames, ParsedClassicsVars.voiceNums);
						voice_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.voiceNames, ParsedClassicsVars.voiceNums);
						return_val = voice_1 - voice_2;		
				}
			
				// if both words ARE NOT participles NOR verbals AND  have the same grammatical voice, then convert grammatical numbers to math numbers and compare them
				if (return_val === 0 && ( parsing_1.indexOf("participle") == -1 && parsing_2.indexOf("participle") == -1 && parsing_1.indexOf("verbal") == -1 && parsing_2.indexOf("verbal") == -1 ) ) {
					
					number_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.numberNames, ParsedClassicsVars.numberNums);	
					number_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.numberNames, ParsedClassicsVars.numberNums);
					return_val = number_1 - number_2;

					// if both words have the same grammatical numbers, then convert grammatical persons to math numbers and compare them
					if (return_val === 0) {
						person_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.personNames, ParsedClassicsVars.personNums);
						person_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.personNames, ParsedClassicsVars.personNums);
						return_val = person_1 - person_2;
					}
				}
			
				// if both words have the same moods, tenses, voices AND  
				// are participles OR verbals, then convert their cases to math numbers and compare then
				else if (return_val === 0 && ( (parsing_1.indexOf("participle") > -1 && parsing_2.indexOf("participle") > -1) || (parsing_1.indexOf("verbal") > -1 && parsing_2.indexOf("verbal") > -1) ) ) {

					// convert grammatical gender to math numbers and compare them
					gender_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.genderNames, ParsedClassicsVars.genderNums);
					gender_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.genderNames, ParsedClassicsVars.genderNums);
					return_val = gender_1 - gender_2;

					// if both words have the same grammatical gender, then then convert grammatical numbers to math numbers and compare them
					if (return_val === 0) {
						number_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.numberNames, ParsedClassicsVars.numberNums);	
						number_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.numberNames, ParsedClassicsVars.numberNums);
						return_val = number_1 - number_2;
					}
				
					// if both words have the same grammatical number, then convert grammatical cases to math numbers and compare them
					if (return_val === 0) {
						case_1 = ParsedClassicsConcordance._convertMorphToNum(parsing_1, ParsedClassicsVars.caseNames, ParsedClassicsVars.caseNums);
						case_2 = ParsedClassicsConcordance._convertMorphToNum(parsing_2, ParsedClassicsVars.caseNames, ParsedClassicsVars.caseNums);
						return_val = case_1 - case_2;	
					}
					
				}
				
			}
			
			return return_val;
		}
	
		, _convertMorphToNum: function(parsing, namesArr, numsArr, defaultVal) {
					var numerical_val;
			
					numerical_val = 0;
			
					if (defaultVal) {
							numerical_val = defaultVal;
					}

					for (var i = 0; i < namesArr.length; i++)	{
							if (parsing.indexOf(namesArr[i]) > -1) {
									numerical_val = numsArr[i];
									break;
							}
					}
					return numerical_val;
		}

		, _isPronounAccented: function(word_form) {
			if (word_form.indexOf("έ") > -1 || word_form.indexOf("ὲ") > -1 || word_form.indexOf("ί") > -1 || word_form.indexOf("ὶ") > -1 || word_form.indexOf("ῦ") > -1) {
				return true;
			}
			else {
				return false;
			}
		}
	
		, checkIfConcordanceComplete: function() {
			var parsed_text_container
			, concordance_container
			, parsed_text_lines
			, conc_lines
			, msg_el
			, single_word_el
			, line_class
			, word_form
			, single_parsed_text_line
			, parsed_text_words
			, line_num_els
			, parsing
			, part_of_speech
			, not_included
			, txt;
		
			// find parsed text element
			parsed_text_container = $("#" + ParsedClassicsVars.appendCodeContainerId);
		
			// find all parsed text line els inside parsed text code
			parsed_text_lines = parsed_text_container.find("." + ParsedClassicsVars.verseClass);
		
			// no parsed text? - then nothing to do, exept to display error msg
			if (parsed_text_lines.length === 0) {
					// find message el
					msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
					// put message text inside message el
					msg_el.html("No parsed text loaded!");
					// display modal dialogue
					ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");

					return;		
			}
			
			// find concordance element
			concordance_container = $("#" + ParsedClassicsVars.appendCodeContainer2Id);
		
			// find all concordance line els inside concordance code
			conc_lines = concordance_container.find("." + ParsedClassicsVars.concordanceVerseClass);
		
			// no concordance generated? - then nothing to do, exept to display error msg
			if (conc_lines.length === 0) {
					// find message el
					msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
					// put message text inside message el
					msg_el.html("No concordance generated!");
					// display modal dialogue
					ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");

					return;			
			}
		
			// loop through conc lines conc_lines.length
			for (var i = 0; i < conc_lines.length; i++) {
				
				// find concordance word element
				single_word_el = $(conc_lines[i]).find("." + ParsedClassicsVars.concordanceWordClass);

				// get word form
				word_form = single_word_el.attr(ParsedClassicsVars.formAttr);

				// escape brackets
				word_form = word_form.replace("(", "\\(");
				word_form = word_form.replace(")", "\\)");
				
				// get part of speech
				part_of_speech = single_word_el.attr(ParsedClassicsVars.partOfSpeechAttr);

				// get parsing
				parsing = single_word_el.attr(ParsedClassicsVars.parsingAttr);

				// get <span> els containing line num and line class
				line_num_els = $(conc_lines[i]).find("." + ParsedClassicsVars.concordanceLineNumClass);

				// loop through <span> els containing line num and line class
				for (var j = 0; j < line_num_els.length; j++) {
					
					// get line class 
					line_class = $(line_num_els[j]).attr(ParsedClassicsVars.concordanceLineClassAttr);

					// find relevant line of parsed text
					single_parsed_text_line = parsed_text_container.find("." + line_class).parent();

					// find words in parsed text line having relevant form
					parsed_text_words = single_parsed_text_line.find("[" + ParsedClassicsVars.formAttr + "='" + word_form + "']");

					// filter words having the same part of speech
					parsed_text_words = parsed_text_words.filter("[" + ParsedClassicsVars.partOfSpeechAttr + "='" + part_of_speech + "']");

					// filter words having the same parsing
					parsed_text_words = parsed_text_words.filter("[" + ParsedClassicsVars.parsingAttr + "='" + parsing + "']");

					// highlight words
					parsed_text_words.addClass("w3-pale-green");
				}
				
			}

			// color words not included in concordance
			not_included = parsed_text_container.find("." + ParsedClassicsVars.wordUrlAndCookieName).not(".w3-pale-green").addClass("w3-pale-red");
			// put words not included in concordance into square brackets
			for (var i = 0; i < not_included.length; i++) {
				txt = "[" + $(not_included[i]).html() + "]";
				$(not_included[i]).html(txt);
			}

		}
		
		, init: function() {
				var load_text_button, generate_concordance_button, check_if_complete_button;	
				load_text_button = $("#" + ParsedClassicsVars.loadButtonId);
				generate_concordance_button = $("#" + ParsedClassicsVars.generateButtonId);
				check_if_complete_button	= $("#" + ParsedClassicsVars.checkButtonId);
			
				load_text_button.bind("click", ParsedClassicsWordList.loadParsedText);
				generate_concordance_button.bind("click", ParsedClassicsConcordance.generateConcordance);
				check_if_complete_button.bind("click", ParsedClassicsConcordance.checkIfConcordanceComplete);
		}

};

/*

Concordance Supplementer script

*/

var ParsedClassicsConcSupplementer = {

	load_primary_conc: function() {
		var append_code_container
		, code_textarea
		, code;

		// get code textarea
		code_textarea = $("#" + ParsedClassicsVars.inputTextareaId);

		// get code from textarea
		code = code_textarea.val();
		// trim code
		code = $.trim(code);

		// there is no code in textarea? - then nothing to do except to show error message
		if (code.length == 0) {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No concordance to be supplemented has been loaded!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
		}
		
		// get container to display concordance
		append_code_container = $("#" + ParsedClassicsVars.appendCodeContainerId);

		// display concordance inside container
		append_code_container.html(code);

		//delegate "click" event from els having class "concordance-lines-button" to concordance_container
		append_code_container.delegate("." + ParsedClassicsVars.concordanceLinesButtonClass, "click", ParsedClassicsConcordance.showConcordanceLines);

		// show container
		append_code_container.show();
	}

	, load_additional_conc: function() {
		var append_code_container
		, code_textarea
		, code;

		// get code textarea
		code_textarea = $("#" + ParsedClassicsVars.inputTextarea2Id);

		// get code from textarea
		code = code_textarea.val();
		// trim code
		code = $.trim(code);

		// there is no code in textarea? - then nothing to do except to show error message
		if (code.length == 0) {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No concordance to be added has been loaded!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
		}

		// get container to display concordance
		append_code_container = $("#" + ParsedClassicsVars.appendCodeContainer2Id);

		// display concordance inside container
		append_code_container.html(code);

		//delegate "click" event from els having class "concordance-lines-button" to concordance_container
		append_code_container.delegate("." + ParsedClassicsVars.concordanceLinesButtonClass, "click", ParsedClassicsConcordance.showConcordanceLines);

		// show container
		append_code_container.show();
	}

	, supplement_conc: function() {
		var append_code_container
		, append_code_container2
		, append_code_container3
		, conc_headings
		, conc_headings2
		, words_list_unordered
		, single_word
		, words_list_array
		, language_form_el
		, language_radio_el
		, parsed_text_lang
		, single_conc_heading
		, single_conc_heading2
		, conc_entry
		, conc_entry2
		, conc_html
		, js_string
		, conc_output_textarea_el
		, conc_word_els
		, conc_word_els2
		, conc_word_els_distinct
		, lemma
		, word_form
		, part_of_speech
		, parsing
		, conc_word_els_filtered
		, conc_lines_list_el
		, verse_num_els
		, line_num_els_string
		, conc_entry_assembled
		, conc_btn
		, conc_verse
		, language_form_el
		, language_radio_el
		, parsed_text_lang;

		// initialize var
		conc_html = "";
		js_string = "";

		// get container displaying concordance to be supplemented
		append_code_container = $("#" + ParsedClassicsVars.appendCodeContainerId);

		// get concordance headings from concordance to be supplemented
		conc_headings = append_code_container.find("." + ParsedClassicsVars.concordanceHeadingClass);

		// no concordance headings? - then nothing to do except to show error message
		if (conc_headings.length == 0) {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No concordance to be supplemented has been loaded!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
		}

		// get container displaying concordance to be added
		append_code_container2 = $("#" + ParsedClassicsVars.appendCodeContainer2Id);
		
		// get concordance headings from concordance to be added
		conc_headings2 = append_code_container2.find("." + ParsedClassicsVars.concordanceHeadingClass);

		// no concordance headings? - then nothing to do except to show error message
		if (conc_headings2.length == 0) {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No concordance to be added has been loaded!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
		}

		// get container in which supplemented concordance should be displayed
		append_code_container3 = $("#" + ParsedClassicsVars.appendCodeContainer3Id);

		// get output textarea
		conc_output_textarea_el = $("#" + ParsedClassicsVars.outputTextareaId);

		// find language form and radio els
		language_form_el = document.forms[ParsedClassicsVars.languageFormName];
		language_radio_el = language_form_el[ParsedClassicsVars.languageRadioName];
	
		// find language of parsed text
		parsed_text_lang = language_radio_el.value;
	
		if (parsed_text_lang == ParsedClassicsVars.languageGreek) {
			ParsedClassicsVars.locale = "el";
		}
		else if (parsed_text_lang == ParsedClassicsVars.languageLatin) {
			ParsedClassicsVars.locale = "la";
		}

		// I. put all lemmas into pipe delimited string

		// initialize list string
		words_list_unordered = "|" + conc_headings.first().attr(ParsedClassicsVars.lemmaAttr) + "|";

		// loop through concordance headings starting from second heading from concordance to be supplemented
		for (var i = 1; i < conc_headings.length; i++) {
			// get lemma
			single_word = $(conc_headings[i]).attr(ParsedClassicsVars.lemmaAttr);
			// append lemma to string
			words_list_unordered += single_word + "|";
		}

		// loop through concordance headings from concordance to be added
		for (var i = 0; i < conc_headings2.length; i++) {
			// get lemma
			single_word = $(conc_headings2[i]).attr(ParsedClassicsVars.lemmaAttr);
			// is word already in string?
			if (words_list_unordered.indexOf("|" + single_word + "|") == -1) {
				// append lemma to string
				words_list_unordered += single_word + "|";
			}
		}

		// II. get alphabetically ordered list of lemmas

		// trim pipe char from beginning and end of the string
		words_list_unordered = words_list_unordered.substring(1, words_list_unordered.length - 1);

		// split words string into words array
		words_list_array = words_list_unordered.split("|");

	   	// sort words aphabetically
		words_list_array.sort(function(a, b) {return a.localeCompare(b, ParsedClassicsVars.locale, {sensitivity: 'base'}) });

		// III. generate new concordance from conc.to be supplemented and conc. to be added

		// loop through all lemmas 
		for (var i = 0; i < words_list_array.length; i++) {

			// is lemma heading in concordance to be supplemented?
			single_conc_heading = conc_headings.filter("[" + ParsedClassicsVars.lemmaAttr + "='" + words_list_array[i] + "']");
			if (single_conc_heading.length == 1) {
				// get concordance-entry el
				conc_entry = single_conc_heading;
				while (!$(conc_entry).hasClass(ParsedClassicsVars.concordanceEntryClass)) {
					conc_entry = $(conc_entry).parent();
					if ($(conc_entry)[0] == document.body) {
						conc_entry = null;
						break;
					}
				}
			}

			// is lemma heading in concordance to be added?
			single_conc_heading2 = conc_headings2.filter("[" + ParsedClassicsVars.lemmaAttr + "='" + words_list_array[i] + "']");
			if (single_conc_heading2.length == 1) {
				// get concordance-entry el
				conc_entry2 = single_conc_heading2;
				while (!$(conc_entry2).hasClass(ParsedClassicsVars.concordanceEntryClass)) {
					conc_entry2 = $(conc_entry2).parent();
					if ($(conc_entry2)[0] == document.body) {
						conc_entry2 = null;
						break;
					}
				}
			}

			// (a) lemma heading is only in concordance to be supplemented
			if (single_conc_heading2.length == 0) {
				// append concordance entry to concordance html
				if (conc_entry) {
					conc_html += $(conc_entry)[0].outerHTML;
					js_string += "'" + $(conc_entry)[0].outerHTML + "' +\n";
				}
				
			}

			// (b) lemma heading is only in concordance to be added
			else if (single_conc_heading.length == 0) {
				// append concordance entry to concordance html
				if (conc_entry2) {
					conc_html += $(conc_entry2)[0].outerHTML;
					js_string += "'" + $(conc_entry2)[0].outerHTML + "' +\n";
				}
			}

			// (b) lemma heading is both in concordance to be supplemented and in concordance to be added
			else {
				// get all concordance-word els from concordance entry to be added
				conc_word_els = conc_entry2.find("." + ParsedClassicsVars.concordanceWordClass);

				// get all concordance-word els from concordance entry to be supplemented
				conc_word_els2 = conc_entry.find("." + ParsedClassicsVars.concordanceWordClass).clone(true);

				// get distinct concordance-word els are those from concordance entry to be supplemented
				// all words from from concordance entry to be supplemented are distinct
				conc_word_els_distinct = conc_word_els2.clone(true);
				for (var j = 0; j < conc_word_els.length; j++) {
					// get lemma, word form, part of speech, parsing of concordance-word
					lemma = $(conc_word_els[j]).attr(ParsedClassicsVars.lemmaAttr);
					word_form = $(conc_word_els[j]).attr(ParsedClassicsVars.formAttr);
					part_of_speech = $(conc_word_els[j]).attr(ParsedClassicsVars.partOfSpeechAttr);
					parsing = $(conc_word_els[j]).attr(ParsedClassicsVars.parsingAttr);
					// filter distinct concordance words if there is already word having the same lemma, word form, part of speech, parsing
					conc_word_els_filtered = conc_word_els_distinct.filter("[" + ParsedClassicsVars.lemmaAttr + "='" + lemma + "']").filter("[" + ParsedClassicsVars.formAttr + "='" + word_form + "']").filter("[" + ParsedClassicsVars.partOfSpeechAttr + "='" + part_of_speech + "']").filter("[" + ParsedClassicsVars.parsingAttr + "='" + parsing + "']");
					// there is no word having the same lemma, word form, part of speech, parsing
					if (conc_word_els_filtered.length == 0) {
						// so, add current concordance-word to distinct concordance words
						conc_word_els_distinct = conc_word_els_distinct.add(conc_word_els[j]);
					}
					// there is word having the same lemma, word form, part of speech, parsing 
					else if (conc_word_els_filtered.length == 1) {
						// get concordance-lines-list from which we will take line numbers
						conc_lines_list_el = $(conc_word_els[j]).find("." + ParsedClassicsVars.concordanceLinesListClass);
						//get concordance-verse-number els
						verse_num_els = conc_lines_list_el.find("." + ParsedClassicsVars.concordanceLineNumClass);
						// get concordance-lines-list to which we will put line numbers
						conc_lines_list_el = $(conc_word_els_filtered[0]).find("." + ParsedClassicsVars.concordanceLinesListClass);
						// create lines numbers elements string
						line_num_els_string = "";
						for (k = 0; k < verse_num_els.length; k++) {
							line_num_els_string += ", " + verse_num_els[k].outerHTML;
						}
						// add lines numbers elements string to concordance-lines-list
						conc_lines_list_el[0].innerHTML += line_num_els_string;
					}
				}

				// sort distinct distinct concordance-word els 
				conc_word_els_distinct.sort(ParsedClassicsConcordance._sortWordsByParsing);

				// assemble concordance-entry from distinct concordance-word els 
				conc_entry_assembled = $('<div class="' + ParsedClassicsVars.concordanceEntryClass + '"></div>');
				conc_entry_assembled.append(single_conc_heading.parent()[0].cloneNode(true));
				for (k = 0; k < conc_word_els_distinct.length; k++) {
					conc_verse = $('<span class="' + ParsedClassicsVars.concordanceVerseClass + '"></span>');
					conc_btn = $('<span class="' + ParsedClassicsVars.concordanceLinesButtonClass + ' ' + ParsedClassicsVars.concordanceLinesButtonCollapsedClass + '"></span>');
					conc_verse.append(conc_btn);
					conc_verse.append(conc_word_els_distinct[k].cloneNode(true));
					conc_entry_assembled.append(conc_verse);
				}

				// append concordance entry to concordance html
				conc_html += conc_entry_assembled[0].outerHTML;
				js_string += "'" + conc_entry_assembled[0].outerHTML + "' +\n";
			}


		}

		// put supplemented concordance code into output textarea
		conc_output_textarea_el.val(conc_html);

		// display supplemented concordance inside container
		append_code_container3.html(conc_html);

		//delegate "click" event from els having class "concordance-lines-button" to concordance_container
		append_code_container3.delegate("." + ParsedClassicsVars.concordanceLinesButtonClass, "click", ParsedClassicsConcordance.showConcordanceLines);

		// show container
		append_code_container3.show();	

	}

	, check_if_conc_complete: function() {
		var concordance_container1
		, concordance_container2
		, result_container
		, conc_words_from_container1
		, conc_words_from_container2
		, conc_words_from_result_container
		, msg_el
		, single_word_el
		, word_form
		, parsing
		, part_of_speech
		, line_num_els
		, conc_words_from_container1_filtered
		, conc_words_from_container2_filtered
		, line_num_els_from_container1_filtered
		, line_num_els_from_container2_filtered
		, not_included
		, txt
		, line_class;

		// find first concordance container
		concordance_container1 = $("#" + ParsedClassicsVars.appendCodeContainerId);

		// find second concordance container
		concordance_container2 = $("#" + ParsedClassicsVars.appendCodeContainer2Id);

		// find resulting concordance container
		result_container = $("#" + ParsedClassicsVars.appendCodeContainer3Id);

		// get concordance words from first concordance container
		conc_words_from_container1 = concordance_container1.find("." + ParsedClassicsVars.concordanceWordClass);

		// no concordance loaded? - then nothing to do, exept to display error msg
		if (conc_words_from_container1.length === 0) {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No concordance to be supplemented has been loaded!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");

			return;
		}

		// get concordance words from second concordance container
		conc_words_from_container2 = concordance_container2.find("." + ParsedClassicsVars.concordanceWordClass);

		// no concordance loaded? - then nothing to do, exept to display error msg
		if (conc_words_from_container2.length === 0) {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No concordance to be added has been loaded!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");

			return;
		}

		// get concordance words from resulting concordance container
		conc_words_from_result_container = result_container.find("." + ParsedClassicsVars.concordanceWordClass);

		// no concordance generated? - then nothing to do, exept to display error msg
		if (conc_words_from_result_container.length === 0) {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No concordance supplemented has been generated!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");

			return;
		}

		// loop through words from resulting conc container 
		for (var i = 0; i < conc_words_from_result_container.length; i++) {
			single_word_el = $(conc_words_from_result_container[i]);

			// get word form
			word_form = single_word_el.attr(ParsedClassicsVars.formAttr);

			// escape brackets
			word_form = word_form.replace("(", "\\(");
			word_form = word_form.replace(")", "\\)");
			
			// get part of speech
			part_of_speech = single_word_el.attr(ParsedClassicsVars.partOfSpeechAttr);

			// get parsing
			parsing = single_word_el.attr(ParsedClassicsVars.parsingAttr);

			// get <span> els containing line num and line class
			line_num_els = single_word_el.find("." + ParsedClassicsVars.concordanceLineNumClass);

			conc_words_from_container1_filtered = conc_words_from_container1;

			// filter words in first conc container having relevant form
			conc_words_from_container1_filtered = conc_words_from_container1_filtered.filter("[" + ParsedClassicsVars.formAttr + "='" + word_form + "']");
			
			// filter words in first conc container having the same part of speech
			conc_words_from_container1_filtered = conc_words_from_container1_filtered.filter("[" + ParsedClassicsVars.partOfSpeechAttr + "='" + part_of_speech + "']");

			// filter words in first conc container having the same parsing
			conc_words_from_container1_filtered = conc_words_from_container1_filtered.filter("[" + ParsedClassicsVars.parsingAttr + "='" + parsing + "']");

			// find els containing line num and line class
			line_num_els_from_container1_filtered = conc_words_from_container1_filtered.find("." + ParsedClassicsVars.concordanceLineNumClass);

			// highlight words in first conc container
			conc_words_from_container1_filtered.addClass("w3-pale-green");

			conc_words_from_container2_filtered = conc_words_from_container2;

			// filter words in first conc container having relevant form
			conc_words_from_container2_filtered = conc_words_from_container2_filtered.filter("[" + ParsedClassicsVars.formAttr + "='" + word_form + "']");
			
			// filter words in first conc container having the same part of speech
			conc_words_from_container2_filtered = conc_words_from_container2_filtered.filter("[" + ParsedClassicsVars.partOfSpeechAttr + "='" + part_of_speech + "']");

			// filter words in first conc container having the same parsing
			conc_words_from_container2_filtered = conc_words_from_container2_filtered.filter("[" + ParsedClassicsVars.parsingAttr + "='" + parsing + "']");

			// find els containing line num and line class
			line_num_els_from_container2_filtered = conc_words_from_container2_filtered.find("." + ParsedClassicsVars.concordanceLineNumClass);

			// highlight words in first conc container
			conc_words_from_container2_filtered.addClass("w3-pale-green");

			// loop through els containing line num and line class
			for (var j = 0; j < line_num_els.length; j++) {
				txt = $(line_num_els[j]).text();
				// color els containing the same line num and line class
				line_num_els_from_container1_filtered.filter(":contains(" + txt + ")").addClass("w3-pale-green");
				line_num_els_from_container2_filtered.filter(":contains(" + txt + ")").addClass("w3-pale-green");
			}
		}

		// color words not included in supplemented concordance
		not_included = conc_words_from_container1.not(".w3-pale-green").addClass("w3-pale-red");
		// put words not included in concordance into square brackets
		for (var i = 0; i < not_included.length; i++) {
			txt = "[" + $(not_included[i]).html() + "]";
			$(not_included[i]).html(txt);
		}
		// color words not included in supplemented concordance
		not_included = conc_words_from_container2.not(".w3-pale-green").addClass("w3-pale-red");
		for (var i = 0; i < not_included.length; i++) {
			txt = "[" + $(not_included[i]).html() + "]";
			$(not_included[i]).html(txt);
		}

		// color els containing line num and line class not included in supplemented concordance
		not_included = conc_words_from_container1.find("." + ParsedClassicsVars.concordanceLineNumClass).not(".w3-pale-green").addClass("w3-pale-red");
		for (var i = 0; i < not_included.length; i++) {
			txt = "[" + $(not_included[i]).html() + "]";
			$(not_included[i]).html(txt);
		}
		not_included = conc_words_from_container2.find("." + ParsedClassicsVars.concordanceLineNumClass).not(".w3-pale-green").addClass("w3-pale-red");
		for (var i = 0; i < not_included.length; i++) {
			txt = "[" + $(not_included[i]).html() + "]";
			$(not_included[i]).html(txt);
		}
	}

	, init: function() {
		var load_primary_conc_btn
		, load_additional_conc_btn
		, generate_conc_btn
		, check_if_complete_btn;

		load_primary_conc_btn = $("#" + ParsedClassicsVars.loadButtonId);
		load_additional_conc_btn = $("#" + ParsedClassicsVars.loadButton2Id);
		generate_conc_btn = $("#" + ParsedClassicsVars.generateButtonId);
		check_if_complete_btn = $("#" + ParsedClassicsVars.checkButtonId);

		load_primary_conc_btn.bind("click", ParsedClassicsConcSupplementer.load_primary_conc);
		load_additional_conc_btn.bind("click", ParsedClassicsConcSupplementer.load_additional_conc);
		generate_conc_btn.bind("click", ParsedClassicsConcSupplementer.supplement_conc);
		check_if_complete_btn.bind("click", ParsedClassicsConcSupplementer.check_if_conc_complete);
	}

};

/*

Lexicon contents (for scanned lexicons) generator script

*/

var ParsedClassicsLexContentsGenerator = {

		generateLexContents: function() {
				var generate_lexcontents_button, word_list_input, contents_name_input, output_textarea, contents_name, word_list_all, word_list_array, single_word, word_code, contents_code, msg_el;
			
				// find generate button
				generate_lexcontents_button = $("#" + ParsedClassicsVars.generateButtonId);
			
				// find word list input textarea
				word_list_input = $("#" + ParsedClassicsVars.inputTextareaId);
			
				// find contents name textinput
				contents_name_input = $("#" + ParsedClassicsVars.inputTextarea2Id);
			
				// find contents code output textarea
				output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
				
				// get word list textarea value
				word_list_all = word_list_input.val();
			
				// get contents shortname
				contents_name = contents_name_input.val();
			
				// no contents shortname list? - then nothing to do, exept to display error msg
				if (contents_name == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No contents shortname found inside Contents shortname input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
			
				// trim word list 
				word_list_all = word_list_all.trim();
			
				// no word list? - then nothing to do, exept to display error msg
				if (word_list_all == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No word list found inside Word list input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
			
				// split word list string into single words
				word_list_array = word_list_all.split("|");
			
				// define contents var
				contents_code = "";
			
				for (var i = 0; i < word_list_array.length; i++) {
						single_word = word_list_array[i];
						word_code = "w";
						for (var j = 0; j < single_word.length; j++) {
								word_code += "-" + single_word.codePointAt(j);	
						}
						contents_code += ', /*' + single_word + '*/ "' + word_code + '": ""\n\n'; 
						
				}
			
				// add title page to contents
				contents_code = '/*Title page*/	"title": ""\n\n' + contents_code;
			
				// add JS object symbols
				contents_code = "{\n\n" + contents_code + "};";
			
				// add contents shortname
				contents_code = contents_name + " = " + contents_code;
			
				// output lexicon contents code
				output_textarea.val(contents_code);
		}

		, init: function() {
						var generate_lexcontents_button;

						generate_lexcontents_button = $("#" + ParsedClassicsVars.generateButtonId);
						generate_lexcontents_button.bind("click", ParsedClassicsLexContentsGenerator.generateLexContents);
		}
	
	
};

/*

Scanned book contents (for original text, commentary, translation) generator script

*/

var ParsedClassicsBookContentsGenerator = {
	
		generateBookContents: function() {
				var book_contents, contents_name, prefixes_all, ranges_all, single_range, single_prefix, start_num, end_num, output_textarea, msg_el;
			
				// define var
				book_contents = "";
			
				// get contents name 
				contents_name = $("#" + ParsedClassicsVars.inputTextarea3Id).val();
				// get prefixes string
				prefixes_all = $("#" + ParsedClassicsVars.inputTextarea2Id).val();
				// get ranges string
				ranges_all = $("#" + ParsedClassicsVars.inputTextareaId).val();
			
				// get output textarea
				output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
			
				// trim contents name
				contents_name = $.trim(contents_name);
				// trim prefixes string
				prefixes_all = $.trim(prefixes_all);
				// trim ranges string
				ranges_all = $.trim(ranges_all);
			
				// no contents name? - then nothing to do, exept to display error msg
				if (contents_name == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No contents shortname defined inside Contents shortname input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
			
				// no prefixes string? - then nothing to do, exept to display error msg
				if (prefixes_all == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No prefix defined inside Prefix input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
			
				// no ranges string? - then nothing to do, exept to display error msg
				if (ranges_all == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No range defined inside Line range input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
			
				// get prefixes array
				prefixes_all = prefixes_all.split("|");
				// get ranges array
				ranges_all = ranges_all.split("|");
			
				// does number of prefixes match the number of ranges? - if not, then nothing to do, exept to display error msg
				if (prefixes_all.length != ranges_all.length) {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("The number of defined prefixes does not match the number of defined ranges!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
			
				// generate book contents
				for (var i = 0; i < prefixes_all.length; i++) {
						
						single_prefix = $.trim(prefixes_all[i]);
						single_range = $.trim(ranges_all[i]);
						// remove whitespace
						single_range = single_range.replace(" ", "");
						// split into start and end numbers
						single_range = single_range.split("-");
					
						// no start and end numbers? - then nothing to do, exept to display error msg
						if (single_range.length != 2) {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("Inside each line range start and end numbers must be separated by dash!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
					
						// get start number of the range
						start_num = Number(single_range[0]);
						// get end number of the range
						end_num = Number(single_range[1]);
					
						// increase end number by 1
						end_num++;
					
						// generate contens of the line range
						for (var j = start_num; j < end_num; j++) {
							
								book_contents += ', "' + single_prefix + j + '": ""\n\n';
							
						}
					
				}
			
				// add title page
				book_contents = '"v-title": ""\n\n' + book_contents;
			
				// add braces
				book_contents = "{\n\n" + book_contents + "};"
			
				// add contents shortname
				book_contents = contents_name + " = " + book_contents;
			
				// output book contents
				output_textarea.val(book_contents);
				
		}	
	
		, init: function() {
						var generate_bookcontents_button;
			
						generate_bookcontents_button = $("#" + ParsedClassicsVars.generateButtonId);
						generate_bookcontents_button.bind("click", ParsedClassicsBookContentsGenerator.generateBookContents);
		}
	
};

/*

Lexicon contents (for scanned lexicons and Concordances) supplementer script

*/

var ParsedClassicsLexContentsSupplementer = {
	
		contentWords: []
	
		, suppWords: []
	
		, contentObjStart: ""
	
		, contentObjtEnd: ""
	
		, contentItemTitle: ""
		
		, loadContents: function() {
						var contents_object_input
						, contents_object_string
						, contents_object_start
						, contents_object_end
						, words_from_object_append_code_el
						, msg_el
						, char_index
						, member_strings_array
						, original_word
						, string_split_array
						, words_from_object_html
						, original_word_array
						, words_from_object_append_code_el
						, word_list_from_object
      , word_code;
			
						// define var
						original_word_array = [];
						words_from_object_html = "";
				
						// find contents object input textarea 
						contents_object_input = $("#" + ParsedClassicsVars.inputTextarea2Id);
						
						// get contents object
						contents_object_string = contents_object_input.val();
			
						// get append code container
						words_from_object_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainerId);
						
						// no contents object? - then nothing to do, exept to display error msg
						if (contents_object_string == "") {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No contents object found inside Lexicon contents object input!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
			
						// delete everything before opening brace, brace included
						char_index = contents_object_string.indexOf("{");
						if (char_index != -1) {
								contents_object_start = contents_object_string.substring(0, char_index + 1);
								ParsedClassicsLexContentsSupplementer.contentObjStart = contents_object_start;
								contents_object_string = contents_object_string.substring(char_index + 1);
						}
			
						// delete everything after closing brace, brace included
						char_index = contents_object_string.indexOf("}");
						if (char_index != -1) {
								contents_object_end = contents_object_string.substring(char_index);
								ParsedClassicsLexContentsSupplementer.contentObjEnd = contents_object_end;
								contents_object_string = contents_object_string.substring(0, char_index);	
						}
			
						// trim whitespace
    		contents_object_string = $.trim(contents_object_string);
			
						// remove line breaks
						contents_object_string = contents_object_string.replace(/(\r\n\t|\n|\r\t)/gm,"");
			
						// remove whitespace
						//contents_object_string = contents_object_string.replace(/\s/g,'');
			
						// split contents object string into member strings array
						member_strings_array = contents_object_string.split(",");
				
						// loop through member strings array 
						// and extract original words placed inside comment symbols "/*" and "*/"
						// and form html to display content object members
						for (var i = 0; i < member_strings_array.length; i++) {
								original_word = "";
								string_split_array = member_strings_array[i].split("/*");
								if (string_split_array.length == 2) {
										original_word = string_split_array[1];
										string_split_array = original_word.split("*/");
										if (string_split_array.length == 2) {
												original_word = $.trim(string_split_array[0]);
												// is first member string title item? - then save it for later
												if (i == 0 && original_word.toLowerCase().indexOf("title") > -1) {
														original_word = ParsedClassicsVars.wordClassSelectedByDefault;
														ParsedClassicsLexContentsSupplementer.contentItemTitle = member_strings_array[i];
												}
										}
										else {
												original_word = "";
										}
								}
								else {
										original_word = "";
								}
								// original word was extracted from inside comment symbols "/*" and "*/"
								if (original_word != "") {
										// check if the word match its code
          word_code = "w";
          for (var j = 0; j < original_word.length; j++) {
            word_code += "-" + original_word.codePointAt(j);
          }
          if (member_strings_array[i].indexOf("title") == -1 && member_strings_array[i].indexOf(word_code) == -1) {
            // find message el
    								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
    								// put message text inside message el
    								msg_el.html("Word lemma and word code mismatch in " + member_strings_array[i] + " .");
    								// display modal dialogue
    								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
    								return;
          }
          
          words_from_object_html += '<span ' + ParsedClassicsVars.lemmaAttr + '="' + original_word + '">' + $.trim(member_strings_array[i]) + '</span><br>';
          original_word_array.push(original_word);
								}
        // original word was not extracted from inside comment symbols "/*" and "*/"
        // so, error message should be displayed
        else {
          // find message el
  								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
  								// put message text inside message el
  								msg_el.html("No word found inside comment symbols '/*' and '*/' in contens object line " + member_strings_array[i] + " .");
  								// display modal dialogue
  								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
  								return;
        }
						}

						// save original word array list as object member
						ParsedClassicsLexContentsSupplementer.contentWords = original_word_array;
			
						// add contents object start and end
						words_from_object_html = contents_object_start + "<br>" + words_from_object_html + contents_object_end;
			
						// put words extracted from contents object for display
						words_from_object_append_code_el.html(words_from_object_html);
						// make append code el visible
						words_from_object_append_code_el.css("display", "block");
		}
	
		, loadWordList: function() {
						var word_list_input
						, word_list_to_add
						, words_to_add_append_code_el
						, msg_el
						, words_to_add_array
						, words_to_add_html;
			
						// define var
						words_to_add_html = "";
			
						// find words to be added list input textarea
						word_list_input = $("#" + ParsedClassicsVars.inputTextareaId);
			
						// get word list textarea value
						word_list_to_add = word_list_input.val();
			
						// get words to add append code container
						words_to_add_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainer2Id);
			
						// no word list? - then nothing to do, exept to display error msg
						if (word_list_to_add == "") {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No words list found inside List of words to be added input!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
			
						// trim whitespace
    		word_list_to_add = $.trim(word_list_to_add);
			
						// split words to add list into words array
						words_to_add_array = word_list_to_add.split("|");
			
						// save words to be added array as object member
						ParsedClassicsLexContentsSupplementer.suppWords = words_to_add_array;
			
						// generate html string to be displayed
						for (var i = 0; i < words_to_add_array.length; i++) {
								words_to_add_html += '<span ' + ParsedClassicsVars.lemmaAttr + '="' + words_to_add_array[i] + '">' + words_to_add_array[i] + '</span><br>';
						}
			
						// put words to be added for display
						words_to_add_append_code_el.html(words_to_add_html);
						// make append code el visible
						words_to_add_append_code_el.css("display", "block");
		}
	
		, suppLexContents: function() {
						var word_list_from_object
						, original_word_array
						, words_to_add_array
						, new_words_array
						, supplemented_words_array
						, language_form_el
						, language_radio_el
						, text_lang
						, original_word
						, original_word_esc
						, words_from_object_append_code_el
						, words_to_add_append_code_el
						, member_to_add
						, word_from_contents
						, new_contents_object
						, word_code
						, output_textarea;
			
						// define var
						new_words_array = [];
						new_contents_object = ParsedClassicsLexContentsSupplementer.contentItemTitle ? ParsedClassicsLexContentsSupplementer.contentItemTitle + "\n\n" : "";
			
						// get append code containers
						words_from_object_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainerId);
						words_to_add_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainer2Id);
			
						// get original words array
						original_word_array = ParsedClassicsLexContentsSupplementer.contentWords;
			
						// get words to be added array
						words_to_add_array = ParsedClassicsLexContentsSupplementer.suppWords;
			
						// no original word list? - then nothing to do, exept to display error msg
						if (original_word_array.length == 0) {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No contents object loaded!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
			
						// no words to be added array? - then nothing to do, exept to display error msg
						if (words_to_add_array.length == 0) {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No words to be added list loaded!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
			
						// get pipe delimited original word list
						word_list_from_object = original_word_array.join("|");
			
						// add pipe symbols to start and end
						word_list_from_object = "|" + word_list_from_object + "|"; 
			
						// find words in list to be added which are not already included in the list extracted from contents object
						for (var i = 0; i < words_to_add_array.length; i++) {
								// is word not in word list generated from contents object?
								if ( word_list_from_object.indexOf("|" + words_to_add_array[i] + "|") == -1 ) {
										new_words_array.push(words_to_add_array[i]);
								}
						}
			
						// add new words to the words from contents
						supplemented_words_array = original_word_array.concat(new_words_array);
			
						// find language form and radio els
						language_form_el = document.forms[ParsedClassicsVars.languageFormName];
						language_radio_el = language_form_el[ParsedClassicsVars.languageRadioName];

						// find language of parsed text
						text_lang = language_radio_el.value;

						if (text_lang == ParsedClassicsVars.languageGreek) {
							ParsedClassicsVars.locale = "el";
						}
						else if (text_lang == ParsedClassicsVars.languageLatin) {
							ParsedClassicsVars.locale = "la";
						}

						// sort words aphabetically
						supplemented_words_array.sort(function(a, b) {return a.localeCompare(b, ParsedClassicsVars.locale, {sensitivity: 'base'}) });
			
						// loop supplemended words array and generate new contents object
						for (var i = 0; i < supplemented_words_array.length; i++) {
								original_word = supplemented_words_array[i];
								// escape braces in word
								original_word_esc = original_word;
								original_word_esc = original_word_esc.replace("(", "\\(");
								original_word_esc = original_word_esc.replace(")", "\\)");
								// is original word a word already included in contents?
								member_to_add = words_from_object_append_code_el.find("[" + ParsedClassicsVars.lemmaAttr + "=" + original_word_esc + "]");
        
        // in case there are more than 2 members in contents for the same word, show error message
        if (member_to_add.length > 1) {
          // find message el
  								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
  								// put message text inside message el
  								msg_el.html("There are " + member_to_add.length + " entries for the word " + original_word + " in original contents object.");
  								// display modal dialogue
  								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
  								return;
        }
        
								if (member_to_add.length != 0) {
										// it is already included in contents, so add its string if it is not title item
										if (original_word != ParsedClassicsVars.wordClassSelectedByDefault) {
												new_contents_object += ", " + member_to_add.text() + "\n\n";
										}
								}
								else {
										// it is not already in contents, so form its string
										word_code = "w";
										for (var j = 0; j < original_word.length; j++) {
												word_code += "-" + original_word.codePointAt(j);
										}
										new_contents_object += ', /*' + original_word + '*/ ' + '"' + word_code + '": ""\n\n';
								}
						}
						
						// delete first comma char if there is no title page item
						if (ParsedClassicsLexContentsSupplementer.contentItemTitle == "") {
								new_contents_object = new_contents_object.substring(2);
						}
						
						// add to contents object its start and end
						new_contents_object = ParsedClassicsLexContentsSupplementer.contentObjStart + "\n\n" + new_contents_object + ParsedClassicsLexContentsSupplementer.contentObjEnd;
			
						// put new contentsobject into output textarea
						output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
						output_textarea.val(new_contents_object);
		}
	
		, checkCompleteness: function() {
						var output_textarea
						, new_contents_object
						, msg_el
						, contents_object_varname
						, contents_object_literal
						, word_code
						, char_code_arr
						, word_string
						, words_from_object_append_code_el
						, words_to_add_append_code_el;
			
						// get output textarea
						output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
			
						// get contents object from output textarea
						new_contents_object = $.trim(output_textarea.val());
			
						// get append code containers
						words_from_object_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainerId);
						words_to_add_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainer2Id);

						// remove comments from contents object
						new_contents_object = new_contents_object.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, '');
						// remove end semicolon
						new_contents_object.replace(";", "");
			
						// get contents object variable name and object literal
						if (new_contents_object.indexOf("=") != -1) {
								contents_object_varname = new_contents_object.split("=");
								contents_object_literal = contents_object_varname[1];
								contents_object_varname = $.trim(contents_object_varname[0]);
								contents_object_literal = contents_object_literal.replace(";", "");
								if (contents_object_varname.indexOf("var") == 0) {
										contents_object_varname = $.trim(contents_object_varname.substring(3));
								}
						}
						else {
								contents_object_varname = "";
								contents_object_literal = "";
						}
			
						// no contents object? - then nothing to do, exept to display error msg
						if (new_contents_object == "" || contents_object_varname == "") {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No contents object definition found in Supplemented contents code output textarea!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}

						// eval contents object
						try {
								window[contents_object_varname] = JSON.parse(contents_object_literal);
						}
						catch(error) {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("Eval of outputted contents object resulted into " + error);
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
						
						// loop through members of contents object and find the if their words are in innitial contents object or in words to be added list
						for (var property in window[contents_object_varname]) {
								// is contents item the title page?
								if (property == ParsedClassicsVars.wordClassSelectedByDefault) {
										word_string = property;
								}
								else {
										word_code = property.substring(2);
										char_code_arr = word_code.split("-");
										word_string = "";
										// generate original word from word code array
										for (var i = 0; i < char_code_arr.length; i++) {
												word_string += String.fromCodePoint(char_code_arr[i]);
										}	
								}
							
								// escape braces in word string
								word_string = word_string.replace("(", "\\(");
								word_string = word_string.replace(")", "\\)");
							
								// find word inside initial contents object and mark as found
								words_from_object_append_code_el.find("[" + ParsedClassicsVars.lemmaAttr + "=" + word_string + "]").addClass("w3-pale-green");
							
								// find word inside words to be added list and mark as found
								words_to_add_append_code_el.find("[" + ParsedClassicsVars.lemmaAttr + "=" + word_string + "]").addClass("w3-pale-green");

						}
		}
	
		, init: function() {
      var load_contents_button, load_words_button, supplement_lexcontents_button, check_completeness_button;
						
						load_contents_button = $("#" + ParsedClassicsVars.loadButtonId);
						load_contents_button.bind("click", ParsedClassicsLexContentsSupplementer.loadContents);
			
						load_words_button = $("#" + ParsedClassicsVars.loadButton2Id);
						load_words_button.bind("click", ParsedClassicsLexContentsSupplementer.loadWordList);
						
						supplement_lexcontents_button = $("#" + ParsedClassicsVars.generateButtonId);
						supplement_lexcontents_button.bind("click", ParsedClassicsLexContentsSupplementer.suppLexContents);
			
						check_completeness_button = $("#" + ParsedClassicsVars.checkButtonId);
						check_completeness_button.bind("click", ParsedClassicsLexContentsSupplementer.checkCompleteness);
		}
	
};

/*

Lexicon (typed) code formatter script

*/

var ParsedClassicsLexCodeFormatter = {
		
		loadLexCode: function() {
						var lexcode_input_textarea
						, lexcode_append_code_el
						, lexcode
						, msg_el;
			
						// get lexicon code input el
						lexcode_input_textarea = $("#" + ParsedClassicsVars.inputTextareaId);
			
						// get lexicon code
						lexcode = $.trim(lexcode_input_textarea.val());
			
						// no lexicon code? - then nothing to do except to display error msg
						if (lexcode == "") {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No lexicon code found in Lexicon code input textarea!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;	
						}
			
						// get append code el
						lexcode_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainerId);
			
						// insert lexicon code into append code el
						lexcode_append_code_el.html(lexcode);
						// display append code el
						lexcode_append_code_el.css("display", "block");
			
		}
	
		, formatLexCode: function() {
						var lexcode_append_code_el
						, msg_el
						, inner_html
						, definition_terms
						, definition_term_single
						, term_text
						, entry_word
						, entry_word_lowercase
						, char_index
      , char_index2
						, entry_word_el
						, term_inner_html
						, resulting_code
						, output_textarea;
			
						// get output textarea
						output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
			
						// get append code el
						lexcode_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainerId);
			
						// get inner html from append code el
						inner_html = lexcode_append_code_el.html();
			
						// no code in append code el? - then nothing to do except to display error msg
						if (inner_html == "") {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No lexicon code loaded!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;	
						}
			
						// get all <dt> els from append code el
						definition_terms = lexcode_append_code_el.find("dt");
			
						// loop through <dt> els, extract text and wrap each definition term string with <span> el having class "lexicon-heading" and attr "data-lemma"
						for (var i = 0; i < definition_terms.length; i++) {
								definition_term_single = $(definition_terms[i]);
								// get text of <dt> el
								term_text = definition_term_single.text();
								// get inner html of <dt> el
								term_inner_html = definition_term_single.html();
								// find position of comma char
								char_index = term_text.indexOf(",");
        // find position of emptyspace char
								char_index2 = term_text.indexOf(" ");
								// get entry word which should be before first comma char or before emptyspace or is identical with full <dt> text
								if (char_index > -1) {
										entry_word = term_text.substring(0, char_index);
								}
        else if (char_index2 > -1) {
          entry_word = term_text.substring(0, char_index2);  
        }
								else {
										entry_word = term_text;
										
								}
        
        entry_word_lowercase = entry_word.toLowerCase();
        // remove macrons and breves
        entry_word_lowercase = entry_word_lowercase.replace("ᾰ", "α");
        entry_word_lowercase = entry_word_lowercase.replace("ᾱ", "α");

        entry_word_lowercase = entry_word_lowercase.replace("ῐ", "ι");
        entry_word_lowercase = entry_word_lowercase.replace("ῑ", "ι");

        entry_word_lowercase = entry_word_lowercase.replace("ῠ", "υ");
        entry_word_lowercase = entry_word_lowercase.replace("ῡ", "υ");
								
								// form html of entry word el 
								entry_word_el = '<span class="' + ParsedClassicsVars.lexiconHeadingClass + '" ' + ParsedClassicsVars.lemmaAttr + '="' + entry_word_lowercase + '">' + entry_word + '</span>';
							
								// replace inside inner html of <dt> el the text of entry word with code of entry word el
								term_inner_html = term_inner_html.replace(entry_word, entry_word_el);
								definition_term_single.html(term_inner_html);
						}
						
						// get inner html from append code el
						resulting_code = lexcode_append_code_el.html();
			
						// put resulting code into output textarea
						output_textarea.val(resulting_code);
		}
	
		, init: function() {
						var load_lexcode_btn, format_lexcode_btn;
			
						load_lexcode_btn = $("#" + ParsedClassicsVars.loadButtonId);
						load_lexcode_btn.bind("click", ParsedClassicsLexCodeFormatter.loadLexCode);
			
						format_lexcode_btn = $("#" + ParsedClassicsVars.generateButtonId);
						format_lexcode_btn.bind("click", ParsedClassicsLexCodeFormatter.formatLexCode);
		}
	
}; 

/*

Lexicon (typed) completeness check script

*/

var ParsedClassicsLexCompletenessCheck = {
		
		loadLexCode: function() {
      var lexcode_input_textarea
						, lexcode_append_code_el
						, lexcode
						, msg_el;
      
      // get lexicon code input el
						lexcode_input_textarea = $("#" + ParsedClassicsVars.inputTextareaId);
			
						// get lexicon code
						lexcode = $.trim(lexcode_input_textarea.val());
      
      // no lexicon code? - then nothing to do except to display error msg
						if (lexcode == "") {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No lexicon code found in Lexicon code input textarea!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;	
						}
      
      // get append code el
						lexcode_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainerId);
      
      // insert lexicon code into append code el
						lexcode_append_code_el.html(lexcode);
						// display append code el
						lexcode_append_code_el.css("display", "block");
		}
	
		, loadParsedTextCode: function() {
						var textarea_el, parsed_text, parsed_text_container, msg_el;
      
      // find input textarea
      textarea_el = $("#" + ParsedClassicsVars.inputTextarea2Id);
      
      // get parsed text code
      parsed_text = textarea_el.val();

      // trim parsed text string
      parsed_text = $.trim(parsed_text);
      
      // no parsed text? - then nothing to do, exept to display error msg
      if (parsed_text == "") {
          // find message el
          msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
          // put message text inside message el
          msg_el.html("No parsed text found inside Parsed text input!");
          // display modal dialogue
          ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");

          return;
      }
      
      // find parsed text element
      parsed_text_container = $("#" + ParsedClassicsVars.appendCodeContainer2Id);
      
      // put parsed text code into paresed text element
      parsed_text_container.html(parsed_text);
		
      // display parsed text container
      parsed_text_container.slideDown(ParsedClassicsVars.animationSpeed);
		}
	
		, checkIfComplete: function() {
						var parsed_text_container
      , lexicon_container
      , words_all
      , single_word
      , words_list_array
      , words_list_array_unique
      , lemma
      , words_by_lemma;
      
      // define var
      words_list_array = [];
      
      // find lexicon container
						lexicon_container = $("#" + ParsedClassicsVars.appendCodeContainerId);
      
      // find parsed text element
      parsed_text_container = $("#" + ParsedClassicsVars.appendCodeContainer2Id);
      
      // find all word els
      words_all = parsed_text_container.find("." + ParsedClassicsVars.wordClass);
      
      // no words found? - nothing to do, exept to display error msg
      if (words_all.length == 0) {
          // find message el
          msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
          // put message text inside message el
          msg_el.html("No parsed text has been loaded!");
          // display modal dialogue
          ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

          return;
       }
       
       // get word list array
       for (var i = 0; i < words_all.length; i++) {
            single_word = $(words_all[i]).attr(ParsedClassicsVars.lemmaAttr);
            words_list_array.push(single_word);
       }
       
       // remove duplicates from words list array
       words_list_array_unique = ParsedClassicsLexCompletenessCheck._getUnique(words_list_array);
       
       // loop through words list array and check if there is entry for each in lexico
       // if there is, then highlight the words in parsed text
       for (var i = 0; i < words_list_array_unique.length; i++) {
           lemma = words_list_array_unique[i];
           // escape lemma
           lemma = lemma.replace("(", "\\(");
           lemma = lemma.replace(")", "\\)");
           words_by_lemma = lexicon_container.find("[" + ParsedClassicsVars.lemmaAttr + "=" + lemma + "]");
           // word found in lexicon, so highlite it in parsed text
           if (words_by_lemma.length > 0) {
               parsed_text_container.find("[" + ParsedClassicsVars.lemmaAttr + "=" + lemma + "]").addClass("w3-pale-green");
           }
       }
       
       // highlight in red words in parsed text for which there are no entries in lexicon
       parsed_text_container.find("span.word:not(.w3-pale-green)").addClass("w3-pale-red");
		}
  
  , _getUnique: function(inputArray) {
     var outputArray = [];
     for (var i = 0; i < inputArray.length; i++)
     {
      if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
      {
       outputArray.push(inputArray[i]);
      }
     }
     return outputArray;
    }
		
		, init: function() {
				var load_lexcode_btn, load_parsedtextcode_btn, check_completeness_btn;
			
				load_lexcode_btn = $("#" + ParsedClassicsVars.loadButtonId);
				load_lexcode_btn.bind("click", ParsedClassicsLexCompletenessCheck.loadLexCode);
			
				load_parsedtextcode_btn = $("#" + ParsedClassicsVars.loadButton2Id);
				load_parsedtextcode_btn.bind("click", ParsedClassicsLexCompletenessCheck.loadParsedTextCode);
			
				check_completeness_btn = $("#" + ParsedClassicsVars.checkButtonId);
				check_completeness_btn.bind("click", ParsedClassicsLexCompletenessCheck.checkIfComplete); 
		}
	
};

/*

Audio contents generator script

*/

var ParsedClassicsAudioContentsGenerator = {
  
  loadRecordedText: function() {
    var textarea_el, text_code, text_code_container, msg_el;
    
    // find input textarea
			 textarea_el = $("#" + ParsedClassicsVars.inputTextareaId);
    
    // get text code
    text_code = textarea_el.val();
    
    // no text code? - then nothing to do, exept to display error msg
    if (text_code == "") {
        // find message el
        msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
        // put message text inside message el
        msg_el.html("No text code found inside Recorded text code input!");
        // display modal dialogue
        ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");

        return;
     }
     
     // find text code element
			  text_code_container = $("#" + ParsedClassicsVars.appendCodeContainerId);
     
     // put text code into container element
			  text_code_container.html(text_code);
     
     // display  container el
     text_code_container.slideDown(ParsedClassicsVars.animationSpeed);
  }
  
  , generateAudioContents: function() {
      var contents_name_input
      , contents_name
      , msg_el
      , text_code_container
      , line_els
      , single_line
      , line_text
      , line_number
      , char_index
      , object_key
      , start_time
      , object_code
      , output_textarea;
      
      // define var
      object_code = "";
      
      // find contents name textinput
				  contents_name_input = $("#" + ParsedClassicsVars.inputTextarea2Id);
      
      // get contents shortname
				  contents_name = contents_name_input.val();
      
      // get output textarea
      output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
      
      // no contents shortname? - then nothing to do, exept to display error msg
      if (contents_name == "") {
        // find message el
        msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
        // put message text inside message el
        msg_el.html("No contents shortname found inside Contents shortname input!");
        // display modal dialogue
        ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
        return;
      }
      
      // find text code element
			   text_code_container = $("#" + ParsedClassicsVars.appendCodeContainerId);
      
      // get line els
      line_els = text_code_container.find("." + ParsedClassicsVars.audioTextLineClass);
      
      // no line els? - - then nothing to do, exept to display error msg
      if (line_els.length == 0) {
        msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
        // put message text inside message el
        msg_el.html("No text code has been loaded!");
        // display modal dialogue
        ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
        return;
      }
      
      // loop through line els and extract line numbers and audio start time
      for (var i = 0; i < line_els.length; i++) {
        // get text of the line el
        single_line = $(line_els[i]);
        line_text = single_line.text();
        // trim line text
        line_text = $.trim(line_text);
        
        if (line_text !== "") {
          // get position of firs emptyspace char
          char_index = line_text.indexOf(" ");
          if (char_index > 0) {
            line_number = line_text.substring(0, char_index);

            // get object key which is the same as line class in Parsing pane
            object_key = ParsedClassicsData._findLineNumClass(line_number);

            // get start time of the line in audio recording
            start_time = single_line.attr(ParsedClassicsVars.audioLineStartAttr);

            // form key/value pair of the JSON object
            object_code += ', "' + object_key + '": ' + start_time + '\n\n'; 
          }
        }
        
      }
      
      // add the line for "v-title" line class
      object_code = '"' + ParsedClassicsVars.lineClassSelectedByDefault + '": 0\n\n' + object_code;
      // add starting and ending braces
      object_code = '{\n\n' + object_code + '};';
      // add object name
      object_code = 'var ' + contents_name + ' = ' + object_code;
      
      // put object code into contents code ouput texarea
      output_textarea.val(object_code);
      
  }
  
  , init: function() {
     var load_textcode_btn, generate_contents_btn;
     
     load_textcode_btn = $("#" + ParsedClassicsVars.loadButtonId);
     load_textcode_btn.bind("click", ParsedClassicsAudioContentsGenerator.loadRecordedText);
     
     generate_contents_btn = $("#" + ParsedClassicsVars.generateButtonId);
     generate_contents_btn.bind("click", ParsedClassicsAudioContentsGenerator.generateAudioContents);
  }
    
};

/*

Audio datafile generator script

*/

var ParsedClassicsAudioDatafileGenerator = {
	
	loadRecordedText: function() {
		var textarea_el, text_code, text_code_container, msg_el;

		// find input textarea
		textarea_el = $("#" + ParsedClassicsVars.inputTextareaId);

		// get text code
		text_code = textarea_el.val();

		// no text code? - then nothing to do, exept to display error msg
		if (text_code == "") {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No text found inside Recorded text code input!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
	
			return;
		}

		// change line breakes to <br>
		text_code = text_code.replace(/(\r\n\t|\n|\r\t)/gm,"<br><br>");

		// find text code element
		text_code_container = $("#" + ParsedClassicsVars.appendCodeContainerId);

		// put text code into container el
		text_code_container.html(text_code);

		// display  container el
		text_code_container.slideDown(ParsedClassicsVars.animationSpeed);
	}

	, generateAudioDatafile: function() {
		var text_code_container
		, text_html
		, msg_el
		, lines_arr
		, line_single
		, datafile_code
		, datafile_name_input
		, datafile_name
		, output_textarea;

		//define vars
		datafile_code = "";

		// find datafile name textinput
		datafile_name_input = $("#" + ParsedClassicsVars.inputTextarea2Id);

		// get datafile shortname
		datafile_name = datafile_name_input.val();

		// no datafile shortname? - then nothing to do, exept to display error msg
		if (datafile_name == "") {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No shortname found inside Data file shortname input!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
			return;
		  }

		// get output textarea
		output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);

		// find text code element
		text_code_container = $("#" + ParsedClassicsVars.appendCodeContainerId);

		// get text html
		text_html = text_code_container.html();

		// split text html into lines
		lines_arr = text_html.split("<br><br>");

		// loop through lines
		for (var i = 0; i < lines_arr.length; i++) {
			// trim whitespace
			line_single = $.trim(lines_arr[i]);
			// add datafile code
			line_single = "'[00:00.00]" + line_single + "\\n' + \n\n";
			datafile_code += line_single;
		}

		// add first line of datafile code
		datafile_code = 'ParsedClassicsData._loadResource("' + datafile_name + '", \n\n' + datafile_code;

		// add last line of datafile code
		datafile_code += '""\n\n);';

		// put datafile code into datafile code ouput texarea
		output_textarea.val(datafile_code);
	}

	

	, init: function() {
		 var load_textcode_btn, generate_datafile_btn;

		 load_textcode_btn = $("#" + ParsedClassicsVars.loadButtonId);
		 load_textcode_btn.bind("click", ParsedClassicsAudioDatafileGenerator.loadRecordedText);
		 
		 generate_datafile_btn = $("#" + ParsedClassicsVars.generateButtonId);
		 generate_datafile_btn.bind("click", ParsedClassicsAudioDatafileGenerator.generateAudioDatafile);
	}

}

/*

Collection contents generator script

*/

var ParsedClassicsCollContentsGenerator = {
  
  generateCollContents: function() {
    var coll_contents
    , contents_name
    , lineclass_prefixes_all
    , linenum_prefixes_all
    , ranges_all
    , output_textarea
    , msg_el
    , single_range
    , single_lineclass_prefix
    , single_linenum_prefix
    , start_num
    , end_num
    , range_index;
    
    // define var
				coll_contents = "";
    
    // get contents name 
				contents_name = $("#" + ParsedClassicsVars.inputTextarea3Id).val();
    // get line class prefixes string
    lineclass_prefixes_all = $("#" + ParsedClassicsVars.inputTextarea2Id).val();
    // get line number prefixes string
    linenum_prefixes_all = $("#" + ParsedClassicsVars.inputTextarea4Id).val();
    // get ranges string
				ranges_all = $("#" + ParsedClassicsVars.inputTextareaId).val();
    
    // get output textarea
				output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
    
    // trim contents name
				contents_name = $.trim(contents_name);
    // trim line class prefixes string
    lineclass_prefixes_all = $.trim(lineclass_prefixes_all);
    // trim line number prefixes string
    linenum_prefixes_all = $.trim(linenum_prefixes_all);
    // trim ranges string
				ranges_all = $.trim(ranges_all);
    
    // no contents name? - then nothing to do, exept to display error msg
				if (contents_name == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No contents shortname defined inside Contents shortname input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
    
    // no line class prefixes string? - then nothing to do, exept to display error msg
    if (lineclass_prefixes_all == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No line class prefix defined inside Line class prefix input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
    
    // no line number prefixes string? - then nothing to do, exept to display error msg
    if (linenum_prefixes_all == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No line number prefix defined inside Line number prefix input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
    
    // no ranges string? - then nothing to do, exept to display error msg
				if (ranges_all == "") {
						// find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No range defined inside Line range input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
				}
    
    // get line class prefixes array
				lineclass_prefixes_all = lineclass_prefixes_all.split("|");
    // get line number prefixes array
    linenum_prefixes_all = linenum_prefixes_all.split("|");
    // get ranges array
				ranges_all = ranges_all.split("|");
    
    // does number of line class prefixes match the number of line number prefixes and the number of ranges? - if not, then nothing to do, exept to display error msg
    if (ranges_all.length != lineclass_prefixes_all.length || ranges_all.length != linenum_prefixes_all.length) {
      // find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("The numbers of defined line class prefixes, line number prefixes and ranges do not match !");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
    }
    
    // generate collection contents
    for (var i = 0; i < ranges_all.length; i++) {
    
      // get single range, single lineclass prefix, single line number prefix
      single_range = $.trim(ranges_all[i]);
      single_lineclass_prefix = $.trim(lineclass_prefixes_all[i]);
      single_linenum_prefix = $.trim(linenum_prefixes_all[i]);
      // remove whitespace
						single_range = single_range.replace(" ", "");
      
						// split into start and end numbers
						single_range = single_range.split("-");
      
      // no start and end numbers? - then nothing to do, exept to display error msg
      if (single_range.length != 2) {
        // find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("Inside each line range start and end numbers must be separated by dash!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
      }
      
      // calculate range index
      range_index = i + 1;
      
      // create key/val pair indicating levelstart
      coll_contents += ', "levelstart-' + range_index + '": ""\n\n';
      
      // get start number of the range
						start_num = Number(single_range[0]);
						// get end number of the range
						end_num = Number(single_range[1]);
					
						// increase end number by 1
						end_num++;
      
      // generate contens of the line range
      for (var j = start_num; j < end_num; j++) {
      
        coll_contents += ', "' + single_lineclass_prefix + j + '": "' + single_linenum_prefix + j + '"\n\n';
        
        // create key/val pair indicating levelend
        if (j === end_num - 1) {
          coll_contents += ', "levelend-' + range_index + '": ""\n\n';
        }
        
      }
      
    }
    
    // add title page
				coll_contents = '"title": ""\n\n' + coll_contents;
    
    // add braces
				coll_contents = "{\n\n" + coll_contents + "};"
    
    // add variable name 
				coll_contents = contents_name + ' = ' + coll_contents;
    
    // output collection contents
				output_textarea.val(coll_contents);
  }
  
  , init: function() {
      var generate_collcontents_button;
      
      generate_collcontents_button = $("#" + ParsedClassicsVars.generateButtonId);
      generate_collcontents_button.bind("click", ParsedClassicsCollContentsGenerator.generateCollContents);
  }
  
};

/*

Page numbers cleaner script (for scanned Lexicons and Concordances)

*/

var ParsedClassicsPageNumCleaner = {
  
  cleanPageNums: function() {
    var contents_obj_inputted, msg_el, contents_obj_outputted, output_textarea, regex;
    
    // get inputted contents object string
    contents_obj_inputted = $("#" + ParsedClassicsVars.inputTextareaId).val();
    
    // get output textarea
				output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
    
    // no contents object? - then nothing to do, exept to display error msg
    if (contents_obj_inputted == "") {
      // find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No contents object found inside Contents object input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
    }
    
    // clean page numbers between quotes
    regex = /\"([0-9]+)\"/g;
    contents_obj_outputted = contents_obj_inputted.replace(regex, '""');
    
    regex = /\'([0-9]+)\'/g;
    contents_obj_outputted = contents_obj_outputted.replace(regex, "''");
    
    // output contents object without page numbers
    output_textarea.val(contents_obj_outputted);
  }
  
  , init: function() {
    var clean_page_nums_button;
    
    clean_page_nums_button = $("#" + ParsedClassicsVars.generateButtonId);
    clean_page_nums_button.bind("click", ParsedClassicsPageNumCleaner.cleanPageNums); 
  }
  
};

/*

Lexicon contents importer script (for scanned Lexicons and Concordances)

*/

var ParsedClassicsLexContentsImporter = {
  
  contentWords: []
	
		, importWords: []
	
		, contentObjStart: ""
	
		, contentObjtEnd: ""
	
		, contentItemTitle: ""
  
  , loadContents: function(textarea_id, append_code_container_id, main) {
      var contents_object_input
      , contents_object_string
      , words_from_object_append_code_el
      , msg_el
      , char_index
      , contents_object_start
						, contents_object_end
      , member_strings_array
      , original_word
						, string_split_array
						, words_from_object_html
						, original_word_array
						, words_from_object_append_code_el
						, word_list_from_object;
      
      // define var
      original_word_array = [];
						words_from_object_html = "";
      
      // find contents object input textarea
      contents_object_input = $("#" + textarea_id);
      
      // get contents object
						contents_object_string = contents_object_input.val();
      
      // get append code container
						words_from_object_append_code_el = $("#" + append_code_container_id);
      
      // no contents object? - then nothing to do, exept to display error msg
						if (contents_object_string == "") {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
        if (main == true) {
          msg_el.html("No initial contents object found inside textarea field!");
        }
        else {
          msg_el.html("No contents object to be imported found inside textarea field!");
        }
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
      
      // delete everything before opening brace, brace included
      char_index = contents_object_string.indexOf("{");
     	if (char_index != -1) {
        contents_object_start = contents_object_string.substring(0, char_index + 1);
        if (main == true) {
          ParsedClassicsLexContentsImporter.contentObjStart = contents_object_start;
        }
        contents_object_string = contents_object_string.substring(char_index + 1);
      }
      
      // delete everything after closing brace, brace included
      char_index = contents_object_string.indexOf("}");
      if (char_index != -1) {
        contents_object_end = contents_object_string.substring(char_index);
        if (main == true) {
          ParsedClassicsLexContentsImporter.contentObjEnd = contents_object_end;
        }
        contents_object_string = contents_object_string.substring(0, char_index);
      }
      
      // trim whitespace
    		contents_object_string = $.trim(contents_object_string);
      
      // remove line breaks
						contents_object_string = contents_object_string.replace(/(\r\n\t|\n|\r\t)/gm,"");
      
      // split contents object string into member strings array
						member_strings_array = contents_object_string.split(",");
      
      // loop through member strings array 
						// and extract original words placed inside comment symbols "/*" and "*/"
						// and form html to display content object members
      for (var i = 0; i < member_strings_array.length; i++) {
        original_word = "";
        string_split_array = member_strings_array[i].split("/*");
        if (string_split_array.length == 2) {
          original_word = string_split_array[1];
          string_split_array = original_word.split("*/");
          if (string_split_array.length == 2) {
            original_word = $.trim(string_split_array[0]);
            // is first member string title item? - then save it for later
												if (i == 0 && original_word.toLowerCase().indexOf("title") > -1) {
														original_word = ParsedClassicsVars.wordClassSelectedByDefault;
              if (main != true) {
                ParsedClassicsLexContentsImporter.contentItemTitle = member_strings_array[i];
              }
												}
          }
          else {
												original_word = "";
										}
        }
        else {
										original_word = "";
								}
        words_from_object_html += '<span ' + ParsedClassicsVars.lemmaAttr + '="' + original_word + '">' + $.trim(member_strings_array[i]) + '</span><br>';
								if (original_word != "") {
										original_word_array.push(original_word);
								}
      }
      
      // save original word array list as object member
      if (main == true) {
        ParsedClassicsLexContentsImporter.contentWords = original_word_array;
      }
      else {
        ParsedClassicsLexContentsImporter.importWords = original_word_array;
      }
      
      // add contents object start and end
						words_from_object_html = contents_object_start + "<br>" + words_from_object_html + contents_object_end;
      
      // put words extracted from contents object for display
						words_from_object_append_code_el.html(words_from_object_html);
      
      // make append code el visible
						words_from_object_append_code_el.css("display", "block");
  }
  
  , importLexContents: function() {
      var word_list_from_object
						, original_word_array
						, words_to_add_array
						, new_words_array
						, supplemented_words_array
						, language_form_el
						, language_radio_el
						, text_lang
						, original_word
						, original_word_esc
						, words_from_object_append_code_el
						, words_to_add_append_code_el
						, member_to_add
						, word_from_contents
						, new_contents_object
						, word_code
						, output_textarea;
      
      // define var
						new_words_array = [];
						new_contents_object = ParsedClassicsLexContentsImporter.contentItemTitle ? ParsedClassicsLexContentsImporter.contentItemTitle + "\n\n" : "";
      
      // get append code containers
						words_from_object_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainerId);
						words_to_add_append_code_el = $("#" + ParsedClassicsVars.appendCodeContainer2Id);
      
      // get original words array
						original_word_array = ParsedClassicsLexContentsImporter.contentWords;
      
      // get words to be added array
						words_to_add_array = ParsedClassicsLexContentsImporter.importWords;
      
      // no original word list? - then nothing to do, exept to display error msg
      if (original_word_array.length == 0) {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No initial contents object has been loaded!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
      
      // no words to be added array? - then nothing to do, exept to display error msg
						if (words_to_add_array.length == 0) {
								// find message el
								msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
								// put message text inside message el
								msg_el.html("No contents object to be imported has been loaded!");
								// display modal dialogue
								ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
								return;
						}
      
      // get pipe delimited original word list
						word_list_from_object = original_word_array.join("|");
      
      // add pipe symbols to start and end
						word_list_from_object = "|" + word_list_from_object + "|";
      
      // find words in list to be added which are not already included in the list extracted from initial contents object
      for (var i = 0; i < words_to_add_array.length; i++) {
								// is word not in word list generated from contents object?
								if ( word_list_from_object.indexOf("|" + words_to_add_array[i] + "|") == -1 ) {
										new_words_array.push(words_to_add_array[i]);
								}
						}
      
      // add new words to the words from initial contents object
						supplemented_words_array = original_word_array.concat(new_words_array);
      
      // find language form and radio els
						language_form_el = document.forms[ParsedClassicsVars.languageFormName];
						language_radio_el = language_form_el[ParsedClassicsVars.languageRadioName];
      
      // find language of parsed text
						text_lang = language_radio_el.value;

						if (text_lang == ParsedClassicsVars.languageGreek) {
							ParsedClassicsVars.locale = "el";
						}
						else if (text_lang == ParsedClassicsVars.languageLatin) {
							ParsedClassicsVars.locale = "la";
						}
      
      // sort words aphabetically
						supplemented_words_array.sort(function(a, b) {return a.localeCompare(b, ParsedClassicsVars.locale, {sensitivity: 'base'}) });
      
      // loop supplemended words array and generate new contents object
      for (var i = 0; i < supplemented_words_array.length; i++) {
        original_word = supplemented_words_array[i];
								// escape braces in word
								original_word_esc = original_word;
								original_word_esc = original_word_esc.replace("(", "\\(");
								original_word_esc = original_word_esc.replace(")", "\\)");
        // is original word among words to be imported?
        member_to_add = words_to_add_append_code_el.find("[" + ParsedClassicsVars.lemmaAttr + "=" + original_word_esc + "]");
        if (member_to_add.length != 0) {
          // original word is among words to be imported, so add its string if it is not title item
          if (original_word != ParsedClassicsVars.wordClassSelectedByDefault) {
												new_contents_object += ", " + member_to_add.text() + "\n\n";
										}
        }
        // not being found among words to be imported, original word should be among words of initial contents object, 
        //so find its string there
        else {
          member_to_add = words_from_object_append_code_el.find("[" + ParsedClassicsVars.lemmaAttr + "=" + original_word_esc + "]");
          if (member_to_add.length != 0) {
  										// it is already included in contents, so add its string if it is not title item
  										if (original_word != ParsedClassicsVars.wordClassSelectedByDefault) {
  												new_contents_object += ", " + member_to_add.text() + "\n\n";
  										}
  								}
        }
      }
      
      // delete first comma char if there is no title page item
						if (ParsedClassicsLexContentsImporter.contentItemTitle == "") {
								new_contents_object = new_contents_object.substring(2);
						}
      
      // add to contents object its start and end
						new_contents_object = ParsedClassicsLexContentsImporter.contentObjStart + "\n\n" + new_contents_object + ParsedClassicsLexContentsImporter.contentObjEnd;
      
      // put new contentsobject into output textarea
						output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
						output_textarea.val(new_contents_object);
  }
  
  , checkCompleteness: function() {
      
      ParsedClassicsLexContentsSupplementer.checkCompleteness();
  }

  , init: function() {
      var load_contents_button, load_contents_button2, import_lexcontents_button, check_completeness_button;
      
      load_contents_button = $("#" + ParsedClassicsVars.loadButtonId);
      load_contents_button.bind("click", function(){ParsedClassicsLexContentsImporter.loadContents(ParsedClassicsVars.inputTextarea2Id, ParsedClassicsVars.appendCodeContainerId, true)});
      
      load_contents_button2 = $("#" + ParsedClassicsVars.loadButton2Id);
      load_contents_button2.bind("click", function(){ParsedClassicsLexContentsImporter.loadContents(ParsedClassicsVars.inputTextareaId, ParsedClassicsVars.appendCodeContainer2Id, false)});
      
      import_lexcontents_button = $("#" + ParsedClassicsVars.generateButtonId);
      import_lexcontents_button.bind("click", ParsedClassicsLexContentsImporter.importLexContents);
      
      check_completeness_button = $("#" + ParsedClassicsVars.checkButtonId);
      check_completeness_button.bind("click", ParsedClassicsLexContentsImporter.checkCompleteness);
  }
};

/*

Unicode characters changer script (for scanned Parsed texts, Concordances and transcribed Lexicons)

*/

var ParsedClassicsCharChanger = {

  changeChars: function() {
    var code_inputted, msg_el, code_outputted, output_textarea, find_char, replace_char;
    
    // get inputted code string
    code_inputted = $("#" + ParsedClassicsVars.inputTextareaId).val();
    
    // get output textarea
				output_textarea = $("#" + ParsedClassicsVars.outputTextareaId);
    
    // no code string? - then nothing to do, exept to display error msg
    if (code_inputted == "") {
      // find message el
						msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
						// put message text inside message el
						msg_el.html("No contents found inside Text or code input!");
						// display modal dialogue
						ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
						return;
    }
    
    code_outputted = code_inputted;
    
    // change unicode characters
    
    find_char = /ά/ug;
    replace_char = "ά";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /Ά/ug;
    replace_char = "Ά";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϐ/ug;
    replace_char = "β";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϵ/ug;
    replace_char = "ε";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /έ/ug;
    replace_char = "έ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /Έ/ug;
    replace_char = "Έ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ή/ug;
    replace_char = "ή";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /Ή/ug;
    replace_char = "Ή";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϑ/ug;
    replace_char = "θ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϴ/ug;
    replace_char = "Θ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ί/ug;
    replace_char = "ί";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ΐ/ug;
    replace_char = "ΐ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /Ί/ug;
    replace_char = "Ί";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϰ/ug;
    replace_char = "κ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ό/ug;
    replace_char = "ό";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /Ό/ug;
    replace_char = "Ό";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϱ/ug;
    replace_char = "ρ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ύ/ug;
    replace_char = "ύ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ΰ/ug;
    replace_char = "ΰ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϒ/ug;
    replace_char = "Υ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /Ύ/ug;
    replace_char = "Ύ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϔ/ug;
    replace_char = "Ϋ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ϕ/ug;
    replace_char = "φ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /ώ/ug;
    replace_char = "ώ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    find_char = /Ώ/ug;
    replace_char = "Ώ";
    code_outputted = code_outputted.replace(find_char, replace_char);
    
    // output contents object without page numbers
    output_textarea.val(code_outputted);
  }
  
  , init: function() {
    var change_chars_button;

    change_chars_button = $("#" + ParsedClassicsVars.generateButtonId);
    change_chars_button.bind("click", ParsedClassicsCharChanger.changeChars); 
  }

};

/*

URL list generator script 

to generate URL list from URL temlate and number range

*/

var ParsedClassicsUrlListGenerator = {

	generate_url_list: function(e) {
		var start_num,
		end_num,
		zero_padding_to,
		url_template,
		index,
		url_list,
		url,
		output_textarea;

		e.preventDefault();

		start_num = $("#pc-start-num-input").val();
		start_num = parseInt(start_num);
		end_num = $("#pc-end-num-input").val();
		end_num = parseInt(end_num);
		zero_padding_to = $("#pc-zero-padding-input").val();
		zero_padding_to = parseInt(zero_padding_to);
		url_template = $("#pc-url-template-input").val();

		output_textarea = $("#pc-textarea-output");

		// end num must be bigger than start num
		if (start_num - end_num > 0) {
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("End number must be bigger than start number!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
			return;
		}

		// url template must include {index} variable
		if (url_template.indexOf("{index}") === -1) {
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("URL template must contain {index} variable!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
			return;
		}

		// generate URL list
		url_list = "";
		for (var i = start_num; i <= end_num; i++) {
			// calculate index
			index = i;
			if (zero_padding_to) {
				index = String(i).padStart(zero_padding_to, '0')
			}
			// generate url
			url = url_template.replace("{index}", index);
			// append url to url list
			url_list += url + "\n\n";
		}

		// output url list
		output_textarea.val(url_list);
	}
	
	, init: function() {
		var url_list_form;

		url_list_form = $("#url_list_form");
		url_list_form.bind("submit", ParsedClassicsUrlListGenerator.generate_url_list);
	}

}

/*

Grammar references generator script 

to generate code of Grammar refs resource

*/

var ParsedClassicsGrammarRefsGenerator = {
  
  loadInputsButtonId: "load-button",

  generateButtonId: "generate-button",

  inputsAreaId: "data-inputs-area",

  inputsArea: null,

  inputsHTML: "",

  inputsBlockClass: "inputs-block",

  lineInputClass: "line-input",

  lineClassInputClass: "line-class",

  filenameInputClass: "filename-input",

  fileNumOffsetInputId: "file-num-offset-input",

  fileNumOffset: "",

  scannedBookShortnameInputId: "scanned-book-shortname-input",

  scannedBookShortname: "",

  scannedBookShorttitleInputId: "scanned-book-shorttitle-input",

  scannedBookShorttitle: "",

  collContentInputId: "coll-content-input",

  insertInputBlockBtnClass: "insert-input-block-btn",

  grammarRefsOutputId: "grammar-refs-output",

  loadInputs: function(e) {
    var inputsArea, inputsHTML, resShortnameInput, fileNumOffsetInput, scannedBookShortnameInput, collContentInput, msg_el;

    e.preventDefault();

    // get message el
    msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);

    // get input data
    ParsedClassicsGrammarRefsGenerator.fileNumOffset = $("#" + ParsedClassicsGrammarRefsGenerator.fileNumOffsetInputId).val().trim();
    ParsedClassicsGrammarRefsGenerator.scannedBookShortname = $("#" + ParsedClassicsGrammarRefsGenerator.scannedBookShortnameInputId).val().trim();
    ParsedClassicsGrammarRefsGenerator.scannedBookShorttitle = $("#" + ParsedClassicsGrammarRefsGenerator.scannedBookShorttitleInputId).val().trim();
    collContent = $("#" + ParsedClassicsGrammarRefsGenerator.collContentInputId).val().trim();

    if (ParsedClassicsGrammarRefsGenerator.fileNumOffset === "") {
      // put message text inside message el
      msg_el.html("File number offset must be defined!");
      // display modal dialogue
      ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
      return;
    }

    if (ParsedClassicsGrammarRefsGenerator.scannedBookShortname === "") {
      // put message text inside message el
      msg_el.html("Scanned book shortname must be defined!");
      // display modal dialogue
      ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
      return;
    }

    if (ParsedClassicsGrammarRefsGenerator.scannedBookShorttitle === "") {
      // put message text inside message el
      msg_el.html("Scanned book shorttitle must be defined!");
      // display modal dialogue
      ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
      return;
    }

    if (collContent === "") {
      // put message text inside message el
      msg_el.html("Collection content must be defined!");
      // display modal dialogue
      ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
      return;
    }

    // parse JSON of collection content
    try {
      collContent = JSON.parse(collContent);
    }
    catch(err) {
       // put message text inside message el
      msg_el.html(err.message);
      // display modal dialogue
      ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
      return;
    }

    // loop collection contents object
    Object.entries(collContent).forEach(([lineClass, lineNum]) => {
      if (lineClass !== "v-title" && lineClass.indexOf("levelstart") !== 0  && lineClass.indexOf("levelend") !== 0) {
        ParsedClassicsGrammarRefsGenerator.inputsHTML += ParsedClassicsGrammarRefsGenerator.createInputsBlock(lineNum, lineClass);
      } 
    });

    // get inputs area
    inputsArea = $("#" + ParsedClassicsGrammarRefsGenerator.inputsAreaId);
    // put inputs html into inputs area
    inputsArea.append(ParsedClassicsGrammarRefsGenerator.createInputsBlockFirst());
    inputsArea.append(ParsedClassicsGrammarRefsGenerator.inputsHTML);

    // delegate "click" evt from els having class "insert-input-block-btn" to inputs area
    inputsArea.delegate("." + ParsedClassicsGrammarRefsGenerator.insertInputBlockBtnClass, "click", ParsedClassicsGrammarRefsGenerator.insertInputsBlock);

  },

  createInputsBlock: function(lineNum, lineClass) {
    var html;

    // default values of lineClass and LineNum is empty string
    lineNum = typeof lineNum !== 'undefined' ? lineNum : "";
    lineClass = typeof lineClass !== 'undefined' ? lineClass : "";

    html = `
      <div class="${ParsedClassicsGrammarRefsGenerator.inputsBlockClass}">  
        <div>
          <div style="float: left; width: 30%;" class="pc-padding-right-4">
            Line(s)
            <input type="text" value="${lineNum}" class="${ParsedClassicsGrammarRefsGenerator.lineInputClass} pc-width-100">
          </div>
          <div style="float: left; width: 70%;" class="pc-padding-left-4">
            Line class(es)
            <span class="resizable-input-v3"><input type="text" value="${lineClass}" class="${ParsedClassicsGrammarRefsGenerator.lineClassInputClass} pc-width-100"></span>
          </div>
        </div>
        <div>
          Page(s)
          <span class="resizable-input-v3"><input type="text" class="${ParsedClassicsGrammarRefsGenerator.filenameInputClass} pc-width-100"></span>
        </div>
        ${ParsedClassicsGrammarRefsGenerator.createButtonBlock()}
      </div>
    `;

    return html;
  },

  createInputsBlockFirst: function() {
    var html;

    html = `
      <div class="${ParsedClassicsGrammarRefsGenerator.inputsBlockClass}">
        ${ParsedClassicsGrammarRefsGenerator.createButtonBlock()}
      </div>
    `;

    return html;
  },

  createButtonBlock: function() {
    var html;

    html = `
      <div style="text-align: right;">
        <button class="${ParsedClassicsGrammarRefsGenerator.insertInputBlockBtnClass} w3-button w3-hover-white w3-border w3-padding-small w3-ripple w3-round-small w3-hover-border-dark-grey">Insert inputs block</button>
      </div>
    `;

    return html;
  },

  insertInputsBlock: function(e) {
    var btn, html, block;

    e.preventDefault();

    btn = $(e.target);

    // get inputs block
    block = btn;
    while (!block.hasClass(ParsedClassicsGrammarRefsGenerator.inputsBlockClass)) {
      block = block.parent();
    }

    html = ParsedClassicsGrammarRefsGenerator.createInputsBlock();

    block.after(html);
  },

  createOutputCodeBlock: function(line, lineClass, pagenum) {
    var html, pagesHtml, pagenumArr, pagenum, filenum, num, comma;

    // define vars
    pagesHtml = "";

    // form line class string
    lineClass = lineClass.split("|").join(" ");

    // form pagenum arr
    pagenumArr = pagenum.split("|");
    // loop filenum arr
    for (var i = 0; i < pagenumArr.length; i++) {
      num = pagenumArr[i].replace(/[^0-9]/g,'');
      filenum = parseInt(num) + parseInt(ParsedClassicsGrammarRefsGenerator.fileNumOffset);
      comma = i < pagenumArr.length - 1 ? "," : "";
      pagesHtml += `<a data-grammar="${ParsedClassicsGrammarRefsGenerator.scannedBookShortname}" data-page="${filenum}">${ParsedClassicsGrammarRefsGenerator.scannedBookShorttitle} ${pagenumArr[i]}</a>${comma}\n`;
    }

    html = `<span class="verse"><span class="verse-number ${lineClass}">${line}</span>\n${pagesHtml}</span>\n\n`;

    return html;
  },

  generate: function(e) {
    var inputsArea, inputsBlocks, html, line, lineClass, pagenum, msgEl, grammarRefsOutputTextarea;

    e.preventDefault();

    // define vars
    html = "";

    // get inputs area
    inputsArea = $("#" + ParsedClassicsGrammarRefsGenerator.inputsAreaId);
    // get inputs blocks
    inputsBlocks = inputsArea.find("." + ParsedClassicsGrammarRefsGenerator.inputsBlockClass);

    if (inputsBlocks.length === 0) {
      // get message el
      msgEl = $("#" + ParsedClassicsVars.errorMsgTextElId);
      // put message text inside message el
      msgEl.html("No grammar references data inputs found!");
      // display modal dialogue
      ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");
      return;
    }

    // loop inputs blocks
    for (var i = 0; i < inputsBlocks.length; i++) {
      line = $.trim($(inputsBlocks[i]).find("." + ParsedClassicsGrammarRefsGenerator.lineInputClass).val());
      lineClass = $.trim($(inputsBlocks[i]).find("." + ParsedClassicsGrammarRefsGenerator.lineClassInputClass).val());
      pagenum = $.trim($(inputsBlocks[i]).find("." + ParsedClassicsGrammarRefsGenerator.filenameInputClass).val());
      if (line && lineClass && pagenum) {
        html += ParsedClassicsGrammarRefsGenerator.createOutputCodeBlock(line, lineClass, pagenum);
      }
    }

    // get output textarea
    grammarRefsOutputTextarea = $("#" + ParsedClassicsGrammarRefsGenerator.grammarRefsOutputId);
    grammarRefsOutputTextarea.val(html);
  },

  init: function() {
    var loadInputsButton, generateButton;

    loadInputsButton = $("#" + ParsedClassicsGrammarRefsGenerator.loadInputsButtonId);
    generateButton = $("#" + ParsedClassicsGrammarRefsGenerator.generateButtonId);

    loadInputsButton.bind("click", ParsedClassicsGrammarRefsGenerator.loadInputs);
    generateButton.bind("click", ParsedClassicsGrammarRefsGenerator.generate);
  }

};

/*

Grammar references supplementer script 

to generate code of Grammar refs resource

*/

var ParsedClassicsGrammarRefsSupplementer = {
  
  loadInitialRefsButtonId: "pc-load-button",
  loadAdditionalRefsButtonId: "pc-load-button2",
  supplementRefsButtonId: "pc-generate-button",
  checkCompletenessButtonId: "pc-check-button",
  initialRefsInputTextareaId: "pc-textarea-input",
  additionalRefsInputTextareaId: "pc-textarea-input2",
  initialRefsShowAreaId: "pc-append-code-container",
  additionalRefsShowAreaId: "pc-append-code-container2",
  supplementedRefsShowAreaId: "pc-append-code-container3",
  supplementedRefsOutputTextareaId: "pc-textarea-output",
  notAddedRefsOutputTextareaId: "pc-textarea-output2",

  loadRefs: function(inputTextareaId, showAreaId, msg) {
    var inputTextarea, showArea, code;

    // get code textarea
    inputTextarea = $("#" + inputTextareaId); 

    // get code from textarea
    code = inputTextarea.val();

    // trim code
		code = $.trim(code);

    // there is no code in textarea? - then nothing to do except to show error message
		if (code.length == 0) {
			// find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html(msg);
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
		}

    // get container to display references
		showArea = $("#" + showAreaId);

    // display refrerences inside container
		showArea.html(code);

    // show container
		showArea.show();
  },

  supplementRefs: function() {
    var supplementedRefsShowArea
    , initialRefsShowArea
    , additionalRefsShowArea
    , initialRefsCode
    , additionalRefsCode
    , additionalLines
    , initialLines
    , lineNum
    , initialLineToSupplement
    , initialLineToSupplementHtml
    , additionalLineClone
    , additionalLineHtml
    , supplementedRefsOutputTextarea
    , notAddedRefsOutputTextarea
    , notAddedRefsCode
    , certainLine;

    // get container where initial references are loaded
    initialRefsShowArea = $("#" + ParsedClassicsGrammarRefsSupplementer.initialRefsShowAreaId);

    // get initial references code
    initialRefsCode = $.trim(initialRefsShowArea.html());

    // no initial references code found? - then nothing to do except to show error message
    if (initialRefsCode.length == 0) {
      // find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("Grammar references to be supplemented are not loaded!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
    }

    // get container where supplemented references should be loaded
    supplementedRefsShowArea = $("#" + ParsedClassicsGrammarRefsSupplementer.supplementedRefsShowAreaId);

    // load initial references to supplemented references showarea
    supplementedRefsShowArea.html(initialRefsCode);

    // get container where additional references are loaded
    additionalRefsShowArea = $("#" + ParsedClassicsGrammarRefsSupplementer.additionalRefsShowAreaId);

    // get additional references code
    additionalRefsCode = $.trim(additionalRefsShowArea.html());

    // no additional references code found? - then nothing to do except to show error message
    if (additionalRefsCode.length == 0) {
      // find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("Grammar references to be added are not loaded!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
    }

    // get all additional lines
    additionalLines = additionalRefsShowArea.find("span." + ParsedClassicsVars.verseClass);

    // no additional lines? - then nothing to do, only to display error message
    if (additionalLines.length == 0) {
      // find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No lines found inside references to be added code!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
    }

    // get all initial lines
    initialLines = initialRefsShowArea.find("span." + ParsedClassicsVars.verseClass);

    // no initial lines? - then nothing to do, only to display error message
    if (initialLines.length == 0) {
      // find message el
			msg_el = $("#" + ParsedClassicsVars.errorMsgTextElId);
			// put message text inside message el
			msg_el.html("No lines found inside references to be supplemented code!");
			// display modal dialogue
			ParsedClassicsModalDialogues.openDialogue(ParsedClassicsVars.toolsErrorModalId, "", "");	

			return;
    }

    // get initial lines from supplemented references showarea
    initialLines = supplementedRefsShowArea.find("span." + ParsedClassicsVars.verseClass);

    // init var
    notAddedRefsCode = "";
    // loop through additional lines
    for (var i = 0; i < additionalLines.length; i++) {
      certainLine = $(additionalLines[i]);
      // find line number
      lineNum = certainLine.find("span." + ParsedClassicsVars.verseNumberClass).text();
      // find in references to be supplemented the line having the same line number
      initialLineToSupplement = initialLines.filter(function() { return $(this).find("span." + ParsedClassicsVars.verseNumberClass).text() === lineNum; })
      if (initialLineToSupplement.length == 1) {
        // get html of lite to be supplemented
        initialLineToSupplementHtml = $.trim(initialLineToSupplement.html());
        // clone additional line
        additionalLineClone = certainLine.clone(true);
        //remove line number from cloned additional line
        additionalLineClone.find("span." + ParsedClassicsVars.verseNumberClass).remove();
        // get html of the additional line without line number
        additionalLineHtml = additionalLineClone.html();
        // supplement initial line
        initialLineToSupplement.html(initialLineToSupplementHtml + ", " + additionalLineHtml);
      }
      // line having the same line number, so add the line code to not found references code
      else {
        notAddedRefsCode += additionalLines[i].outerHTML + "\n";
      }
    }

    // get references output textarea
    supplementedRefsOutputTextarea = $("#" + ParsedClassicsGrammarRefsSupplementer.supplementedRefsOutputTextareaId);

    // put supplemented references code into output textarea
    supplementedRefsOutputTextarea.val(supplementedRefsShowArea.html());

    // get not added references output textarea
    notAddedRefsOutputTextarea = $("#" + ParsedClassicsGrammarRefsSupplementer.notAddedRefsOutputTextareaId);

    // put not added references code into relevant output textarea
    notAddedRefsOutputTextarea.val($.trim(notAddedRefsCode));

    // show supplemented references
    supplementedRefsShowArea.show();
  },

  checkForCompleteness: function() {
    var supplementedRefsShowArea
	  , initialRefsShowArea
    , additionalRefsShowArea
    , supplementedLines
    , additionalLines
    , initialLines
    , certainLine
    , lineNum
    , anchorEls
    , anchorText
    , initialLineNeeded
    , additionalLineNeeded
    , anchorElFromInitialLine
    , anchorElFromAdditionalLine;

    // get showarea for supplemented lines
    supplementedRefsShowArea = $("#" + ParsedClassicsGrammarRefsSupplementer.supplementedRefsShowAreaId);
    // get all supplemented lines
    supplementedLines = supplementedRefsShowArea.find("span." + ParsedClassicsVars.verseClass);

    // get showarea for initial lines
    initialRefsShowArea = $("#" + ParsedClassicsGrammarRefsSupplementer.initialRefsShowAreaId);
    // get all initial lines
    initialLines = initialRefsShowArea.find("span." + ParsedClassicsVars.verseClass);

    // get showarea for additional lines
    additionalRefsShowArea = $("#" + ParsedClassicsGrammarRefsSupplementer.additionalRefsShowAreaId);
    // get all additional lines
    additionalLines = additionalRefsShowArea.find("span." + ParsedClassicsVars.verseClass);

    // loop through supplemented lines
    for (var i = 0; i < supplementedLines.length; i++) {
      certainLine = $(supplementedLines[i]);
      // get supplemented line number
      lineNum = certainLine.find("span." + ParsedClassicsVars.verseNumberClass).text();
      // get all <a> elements inside supplemented line
      anchorEls = certainLine.find("a");

      // get relevant line from showarea for initial lines
      initialLineNeeded =  initialLines.filter(function() { return $(this).find("span." + ParsedClassicsVars.verseNumberClass).text() === lineNum; });

      // get relevant line from showarea for additional lines
      additionalLineNeeded = additionalLines.filter(function() { return $(this).find("span." + ParsedClassicsVars.verseNumberClass).text() === lineNum; });

      // loop through anchor els from supplemented line
      for (var j = 0; j < anchorEls.length; j++) {
        // get anchor text and color it in "success" color
        anchorText = $(anchorEls[j]).addClass("w3-pale-green").text();
        // get anchor having the same text from relevant initial line 
        anchorElFromInitialLine = initialLineNeeded.find("a").filter(`:contains(${anchorText})`);
        // color found anchor in "success" color
        anchorElFromInitialLine.addClass("w3-pale-green");
        // get anchor having the same text from relevant additional line 
        anchorElFromAdditionalLine = additionalLineNeeded.find("a").filter(`:contains(${anchorText})`);
        // color found anchor in "success" color
        anchorElFromAdditionalLine.addClass("w3-pale-green");

      }

    }

    // color in "error" color all anchors, which are not colored in "success" color 
    supplementedLines.find("a:not(.w3-pale-green)").addClass("w3-pale-red"); 
    initialLines.find("a:not(.w3-pale-green)").addClass("w3-pale-red");
    additionalLines.find("a:not(.w3-pale-green)").addClass("w3-pale-red");
  },

  init: function() {
    var loadInitialRefsButton, loadAdditionalRefsButton, supplementRefsButton, checkCompletenessButton;
    
    loadInitialRefsButton = $("#" + ParsedClassicsGrammarRefsSupplementer.loadInitialRefsButtonId);
    loadAdditionalRefsButton = $("#" + ParsedClassicsGrammarRefsSupplementer.loadAdditionalRefsButtonId);
    supplementRefsButton = $("#" + ParsedClassicsGrammarRefsSupplementer.supplementRefsButtonId);
    checkCompletenessButton = $("#" + ParsedClassicsGrammarRefsSupplementer.checkCompletenessButtonId);

    loadInitialRefsButton.bind("click", () => {
      ParsedClassicsGrammarRefsSupplementer.loadRefs(ParsedClassicsGrammarRefsSupplementer.initialRefsInputTextareaId, ParsedClassicsGrammarRefsSupplementer.initialRefsShowAreaId, "No code was found in references to be supplemented code input!")
    });

    loadAdditionalRefsButton.bind("click", () => {
      ParsedClassicsGrammarRefsSupplementer.loadRefs(ParsedClassicsGrammarRefsSupplementer.additionalRefsInputTextareaId, ParsedClassicsGrammarRefsSupplementer.additionalRefsShowAreaId, "No code was found in references to be added code input!")
    });

    supplementRefsButton.bind("click", ParsedClassicsGrammarRefsSupplementer.supplementRefs);
    checkCompletenessButton.bind("click", ParsedClassicsGrammarRefsSupplementer.checkForCompleteness);
  }
};