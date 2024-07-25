//Crear estilos
var ca_plg_estilo = {
	color: "purple",
	weight:1,
	fillOpacity: 0.4
};

var c_proyec_estilo = {
	color: "red",
	weight:1,
	fillOpacity: 0.4
};

function componente_calineas_estilo(feature){
	switch(feature.properties.componente){
	case'Acceso':
		return {
			color: "#A8A800",
			weight: 5,
			opacity: 0.6
		};
		
	case'Canal comihuasa':
		return {
			color: "#00FFC5",
			weight: 2,
		};
		
	case'Canal pepito':
		return {
			color: "#00FFC5",
			weight: 2,
		};
		
	case'Canal sur':
		return {
			color: "#00FFC5",
			weight: 2,
		};
	case'Sub drenaje de aguas de contacto':
		return {
			color: "red",
			weight: 2,
			dashArray:'5,10'
		};
	}
};

var ndvi_estilo = {
	color: "#55FF00",
	weight:1,
	fillOpacity: 0.4
};
