<?php
	/**
	 * Oasis bookstore site
	 *
	 * @Author Oleh Yaroshchuk 
	 * 
	 */

	/**
	 * Functions
	*/

	function searchFull($dom, $conn, $query){
		$min_length = 3;
	    if(strlen($query) >= $min_length){ 
	        $query = htmlspecialchars($query); 
	        $query = $conn->real_escape_string($query);
	        $raw_results = $conn->query("SELECT * FROM Catalog WHERE (`title` LIKE '%".$query."%') OR (`author` LIKE '%".$query."%') OR (`description` LIKE '%".$query."%') OR (`categories` LIKE '%".$query."%')") or die($conn->error);
	        if($raw_results->num_rows > 0){ 
	            while($results = $raw_results->fetch_array()){
	                addFoundedItem($dom, $results);
	            }
	        }
	        else{ 
	            echo "No results";
	        }
	    }
	    else{ 
	        echo "Minimum length is ".$min_length;
	    }
	}

	function searchMainAndOne($conn, $column, $key, $dom){
		$raw_results = $conn->query("SELECT * FROM Catalog WHERE (`title` LIKE '%".$key[0]."%') OR (`author` LIKE '%".$key[0]."%') OR (`description` LIKE '%".$key[0]."%') OR (`categories` LIKE '%".$key[0]."%') AND (`$column` LIKE '%".$key[1]."%')") or die($conn->error);
	    if($raw_results->num_rows > 0){ 
	        while($results = $raw_results->fetch_array()){
	            addFoundedItem($dom, $results);
	        }
	    }
	    else{ 
	        echo "No results";
	    }
	}

	function searchMainAndTwo($conn, $column, $key, $dom){
		$raw_results = $conn->query("SELECT * FROM Catalog WHERE (`title` LIKE '%".$key[0]."%') OR (`author` LIKE '%".$key[0]."%') OR (`description` LIKE '%".$key[0]."%') OR (`categories` LIKE '%".$key[0]."%') AND (`$column[0]` LIKE '%".$key[1]."%') AND (`$column[1]` LIKE '%".$key[2]."%')") or die($conn->error);
	    if($raw_results->num_rows > 0){ 
	        while($results = $raw_results->fetch_array()){
	            addFoundedItem($dom, $results);
	        }
	    }
	    else{ 
	        echo "No results";
	    }
	}

	function searchMainAndThree($conn, $column, $key, $dom){
		$raw_results = $conn->query("SELECT * FROM Catalog WHERE (`title` LIKE '%".$key[0]."%') OR (`author` LIKE '%".$key[0]."%') OR (`description` LIKE '%".$key[0]."%') OR (`categories` LIKE '%".$key[0]."%') AND (`$column[0]` LIKE '%".$key[1]."%') AND (`$column[1]` LIKE '%".$key[2]."%') AND (`$column[2]` LIKE '%".$key[3]."%')") or die($conn->error);
	    if($raw_results->num_rows > 0){ 
	        while($results = $raw_results->fetch_array()){
	            addFoundedItem($dom, $results);
	        }
	    }
	    else{ 
	        echo "No results";
	    }
	}

	function searchOneAndPut($conn, $column, $key, $dom){
		$raw_results = $conn->query("SELECT * FROM Catalog WHERE (`$column` LIKE '%".$key."%')") or die($conn->error);
	    if($raw_results->num_rows > 0){ 
	        while($results = $raw_results->fetch_array()){
	            addFoundedItem($dom, $results);
	        }
	    }
	    else{ 
	        echo "No results";
	    }
	}

	function searchTwoAndPut($conn, $column, $key, $dom){
		$raw_results = $conn->query("SELECT * FROM Catalog WHERE (`$column[0]` LIKE '%".$key[0]."%') AND (`$column[1]` LIKE '%".$key[1]."%')") or die($conn->error);
	    if($raw_results->num_rows > 0){ 
	        while($results = $raw_results->fetch_array()){
	            addFoundedItem($dom, $results);
	        }
	    }
	    else{ 
	        echo "No results";
	    }
	}

	function searchThreeAndPut($conn, $column, $key, $dom){
		$raw_results = $conn->query("SELECT * FROM Catalog WHERE (`$column[0]` LIKE '%".$key[0]."%') AND (`$column[1]` LIKE '%".$key[1]."%') AND (`$column[2]` LIKE '%".$key[2]."%')") or die($conn->error);
	    if($raw_results->num_rows > 0){ 
	        while($results = $raw_results->fetch_array()){
	            addFoundedItem($dom, $results);
	        }
	    }
	    else{ 
	        echo "No results";
	    }
	}

	function searchFullWithAside($dom, $conn, $keywords){
		$min_length = 3;
		if ($keywords[0] == ''){
			if ($keywords[1] == '' && $keywords[2] == '' && $keywords[3] == '') {
				# code...
				echo "all";
			} else if($keywords[1] != '' && $keywords[2] == '' && $keywords[3] == '') {
				$myArray = explode(', ', $keywords[1]);
				foreach($myArray as $word) { 
					if ($word != '') {
						searchOneAndPut($conn, "categories", $word, $dom); 
					}
				}
			} else if($keywords[1] == '' && $keywords[2] != '' && $keywords[3] == ''){
				$myArray = explode(', ', $keywords[2]);
				foreach($myArray as $word) { 
					if ($word != '') {
						searchOneAndPut($conn, "author", $word, $dom); 
					}
				}
			} else if($keywords[1] == '' && $keywords[2] == '' && $keywords[3] != ''){
				$myArray = explode(', ', $keywords[3]);
				foreach($myArray as $word) { 
					if ($word != '') {
						searchOneAndPut($conn, "publisher", $word, $dom); 
					}
				}
			} else if($keywords[1] != '' && $keywords[2] != '' && $keywords[3] == ''){
				$thisArray = explode(', ', $keywords[1]);
				$myArray = explode(', ', $keywords[2]);
				foreach($myArray as $word) { 
					if ($word != '') {
						foreach ($thisArray as $key) {
							if ($key != '') {
								searchTwoAndPut($conn, ["author", "categories"], [$word, $key], $dom); 
							}
						}
					}
				}
			} else if($keywords[1] != '' && $keywords[2] == '' && $keywords[3] != ''){
				$thisArray = explode(', ', $keywords[1]);
				$myArray = explode(', ', $keywords[3]);
				foreach($myArray as $word) { 
					if ($word != '') {
						foreach ($thisArray as $key) {
							if ($key != '') {
								searchTwoAndPut($conn, ["publisher", "categories"], [$word, $key], $dom); 
							}
						}
					}
				}
			} else if($keywords[1] == '' && $keywords[2] != '' && $keywords[3] != ''){
				$thisArray = explode(', ', $keywords[3]);
				$myArray = explode(', ', $keywords[2]);
				foreach($myArray as $word) { 
					if ($word != '') {
						foreach ($thisArray as $key) {
							if ($key != '') {
								searchTwoAndPut($conn, ["author", "publisher"], [$word, $key], $dom); 
							}
						}
					}
				}
			} else if($keywords[1] != '' && $keywords[2] != '' && $keywords[3] != ''){
				$yourArray = explode(', ', $keywords[1]);
				$myArray = explode(', ', $keywords[2]);
				$thisArray = explode(', ', $keywords[3]);
				foreach($yourArray as $text){
					if ($text != '') {
						foreach($myArray as $word) { 
							if ($word != '') {
								foreach ($thisArray as $key) {
									if ($key != '') {
										searchThreeAndPut($conn, ["categories", "author", "publisher"], [$text, $word, $key], $dom); 
									}
								}
							}
						}
					}
				}
			} 
		} else{
			if ($keywords[1] == '' && $keywords[2] == '' && $keywords[3] == '') {
				$raw_results = $conn->query("SELECT * FROM Catalog WHERE (`title` LIKE '%".$keywords[0]."%') OR (`author` LIKE '%".$keywords[0]."%') OR (`description` LIKE '%".$keywords[0]."%') OR (`categories` LIKE '%".$keywords[0]."%')") or die($conn->error);
			    if($raw_results->num_rows > 0){ 
			        while($results = $raw_results->fetch_array()){
			            addFoundedItem($dom, $results);
			        }
			    }
			    else{ 
			        echo "No results";
			    }
			} else if($keywords[1] != '' && $keywords[2] == '' && $keywords[3] == '') {
				$myArray = explode(', ', $keywords[1]);
				foreach($myArray as $word) { 
					if ($word != '') {
						searchMainAndOne($conn, "categories", [$keywords[0], $word], $dom);
					}
				}
			} else if($keywords[1] == '' && $keywords[2] != '' && $keywords[3] == ''){
				$myArray = explode(', ', $keywords[2]);
				foreach($myArray as $word) { 
					if ($word != '') {
						searchMainAndOne($conn, "author", [$keywords[0], $word], $dom);
					}
				}
			} else if($keywords[1] == '' && $keywords[2] == '' && $keywords[3] != ''){
				$myArray = explode(', ', $keywords[3]);
				foreach($myArray as $word) { 
					if ($word != '') {
						searchMainAndOne($conn, "publisher", [$keywords[0], $word], $dom);
					}
				}
			} else if($keywords[1] != '' && $keywords[2] != '' && $keywords[3] == ''){
				$thisArray = explode(', ', $keywords[1]);
				$myArray = explode(', ', $keywords[2]);
				foreach($myArray as $word) { 
					if ($word != '') {
						foreach ($thisArray as $key) {
							if ($key != '') {
								searchMainAndTwo($conn, ["author", "categories"], [$keywords[0], $word, $key], $dom);
							}
						}
					}
				}
			} else if($keywords[1] != '' && $keywords[2] == '' && $keywords[3] != ''){
				$thisArray = explode(', ', $keywords[1]);
				$myArray = explode(', ', $keywords[3]);
				foreach($myArray as $word) { 
					if ($word != '') {
						foreach ($thisArray as $key) {
							if ($key != '') {
								searchMainAndTwo($conn, ["publisher", "categories"], [$keywords[0], $word, $key], $dom);
							}
						}
					}
				}
			} else if($keywords[1] == '' && $keywords[2] != '' && $keywords[3] != ''){
				$thisArray = explode(', ', $keywords[3]);
				$myArray = explode(', ', $keywords[2]);
				foreach($myArray as $word) { 
					if ($word != '') {
						foreach ($thisArray as $key) {
							if ($key != '') {
								searchMainAndTwo($conn, ["author", "publisher"], [$keywords[0], $word, $key], $dom);
							}
						}
					}
				}
			} else if($keywords[1] != '' && $keywords[2] != '' && $keywords[3] != ''){
				$yourArray = explode(', ', $keywords[1]);
				$myArray = explode(', ', $keywords[2]);
				$thisArray = explode(', ', $keywords[3]);
				foreach($yourArray as $text){
					if ($text != '') {
						foreach($myArray as $word) { 
							if ($word != '') {
								foreach ($thisArray as $key) {
									if ($key != '') {
										searchMainAndThree($conn, ["categories", "author", "publisher"], [$keywords[0], $text, $word, $key], $dom); 
									}
								}
							}
						}
					}
				}
			} 
		}
	}

	function searchCustomSmall($dom, $conn, $keywords){
		$min_length = 3;
		if ($keywords[1] != 'Choose category'){
			if ($keywords[0] == '' && $keywords[2] == '') {
				$raw_results = $conn->query("SELECT * FROM Catalog WHERE (`categories` LIKE '%".$keywords[1]."%')") or die($conn->error);
		        if($raw_results->num_rows > 0){ 
		            while($results = $raw_results->fetch_array()){
		                addFoundedItem($dom, $results);
		            }
		        }
		        else{ 
		            echo "No results";
		        }
			} else if ($keywords[0] != '' && $keywords[2] != ''){
				if(strlen($keywords[0]) >= $min_length && strlen($keywords[2]) >= $min_length){ 
			        $raw_results = $conn->query("SELECT * FROM Catalog WHERE (`title` LIKE '%".$keywords[0]."%') AND (`categories` LIKE '%".$keywords[1]."%') AND (`author` LIKE '%".$keywords[2]."%')") or die($conn->error);
			        if($raw_results->num_rows > 0){ 
			            while($results = $raw_results->fetch_array()){
			                addFoundedItem($dom, $results);
			            }
			        }
			        else{ 
			            echo "No results";
			        }
			    }
			    else{ 
			        echo "Minimum length is ".$min_length;
			    }	
			} else if ($keywords[0] == '' && $keywords[2] != '') {
				if(strlen($keywords[2]) >= $min_length){ 
			        $raw_results = $conn->query("SELECT * FROM Catalog WHERE (`categories` LIKE '%".$keywords[1]."%') AND (`author` LIKE '%".$keywords[2]."%')") or die($conn->error);
			        if($raw_results->num_rows > 0){ 
			            while($results = $raw_results->fetch_array()){
			                addFoundedItem($dom, $results);
			            }
			        }
			        else{ 
			            echo "No results";
			        }
			    }
			    else{ 
			        echo "Minimum length is ".$min_length;
			    }
			} else if ($keywords[0] != '' && $keywords[2] == '') {
				if(strlen($keywords[0]) >= $min_length){ 
			        $raw_results = $conn->query("SELECT * FROM Catalog WHERE (`categories` LIKE '%".$keywords[1]."%') AND (`title` LIKE '%".$keywords[0]."%')") or die($conn->error);
			        if($raw_results->num_rows > 0){ 
			            while($results = $raw_results->fetch_array()){
			                addFoundedItem($dom, $results);
			            }
			        }
			        else{ 
			            echo "No results";
			        }
			    }
			    else{ 
			        echo "Minimum length is ".$min_length;
			    }
			}
		}  else{
			if ($keywords[0] == '' && $keywords[2] == '') {
	            echo "No input";
			} else if ($keywords[0] != '' && $keywords[2] != ''){
				if(strlen($keywords[0]) >= $min_length && strlen($keywords[2]) >= $min_length){ 
			        $raw_results = $conn->query("SELECT * FROM Catalog WHERE (`title` LIKE '%".$keywords[0]."%') AND  (`author` LIKE '%".$keywords[2]."%')") or die($conn->error);
			        if($raw_results->num_rows > 0){ 
			            while($results = $raw_results->fetch_array()){
			                addFoundedItem($dom, $results);
			            }
			        }
			        else{ 
			            echo "No results";
			        }
			    }
			    else{ 
			        echo "Minimum length is ".$min_length;
			    }	
			} else if ($keywords[0] == '' && $keywords[2] != '') {
				if(strlen($keywords[2]) >= $min_length){ 
			        $raw_results = $conn->query("SELECT * FROM Catalog WHERE (`author` LIKE '%".$keywords[2]."%')") or die($conn->error);
			        if($raw_results->num_rows > 0){ 
			            while($results = $raw_results->fetch_array()){
			                addFoundedItem($dom, $results);
			            }
			        }
			        else{ 
			            echo "No results";
			        }
			    }
			    else{ 
			        echo "Minimum length is ".$min_length;
			    }
			} else if ($keywords[0] != '' && $keywords[2] == '') {
				if(strlen($keywords[0]) >= $min_length){ 
			        $raw_results = $conn->query("SELECT * FROM Catalog WHERE (`title` LIKE '%".$keywords[0]."%')") or die($conn->error);
			        if($raw_results->num_rows > 0){ 
			            while($results = $raw_results->fetch_array()){
			                addFoundedItem($dom, $results);
			            }
			        }
			        else{ 
			            echo "No results";
			        }
			    }
			    else{ 
			        echo "Minimum length is ".$min_length;
			    }
			}
		}
	}

	function addFoundedItem($dom, $book){
		$foundedSection = $dom->getElementById('founded_section');

		$item = $dom->createElement("div");
		$item->setAttribute('class', 'founded-item grid-center-items');

		$itemPhoto = $dom->createElement("img");
		$itemPhoto->setAttribute('class', 'founded-item-photo');
		$itemPhoto->setAttribute('pseudo', $book['title']);
		$itemPhoto->setAttribute('src', $book['thumbnailUrl']);
		$item->appendChild($itemPhoto);

		$itemTitle = $dom->createElement("h3");
		$itemTitle->appendChild($dom->createTextNode($book['title'])); 
		$item->appendChild($itemTitle);

		$itemAuthor = $dom->createElement("span");
		$itemAuthor->appendChild($dom->createTextNode("by ".$book['author'])); 
		$item->appendChild($itemAuthor);

		$itemPrice = $dom->createElement("span");
		$itemPrice->appendChild($dom->createTextNode($book['price'])); 
		$item->appendChild($itemPrice);

		$itemButton = $dom->createElement('input');
			$itemButton->setAttribute('type', 'button');
			$itemButton->setAttribute('name', $book['title']);
			$itemButton->setAttribute('class', 'button');
			$itemButton->setAttribute('value','Add to cart');
	    $item->appendChild($itemButton);
	    
	/*	$itemShowMore = $dom->createElement("span");
		$itemShowMore->appendChild($dom->createTextNode("Show more")); 
		$item->appendChild($itemShowMore);*/

		$foundedSection->appendChild($item);
	}

	function addCategoriesList($conn, $categoriesArray, $dom){
		$sql = "SELECT * FROM Catalog";
		$result = $conn->query($sql);
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
			$categoriesList = $dom->getElementById('categories_list');
		    $category = $dom->createElement("input");
		    $category->setAttribute('type', 'checkbox');
		    $category->setAttribute('name', 'category');
		    $category->setAttribute('value', $categoriesArray[$i]);

			$categoriesList->appendChild($category);		
			$categoriesList->appendChild($dom->createTextNode($categoriesArray[$i])); 
		}
	}

	function addAuthorsList($conn, $authorsArray, $dom){
		$sql = "SELECT * FROM Catalog";
		$result = $conn->query($sql);
		while($row = $result->fetch_assoc()) {
	    	$arr = explode(',', $row['author']);
			foreach ($arr as $word) {
	    		$word = trim($word);
	    		if (!in_array($word, $authorsArray)) {
					$authorsArray[] = $word;
	    		}
	    	}
		}
		sort($authorsArray);

		for ($i=0; $i < count($authorsArray); $i++) { 
			$authorsList = $dom->getElementById('authors_list');
			$author = $dom->createElement("input");
		    $author->setAttribute('type', 'checkbox');
		    $author->setAttribute('name', 'author');
		    $author->setAttribute('value', $authorsArray[$i]);

			$authorsList->appendChild($author);		
			$authorsList->appendChild($dom->createTextNode($authorsArray[$i])); 
		}
	}

	function addPublishersList($conn, $publishersArray, $dom){
		$sql = "SELECT * FROM Catalog";
		$result = $conn->query($sql);
		while($row = $result->fetch_assoc()) {
    		if (!in_array($row['publisher'], $publishersArray)) {
				$publishersArray[] = $row['publisher'];
    		}
		}
		sort($publishersArray);

		for ($i=0; $i < count($publishersArray); $i++) { 
			$publisersList = $dom->getElementById('publishers_list');
			$publisher = $dom->createElement("input");
		    $publisher->setAttribute('type', 'checkbox');
		    $publisher->setAttribute('name', 'publisher');
		    $publisher->setAttribute('value', $publishersArray[$i]);

			$publisersList->appendChild($publisher);		
			$publisersList->appendChild($dom->createTextNode($publishersArray[$i])); 
		}
	}


	/**
	 * Main
	*/

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
		$html = file_get_contents('./search.html'); echo $html;
		$dom->loadHTML($html);
		libxml_use_internal_errors(false); 
	ob_end_clean();

	$searchTextPanel = $dom->getElementById('you_searched_text');
	$categoriesArray = [];
	$authorsArray = [];
	$publishersArray = [];

	addCategoriesList($conn, $categoriesArray, $dom);
	addAuthorsList($conn, $authorsArray, $dom);
	addPublishersList($conn, $publishersArray, $dom);
	

	switch ($_GET['search-type']) {
		case 'search-full':
			searchFull($dom, $conn, $_GET['query']);
			$searchTextPanel->appendChild($dom->createTextNode('Search Results: "'.$_GET['query'].'"'));
			break;
		case 'aside-search':
			$keywords = [$_GET['query'], $_GET['checkbox-category'], $_GET['checkbox-author'], $_GET['checkbox-publisher']];
			searchFullWithAside($dom, $conn, $keywords);
			$searchTextPanel->appendChild($dom->createTextNode('Search Results: "'.$_GET['checkbox-category'].' '.$_GET['checkbox-author'].' '.$_GET['checkbox-publisher'].' '.$_GET['query'].'"'));
			break;
		case 'search-custom-small':
			$keywords = [$_GET['title-search'], $_GET['category-select'], $_GET['author-search']];
			searchCustomSmall($dom, $conn, $keywords);
			if ($keywords[1] != 'Choose category') {
				$searchTextPanel->appendChild($dom->createTextNode('Search Results: "'.$keywords[0].' '.$keywords[1].' '.$keywords[2].'"'));
			} else 	$searchTextPanel->appendChild($dom->createTextNode('Search Results: "'.$keywords[0].' '.$keywords[2].'"'));
			break;
		
		default:
			# code...
			break;
	}

    echo $dom->saveHTML();
	$conn->close();
?>