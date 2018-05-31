<?php
	session_start();
	if (isset($_SESSION['booksInCart'])) {
		$booksInCart = $_SESSION['booksInCart'];
		echo json_encode($booksInCart);
	}
?>