<?php
    $conn  = new mysqli("oasis", "root", "", "Oasis");
    if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$sql = "SELECT * FROM Catalog";
	$result = $conn->query($sql);

	$neededTitle =  $_GET['title'];
	while($row = $result->fetch_assoc()) {
		if ($neededTitle == $row['title']) {
			echo json_encode($row);
		}
	}
?>