<%php 

function handlePost() {
	$date = new DateTime();
	$timestamp = $date->getTimestamp();
	
	echo $timestamp;
}




if ( $_SERVER['REQUEST_METHOD'] == "POST") {
	// this will record the performance
	handlePost();
} else if ( $_SERVER['REQUEST_METHOD'] == "GET" ) {
	handleGet();
}
%>