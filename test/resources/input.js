var input = document.getElementById("fileInput"),
    file,
    format,
    reader = new FileReader();

input.addEventListener("change", readAndSniff, false);

function readAndSniff () {
  file = input.files[0];

  reader.readAsArrayBuffer(magicSniffer.sliceBlob(file, 0, 128 * 1024));
  reader.onload = function (){
    var dataView = new jDataView(reader.result);
    format = magicSniffer.sniffFormat(dataView);
  };

}
