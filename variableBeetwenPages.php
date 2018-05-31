<?php
	session_start();
	$booksInCart = $_GET["books"];
	$array=json_decode($booksInCart);
	$_SESSION['booksInCart'] = $array;

	echo json_encode($array);
?>