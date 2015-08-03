<?php
	error_reporting(-1);
	ini_set('display_errors', true);


	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	if (isset($_POST["resp"], $_POST["id"])) {
		$responseCode = $_POST["resp"];
		$id = $_POST["id"];
	}else{
		die("no json found");
	}

	// echo $id." ";
	// echo $responseCode;

	$query = "UPDATE `tpb-scrape`.`scraper` SET `scrape_date` = ".$responseCode." WHERE `scraper`.`id` = ".$id.";";
	mysqli_query($link, $query) or die(mysqli_error($link));

?>