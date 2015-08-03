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

?>