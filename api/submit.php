<?php
	error_reporting(-1);
	ini_set('display_errors', true);

	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape") or die(mysqli_error($link));

	if (isset($_POST["json"])) {
		$json = $_POST["json"];
	}else{
		die("no json found");
	}

	if(!file_exists("../json/")){
		mkdir("../json/");
		echo "making dir";
	}

	$data = json_decode($json,true);

	// var_dump($data);

	file_put_contents("../json/".$data["id"].".json", $json);


	$query = "UPDATE `tpb-scrape`.`scraper` SET `scrape_date` = '".time()."' WHERE `scraper`.`id` = ".$data["id"].";";
	mysqli_query($link, $query) or die(mysqli_error($link));
?>