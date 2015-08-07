<?php
	error_reporting(-1);
	ini_set('display_errors', true);

	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	$json = file_get_contents('php://input');

	if ($json == "" || !isset($json)) {
		die("no json found");
	}

	$data = json_decode($json,true);

	file_put_contents("../json/".$data["id"].".json", $json) or die("file error");


	$query = "UPDATE `tpb-scrape`.`scraper` SET `scrape_date` = '".time()."' WHERE `scraper`.`id` = ".$data["id"].";";
	mysqli_query($link, $query) or die(mysqli_error($link));

	echo "item received";
?>