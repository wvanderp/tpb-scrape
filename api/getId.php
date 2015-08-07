<?php
	error_reporting(-1);
	ini_set('display_errors', true);
	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	$query = "SELECT count(*) as count FROM `scraper` WHERE `scrape_date` = 0";
	$resp = mysqli_query($link, $query) or die(mysqli_error($link));
	$arr = mysqli_fetch_assoc($resp);
	// var_dump($arr);

	if ($arr["count"] != 0) {
		$rand = rand(3211594, 12155276);
		$query = "SELECT * FROM `scraper` WHERE `scrape_date` = 0 AND `id` > ".$rand." LIMIT 1";
		
		$resp = mysqli_query($link, $query) or die(mysqli_error($link));
		$arr = mysqli_fetch_assoc($resp);

		echo $arr["id"];
	}	
?>