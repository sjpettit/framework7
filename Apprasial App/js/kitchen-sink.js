var myApp = new Framework7({
    modalTitle: 'Framework7',
    animateNavBackIcon: true,

});
// Expose Internal DOM library
var $$ = Dom7;
//Declare global tracking variables
var userKey;
var orderArray;
var geocodeData;
var zipObjects;
var cityObjects;
var stateObjects;
var type;
var currentOrderArray;
var map;
var currentLocationMarker;
var destinationMarker;
var dirService;
var dirRenderer;
var drivingDistance;
var drivingDuration;
var prevOrderDiv;
var drivingSteps;

      tinymce.init({
          selector: "textarea"
       });



//initalize login
login();
// Add main view
var mainView = myApp.addView('.view-main', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
var leftView = myApp.addView('.view-left', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


function getStateObjects(orderArr){
  var stateObjectArray = new Array();
  var tempStateArray = new Array();
  var stateIndex = -1;
  for(var i = 0;i<orderArr.length;i++){
    stateIndex = tempStateArray.indexOf(orderArr[i].state);
    if(stateObjectArray.length>0 && stateIndex != -1){
      stateObjectArray[stateIndex].stateOrderArray.push(orderArr[i]);
    }else{
      stateObjectArray.push({ state:""+orderArr[i].state,stateOrderArray: new Array()});
      stateObjectArray[stateObjectArray.length-1].stateOrderArray.push(orderArr[i]);
      tempStateArray.push(orderArr[i].state);
    }
  }
  return stateObjectArray;
}

function getZipObjects(orderArr){
  var zipObjectArray = new Array();
  var tempZipArray = new Array();
  var zipIndex = -1;
  for(var i = 0;i<orderArr.length;i++){
    zipIndex = tempZipArray.indexOf(orderArr[i].zip);
    if(zipObjectArray.length>0 && zipIndex != -1){
      zipObjectArray[zipIndex].zipOrderArray.push(orderArr[i]);
    }else{
      zipObjectArray.push({ zip:""+orderArr[i].zip,zipOrderArray: new Array()});
      zipObjectArray[zipObjectArray.length-1].zipOrderArray.push(orderArr[i]);
      tempZipArray.push(orderArr[i].zip);
    }
  }
  return zipObjectArray;
}

function getCityObjects(orderArr){
  var cityObjectArray = new Array();
  var tempCityArray = new Array();
  var cityIndex = -1;
  for(var i = 0;i<orderArr.length;i++){
    cityIndex = tempCityArray.indexOf(orderArr[i].city + ", " + orderArr[i].state);
    if(cityObjectArray.length>0 && cityIndex != -1){
      cityObjectArray[cityIndex].cityOrderArray.push(orderArr[i]);
    }else{
      cityObjectArray.push({ city:orderArr[i].city + ", " + orderArr[i].state,cityOrderArray: new Array()});
      cityObjectArray[cityObjectArray.length-1].cityOrderArray.push(orderArr[i]);
      tempCityArray.push(orderArr[i].city + ", " + orderArr[i].state);
    }
  }
  return cityObjectArray;
}

function convertTime(time){
  var minutes = 0;
  var hours = 0;
  var timeString = "";
  if(time>60){
    minutes = time/60;
  }
  if(minutes>60){
    hours = minutes/60
  }
  var seconds;
  var minPlurality = " minutes";
  var secondPlurality = " seconds";
  var hourPlurality = " hours";
  if(seconds<2&&seconds>=1){
    secondPlurality = " second";
  }
  seconds = time;
  timeString = seconds+secondPlurality;
  
  if(minutes>0){
    seconds = (minutes %1)*60;
    if(minutes<2&&minutes>=1){
      minPlurality = " minute";
    }
    if(seconds<2&&seconds>=1){
      secondPlurality = " second";
    }
    timeString = minutes.toString().split(".")[0]+ minPlurality +" ";
    timeString = timeString+seconds.toString().split(".")[0]+secondPlurality;
  }
  if(hours>0){
    minutes = (hours %1)*60;
    if(minutes<2&&minutes>=1){
      minPlurality = " minute";
    }
    if(hours<2&&hours>=1){
      hourPlurality = " hour";
    }
    timeString = hours.toString().split(".")[0]+hourPlurality+" ";
    timeString = timeString+minutes.toString().split(".")[0]+minPlurality +" ";
    timeString = timeString+seconds.toString().split(".")[0]+secondPlurality;
  }

  return timeString
}


  $$(document).on('click', '.load-orders', function(e){
          

                    leftView.loadPage('order-page.html');
                    mainView.loadPage('map-page.html');

                    if(type == 'zip'){
                      var ordersToLoad = zipObjects[this.id].zipOrderArray;
                      loadOrders(ordersToLoad);
                    }else if(type == 'state'){
                      var ordersToLoad = stateObjects[this.id].stateOrderArray;
                      loadOrders(ordersToLoad);
                    }else if(type == 'city'){
                      var ordersToLoad = cityObjects[this.id].cityOrderArray;
                      loadOrders(ordersToLoad);
                    }
                    currentOrderArray = ordersToLoad;
                    
  });


function loadOrders(ordersToLoad){

myApp.onPageAfterAnimation('order-page', function(page) {
      $('#back-button').removeClass("invisible");
      $('#order-list').html("");
                    for(var i = 0;i<ordersToLoad.length;i++){
                      $('#order-list').append(               
                        "<li>"+
                        "<div id="+i+" class=\"item-content item-link show-marker\">"+
                          "<div class=\"item-inner\">"+
                            "<div class=\"item-title-row\">"+
                                "<div class=\"item-title\"> Order "+ordersToLoad[i].orderID+"</div>"+ 
                            "</div>"+
                            "<div class=\"item-subtitle\">  Due Date: "+ordersToLoad[i].order_due_date+"</div>"+
                            "<div class=\"item-subtitle\">  City: "+ordersToLoad[i].city+", "+ordersToLoad[i].state+ "</div>"+
                            "<div id=\"distance-"+i+"\"class=\"\"></div>"+
                            "<div id=\"duration-"+i+"\"class=\"\"></div>"+
                          "</div>"+    
                        "</li>"
                      )
                    
                      }
});
}

$$('.back').on('click', function() {
  leftView.goBack();
});


myApp.onPageAfterAnimation('order-info', function(page) {
        prevOrderDiv.className = "item-content";
        $('#order-info').append(prevOrderDiv);
        $('#order-info').append(drivingSteps);

});


var myDropzone;
function processQueue(){
    myDropzone.processQueue();
}

myApp.onPageAfterAnimation('tab-page', function(page) {
        tinymce.init({
          selector: "notes"
       });

myDropzone = new Dropzone("#myDropzone", { url: "/file/post"});
console.log(myDropzone);

});

$$(document).on('click', '.show-marker', function(e){
    if(prevOrderDiv){
        prevOrderDiv.className = "item-content item-link show-marker";
        if(prevOrderDiv == document.getElementById(this.id)){
            leftView.loadPage('order-info.html');
            mainView.loadPage('tab-page.html');

        }
    }
    var currentOrder = currentOrderArray[this.id];
    var currId= this.id;
      $.ajax({
          url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+currentOrder.order_addres+", "+currentOrder.city+", "+currentOrder.state+'&key=AIzaSyBjm_gt77HZ8-aFj8DvnnVqTOyg54fNMFU',
            beforeSend: function(xhr) {
                myApp.showPreloader();
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
      }).done(function(data) {
            myApp.hidePreloader();
           if(destinationMarker){
            destinationMarker.setMap(null);
           }
            geocodeData = JSON.parse(data).results;
            console.log(geocodeData[0].geometry.location.lat+", "+geocodeData[0].geometry.location.lng);
            var myLatlng = new google.maps.LatLng(geocodeData[0].geometry.location.lat,geocodeData[0].geometry.location.lng);
            console.log(myLatlng);
            var image = 'img/MapMarker_Flag5_Chartreuse.png';
            destinationMarker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: image,
            title: 'Your Destination!'
           });
           destinationMarker.setMap(map);
           var request = {
                    origin: currentLocationMarker.position,
                    destination: destinationMarker.position,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                dirService.route(request, function(result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        console.log(result);
                        console.log(currId);
                        console.log(result.routes[0].legs[0].steps[0].instructions);
                        drivingSteps = "<li>"+"<div class=\"item-content\">"+"<div class=\"item-inner\">"+"<div class=\"item-title\"> Driving Instructions </div></div></div></li>";
                        for(var i = 0; i<result.routes[0].legs[0].steps.length; i++){
                            drivingSteps = drivingSteps + "<li>"+"<div class=\"item-content\">"+"<div class=\"item-inner\">"+"<div class=\"item-text\">"+result.routes[0].legs[0].steps[i].instructions+"</div></div></div></li>";
                        }
                        document.getElementById('duration-'+currId).className="item-text";
                        document.getElementById('duration-'+currId).innerHTML="Driving Duration: "+convertTime(result.routes[0].legs[0].duration.value);
                        
                        dirRenderer.setDirections(result);
                    }
               });
        }).fail(function(err) {
           myApp.hidePreloader();
           console.log('error: '+err);
           //TODO add error function
        });
        document.getElementById(currId).className = "item-content item-link show-marker active";
        prevOrderDiv = document.getElementById(currId);
});


myApp.onPageAfterAnimation('map-page', function(page) {

 dirService = new google.maps.DirectionsService();
 dirRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});

var x = document.getElementById("demo");
    function getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition,showError);
      } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
    
    function showError(error) {
      switch(error.code) {
          case error.PERMISSION_DENIED:
              x.innerHTML = "User denied the request for Geolocation."
              break;
          case error.POSITION_UNAVAILABLE:
              x.innerHTML = "Location information is unavailable."
              break;
          case error.TIMEOUT:
              x.innerHTML = "The request to get user location timed out."
              break;
          case error.UNKNOWN_ERROR:
              x.innerHTML = "An unknown error occurred."
              break;
      }
    }
    function showPosition(position){ 
        var mapOptions = {
          center: { lat: position.coords.latitude, lng: position.coords.longitude},
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        dirRenderer.setMap(map);
        var myLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        var image = 'img/MapMarker_Marker_Inside_Pink.png';
        currentLocationMarker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: image,
            title: 'You are Here!'
        });
        myApp.hidePreloader();
     }

      myApp.showPreloader();
      getLocation();

});

