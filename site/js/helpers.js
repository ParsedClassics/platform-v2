/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Éleuthère Ioannidis
=====================================================
*/

const ParsedClassicsSiteHelpers = {

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

  generateUID: function () {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    // from https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  },

};