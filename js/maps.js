//Creación de objeto mapa
var map = L.map("map").setView([-10.548704, -75.461643], 5);




//Enlazar mapas base
var topo = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 19,				 
}).addTo(map);

var hybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
	maxZoom: 21,
});

var relieve = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',{
	maxZoom: 9,
});

var carto_positron = L.tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',{
	maxZoom: 22,
});

var carto_dark = L.tileLayer('http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
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
var ca_linea = L.geoJSON(ca_linea,{
	style : componente_calineas_estilo,
	onEachFeature: popup_calinea
});

var ca_plg = L.geoJSON(ca_plg,{
	style : ca_plg_estilo,
	onEachFeature: popup_caplg
});

var c_proyec = L.geoJSON(c_proyec,{
	style : c_proyec_estilo,
	onEachFeature: popup_cproyec,
	/*onEachFeature: tooltip_cproyec*/
}).addTo(map);

var ndvi = L.geoJSON(ndvi, {
	style : ndvi_estilo
});
	
console.log(c_proyec);




//Creación diccionarios
var basemaps =	{
					"ESRI Topo" : topo,
					"Google Hybrid" : hybrid,
					"ESRI Relieve" : relieve,
					"Carto Positron" : carto_positron,
					"Carto dark" : carto_dark,
					"Desactiva el mapa base" : L.layerGroup([]),					
				};

var wms =	{
				"ANP de Administración Nacional Definitiva" : anp,
				"Zona de amortiguamiento" : za,
				"ANP de Administración Nacional Transitoria" : zr,
				"Área de conservación regional" : acr,
				"Área de conservación privada" : acp,				
			};

var kolpa = {
				"Componentes aprobados (Polígono)" : ca_plg,
				"Componentes aprobados (Línea)" : ca_linea,
				"Componentes proyectados" : c_proyec,
				"Áreas de desbroce (Cálculo NDVI > 1.5)" : ndvi,
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
	placeholder: "Escriba una referencia...",
	errorMessage: "No se encontraron resultados con su referencia"
});




//Agregar control de busqueda de atributos de una capa
var searchControl = new L.Control.Search({
						layer : c_proyec,
						propertyName : "Layer",
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
	c_proyec.eachLayer(function(layer){
		c_proyec.resetStyle(layer);
	});
});



//Agregar el control de busqueda al mapa
map.addControl(searchControl);




//Creación control de capas

L.control.layers(basemaps, kolpa).addTo(map);




//Añadir leyenda
var leyenda = L.control.Legend({
	position : "bottomright",
	collapsed : false, 
	opacity : 0.8,
	legends : [
				{
					label : "Canal",
					type : "polyline",
					color : "#00FFC5",
					weight : 1,
					layers : ca_linea
				},
				{
					label : "Accesos",
					type : "polyline",
					color : "#A8A800",
					weight : 5,
					layers : ca_linea
				},
				{
					label : "Sub drenaje de aguas de contacto",
					type : "polyline",
					color : "red",
					weight : 2,
					dashArray:[5,10],
					layers : ca_linea
				},
				{
					label : "Componentes aprobados (Polígono)",
					type : "rectangle",
					color : "purple",
					fillColor : "purple",
					weight : 1,
					fillOpacity: 0.4,
					layers : ca_plg
				},
				{
					label : "Componentes proyectados",
					type : "rectangle",
					color : "red",
					fillColor : "red",
					weight : 1,
					fillOpacity: 0.4,
					layers : c_proyec
				},
				{
					label : "Áreas de desbroce (Cálculo NDVI > 1.5)",
					type : "rectangle",
					color : "#55FF00",
					fillColor : "#55FF00",
					weight : 1,
					fillOpacity: 0.4,
					layers : ndvi
				},
	]
}).addTo(map);
