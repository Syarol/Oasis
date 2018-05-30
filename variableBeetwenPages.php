<?php
	session_start();
	$booksInCart = $_GET["books"];
	$array=json_decode($booksInCart);
	$_SESSION['booksInCart'] = $array;

	//echo '<script>'.json_encode($array).'</script>';
	echo json_encode($array);
	/*	if(isset($_POST["books"]))
	{
	}*/

	//echo json_encode($array);

	//On page 2
	//$var_value = $_COOKIE['varname'];
?>