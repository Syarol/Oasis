<?php
	session_start();
	if (isset($_SESSION['booksInCart'])) {
		$booksInCart = $_SESSION['booksInCart'];
	}

    $conn  = new mysqli("oasis", "root", "", "Oasis");
    if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$sql = "SELECT * FROM Catalog";
	$result = $conn->query($sql);

	ob_start();
		libxml_use_internal_errors(true);
		$dom = new DOMDocument;
		$dom->validateOnParse = true; 
		$dom->preserveWhiteSpace = false;
		$html = file_get_contents('./blog.html'); echo $html;
		$dom->loadHTML($html);
		libxml_use_internal_errors(false); 
	ob_end_clean();



	echo $dom->saveHTML();
	$conn->close();
?>