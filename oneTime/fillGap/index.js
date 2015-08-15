var request = require("sync-request");

var lastId = 12155275;
var newstId = 12237167;
var query = [];

for (var i = lastId; i <= newstId; i++) {
  // console.log(i);
  query.push(i);
}

var resSubmit = request('POST', settings.apiUrl + "/newId.php", {
  body: JSON.stringify(query)
});
console.log(resSubmit.body.toString('utf8'));
// console.log(query);
