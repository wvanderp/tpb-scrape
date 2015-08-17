var request = require("sync-request");

var lastId = 12237601;
var newstId = 12242724;
var query = [];

for (var i = lastId; i <= newstId; i++) {
  // console.log(i);
  query.push(i);
}

var resSubmit = request('POST', "http://tpb.cwms.cc/tpb-scrape/api/newId.php", {
  body: JSON.stringify(query)
});
console.log(resSubmit.body.toString('utf8'));
// console.log(query);
