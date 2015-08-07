var fs = require("fs");
var mysql = require('mysql');

var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
var dbSql = fs.readFileSync('sql/tpb-scrape.sql', 'utf8');


var connection = mysql.createConnection({
  host     : settings.hostname,
  user     : settings.username,
  password : settings.password,
  database : settings.database
});

connection.connect();
console.log("start")
console.log("checking database");
connection.query(dbSql, function(err, rows, fields) {if (err) throw err;});
console.log("database is good.");
console.log("table inserted");

console.log("adding id's");
next(settings.start_id);
var startDate = Date.now();

function next (i) {
	if(i >= settings.end_id){
		console.log("last id "+ settings.end_id);
		var endDate = Date.now();

		var time = endDate - startDate;
		console.log("it took "+time+" seconds")
		connection.end()
		return
	}

	console.log(i);
	connection.query("INSERT INTO `tpb-scrape`.`scraper` (`id`, `scrape_date`) VALUES ('"+i+"', '0');", function(err, rows, fields) {
	  if (err) throw err;
	  next(i+1);
	});

}

