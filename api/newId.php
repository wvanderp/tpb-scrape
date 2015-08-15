<?php
	error_reporting(-1);
	ini_set('display_errors', true);

	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	$json = file_get_contents('php://input');

	if ($json == "" || !isset($json)) {
		die("no json found");
	}

	$data = json_decode($json,true);

	$query = "INSERT INTO `tpb-scrape`.`scraper` VALUES ";
	$i = 0;
	foreach ($data as $id) {
		if ($i !== 0) {
			$query .= ", ";
		}
		$query .= "(".$id.", 0)";
		$i++;
	}
	// echo $query;

	mysqli_query($link, $query) or die(mysqli_error($link));

	echo "new id inserterd";
?>
