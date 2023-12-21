//

// These are the minimum you need to provide to BookReader to display a book

//

// Copyright(c)2008-2009 Internet Archive. Software license AGPL version 3.



// Create the BookReader object

var BookReaderOptions = {

  book_shortname: "",

  logoURL: '../site/index.html',

  

  // Total number of leafs

  getNumLeafs: function() {

      //return 15;

      return BookReaderOptions.getBookParam("numLeafs");

  },



  // Return the width of a given page.  Here we assume all images are 800 pixels wide

  getPageWidth: function(index) {
    
    var pageWidth = BookReaderOptions.getBookParam("leafWidth")
    if (pageWidth) {
        return pageWidth;
    }
    return 800;

  },



  // Return the height of a given page.  Here we assume all images are 1200 pixels high

  getPageHeight: function(index) {
    var pageHeight = BookReaderOptions.getBookParam("leafHeight")
    if (pageHeight) {
        return pageHeight;
    }
    return 1200;

  },

  

  getBookShortname: function() {

    var search_string, book_shortname;
    
    book_shortname = "book_not_found";
    
    search_string = window.location.search;
    
    if (search_string.length > 1) {
      // trim "?" char
      search_string  = search_string.slice(1);

      if (typeof ParsedClassicsScannedBooks[search_string] != "undefined") {
        book_shortname = search_string;
        BookReaderOptions.book_shortname = book_shortname;
        return book_shortname;
      }
    }
    
    return book_shortname;

  },

  

  getBookParam: function(param_name) {

    var book_shortname, book_desc, param_val;

    param_val = "";
    
    if (BookReaderOptions.book_shortname == "") {
      BookReaderOptions.book_shortname = BookReaderOptions.getBookShortname();
    }

    book_desc = ParsedClassicsScannedBooks[BookReaderOptions.book_shortname];

    if (typeof  book_desc[param_name] != "undefined") {
      
      param_val = book_desc[param_name];

    }

    return param_val;

  },



  // We load the images from archive.org -- you can modify this function to retrieve images

  // using a different URL structure

  getPageURI: function(index, reduce, rotate) {

      // reduce and rotate are ignored in this simple implementation, but we

      // could e.g. look at reduce and load images from a different directory

      // or pass the information to an image server

      var leafStr = '0000';

      var imgStr = (index+1).toString();

      var re = new RegExp("0{"+imgStr.length+"}$");

      

      var url = '../_scans/' + BookReaderOptions.getBookShortname() + '/page' + leafStr.replace(re, imgStr) + '.jpg';

      return url;

  },



  // Return which side, left or right, that a given page should be displayed on

  getPageSide: function(index) {

      if (0 == (index & 0x1)) {

          return 'R';

      } else {

          return 'L';

      }

  },

  

  setScannedBookParams: function() {

  var book_shortname, thumbnail_param, book_title_param, book_url_param, book_url_text_param, metadata_param;

  

  book_shortname = BookReaderOptions.getBookShortname();

  thumbnail_param = '../_scans/' + book_shortname + '/' + BookReaderOptions.getBookParam("thumbnail");

  BookReaderOptions['thumbnail'] = thumbnail_param;

  book_title_param = BookReaderOptions.getBookParam("bookTitle");

  BookReaderOptions['bookTitle'] = book_title_param;

  book_url_param = '/reader/embedded_bookreader.html?' + book_shortname;

  BookReaderOptions['bookUrl'] = book_url_param;

  book_url_text_param = BookReaderOptions.getBookParam("bookUrlText");

  BookReaderOptions['bookUrlText'] = book_url_text_param;

  metadata_param = BookReaderOptions.getBookParam("metadata");

  BookReaderOptions['metadata'] = metadata_param;

},



  // This function returns the left and right indices for the user-visible

  // spread that contains the given index.  The return values may be

  // null if there is no facing page or the index is invalid.

  getSpreadIndices: function(pindex) {

      var spreadIndices = [null, null];

      if ('rl' == this.pageProgression) {

          // Right to Left

          if (this.getPageSide(pindex) == 'R') {

              spreadIndices[1] = pindex;

              spreadIndices[0] = pindex + 1;

          } else {

              // Given index was LHS

              spreadIndices[0] = pindex;

              spreadIndices[1] = pindex - 1;

          }

      } else {

          // Left to right

          if (this.getPageSide(pindex) == 'L') {

              spreadIndices[0] = pindex;

              spreadIndices[1] = pindex + 1;

          } else {

              // Given index was RHS

              spreadIndices[1] = pindex;

              spreadIndices[0] = pindex - 1;

          }

      }

      return spreadIndices;

  },



  // For a given "accessible page index" return the page number in the book.

  //

  // For example, index 5 might correspond to "Page 1" if there is front matter such

  // as a title page and table of contents.

  getPageNum: function(index) {

      return index+1;

  },



  // Book title and the URL used for the book title link

  bookTitle: '',

  bookUrl: '',

  bookUrlText: '',

  bookUrlTitle: ' ',

  // thumbnail is optional, but it is used in the info dialog

  thumbnail: '',

  // Metadata is optional, but it is used in the info dialog

  metadata: [

   // {label: 'Title', value: ''},

   // {label: 'Author', value: ''},

   // {label: 'Info', value: ''},

  ],

  // This toggles the mobile drawer (not shown in 'embed' mode)

  enableMobileNav: false,

  mobileNavTitle: 'BookReader demo',



  // Override the path used to find UI images

  imagesBaseURL: 'BookReader/images/',



  getEmbedCode: function(frameWidth, frameHeight, viewParams) {

      return "Embed code not supported in bookreader.";

  },



  // Note previously the UI param was used for mobile, but it's going to be responsive

  // embed === iframe



  ui: 'full' // embed, full (responsive)



};



