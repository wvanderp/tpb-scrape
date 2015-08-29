//request is a library for http request
//I use the synchronous version because i can program this shit with async shit
var request = require("sync-request");
var cheerio = require("cheerio");
var fs = require("fs");

//reading setting
console.log("reading settings");
var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

start();

function start() {
  while (true) {
    console.log("getting tasks from server");
    var res = request('GET', settings.apiUrl + "/getId.php");
    var ids = JSON.parse(res.body);

    for (var i = 0; i < ids.length; i++) {
      scrape(ids[i]);
    }
  }
}

function scrape(id) {
  var res = getPage(id);
  var data = null;

  if (res.body !== null) {
    data = gether(res.body, id);

    var comments = getComments(id);
    data.comments = comments;
  } else {
    data = null;
    var resError = request('POST', settings.apiUrl + "/error.php", {
      json: {
        id: id,
        resp: res.code
      }
    });
    console.log(resError.body.toString('utf8'));
    return;
  }

  console.log(data);
  var resSubmit = request('POST', settings.apiUrl + "/submit.php", {
    body: JSON.stringify(data)
  });
  console.log(resSubmit.body.toString('utf8'));
}


function getPage(i) {
  console.log("getting page");
  // console.log(getUserAgent());
  var res = request('GET', settings.tpbUrl + 'torrent/' + i, {
    'headers': {
      'user-agent': getUserAgent()
    }
  });
  console.log(i + ": " + res.statusCode);
  if (res.statusCode == 200) {
    return {
      "body": res.body.toString('utf8'),
      "code": res.statusCode
    };
  } else {
    return {
      "body": null,
      "code": res.statusCode
    };
  }
}


function gether(page, id) {
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


  $("#details dl.col1 dt").each(function() {
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
        size = size.substring(0, size.length - 6);
        // console.log("size: "+size);
        break;
      case "Info:": //info
        info = $(this).next().find("a").attr("href");
        // console.log("info: "+info);
        break;
      case "Spoken language(s):": //language of film
      case "Texted language(s):": //language of text
        language = $(this).next().text();
        // console.log("language: "+language);
        break;
      case "Tag(s):": //tagsLink
        tagsLink = $(this).next().children().each(function(tag) {
          tags.push($(this).text());
        });
        // console.log("tags: "+tags);
        break;
      case "Uploaded:": //date
        date = Date.parse($(this).next().text()).toString();
        date = date.substring(0, date.length - 3);
        // console.log("date: "+date);
        break;
      case "By:": //uploader
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
  });

  $("#details dl.col2 dt").each(function() {
    switch ($(this).text()) {
      case "Type:": //cat
        if (cat === "") {
          cat = $(this).next().find("a").attr("href");
          cat = cat.substring(8);
          // console.log("cat: "+cat);
        }
        break;
      case "Files:": //filesAmount
        if (filesAmount === "") {
          filesAmount = $(this).next().text();
          // console.log("filesAmount: "+filesAmount);
        }
        break;
      case "Size:": //size
        if (size === "") {
          sizeRegex = /(\d+)\sBytes/g;
          size = $(this).next().text().match(sizeRegex)[0];
          size = size.substring(0, size.length - 6);
          // console.log("size: "+size);
        }
        break;
      case "Info:": //info
        if (info === "") {
          info = $(this).next().find("a").attr("href");
          // console.log("info: "+info);
        }
        break;
      case "Spoken language(s):": //language
        if (language === "") {
          language = $(this).next().text();
          // console.log("language: "+language);
        }
        break;
      case "Tag(s):": //tagsLink
        if (tags === "") {
          tagsLink = $(this).next().children().each(function(tag) {
            tags.push($(this).text());
          });
          // console.log("tags: "+tags);
        }
        break;
      case "Uploaded:": //date
        if (date === "") {
          date = Date.parse($(this).next().text()).toString();
          date = date.substring(0, date.length - 3);
          // console.log("date: "+date);
        }
        break;
      case "By:": //uploader
        if (uploader === "") {
          uploader = $(this).next().text();
          // console.log("uploader: "+uploader);
        }
        break;
      case "Seeders:": //seeders
        if (seeders === "") {
          seeders = $(this).next().text();
          // console.log("seeders: "+seeders);
        }
        break;
      case "Leechers:": //Leechers
        if (Leechers === "") {
          Leechers = $(this).next().text();
          // console.log("Leechers: "+Leechers);
        }
        break;
    }
  });

  //TITLE
  title = $("#title").text().replace("\n", "").trim();

  //INFO HASH
  var regexHash = /[A-F\d]{40}/;
  try {
    infohash = $("#details dl.col2").text().match(regexHash)[0];
  } catch (e) {
    console.log(e);
    infohash = $("#details dl.col1").text().match(regexHash)[0];
  }
  // console.log("infohash: "+infohash);

  //description
  description = $(".nfo pre").text();
  // console.log("description: "+description);

  //magnetlink
  if ($("#details dl.col2").text().length < 25) {
    //no second colom
    magnetlink = $(".download a:nth-child(1)").attr("href");
  } else {
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
  };

  return ret;
}

function getCommentsPage(i) {
  console.log("getting comments");
  var res = request('GET', settings.tpbUrl + 'ajax_details_comments.php?id=' + i, {
    'headers': {
      'user-agent': settings.userAgent
    }
  });
  console.log("(comments) " + i + ": " + res.statusCode);
  if (res.statusCode == 200) {
    return {
      "body": res.body.toString('utf8'),
      "code": res.statusCode
    };
  } else {
    return {
      "body": null,
      "code": res.statusCode
    };
  }
}

function getComments(id) {
  var comments = [];

  var res = getCommentsPage(id);
  var page = res.body;

  if (res.body === null) {
    return {};
  }
  // console.log(page);

  $ = cheerio.load(page);
  commentLink = $("div").not(".comment").each(function() {
    var byline = $(this).find(".byline");
    // console.log(byline.text());

    var user = byline.find("a").text();
    // console.log("user: "+user);

    var date = byline.text().substring(user.length + 6, byline.text().length);
    date = date.substring(0, date.length - 6);
    date = Date.parse(date).toString();
    date = date.substring(0, date.length - 3);
    // console.log("date: "+date);

    var text = $(this).find(".comment").text();
    text = text.substring(1, text.length);
    // console.log("text: "+text);

    comments.push({
      "user": user,
      "date": date,
      "text": text
    });
  });
  // console.log(comments);
  return comments;
}

function getUserAgent(){
  var randNum = getRandomInt(0, settings.userAgent.length-1);
  return settings.userAgent[randNum];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
