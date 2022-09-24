Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.utils.pdf.js');

var PdfDocument = Lourah.utils.pdf.PdfDocument;
var pDoc = new PdfDocument();
pDoc.addObject(new PdfDocument.Record("Catalog", { "/Type": "/Catalog", "/Pages": "&{Pages}" }));
pDoc.addObject(new PdfDocument.Record( "Pages", {"/type": "/Pages", "/MediaBox": "[0, 0, 200, 200]", "/Count": 1, "/Kids": "[&{Page}]"}));
pDoc.addObject(new PdfDocument.Record( "Page", {"/type": "/Page", "/Parent": "&{Pages}", "/Count": 1
	,"Resources": "<< >>"
	,"Content": "{Content}"}));
var pdf = pDoc.generate();
console.log("pdf::" + pdf);
