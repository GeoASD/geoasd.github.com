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





var gifIcon = L.icon({
    iconUrl: 'images/point_azul.svg', // ejemplo: 'images/pulse.gif'
    iconSize: [32, 32], // ajusta según el tamaño del GIF
    iconAnchor: [16, 16], // el centro del icono será el punto exacto en el mapa
});












var proyectos_total = L.geoJSON(proyectos_total,{
	pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: gifIcon
        });
    },
    onEachFeature: popup_proyectos
}).addTo(map);

generarDashboard(proyectos_total);

// ----------------------------------------
// Función para crear el gráfico del dashboard
// ----------------------------------------

function generarDashboard(capa) {
	let porDepartamento = {};
	let porActividad = {};

	capa.eachLayer(function (layer) {
		const props = layer.feature.properties;

		let depto = props.Departamen;
		let actividad = props.Actividad;

		if (depto) {
			if (!porDepartamento[depto]) porDepartamento[depto] = 0;
			porDepartamento[depto]++;
		}

		if (actividad) {
			if (!porActividad[actividad]) porActividad[actividad] = 0;
			porActividad[actividad]++;
		}
	});

	// --- Gráfico de barras por Departamento ---
	const deptoEntries = Object.entries(porDepartamento).sort((a, b) => a[0].localeCompare(b[0]));
	const deptoLabels = deptoEntries.map(entry => entry[0]);
	const deptoData = deptoEntries.map(entry => entry[1]);

	const maxDepto = Math.max(...deptoData);
	const deptoColors = deptoData.map(count => {
		const alpha = 0.4 + 0.6 * (count / maxDepto);
		return `rgba(54, 162, 235, ${alpha.toFixed(2)})`;
	});

	const ctxBar = document.getElementById('dashboardBarChart').getContext('2d');
	new Chart(ctxBar, {
		type: 'bar',
		data: {
			labels: deptoLabels,
			datasets: [{
				label: 'N° de Proyectos',
				data: deptoData,
				backgroundColor: deptoColors,
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			indexAxis: 'x', // eje vertical (barras de pie a cabeza)
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: 'Proyectos'
					}
				},
				x: {
					ticks: {
						autoSkip: false,
						maxRotation: 45,
						minRotation: 0
					}
				}
			},
			plugins: {
				legend: { display: false },
				title: {
					display: false
				}
			}
		}
	});

	// --- Gráfico de donut por Actividad ---
	const actEntries = Object.entries(porActividad).sort((a, b) => a[0].localeCompare(b[0]));
	const actLabels = actEntries.map(entry => entry[0]);
	const actData = actEntries.map(entry => entry[1]);
	const actMax = Math.max(...actData);

	// Generar colores aleatorios distintos para cada actividad
	function getRandomColor(index) {
		const baseColors = [
			'#02e16d', '#fdfc0b', '#00525a', '#f9670c',
			'#ff0000','#9a6632', '#3a23d3', '#e2a4f6', 
			'#e800ff', '#06e4e1', '#8c0033'
		];
		return baseColors[index % baseColors.length];
	}

	const actColors = actLabels.map((_, index) => getRandomColor(index));

	const ctxDonut = document.getElementById('dashboardDoughnutChart').getContext('2d');
	new Chart(ctxDonut, {
		type: 'doughnut',
		data: {
			labels: actLabels,
			datasets: [{
				label: 'N° de Proyectos',
				data: actData,
				backgroundColor: actColors,
				borderColor: 'rgba(255,255,255,0.8)',
				borderWidth: 2
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'right'
				},
				title: {
					display: false
				}
			}
		}
	});
}























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
	placeholder: "Ingrese el proyecto...",
	errorMessage: "No se encontraron resultados"
});




//Agregar control de busqueda de atributos de una capa
var searchControl = new L.Control.Search({
						layer : proyectos_total,
						propertyName : "Proyecto",
						zoom : 12,
						collapsed : true,
						filterData: function(text, records) {
        					var results = {};
					        var searchText = text.toLowerCase();
					        for (var key in records) {
					            if (key.toLowerCase().indexOf(searchText) !== -1) {
									results[key] = records[key];
					            }
					        }
					        return results;
					    }
}).addTo(map);










document.addEventListener('mouseover', function (event) {
    const el = event.target.closest('.search-tip');
    if (el && !el.title) {
        el.title = el.textContent.trim();
    }
});


















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


//Añadir SiderBar
var sidebar = L.control.sidebar({
	position 	: "left",
	autopan		: true,
	container	: "sidebar",
	//closeButton	: false
}).addTo(map);

sidebar.open("home");



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






