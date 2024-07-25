//Creación de objeto mapa
var map = L.map("map").setView([-10.548704, -75.461643], 5);




//Enlazar mapas base
var osm_estandar = L.tileLayer(' http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,				 
}).addTo(map);

var osm_mapnick = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 21,
});

var osm_cycle = L.tileLayer('http://tile.thunderforest.com/cycle/{z}/{x}/{y}.png',{
	maxZoom: 9,
});

var osm_bw = L.tileLayer('http://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',{
	maxZoom: 22,
});

var osm_3d = L.tileLayer('http://tiles.osm2world.org/osm/pngtiles/n/{z}/{x}/{y}.png',{
	maxZoom: 22,
});
	
	
	
	
//Enlazar wms nacional
var anp = L.tileLayer.wms ('https://geoservicios.sernanp.gob.pe/arcgis/services/representatividad/peru_sernanp_010201/MapServer/WMSServer?', {
				layers: "0",
				format: "image/png",
				transparent: true,
				maxZoom:22
});
	
var za = L.tileLayer.wms ('https://geoservicios.sernanp.gob.pe/arcgis/services/gestion_de_anp/peru_sernanp_021401/MapServer/WMSServer?', {
				layers: "0",
				format: "image/png",
				transparent: true,
				maxZoom:22
});

var zr = L.tileLayer.wms ('https://geoservicios.sernanp.gob.pe/arcgis/services/representatividad/peru_sernanp_010202/MapServer/WMSServer?', {
				layers: "0",
				format: "image/png",
				transparent: true,
				maxZoom:22
});

var acr = L.tileLayer.wms ('https://geoservicios.sernanp.gob.pe/arcgis/services/representatividad/peru_sernanp_010203/MapServer/WMSServer?', {
				layers: "0",
				format: "image/png",
				transparent: true,
				maxZoom:22
});

var acp = L.tileLayer.wms ('https://geoservicios.sernanp.gob.pe/arcgis/services/representatividad/peru_sernanp_010204/MapServer/WMSServer?', {
				layers: "0",
				format: "image/png",
				transparent: true,
				maxZoom:22
});




//Enlazar capas kolpa
var proyectos = L.geoJSON(proyectos,{
	style : proyectos_estilo,
	onEachFeature: popup_proyectos
});







//Creación diccionarios
var basemaps =	{
					"OpenStreetMap Standard" : osm_estandar,
					"OpenStreetMap Mapnick" : osm_mapnick,
					"OSM Cycle Map" : osm_cycle,
					"OSM Black and White" : osm_bw,
					"OSM2World/3D (D,A,CH)" : osm_3d,
					"Desactiva el mapa base" : L.layerGroup([]),					
				};

var wms =	{
				"ANP de Administración Nacional Definitiva" : anp,
				"Zona de amortiguamiento" : za,
				"ANP de Administración Nacional Transitoria" : zr,
				"Área de conservación regional" : acr,
				"Área de conservación privada" : acp,				
			};

var capas = {
				"Acceso a la información por proyecto : proyectos,

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
						layer : c_proyec,
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
					type : "point",
					color : "#00FFC5",
					weight : 1,
					layers : proyectos
				}
	]
}).addTo(map);