BookReader.prototype.initUIStrings = function() {

    // Navigation handlers will be bound after all UI is in place -- makes moving icons between

    // the toolbar and nav bar easier



    // Setup tooltips -- later we could load these from a file for i18n

    var titles = { '.logo': 'Go to ParsedClassics.com', // $$$ update after getting OL record

                   '.zoom_in': 'Zoom in',

                   '.zoom_out': 'Zoom out',

                   '.rotate': 'Rotate page',

                   '.onepg': 'One-page view',

                   '.twopg': 'Two-page view',

                   '.thumb': 'Thumbnail view',

                   '.print': 'Print this page',

                   '.embed': 'Embed BookReader',

                   '.link': 'Link to this book (and page)',

                   '.bookmark': 'Bookmark this page',

                   '.read': 'Read this book aloud',

                   '.share': 'Share this book',

                   '.info': 'About this book',

                   '.full': 'Show fullscreen',

                   '.book_left': 'Flip left',

                   '.book_right': 'Flip right',

                   '.book_up': 'Page up',

                   '.book_down': 'Page down',

                   '.play': 'Play',

                   '.pause': 'Pause',

                   '.BRdn': 'Show/hide nav bar', // Would have to keep updating on state change to have just "Hide nav bar"

                   '.BRup': 'Show/hide nav bar',

                   '.book_top': 'First page',

                   '.book_bottom': 'Last page'

                  };

    if ('rl' == this.pageProgression) {

        titles['.book_leftmost'] = 'Last page';

        titles['.book_rightmost'] = 'First page';

    } else { // LTR

        titles['.book_leftmost'] = 'First page';

        titles['.book_rightmost'] = 'Last page';

    }



    for (var icon in titles) {

        if (titles.hasOwnProperty(icon)) {

            this.refs.$br.find(icon).prop('title', titles[icon]);

        }

    }

}



// setupTooltips()

// empty function because no js-tooltips needed

//______________________________________________________________________________

BookReader.prototype.setupTooltips = function() {

    return false;

}