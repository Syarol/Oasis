<?php
	 $conn  = new mysqli("oasis", "root", "", "Oasis");
    if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$message = $_GET["message"];
	$array=json_decode($message);

	$sql = "INSERT INTO Contact (name, email, subject, message)	VALUES ('$array->name', '$array->email', '$array->subject', '$array->message')";
	if ($conn->query($sql) === TRUE) {
	    echo "New record created successfully";
	} else {
	    echo "Error: " . $sql . "<br>" . $conn->error;
	}

	$conn->close();
?>
