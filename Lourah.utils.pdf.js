var Lourah = Lourah || {};
(function () {
	Lourah.utils = Lourah.utils || {};
	Lourah.utils.pdf = Lourah.utils.pdf || {};

	function PdfSource() {
		var source = "";
		var offset = 3;
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
		this.add = (command) => {
			stream.push(command);
			return this
		}
		this.getLength = () => stream.join('\n').length; // + 1;
		this.toString = () => {
			var s = "";
			if (stream.length > 0) {
				s += "stream\n";
				s += stream.join('\n');
				s += "\nendstream\n";
			}
			return s;
		}
		
	}

	var names = {};
	
	PdfDocument.Record = function(name, record, stream) {
		names[name] = {name:name, record:this, ref:"" + (Object.keys(names).length + 1) + " 0 R"};
		this.toString = () => {
			var s = "<<";
			Object.keys(record).forEach(key => {
				var value = record[key];
				var match = String(record[key]).match(/(.*)&\{(.*)\}(.*)/);
				if (match !== null) {
					if (!names[match[2]]) throw "PdfDocument.Record::" + "No object ref in <" + value + ">";
					value = match[1] + names[match[2]].ref + match[3];
				}
				if (value === "/Length") {
					value = stream.getLength();
				}
				s += "     " + key + " " + value + "\n";
			});
			s += ">>\n";
			if (stream) s+=stream;
			return s;
		}
	}
	

	function PdfDocument() {
		var header = "%PDF-1.4\n%¥±ë\n\n";
		var offsetFrame = "0".repeat(10);
		var pdfSource;

		var objects = [];
		this.addObject = (object) => {
			objects.push({object:object, offset:-1});
		}

		this.setHeader = (h) => {
			header = h;
		}

		this.generate = () => {
			var pdf = new PdfSource();;
			var oBody = pdf.write(header);
			objects.forEach((object, index) => {
				object.offset = pdf.write(
					"" + (index + 1) + " 0 obj\n" + object.object + "endobj\n\n"
				);
			});
			var oXref = pdf.write("xref\n0 " + (objects.length + 1) + "\n");
			pdf.write(offsetFrame + " 65535 f \n");
			objects.forEach((object) => {
				pdf.write(String(object.offset).padStart(10, '0') + " 00000 n \n");
			});
			pdf.write("trailer\n<< /Root 1 0 R\n /Size " + (objects.length + 1) + "\n>>\n");
			pdf.write("startxref\n" + oXref + "\n%%EOF\n");
			pdfSource = pdf;;
			return pdf;
		}

		this.getPdfSource = () => pdfSource;

	}

	Lourah.utils.pdf.PdfDocument = PdfDocument;
})();
