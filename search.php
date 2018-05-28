<?php
	/**
	 * Oasis bookstore site
	 *
	 * @Author Oleh Yaroshchuk 
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

		$itemButton = $dom->createElement("button");
		$itemButton->setAttribute('class', 'button');
		$itemButton->appendChild($dom->createTextNode("Add to cart")); 
	    $item->appendChild($itemButton);

/*		$itemShowMore = $dom->createElement("span");
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
		    $category = $dom->createElement("li");
			$category->appendChild($dom->createTextNode($categoriesArray[$i])); 
			$categoriesList->appendChild($category);		
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
		    $author = $dom->createElement("li");
			$author->appendChild($dom->createTextNode($authorsArray[$i])); 
			$authorsList->appendChild($author);		
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
			$authorsList = $dom->getElementById('publishers_list');
		    $author = $dom->createElement("li");
			$author->appendChild($dom->createTextNode($publishersArray[$i])); 
			$authorsList->appendChild($author);		
		}
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