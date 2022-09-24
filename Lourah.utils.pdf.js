var Lourah = Lourah || {};
(function () {
	Lourah.utils = Lourah.utils || {};
	Lourah.utils.pdf = Lourah.utils.pdf || {};

	function PdfSource() {
		var source = "";
		var offset = 0;
		this.write = (content) => {
			var at = offset;
			source += content;
			offset += content.length;
			return at;
		}

		this.toString = () => {
			return source;
		}
	}


	PdfDocument.Stream = function() {
		var stream = [];
		this.add = (command) => stream.push(command);
		this.toString = () => {
			var s = "";
			if (stream.length > 0) {
				s += "stream\n";
				s += stream.join('\n');
				s += "endstream\n";
			}
			return s;
		}
		
	}

	var names = {};
	
	PdfDocument.Record = function(name, record, stream) {
		names[name] = {name:name, record:this, ref:"" + (Object.keys(names).length + 1) + " 0 R"};
		this.toString = () => {
			var s = "<<\n";
			Object.keys(record).forEach(key => {
				var value = record[key];
				var match = String(record[key]).match(/&\{(.*)\}/);
				if (match !== null) {
					value = names[match[1]].ref;
				}
				s += key + " " + value + "\n";
			});
			if (stream) s+=stream;
			s += ">>\n";
			console.log("s::" + s);
			return s;
		}
	}
	

	function PdfDocument() {
		var header = "%PDF-1.7\n";
		var offsetFrame = "0".repeat(10);
		var pdfSource;

		var objects = [];
		this.addObject = (object) => {
			objects.push({object:object, offset:-1});
		}

		this.generate = () => {
			var pdf = new PdfSource();;
			var oBody = pdf.write(header);
			objects.forEach((object, index) => {
				object.offset = pdf.write(
					"" + (index + 1) + " 0 obj " + object.object + " endobj\n"
				);
			});
			var oXref = pdf.write("xref\n0 " + (objects.length + 1) + "\n");
			pdf.write(offsetFrame + " 65535 f\n");
			objects.forEach((object) => {
				pdf.write(String(object.offset).padStart(10, '0') + " 00000 n\n");
			});
			pdf.write("trailer\n<< /Size " + objects.length + " /Root 1 0 R >>\n");
			pdf.write("startxref\n" + oXref + "\n%%EOF\n");
			pdfSource = pdf;;
			return pdf;
		}

		this.getPdfSource = () => pdfSource;

	}
	Lourah.utils.pdf.PdfDocument = PdfDocument;
})();
