<?php
	error_reporting(-1);
	ini_set('display_errors', true);

	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	$rand = rand(3211594, 12155276);
	$query = "SELECT id FROM `scraper` WHERE `scrape_date` = 0 AND `id` >= ".$rand." LIMIT 10";
		
	$resp = mysqli_query($link, $query) or die(mysqli_error($link));
	$arr = mysqli_fetch_assoc($resp);

	$arr = array();
	
	while ($row = mysqli_fetch_assoc($resp)) {
		$arr[] = $row["id"];
	}

	// var_dump($arr);
	echo json_encode($arr);
?>