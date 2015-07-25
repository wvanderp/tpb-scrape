//request is a libaray for http request
//I use the synchronous version because i can program this shit with desync crap
var request = require("sync-request");
var cheerio = require("cheerio");
var fs = require("fs");

var ids = [
	// 11761303,
	// 11761304,
	// 11959777,
	11974122,
	7070953,
	11150430
]

// for (var i = 3211594; i < 11705724 ; i++) {
for (i in ids){
	var id = ids[i];
	var page = getPage(id);
	if (page != null){
		var data = prosses(page);
	}else{
		var data = null;
	}
	fs.writeFileSync("./json/"+data.id+".json", JSON.stringify(data, null, "\t"), 'utf-8');
	// console.log(data);
};

function getPage (i) {
	var res = request('GET', 'https://thepiratebay.mn/torrent/'+i);
	console.log(i+": "+res.statusCode);
	if (res.statusCode == 200) {
		return res.body;
	}else{
		return null;
	}
}

function prosses (page) {
	$ = cheerio.load(page);
	if($("#details dl.col2").text().length < 50){
		console.log("old page");
		return oldGether($);
	}else{
		console.log("new page");
		return gether($);
	}
	
}


function gether ($) {
	//title of the torrent
	var title = $("#title").text().replace("\n", "").trim();

	//category of the torrent
	var cat = $("#details dl.col1 dd:nth-child(2) a").attr("href");
	cat = cat.substring(8);

	//Amount of files in torrent
	var filesAmount = $("#details dl.col1 dd:nth-child(4) a").text();
	
	//size of the torrent
	var sizeRegex = /(\d+)\sBytes/g;
	var size = $("#details dl.col1 dd:nth-child(6)").text().match(sizeRegex)[0];
	size = size.substring(0,size.length - 6)

	//language of the torrent
	var language = $("#details dl.col1 dd:nth-child(10)").text();

	//tags for the torrent.
	var tags = [];
	var tagsLink = $("#details dl.col1 dd:nth-child(12)").children().each(function(tag) {
		tags.push($(this).text());
	});

	//torrent info
	var info = $("#details dl.col1 dd:nth-child(8) a").attr("href");

	//time of upload
	//needs prossesing
	var date = Date.parse($("#details dl.col2 dd:nth-child(2)").text());

	//uploader of the torrent
	var uploader = $("#details dl.col2 dd:nth-child(4) a").text();

	//seeders of the torrent
	var seeders = $("#details dl.col2 dd:nth-child(6)").text();

	//Leechers of the torrent
	var Leechers = $("#details dl.col2 dd:nth-child(8)").text();

	//infohash
	var regexHash = /[A-F\d]{40}/
	try{
		var infohash = $("#details dl.col2").text().match(regexHash)[0];
	}catch(err){
		console.log(err);
		console.log($("#details dl.col2").text());
	}

	//magnetlink
	var magnetlink = $("#details div:nth-child(10) div:nth-child(1) a:nth-child(1)").attr("href");

	//discription
	var discription = $("#details div:nth-child(10) div.nfo pre").text();

	var comments = [];
	var commentsDiv = $("#comments").children().each(function() {
		var commentUser = $(this).find("p a").text();
		//needs some filtering
		var datum = $(this).find("p").text().split("at")[1].replace(":\n", "");
		// console.log(datum)
		var commentDate = Date.parse(datum);
		var comment = $(this).find("div").text();
		comments.push({
			"user": commentUser,
			"date": commentDate,
			"comment": comment
		});
	});

	// console.log(comments);

	return {
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
		"discription": discription,
		"comments": comments,
	}
}

function oldGether ($) {
	//title of the torrent
	var title = $("#title").text().replace("\n", "").trim();

	//category of the torrent
	var cat = $("#details dl.col1 dd:nth-child(2) a").attr("href");
	cat = cat.substring(8);

	//Amount of files in torrent
	var filesAmount = $("#details dl.col1 dd:nth-child(4) a").text();
	
	//size of the torrent
	var sizeRegex = /(\d+)\sBytes/g;
	var size = $("#details dl.col1 dd:nth-child(6)").text().match(sizeRegex)[0];
	size = size.substring(0,size.length - 6)
	// console.log( $("#details dl.col1 dd:nth-child(6)").text())

	//language of the torrent
	var language = $("#details dl.col1 dd:nth-child(10)").text();

	//tags for the torrent.
	var tags = [];
	// console.log($("#details dl.col1 dd:nth-child(9)").text());
	var tagsLink = $("#details dl.col1 dd:nth-child(9)").children().each(function(tag) {
		console.log($(this).text());
		tags.push($(this).text());
	});
	console.log(tags);
	//torrent info
	var info = $("#details dl.col1 dd:nth-child(8) a").attr("href");

	//time of upload
	//needs prossesing
	var date = Date.parse($("#details dl.col2 dd:nth-child(2)").text());

	//uploader of the torrent
	var uploader = $("#details dl.col2 dd:nth-child(4) a").text();

	//seeders of the torrent
	var seeders = $("#details dl.col2 dd:nth-child(6)").text();

	//Leechers of the torrent
	var Leechers = $("#details dl.col2 dd:nth-child(8)").text();

	//infohash
	var regexHash = /[A-F\d]{40}/
	try{
		var infohash = $("#details dl.col2").text().match(regexHash)[0];
	}catch(err){
		// console.log(err);
		console.log($("#details dl.col2").text());
	}

	//magnetlink
	var magnetlink = $("#details div:nth-child(9) div:nth-child(1) a:nth-child(1)").attr("href");

	//discription
	var discription = $("#details div:nth-child(10) div.nfo pre").text();

	var comments = [];
	var commentsDiv = $("#comments").children().each(function() {
		var commentUser = $(this).find("p a").text();
		//needs some filtering
		// var datum = $(this).find("p").text().split("at")[1].replace(":\n", "");
		// console.log(datum)
		// var commentDate = Date.parse(datum);
		var comment = $(this).find("div").text();
		comments.push({
			"user": commentUser,
			// "date": commentDate,
			"comment": comment
		});
	});

	// console.log(comments);

	return {
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
		"discription": discription,
		"comments": comments,
	}
}