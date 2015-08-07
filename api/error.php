<?php
	error_reporting(-1);
	ini_set('display_errors', true);

	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	$json = file_get_contents('php://input');

	if ($json == "" || !isset($json)) {
		die("no json found");
	}

	$data = json_decode($json, true);
	// var_dump($data);
	$responseCode = $data["resp"];
	$id = $data["id"];

	$query = "UPDATE `tpb-scrape`.`scraper` SET `scrape_date` = ".$responseCode." WHERE `scraper`.`id` = ".$id.";";
	mysqli_query($link, $query) or die(mysqli_error($link));
	
	echo "error received";
?>
