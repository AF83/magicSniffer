// beware of https://developer.mozilla.org/en/docs/Web/API/Blob//Notes_on_the_slice%28%29_implementations
// The difference of implementation of slice will become an issue if
// you want to slice with an offset (ie start != 0)

// magic number for file formats
var magicNumbers = {
  // also known as 0xffd8ff, or ÿØÿ (latin-1 and utf8)
  jpg: [255, 216, 255],
  // also known as 0x89504e47, or .PNG
  png: [137, 80, 78, 71],
  // also known as 0x424d, or BM
  bmp: [66, 77],
  // also known as 0x47494638, or GIF8 (the 2 standards being GIF87a and GIF89a)
  gif: [71, 73, 70, 56],
  // also known as 0x4d4d002a
  tifBigEndian: [77, 77, 0, 42],
  // or 0x49492a00
  tifLittleEndian: [73, 73, 42, 0],
  // also known as 0x38425053, or 8BPS
  psd: [56, 66, 80, 83]
};


// Set up according to the environment (AMD, Node.js or CommonJS, or
// browser global). Inspired by backbonejs.
!function (root, factory){

  if (typeof define === 'function' && define.amd) {
    define([], function() {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.magicSniffer = factory(root, exports);
    });
    // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    factory(root, exports);
    // Finally, as a browser global.
  } else {
    root.magicSniffer = factory(root, {});
  }

}(this, function(root, magicSniffer) {
  return {

    sliceBlob: function(blob, start, end, type){
      var trueSlice = blob.slice || blob.mozSlice || blob.webkitSlice;
      return trueSlice.call(blob, start, end);
    },

    // dataView object returned by given by jDataView
    sniffFormat: function(dataView) {
      // look at http://www.htmlgoodies.com/html5/tutorials/determine-an-images-type-using-the-javascript-filereader.html//fbid=Qyi5YQZ-XRT
      //check whether the jpg are little or big endians
      var format, magic, i, match;

      for(format in magicNumbers){
        magic = magicNumbers[format];
        match = true;

        try {
          for(i=0; i<magic.length; i++){
            match = match && magic[i] === dataView.getUint8(i);
          }
        } catch (e) {
          match = false;
        }

        if(match) return format;
      }

      // if we could not sniff it...
      return 'unknown';
    }
  };
});
