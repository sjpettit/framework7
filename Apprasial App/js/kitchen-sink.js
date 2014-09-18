var myApp = new Framework7({
    modalTitle: 'Framework7',
    animateNavBackIcon: true,

});
// Expose Internal DOM library
var $$ = Dom7;
//Declare user tracking variable
var userKey;
var orderArray;
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

myApp.onPageInit('searchbar', function(page) {
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
                  var stateObjects = getStateObjects(orderArray);
                  console.log(stateObjects);
                  for(var i = 0; i<stateObjects.length;i++){
                    var pluralityString;
                    if(stateObjects[i].stateOrderArray.length>1){
                      pluralityString = " Orders";
                    }else{
                      pluralityString = " Order";
                    }
                    $('#group-list').append(               
                      "<li>"+
                      "<div id="+i+" class=\"item-content item-link\">"+
                          "<div class=\"item-inner\">"+
                                "<div class=\"item-title\">"+stateObjects[i].state+"</div>"+ 
                                "<div class=\"order-ammount\">"+stateObjects[i].stateOrderArray.length+
                                pluralityString+" Found<\div>"+
                          "</div>"+
                        "</div>"+    
                      "</li>")
                  }
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
                  var cityObjects = getCityObjects(orderArray);
                  console.log(cityObjects);
                  for(var i = 0; i<cityObjects.length;i++){
                    var pluralityString;
                    if(cityObjects[i].cityOrderArray.length>1){
                      pluralityString = " Orders";
                    }else{
                      pluralityString = " Order";
                    }
                    $('#group-list').append(               
                      "<li>"+
                      "<div id="+i+" class=\"item-content item-link\">"+
                          "<div class=\"item-inner\">"+
                                "<div class=\"item-title\">"+cityObjects[i].city+"</div>"+ 
                                "<div class=\"order-ammount\">"+cityObjects[i].cityOrderArray.length+
                                pluralityString+" Found<\div>"+
                          "</div>"+
                        "</div>"+    
                      "</li>")
                  }
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
                  var zipObjects = getZipObjects(orderArray);
                  console.log(zipObjects);
                  for(var i = 0; i<zipObjects.length;i++){
                    var pluralityString;
                    if(zipObjects[i].zipOrderArray.length>1){
                      pluralityString = " Orders";
                    }else{
                      pluralityString = " Order";
                    }
                    $('#group-list').append(               
                      "<li>"+
                      "<div id="+i+" class=\"item-content item-link\">"+
                          "<div class=\"item-inner\">"+
                                "<div class=\"item-title\">"+zipObjects[i].zip+"</div>"+ 
                                "<div class=\"order-ammount\">"+zipObjects[i].zipOrderArray.length+
                                pluralityString+" Found<\div>"+
                          "</div>"+
                        "</div>"+    
                      "</li>")
                  }
              }
               
              })
            }
            console.log(orderArray);
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


    console.log(userKey);

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