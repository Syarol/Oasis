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
			$carouselItem->setAttribute('class', 'arrival-item carousel-item');
			$carouselItem->setAttribute('style', 'background-image:url('.$book['thumbnailUrl'].')');

			$itemInf = $dom->createElement("div");
			$itemInf->setAttribute('class', 'arrival-item-inf grid-center-items');
		    $carouselItem->appendChild($itemInf);

		    $itemTitle = $dom->createElement("h3");
		    $itemTitle->appendChild($dom->createTextNode($book['title'])); 
		    $itemInf->appendChild($itemTitle);

		    $itemAuthor = $dom->createElement("span");
		    $itemAuthor->appendChild($dom->createTextNode("by ".$book['author'])); 
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

			return $carouselItem;
		}

		function carouselItemWithLabel($dom, $parent, $book){
			$item = addCarouselItem($dom, $parent, $book);

			$label = $dom->createElement('span');
			$label->setAttribute('class', 'on-sale');
			$label->appendChild($dom->createTextNode('SALE!'));
			$item->appendChild($label);
		}

		function addBestsellerPreviev($dom, $parent, $book){
			$photo = $dom->createElement('div');
			$photo->setAttribute('class', 'book-photo-container center-cover-no-repeat');
			$photo->setAttribute('style', 'background-image:url('.$book['thumbnailUrl'].')');
			$parent->appendChild($photo);

			$text = $dom->createElement('span');
			$text->setAttribute('class', 'text-container');
			$text->appendChild($dom->createTextNode($book['shortDescription']));
			$parent->appendChild($text);

			$button = $dom->createElement('span');
			$button->setAttribute('id', 'open_bestseller_modal');
			$button->setAttribute('class', 'button grid-center-items');
			$button->appendChild($dom->createTextNode('Quick view'));
			$parent->appendChild($button);			
		}

		function addBestSellerModal($dom, $parent, $book){
			$title = $dom->createElement('h3');
			$title->appendChild($dom->createTextNode($book['title']));
			$parent->appendChild($title);

			$photo = $dom->createElement('img');
			$photo->setAttribute('src', $book['thumbnailUrl']);
			$photo->setAttribute('class', 'modal-photo');
			$parent->appendChild($photo);

			$author = $dom->createElement('span');
			$author->setAttribute('class', 'author');
			$author->appendChild($dom->createTextNode("by ".$book['author']));
			$parent->appendChild($author);

			$categories = $dom->createElement('span');
			$categories->setAttribute('class', 'category');
			$categories->appendChild($dom->createTextNode($book['categories']));
			$parent->appendChild($categories);

			$description = $dom->createElement('span');
			$description->setAttribute('class', 'text-container');
			$description->appendChild($dom->createTextNode($book['description']));
			$parent->appendChild($description);

			$description = $dom->createElement('span');
			$description->setAttribute('class', 'price');
			$description->appendChild($dom->createTextNode($book['price']));
				$button = $dom->createElement('input');
				$button->setAttribute('type', 'button');
				$button->setAttribute('name', $book['title']);
				$button->setAttribute('class', 'button');
				$button->setAttribute('value','Add to cart');
				$description->appendChild($button);
			$parent->appendChild($description);
		}

		function addCategoriesList($dom, $parent, $conn){
			$sql = "SELECT categories FROM Catalog";
			$result = $conn->query($sql);
			$categoriesArray = [];
			while($row = $result->fetch_assoc()) {
				$arr = explode(',', $row['categories']);
				foreach ($arr as $word) {
		    		$word = trim($word);
		    		if (!in_array($word, $categoriesArray)) {
						$categoriesArray[] = $word;
		    		}
		    	}
			}
			sort($categoriesArray);

			for ($i=0; $i < count($categoriesArray); $i++) { 
			    $category = $dom->createElement("option");
				$category->appendChild($dom->createTextNode($categoriesArray[$i])); 
				$parent->appendChild($category);		
			}
		}


	/**
	 * Main
	*/

	session_start();
	if (!isset($_SESSION['booksInCart'])) {
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
		$html = file_get_contents('./index.html'); echo $html;
		$dom->loadHTML($html);
		libxml_use_internal_errors(false); 
	ob_end_clean();

	$newArrivalCarousel = $dom->getElementById('new_arrival_list');
	$bestsellerPreview = $dom->getElementById('bestseller_preview');
	$bestsellerModal = $dom->getElementById('bestseller_modal');
	$exclusivesContainer = $dom->getElementById('exclusives_container');
	$categorySelect = $dom->getElementById('category-select');

    while($row = $result->fetch_assoc()) {
    	switch ($row['specialMark']) {
    		case 'ARRIVALS':
    			addCarouselItem($dom, $newArrivalCarousel, $row);
    			break;
    		case 'BESTSELLER':
    			addBestsellerPreviev($dom, $bestsellerPreview, $row);
    			addBestSellerModal($dom, $bestsellerModal, $row);
    			break;
    		case 'EXCLUSIVE':
    			carouselItemWithLabel($dom, $exclusivesContainer, $row);
    			break;
    	}
    }

	addCategoriesList($dom, $categorySelect, $conn);



	echo $dom->saveHTML();
	$conn->close();
?>
