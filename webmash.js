/*
Student Name: Shantan Reddy Kothapalli
First Name: Shantan
Middle Name: Reddy
Last Name: Kothapalli

UTA ID:1001405517

Project Name: Web Mashup: Display House Address on a Map with Weather details
Project No.2
Due Date: Wednesday Oct 26th 2016
*/
var username = "shantan94";
var request = new XMLHttpRequest();
var marker=[];
var address="";
var temperature="";
var value="";
var temp="";
var add="";
var geocoder;
var infowindow;
var lat;
var log;
var map;


function initMap() {									//inititalize a map
	map=new google.maps.Map(document.getElementById('map'), {
		zoom:17,											//set map zoom to 17
		center: {lat: 32.75, lng: -97.13}			//set latitude and longitude
			});
	geocoder = new google.maps.Geocoder;
	infowindow = new google.maps.InfoWindow;
	google.maps.event.addListener(map,'click', function(coord){
		lat = coord.latLng.lat();						//get latitude from mouse click
		log = coord.latLng.lng();					//get longitude from mouse click
		if(marker.length>0)
		marker[marker.length-1].setMap(null);		//remove all markers from map
		reversegeocode(lat,log,geocoder);			//call geocode function
	});
}


// Reserse Geocoding 
function reversegeocode(lat,log,geocoder) {
	//document.getElementById('output').innerHTML=lat+"<br/>"+log;
	var latlng = {lat: lat, lng: log};
        geocoder.geocode({'location': latlng}, function(results, status) {	//geocode function
          if (status === 'OK') {
            if (results[1]) {							//if the mouse click provides address array
              sendRequest(lat,log);				//call the send function request
            }
          } 
        });
}


function displayResult () {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var temperature1 = xml.getElementsByTagName("temperature");	//get the text in temperature tag
		var clouds = xml.getElementsByTagName("clouds");					//get the text in clouds tag
		var windspeed = xml.getElementsByTagName("windSpeed");		//get the text in windspeed tag
	var str1=[].map.call( temperature1, function(val){							//convert temperature xml format to string
        return val.textContent||val.innerText ||"";								
		}).join("");
	var str2=[].map.call( clouds, function(val){									//convert clouds xml format to string
        return val.textContent||val.innerText||"";
		}).join("");
	var str3=[].map.call( windspeed, function(val){								//convert windspeed xml format to string
        return val.textContent||val.innerText||"";
		}).join("");
		var latlng = {lat: lat, lng: log};
		geocoder.geocode({'location': latlng}, function(results, status) {	//geocoder function to display temperature and address in marker
		if (status === 'OK') {
			  var locmarker = new google.maps.Marker({
						position: latlng,
						map: map,
						zoom: 17
			});
			  temperature=temperature+"temperature: "+str1+"<br/>"+"clouds: "+str2+"<br/>"+"windspeed: "+str3;		//append all the temperature values from the click
			  temp=temp+temperature;										//append the above obtained temperature so as to display in marker
			  address=address+"latitude: "+lat+"<br/>"+"longitude: "+log+"<br/>"+results[1].formatted_address;		//get the address from geocoder
			  add=add+"latitude: "+lat+"<br/>"+"longitude: "+log+"<br/>"+results[1].formatted_address;					//append the above obtained address so as to display in marker
			  marker.push(locmarker);											//add marker to list so as to delete it after a second click
              infowindow.setContent(add+"<br/>"+temp);			//append the address and temperature to the marker
              infowindow.open(map, locmarker);							//display the information window on the marker
			  value=value+address+"<br/>"+temperature+"<br/>"+"<br/>";		//append the temperature and address to a variable to display it in text area
			  document.getElementById("output").innerHTML = value;		//display the temperature and address in text area
			  add="";			//clear the add variable
			  temp="";			//clear the temp variable
		}
	});
	address="";				//clear the address variable
	temperature="";		//clear the temperature variable
    }
}

function sendRequest (lat,log) {
    request.onreadystatechange = displayResult;
    var lat = lat;			//get the latitude from the function call
    var lng = log;		//get the longitude from function call
    request.open("GET"," http://api.geonames.org/findNearByWeatherXML?lat="+lat+"&lng="+lng+"&username="+username);		//ajax request to the weather web service
    request.send(null);
}

function clearAll(){
	document.getElementById('output').innerHTML="<br/>";		//clear the text area after button is clicked
	value="";																		//clear the value string
}
