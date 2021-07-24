mapboxgl.accessToken = mbxToken;
var map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/streets-v11", // style URL
	center: camp.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

var marker = new mapboxgl.Marker({}).setLngLat(camp.geometry.coordinates).addTo(map);
