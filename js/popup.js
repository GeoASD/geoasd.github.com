// Crear función popup
function popup_caplg(feature, layer){
	if(feature.properties && feature.properties.componente){
		var popupcontent =	"<b>Componentes Aprobados UM Huachocolpa</b>"+
							"<br>"+"<b>Nombre: </b>" + feature.properties.componente+
							"<br>"+"<b>IGA: </b>" + feature.properties.iga +
							"<br>"+"<b>Área (m²): </b>" + feature.properties.area_m2.toFixed(2) +
							"<br>"+"<b>Este: </b>" + feature.properties.este.toFixed(2) +
							"<br>"+"<b>Norte: </b>" + feature.properties.norte.toFixed(2);
							
		layer.bindPopup(popupcontent,{
			className: "popup"
		});
	}
};




function popup_cproyec(feature, layer){
	if(feature.properties && feature.properties.Layer){
		var popupcontent = 	"<b>Componentes Proyectados UM Huachocolpa</b>"+
							"<br>"+"<b>Nombre: </b>" + feature.properties.Layer +
							"<br>"+"<b>Área (m²): </b>" + feature.properties.area_m2.toFixed(2) +
							"<br>"+"<b>Este: </b>" + feature.properties.este.toFixed(2) +
							"<br>"+"<b>Norte: </b>" + feature.properties.norte.toFixed(2) +
							"<br>" + '<a href="pdf/' + feature.properties.Item + '.pdf"' + 'target="_blank"style="color:white"' + '>Mas información</a>';
		layer.bindPopup(popupcontent,{
			className: "popup"
		});
	}
};



function popup_calinea(feature, layer){
	if(feature.properties && feature.properties.componente){
		var popupcontent ="<b>Nombre: </b>" + feature.properties.componente;
		layer.bindPopup(popupcontent,{
			className: "popup"
		});
	}
};


