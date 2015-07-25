var fs = require("fs");
var mysql = require('mysql');

var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

var connection = mysql.createConnection({
  host     : settings.hostname,
  user     : settings.username,
  password : settings.password,
  database : settings.database
});

connection.connect();
console.log("start")
next(1);


function next (i) {
	if(i >= settings.end_id){
		console.log("last id "+ settings.end_id);
		connection.end()
		return
	}

	console.log(i);
	connection.query("INSERT INTO `tpb-scrape`.`scraper` (`id`, `scrape_date`) VALUES ('"+i+"', '0');", function(err, rows, fields) {
	  if (err) throw err;
	  next(i+1);
	});

}

