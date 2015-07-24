//request is a libaray for http request
//I use the synchronous version because i can program this shit with desync crap
var request = require("sync-request");
var cheerio = require("cheerio");
var fs = require("fs");
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tpb-scrape'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end()


function scrape (id) {
	var page = getPage(id);
	if (page != null){
		var data = gether(page, id);
	}else{
		var data = null;
		return;
	}
	fs.writeFileSync("./json/"+id+".json", JSON.stringify(data, null, "\t"), 'utf-8');
	// console.log(data);
}


function getPage (i) {
	var res = request('GET', 'https://thepiratebay.mn/torrent/'+i);
	console.log(i+": "+res.statusCode);
	if (res.statusCode == 200) {
		return res.body;
	}else{
		return null;
	}
}

function gether (page, id) {
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
		var discription = "";


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
				console.log($(this).next().text());
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
					console.log("cat: "+cat);
				}
			break;
			case "Files:": //filesAmount
				if(typeof cat != "undefined"){
		   			filesAmount = $(this).next().text();
					console.log("filesAmount: "+filesAmount);
				}
			break;
			case "Size:": //size
				if(typeof cat != "undefined"){
					sizeRegex = /(\d+)\sBytes/g;
					size = $(this).next().text().match(sizeRegex)[0];
					size = size.substring(0,size.length - 6)
					console.log("size: "+size);
				}
			break;
			case "Info:": //info
				if(typeof cat != "undefined"){
					info = $(this).next().find("a").attr("href");
					console.log("info: "+info);
				}
			break;
			case "Spoken language(s):": //language
				if(typeof cat != "undefined"){
					language = $(this).next().text();
					console.log("language: "+language);
				}
			break;
			case "Tag(s):": //tagsLink
				if(typeof cat != "undefined"){
					tagsLink = $(this).next().children().each(function(tag) {
						tags.push($(this).text());
					});
					console.log("tags: "+tags);
				}
			break;
			case "Uploaded:":  //date
				if(typeof cat != "undefined"){
					date = Date.parse($(this).next().text());
					console.log("date: "+date);
				}
			break;
			case "By:"://uploader
				if(typeof cat != "undefined"){
					uploader = $(this).next().text();
					console.log("uploader: "+uploader);
				}
			break;
			case "Seeders:": //seeders
				if(typeof cat != "undefined"){
					seeders = $(this).next().text();
					console.log("seeders: "+seeders);
				}
			break;
			case "Leechers:": //Leechers
				if(typeof cat != "undefined"){
					Leechers = $(this).next().text();
					console.log("Leechers: "+Leechers);
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

	//discription
	discription = $(".nfo pre").text();
	// console.log("discription: "+discription);

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
		"discription": discription
	}

	return ret;

}