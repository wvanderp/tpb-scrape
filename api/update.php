<?php
	//this script is used to get id for items that need updating
	// for example json files made with a old version of the script.
	error_reporting(-1);
	ini_set('display_errors', true);

	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	$rand = rand(3211596, 9720658);
	$query = "SELECT * from scraper where scrape_date = 4 AND id > ".$rand."ASC limit 10";

	$resp = mysqli_query($link, $query) or die(mysqli_error($link));
	$arr = mysqli_fetch_assoc($resp);

	$arr = array();

	while ($row = mysqli_fetch_assoc($resp)) {
		$arr[] = $row["id"];
	}

	// var_dump($arr);
	echo json_encode($arr);
?>
