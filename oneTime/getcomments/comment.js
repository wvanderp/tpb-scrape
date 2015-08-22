//request is a library for http request
//I use the synchronous version because i can program this shit with async shit
var request = require("sync-request");
var cheerio = require("cheerio");
var fs = require("fs");

//reading setting
console.log("reading settings");
var settings = JSON.parse(fs.readFileSync('../settings.json', 'utf8'));

start();

function start() {
  // var ids	= [11247581,12139270,12064216,9104718];
  var ids = [12201599];
  console.log(ids);
  for (var id in ids) {
    scrape(ids[id]);
  }
}

function scrape(id) {
  var res = getPage(id);
  var page = res.body;
  var comments = getComments(page);

}

function getComments(page) {
  var comments = [];
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
  console.log(comments);
}


function getCommentsPage(i) {
  console.log("getting comments");
  var res = request('GET', 'http://thepiratebay.la/ajax_details_comments.php?id=' + i);
  console.log("(comments)" + i + ": " + res.statusCode);
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
