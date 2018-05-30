<?php
	/**
	 * Oasis bookstore site
	 *
	 * @Author Oleh Yaroshchuk 
	 */

	/**
	 * Functions
	*/

		function addCarouselItem($dom, $parent, $book){
			$carouselItem = $dom->createElement("div");
			$carouselItem->setAttribute('class', 'carousel-item');
			$carouselItem->setAttribute('style', 'background-image:url('.$book['thumbnailUrl'].')');

			$itemInf = $dom->createElement("div");
			$itemInf->setAttribute('class', 'arrival-item-inf grid-center-items');
		    $carouselItem->appendChild($itemInf);

		    $itemTitle = $dom->createElement("h3");
		    $itemTitle->appendChild($dom->createTextNode($book['title'])); 
		    $itemInf->appendChild($itemTitle);

		    $itemAuthor = $dom->createElement("span");
		    $itemAuthor->appendChild($dom->createTextNode($book['author'])); 
		    $itemInf->appendChild($itemAuthor);

		    $itemPrice = $dom->createElement("span");
		    $itemPrice->appendChild($dom->createTextNode($book['price'])); 
		    $itemInf->appendChild($itemPrice);

		    $itemCategories = $dom->createElement("span");
		    $itemCategories->appendChild($dom->createTextNode($book['categories'])); 
		    $itemInf->appendChild($itemCategories);

		    $itemButton = $dom->createElement('input');
			$itemButton->setAttribute('type', 'button');
			$itemButton->setAttribute('name', $book['title']);
			$itemButton->setAttribute('class', 'button');
			$itemButton->setAttribute('value','Add to cart'); 

		    $itemInf->appendChild($itemButton);
			$parent->appendChild($carouselItem);
		}

	/**
	 * Main
	*/

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
		$html = file_get_contents('./shop.html'); echo $html;
		$dom->loadHTML($html);
		libxml_use_internal_errors(false); 
	ob_end_clean();

	session_start();
	//if (!isset($_SESSION['booksInCart'])) {
		$booksInCart = $_SESSION['booksInCart'];
		echo "<script>".$booksInCart."</script>";
//	}

	$recommendCarousel = $dom->getElementById('recommend_carousel');
	$bestsellersCarousel = $dom->getElementById('bestsellers_carousel');
	$arrivesCarousel = $dom->getElementById('arrives_carousel');

    while($row = $result->fetch_assoc()) {
    	switch ($row['specialMark']) {
    		case 'ARRIVALS':
    			addCarouselItem($dom, $arrivesCarousel, $row);
    			break;
    		case 'BESTSELLERS':
    			addCarouselItem($dom, $bestsellersCarousel, $row);
    			break;
    		case 'RECOMMEND':
    			addCarouselItem($dom, $recommendCarousel, $row);
    			break;
    	}
    }

	



	echo $dom->saveHTML();
	$conn->close();
?>
