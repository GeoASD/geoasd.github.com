// Crear función popup
function popup_proyectos(feature, layer){
	if(feature.properties && feature.properties.proyecto){
		var popupcontent =
							"<br>"+"<b>Proyecto: </b>" + feature.properties.proyecto +
							"<br>"+"<b>Código: </b>" + feature.properties.código +
							"<br>"+"<b>Sector: </b>" + feature.properties.sector +
							"<br>"+"<b>Tipo de servicio: </b>" + feature.properties.tipo_de_se +
							"<br>"+"<b>Departamento: </b>" + feature.properties.departamen +
							"<br>"+"<b>Provincia: </b>" + feature.properties.provincia +
							"<br>"+"<b>Distrito: </b>" + feature.properties.distrito +
							"<br>"+"<b>Información disponible: </b>"+ feature.properties.informaci;
							
		layer.bindPopup(popupcontent,{
			className: "popup"
		});
	}
};