myApp.onPageBeforeAnimation('order-search', function(page) {
        $('#back-button').addClass("invisible");

});


myApp.onPageBeforeAnimation('left-page-1', function(page) {
                $('#zip').attr('checked', false);
                $('#city').attr('checked', false);
                $('#state').attr('checked', false);
                mainView.loadPage('main-page-1.html');
});



myApp.onPageInit('order-search', function(page) {
    // Add views
    document.getElementById('view-left').className = "view view-left navbar-through toolbar-through"
    document.getElementById('view-main').className = "view view-main navbar-through toolbar-through frame-shift"
    document.getElementById('view-navbar').className = "view view-navbar";
    document.getElementById('view-toolbar').className = "view view-toolbar";
    $.ajax({
            url: 'http://localhost:3000/api/v1/getOrderDetail?user='+userKey+'&apiKey=1dca7720-395c-11e4-916c-0800200c9a66',
            beforeSend: function(xhr) {
                myApp.showPreloader();
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
        .done(function(data) {
            myApp.hidePreloader();
            orderArray = JSON.parse(data).data;
            if(orderArray.length>0){
              $(".welcome").html("Welcome, "+orderArray[0].order_party_name);
              
              
              
              $("#state").change(function(event){
                if(!this.checked && !$('#zip').checked && !$('#city').checked){
                  $('#group-list').html("");
                }
                if(this.checked){
                  $('#city').attr('checked', false);
                  $('#zip').attr('checked', false);
                  $('#group-list').html("");
                  stateObjects = getStateObjects(orderArray);
                  for(var i = 0; i<stateObjects.length;i++){
                    var pluralityString;
                    if(stateObjects[i].stateOrderArray.length>1){
                      pluralityString = " Orders";
                    }else{
                      pluralityString = " Order";
                    }
                    $('#group-list').append(               
                      "<li class=\"order-button\">"+
                      "<div id="+i+" class=\"item-content item-link load-orders\">"+
                          "<div class=\"item-inner\">"+
                                "<div class=\"item-title\">"+stateObjects[i].state+"</div>"+ 
                                "<div class=\"order-ammount\">"+stateObjects[i].stateOrderArray.length+
                                pluralityString+" Found<\div>"+
                          "</div>"+
                        "</div>"+    
                      "</li>")
                  }
                type='state';
              }
              });
              $("#city").change(function(event){
                if(!this.checked && !$('#zip').checked && !$('#state').checked){
                  $('#group-list').html("");
                }
                if(this.checked){
                  $('#state').attr('checked', false);
                  $('#zip').attr('checked', false);
                  $('#group-list').html("");
                  cityObjects = getCityObjects(orderArray);
                  for(var i = 0; i<cityObjects.length;i++){
                    var pluralityString;
                    if(cityObjects[i].cityOrderArray.length>1){
                      pluralityString = " Orders";
                    }else{
                      pluralityString = " Order";
                    }
                    $('#group-list').append(               
                      "<li>"+
                      "<div id="+i+" class=\"item-content item-link load-orders\">"+
                          "<div class=\"item-inner\">"+
                                "<div class=\"item-title\">"+cityObjects[i].city+"</div>"+ 
                                "<div class=\"order-ammount\">"+cityObjects[i].cityOrderArray.length+
                                pluralityString+" Found<\div>"+
                          "</div>"+
                        "</div>"+    
                      "</li>")
                  }
                  type='city';
              }
               
              });
              $("#zip").change(function(event){
                if(!this.checked && !$('#state').checked && !$('#city').checked){
                  $('#group-list').html("");
                }
                if(this.checked){
                  $('#city').attr('checked', false);
                  $('#state').attr('checked', false);
                  $('#group-list').html("");
                  zipObjects = getZipObjects(orderArray);
                  for(var i = 0; i<zipObjects.length;i++){
                    var pluralityString;
                    if(zipObjects[i].zipOrderArray.length>1){
                      pluralityString = " Orders";
                    }else{
                      pluralityString = " Order";
                    }
                    $('#group-list').append(               
                      "<li>"+
                      "<div id="+i+" class=\"item-content item-link load-orders\">"+
                          "<div class=\"item-inner\">"+
                                "<div class=\"item-title\">"+zipObjects[i].zip+"</div>"+ 
                                "<div class=\"order-ammount\">"+zipObjects[i].zipOrderArray.length+
                                pluralityString+" Found<\div>"+
                          "</div>"+
                        "</div>"+    
                      "</li>"
                    )
                  }
                  type='zip';
              }
               
              })
            }
        }).fail(function(err) {
                myApp.alert('Server Connection Lost', 'Error:', function() {
                    myApp.hidePreloader();
                    //TODO: call logout
                });
        });
    $$('.logout').on('click', function() {
        document.getElementById('view-left').className = "view view-left navbar-through toolbar-through hidden"
        document.getElementById('view-main').className = "view view-main navbar-through toolbar-through"
        document.getElementById('view-navbar').className = "view view-navbar hidden";
        document.getElementById('view-toolbar').className = "view view-toolbar hidden";
        mainView.loadPage('login.html');
        login();
    });



});
// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function() {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function() {
    myApp.hideIndicator();

});
var xmlhttp;
if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
} else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
    }
}


function login() {
    myApp.modalLogin('Enter your username and password', 'Login: ', function(username, password) {

        $.ajax({
                url: "http://localhost:3000/api/v1/checkUserCredential?userName=" + username + '&password=' + password + '&apiKey=df5cb700-395b-11e4-916c-0800200c9a66',
                beforeSend: function(xhr) {
                    myApp.showPreloader();
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                }
            })
            .done(function(data) {
                myApp.hidePreloader();
                mainView.loadPage('main-page-1.html');
                leftView.loadPage('left-page-1.html');
                userKey = JSON.parse(data).data;
            }).fail(function(err) {

                if (err.status === 401) {
                    myApp.alert('Incorret User Name or Password', 'Error:', function() {
                        myApp.hidePreloader();
                        login();
                    });
                } else {
                    myApp.alert('Could not Connect to the Server', 'Error:', function() {
                        myApp.hidePreloader();
                        login();
                    });
                }
            });


    });

}