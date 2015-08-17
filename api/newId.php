<?php
	//this script is used for inserting new ids in the datebase.
	//it expects a json array in the body of a post request.
	error_reporting(-1);
	ini_set('display_errors', true);

	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	$json = file_get_contents('php://input');

	if ($json == "" || !isset($json)) {
		die("no json found");
	}

	$data = json_decode($json,true);

	$query = "INSERT IGNORE INTO `tpb-scrape`.`scraper` VALUES ";
	$i = 0;
	foreach ($data as $id) {
		if ($i !== 0) {
			$query .= ", ";
		}
		$query .= "(".$id.", 0)";
		$i++;
	}
	// $query .= " ON DUPLICATE KEY UPDATE"
	// echo $query;

	mysqli_query($link, $query) or die(mysqli_error($link));

	echo "added ".mysqli_affected_rows($link)." new ids";
?>
