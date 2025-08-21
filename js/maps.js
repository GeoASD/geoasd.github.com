//Creación de objeto mapa
var map = L.map("map").setView([-10.548704, -75.461643], 5);




//Enlazar mapas base
var osm_estandar = L.tileLayer(' http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,				 
}).addTo(map);


	
	
	
	



//Enlazar capas 
/*var proyectos_wfs 		= "http://192.168.1.11:8080/geoserver/proyectos_total/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=proyectos_total%3Aproyectos_totales&maxFeatures=50&outputFormat=application%2Fjson";
var proyectos_total 	= new L.GeoJSON.AJAX(proyectos_wfs,{
	onEachFeature : popup_proyectos
});*/

var proyectos_total = L.geoJSON(proyectos_total,{
	onEachFeature : popup_proyectos
}).addTo(map);






//Creación diccionarios
var basemaps =	{
					"OpenStreetMap Standard" : osm_estandar,
					"Desactiva el mapa base" : L.layerGroup([]),					
				};


var capas = {
				"Acceso a la información por proyecto" : proyectos_total
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
						layer : proyectos_total,
						propertyName : "Proyecto",
						zoom : 12,
						collapsed : false
}).addTo(map);



//Evento cuando se encuentre la busqueda
searchControl.on('search:locationfound', function(e){

	if(e.layer._popup){
		e.layer.openPopup();
	}
}).on('search:collapsed', function(e){
	proyectos.eachLayer(function(layer){
		proyectos_total.resetStyle(layer);
	});
});
map.get


//Agregar el control de busqueda al mapa
map.addControl(searchControl);




//Creación control de capas

L.control.layers(basemaps, capas, {
	collapsed : false,
}).addTo(map);




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
					layers : proyectos_total
				}
	]
});

