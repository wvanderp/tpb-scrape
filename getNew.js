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
  var res = getPage();
  var ids = [];

  if (res.body !== null) {
    ids = gether(res.body);

    var resSubmit = request('POST', settings.apiUrl + "/newId.php", {
      body: JSON.stringify(ids)
    });
    console.log(resSubmit.body.toString('utf8'));
  } else {
    console.log("the pirate bay offline");
    return;
  }
}

function gether(page) {
  console.log("gethering");
  $ = cheerio.load(page);
  var ids = [];
  $("tr").each(function(tag) {
    var url = $(this).find("td:nth-child(2) div a").attr("href");
    if (typeof url == 'undefined') {
      return;
    }
    var urlParts = url.split("/");
    ids.push(urlParts[2]);
  });
  return ids;
}

function getPage() {
  console.log("getting page");
  var res = request('GET', 'https://thepiratebay.gd/recent');
  console.log("recent: " + res.statusCode);
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
