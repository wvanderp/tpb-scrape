

<?php
	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape");

	if (isset($_POST["json"])) {
		$json = $_POST["json"];
	}else{
		die();
	}

	$data = json_decode($json);

	$responseCode = $data["resp"];
	$id = $data["id"];

	$query = "UPDATE `tpb-scrape`.`scraper` SET `scrape_date` = ".$responseCode." WHERE `scraper`.`id` = ".$id.";";
	
?>