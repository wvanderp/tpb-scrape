//request is a library for http request
//I use the synchronous version because i can program this shit with async shit
var request = require("sync-request");
var cheerio = require("cheerio");
var fs = require("fs");

//reading setting
console.log("reading settings");
var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

start();

function start () {
	while(true){
		console.log("getting task from server");
		var res = request('GET', settings.apiUrl+"/getId.php");
		var id = res.body.toString('utf8');

		scrape(id);
	}
}

function scrape (id) {
	var res = getPage(id);

	if (res.body != null){
		var data = gether(res.body, id);
	}else{
		var data = null;
		var res = request('POST', settings.apiUrl+"/error.php", {
			json: { 
				id: id,
				resp: res.code
			 }
		});
		console.log(res.body.toString('utf8'));
		return;
	}

	console.log(data);
	var res = request('POST', settings.apiUrl+"/submit.php", {
		body: JSON.stringify(data)
	});
	console.log(res.body.toString('utf8'));
}


function getPage (i) {
	console.log("getting page")
	var res = request('GET', 'https://thepiratebay.mn/torrent/'+i);
	console.log(i+": "+res.statusCode);
	if (res.statusCode == 200) {
		return {"body": res.body.toString('utf8'), "code": res.statusCode};
	}else{
		return {"body": null, "code": res.statusCode};
	}
}

function gether (page, id) {
	console.log("parsing page");
	$ = cheerio.load(page);

	var title = "";
	var cat = "";
	var filesAmount = "";
	var size = "";
	var language = "";
	var tags = [];
	var info = "";
	var date = "";
	var uploader = "";
	var seeders = "";
	var Leechers = "";
	var infohash = "";
	var magnetlink = "";
	var description = "";


	$("#details dl.col1 dt").each(function () {
		switch ($(this).text()) {
			case "Type:": //cat
				cat = $(this).next().find("a").attr("href");
				cat = cat.substring(8);
				// console.log("cat: "+cat);
			break;
			case "Files:": //filesAmount
		   		filesAmount = $(this).next().text();
				// console.log("filesAmount: "+filesAmount);
			break;
			case "Size:": //size
				var sizeRegex = /(\d+)\sBytes/g;
				size = $(this).next().text().match(sizeRegex)[0];
				size = size.substring(0,size.length - 6)
				// console.log("size: "+size);
			break;
			case "Info:": //info
				info = $(this).next().find("a").attr("href");
				// console.log("info: "+info);
			break;
			case "Spoken language(s):": //language
				language = $(this).next().text();
				// console.log("language: "+language);
			break;
			case "Tag(s):": //tagsLink
				tagsLink = $(this).next().children().each(function(tag) {
					tags.push($(this).text());
				});
				// console.log("tags: "+tags);
			break;
			case "Uploaded:":  //date
				date = Date.parse($(this).next().text());
				date = date.substring(0, str.length - 3);
				// console.log("date: "+date);
			break;
			case "By:"://uploader
				uploader = $(this).next().text().trim();
				// console.log("uploader: "+uploader);
			break;
			case "Seeders:": //seeders
				seeders = $(this).next().text();
				// console.log("seeders: "+seeders);
			break;
			case "Leechers:": //Leechers
				Leechers = $(this).next().text();
				// console.log("Leechers: "+Leechers);
			break;
		}
	})

	$("#details dl.col2 dt").each(function () {
		switch ($(this).text()) {
			case "Type:": //cat
				if(typeof cat != "undefined"){
					cat = $(this).next().find("a").attr("href");
					cat = cat.substring(8);
					// console.log("cat: "+cat);
				}
			break;
			case "Files:": //filesAmount
				if(typeof cat != "undefined"){
		   			filesAmount = $(this).next().text();
					// console.log("filesAmount: "+filesAmount);
				}
			break;
			case "Size:": //size
				if(typeof cat != "undefined"){
					sizeRegex = /(\d+)\sBytes/g;
					size = $(this).next().text().match(sizeRegex)[0];
					size = size.substring(0,size.length - 6)
					// console.log("size: "+size);
				}
			break;
			case "Info:": //info
				if(typeof cat != "undefined"){
					info = $(this).next().find("a").attr("href");
					// console.log("info: "+info);
				}
			break;
			case "Spoken language(s):": //language
				if(typeof cat != "undefined"){
					language = $(this).next().text();
					// console.log("language: "+language);
				}
			break;
			case "Tag(s):": //tagsLink
				if(typeof cat != "undefined"){
					tagsLink = $(this).next().children().each(function(tag) {
						tags.push($(this).text());
					});
					// console.log("tags: "+tags);
				}
			break;
			case "Uploaded:":  //date
				if(typeof cat != "undefined"){
					date = Date.parse($(this).next().text());
					date = date.substring(0, str.length - 3);
					// console.log("date: "+date);
				}
			break;
			case "By:"://uploader
				if(typeof cat != "undefined"){
					uploader = $(this).next().text();
					// console.log("uploader: "+uploader);
				}
			break;
			case "Seeders:": //seeders
				if(typeof cat != "undefined"){
					seeders = $(this).next().text();
					// console.log("seeders: "+seeders);
				}
			break;
			case "Leechers:": //Leechers
				if(typeof cat != "undefined"){
					Leechers = $(this).next().text();
					// console.log("Leechers: "+Leechers);
				}
			break;
		}
	})

	//TITLE
	title = $("#title").text().replace("\n", "").trim();

	//INFO HASH
	var regexHash = /[A-F\d]{40}/
	if ($("#details dl.col2").text().length < 25) {
		 infohash = $("#details dl.col1").text().match(regexHash)[0];
	}else{
		 infohash = $("#details dl.col2").text().match(regexHash)[0];
	}
	// console.log("infohash: "+infohash);

	//description
	description = $(".nfo pre").text();
	// console.log("description: "+description);

	//magnetlink	
	if ($("#details dl.col2").text().length < 25) {
		//no second colom
		magnetlink = $(".download a:nth-child(1)").attr("href");
	}else{
		//yes second colom
		magnetlink = $("#details div:nth-child(10) div:nth-child(1) a:nth-child(1)").attr("href");
	}
	// console.log("magnetlink: "+magnetlink);
	
	//RETURN STATMEN
	var ret = {
		"id": id,
		"title": title,
		"cat": cat,
		"filesAmount": filesAmount,
		"size": size,
		"language": language,
		"tags": tags,
		"info": info,
		"date": date,
		"uploader": uploader,
		"seeders": seeders,
		"Leechers": Leechers,
		"infohash": infohash,
		"magnetlink": magnetlink,
		"description": description
	}

	return ret;

}

