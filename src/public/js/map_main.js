
//var map = L.map('map-template').setView([19.2441047, -103.7451378], 13);
var real_time, TDS, PH, EC, TB;
///////////////////////MAPBOX




var cities = L.layerGroup();




	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmFhc3JhaWRlciIsImEiOiJja2tnNWg0YmgwMmQ3MnBzMzZyaWwza2lsIn0.SKPlgZ7-jmTdVEZaAC1cAQ';

	var satellite   = L.tileLayer(mbUrl, {id: 'mapbox/satellite-streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
		streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

	var map = L.map('map-template', {
		center: [19.2441047, -103.7451378],
		zoom: 13,
		layers: [streets, cities]
	});

	var baseLayers = {
		"Vista satelital": satellite,
		"Calles": streets
	};

	var overlays = {
		"Calidad del agua": cities
	};

	L.control.layers(baseLayers, overlays).addTo(map);
///////////////////////


var theMarker = {};
var coords = {};




/*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);*/
/*
var grayscale = L.tileLayer(mapboxUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution}),
    streets   = L.tileLayer(mapboxUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});
	var baseMaps = {
		"Grayscale": grayscale,
		"Streets": streets
	};
	L.control.layers(baseMaps, overlayMaps).addTo(map);	
	*/
// Marca de agua
L.Control.Watermark = L.Control.extend({

	onAdd : function ( map ) {
		var img = L.DomUtil.create('img');
		img.src = '/img/Watermark.png';
		img.style.width = '150px';
		return img;
	},
	onRemove:function(map){},

});
L.control.watermark = function(opts){
	return new L.Control.Watermark(opts);
}
L.control.watermark({position:'bottomleft'}).addTo(map);
// El icono debe tener en su propiedad iconAnchor [mitad tamaño del icono, tamaño del icono] para que no se distorsione.
var parkIcon = L.icon({

    iconUrl: '/img/water2.png',
    iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [1, -45],
	shadowUrl: '/img/shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]

});	



//map.on('click', onMapClick);

var carIcon = L.icon({

    iconUrl: '/img/car.png',
    iconSize: [40, 40],
	iconAnchor: [20, 40],
	popupAnchor: [1, -45],
	shadowUrl: '/img/shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]

});	

map.locate({enableHighAccuracy: true});


/*
L.marker([19.2513209, -103.7211143], {icon: parkIcon}).addTo(map)
	.bindPopup('Plaza San Fernando.');
*/


	
/*
L.marker([19.2436325, -103.7273708], {icon: parkIcon}).addTo(map)
    .bindPopup('Constitución.');
*/

// EVENTO ON CLICK PARA LLAMAR FUNCIONES PRESIONANDO EL ICONO
//L.marker([19.2436325,-103.7273708], {icon: parkIcon}).addTo(map).on('click', onClick);


function onClick(e) {
    //alert("HOLA");
	//document.getElementById('chartdiv').classList.toggle('active');

	create_chart("chartdiv");
	
};


function hola() {
		console.log("AAAAAAAAAAAAAAAAA");
	};

map.on('locationfound', e => {

    const coords = [e.latlng.lat, e.latlng.lng];
    const marker = L.marker(coords,{icon: carIcon});
    marker.bindPopup('Aquí estas');
    map.addLayer(marker);
	console.log(e);
	
});


const socket = io();

var hostname = "test.mosquitto.org";
var port = 8080;
var clientId = "WebSocket";
clientId += new Date().getUTCMilliseconds();
var topic = "esli_123";

mqttClient = new Paho.MQTT.Client(hostname, port, clientId);
mqttClient.onMessageArrived = MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

/*Initiates a connection to the MQTT broker*/
function Connect(){
	mqttClient.connect({
	onSuccess: Connected,
	onFailure: ConnectionFailed,
	keepAliveInterval: 10,
});
};

/*Callback for successful MQTT connection */
function Connected() {
	console.log("Connected to broker");
	mqttClient.subscribe(topic);
};

/*Callback for failed connection*/
function ConnectionFailed(res) {
	console.log("Connect failed:" + res.errorMessage);
};

/*Callback for lost connection*/
function ConnectionLost(res) {
	if (res.errorCode !== 0) {
		console.log("Connection lost:" + res.errorMessage);
		Connect();
	}
};

/*Callback for incoming message processing */
function MessageArrived(message) {
	var ban = true;
	var obj = JSON.parse( message.payloadString );
	TDS = obj["TDS"];
	PH = obj["PH"];
	EC = obj["EC"];
	TB = obj["TB"];
	device = obj["device"];
    document.getElementById("mqtt_test").innerHTML=TDS;
	real_time = message.payloadString;

	console.log(message.destinationName +" : " + message.payloadString);
};


function create_chart(div) {


	var chart = am4core.create(div, am4charts.GaugeChart);
	chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
	
	chart.startAngle = 0;
	chart.endAngle = 360;


	
	function createAxis(min, max, start, end, color) {
	  var axis = chart.xAxes.push(new am4charts.ValueAxis());
	  axis.min = min;
	  axis.max = max;
	  axis.strictMinMax = true;
	  axis.renderer.useChartAngles = false;
	  axis.renderer.startAngle = start;
	  axis.renderer.endAngle = end;
	  axis.renderer.minGridDistance = 100;
	
	  axis.renderer.line.strokeOpacity = 1;
	  axis.renderer.line.strokeWidth = 10;
	  axis.renderer.line.stroke = am4core.color(color);
	  
	  axis.renderer.ticks.template.disabled = false;
	  axis.renderer.ticks.template.stroke = am4core.color(color);
	  axis.renderer.ticks.template.strokeOpacity = 1;
	  axis.renderer.grid.template.disabled = true;
	  axis.renderer.ticks.template.length = 10;
	  
	  return axis;
	}
	
	function createHand(axis) {
	  var hand = chart.hands.push(new am4charts.ClockHand());
	  hand.fill = axis.renderer.line.stroke;
	  hand.stroke = axis.renderer.line.stroke;
	  hand.axis = axis;
	  hand.pin.disabled = true;
	  hand.startWidth = 10;
	  hand.endWidth = 0;
	  hand.radius = am4core.percent(90);
	  hand.innerRadius = am4core.percent(70);
	  hand.value = 0;
	  return hand;
	}
	
	//TDS
	var axis1 = createAxis(0, 1000, -85, -5, "#EF6F6C");

	//PH
	var axis2 = createAxis(0, 14, 5, 85, "#426A5A");

	//EC
	var axis3 = createAxis(0, 100, 95, 175, "#7FB685");

	//TB
	var axis4 = createAxis(0, 4.5, 185, 265, "#DDAE7E");
	
	var hand1 = createHand(axis1);
	var hand2 = createHand(axis2);
	var hand3 = createHand(axis3);
	var hand4 = createHand(axis4);
	
	setInterval(function() {
	  hand1.showValue(TDS, 250, am4core.ease.cubicOut);
	  hand2.showValue(PH, 250, am4core.ease.cubicOut);
	  hand3.showValue(EC, 250, am4core.ease.cubicOut);
	  hand4.showValue(TB, 250, am4core.ease.cubicOut);
	}, 2000);

	//////////////// LABEL PH ///////////////
	var label1 = chart.radarContainer.createChild(am4core.Label);
label1.isMeasured = false;
label1.y = 45;
label1.horizontalCenter = "middle";
label1.verticalCenter = "top";
label1.text = "PH";

label1.adapter.add("x", function(x, target){
  return (axis1.renderer.pixelInnerRadius + (axis1.renderer.pixelRadius - axis1.renderer.pixelInnerRadius) / 2);
});

	//////////////// LABEL TURBIDEZ  ///////////////
	var label1 = chart.radarContainer.createChild(am4core.Label);
label1.isMeasured = false;
label1.y = -45;
label1.horizontalCenter = "middle";
label1.verticalCenter = "top";
label1.text = "TB (V)";

label1.adapter.add("x", function(x, target){
  return -(axis1.renderer.pixelInnerRadius + (axis1.renderer.pixelRadius - axis1.renderer.pixelInnerRadius) / 2);
});

	//////////////// LABEL TDS  ///////////////
	var label1 = chart.radarContainer.createChild(am4core.Label);
label1.isMeasured = false;
label1.y = -45;
label1.horizontalCenter = "middle";
label1.verticalCenter = "top";
label1.text = "TDS (ppm)";

label1.adapter.add("x", function(x, target){
  return (axis1.renderer.pixelInnerRadius + (axis1.renderer.pixelRadius - axis1.renderer.pixelInnerRadius) / 2);
});

//////////////// LABEL CONDUCTIVIDAD ///////////////
var label2 = chart.radarContainer.createChild(am4core.Label);
label2.isMeasured = false;
label2.y = 45;
label2.horizontalCenter = "middle";
label2.verticalCenter = "top";
label2.text = "EC (mS/cm)";

label2.adapter.add("x", function(x, target){
  return -(axis2.renderer.pixelInnerRadius + (axis2.renderer.pixelRadius - axis2.renderer.pixelInnerRadius) / 2);
});

//////////////// LEYENDAS ///////////////
var label2 = chart.radarContainer.createChild(am4core.Label);
label2.isMeasured = false;
label2.y = 200;
label2.horizontalCenter = "left";
label2.verticalCenter = "top";
label2.text = "EC: Conductividad eléctrica.";

label2.adapter.add("x", function(x, target){
  return -(axis2.renderer.pixelInnerRadius + (axis2.renderer.pixelRadius - axis2.renderer.pixelInnerRadius) / 2);
});

var label2 = chart.radarContainer.createChild(am4core.Label);
label2.isMeasured = false;
label2.y = 220;
label2.horizontalCenter = "left";
label2.verticalCenter = "top";
label2.text = "PH: Potencial de hidrogeno.";

label2.adapter.add("x", function(x, target){
  return -(axis2.renderer.pixelInnerRadius + (axis2.renderer.pixelRadius - axis2.renderer.pixelInnerRadius) / 2);
});

var label2 = chart.radarContainer.createChild(am4core.Label);
label2.isMeasured = false;
label2.y = 240;
label2.horizontalCenter = "left";
label2.verticalCenter = "top";
label2.text = "TDS: Total de sólidos disueltos.";

label2.adapter.add("x", function(x, target){
  return -(axis2.renderer.pixelInnerRadius + (axis2.renderer.pixelRadius - axis2.renderer.pixelInnerRadius) / 2);
});

var label2 = chart.radarContainer.createChild(am4core.Label);
label2.isMeasured = false;
label2.y = 260;
label2.horizontalCenter = "left";
label2.verticalCenter = "top";
label2.text = "TB: Turbidez.";

label2.adapter.add("x", function(x, target){
  return -(axis2.renderer.pixelInnerRadius + (axis2.renderer.pixelRadius - axis2.renderer.pixelInnerRadius) / 2);
});


}

///// GRÁFICA   ////
am4core.ready(function() {

	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end
	
	// create chart
	
	}); // end am4core.ready()