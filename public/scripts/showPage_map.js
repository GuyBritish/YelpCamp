mapboxgl.accessToken = mbxToken;
let map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/light-v10", // style URL
	center: camp.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

let marker = new mapboxgl.Marker({})
	.setLngLat(camp.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			`<h4> ${camp.title} </h4> <p> ${camp.location} </p>`
		)
	)
	.addTo(map);
