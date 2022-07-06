function loadLexic(game) {
	var System = java.lang.System;

	function string2Path(string, path) {
		var writer = null;
		try {
			writer = new java.io.BufferedWriter(new java.io.OutputStreamWriter(
				new java.io.FileOutputStream(path), "utf-8"));
			writer.write(string);
		} catch (e) {
			// Report
			Activity.reportError("string2Path::" + path + "::" + e + "::" + e.stack);
		} finally {
			try {writer.close();} catch (e) {/*ignore*/}
		}
	}


	function loadLexicTxt() {
		log("txt::load::" + game.lexic.path.txt);
		var start = System.currentTimeMillis();
		game.lexic.words = (new String(Activity.path2String(game.lexic.path.txt)))
			.split("\n");

		var top = System.currentTimeMillis();
		log("LoadLexic::" + game.lexic.path.txt + "::" + (top - start) + " ms");
		start = System.currentTimeMillis();


		for(var i = 0; i < game.lexic.words.length; i++) {
			var key = game.lexic.words[i].split('').sort().join('');
			if (!game.lexic.atoms[key]) game.lexic.atoms[key] = i.toString(36);
			else game.lexic.atoms[key] += "," + i.toString(36);
		}


		//Activity.reportError("ods::" + JSON.stringify(atoms));

		//Activity.reportError("done::" + Object.keys(atoms).length);
		top = System.currentTimeMillis();
		log("txt::done::" + (top - start) + " ms");
		log("txt::atoms::" + Object.keys(game.lexic.atoms).length);
		log("txt::words::" + game.lexic.words.length);


		try {
			start = System.currentTimeMillis();
			var json = JSON.stringify(game.lexic);
			top = System.currentTimeMillis();
			log("txt::json::generate::" + (top - start) + " ms");
			log("txt::json::size::" + json.length);
		} catch(e) {
			log("txt::json::error::" + e + "::" + e.stack);
			return;
		}

		start = System.currentTimeMillis();
		string2Path(json, game.lexic.path.json);
		top = System.currentTimeMillis();
		log("txt::json::saved::" + (top - start) + " ms");


	}

	function loadLexicJson() {
		log("json::load::" + game.lexic.path.json);
		start = System.currentTimeMillis();
		game.lexic = JSON.parse(Activity.path2String(game.lexic.path.json));
		top = System.currentTimeMillis();
		log("json::done::" + (top - start) + " ms");
		log("json::atoms::" + Object.keys(game.lexic.atoms).length);
		log("json::words::" + game.lexic.words.length);
	}

	var json = new java.io.File(game.lexic.path.json);

	if (json.isFile() && json.canRead()) {
		loadLexicJson();
	}
	else {
		loadLexicTxt();
	}
}

