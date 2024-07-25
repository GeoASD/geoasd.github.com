//Creación de objeto mapa
var map = L.map("map").setView([-10.548704, -75.461643], 5);




//Enlazar mapas base
var osm_estandar = L.tileLayer(' http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,				 
}).addTo(map);


	
	
	
	



//Enlazar capas 
var proyectos = L.geoJSON(proyectos,{
	style : proyectos_estilo,
	onEachFeature: popup_proyectos
});







//Creación diccionarios
var basemaps =	{
					"OpenStreetMap Standard" : osm_estandar,
					"Desactiva el mapa base" : L.layerGroup([]),					
				};


var capas = {
				"Acceso a la información por proyecto" : proyectos,

			};



//Agregar control de coordenadas
L.control.coordinates({
	position : "bottomleft",
	decimal : 6,
	labelTemplateLat : "Latitud: {y}",
	labelTemplateLng : "Longitud: {x}",
	enableUserInput : true,
}).addTo(map);




//Agregar control de geocodificación
L.Control.geocoder({
	position: "topleft",
	placeholder: "Ingrese un código...",
	errorMessage: "No se encontraron resultados con su código"
});




//Agregar control de busqueda de atributos de una capa
var searchControl = new L.Control.Search({
						layer : proyectos,
						propertyName : "Código",
						marker : false,
						moveToLocation : function(latlng, title, map){
							var zoom = map.getBoundsZoom(latlng.layer.getBounds());
							map.setView(latlng, zoom);
						}
}).addTo(map);



//Evento cuando se encuentre la busqueda
searchControl.on('search:locationfound', function(e){
	e.layer.setStyle({
		fillColor : "#00FFC5",
		color : "#00FFC5"
	});
	if(e.layer._popup){
		e.layer.openPopup();
	}
}).on('search:collapsed', function(e){
	proyectos.eachLayer(function(layer){
		proyectos.resetStyle(layer);
	});
});



//Agregar el control de busqueda al mapa
map.addControl(searchControl);




//Creación control de capas

L.control.layers(basemaps, capas).addTo(map);




//Añadir leyenda
var leyenda = L.control.Legend({
	position : "bottomright",
	collapsed : false, 
	opacity : 0.8,
	legends : [
				{
					label : "Acceso a la información por proyecto",
					type : "circle",
					color : "#00FFC5",
					weight : 1,
					layers : proyectos
				}
	]
});
