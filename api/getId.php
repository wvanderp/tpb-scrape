<?php
	$link = mysqli_connect("localhost", "root", "root", "tpb-scrape");

	$query = "SELECT count(*) as count FROM `scraper` WHERE `scrape_date` = 0";
	$resp = mysqli_query($link, $query);
	$arr = mysqli_fetch_assoc($resp);

	if ($arr["count"] == 0) {
		$rand = rand(3211594, 12155276);
		$query = "SELECT * FROM `scraper` WHERE `scrape_date` = 0 AND `id` > ".$rand." LIMIT 1";
		
		$resp = mysqli_query($link, $query);
		$arr = mysqli_fetch_assoc($resp);

		echo $arr["id"];
	}	
?>