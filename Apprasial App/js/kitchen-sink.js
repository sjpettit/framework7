var myApp = new Framework7({
    modalTitle: 'Framework7',
    animateNavBackIcon: true,
    
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
    // Enable Dynamic Navbar for this view
    dynamicNavbar: true
});
// Add another view, which is in right panel


// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function () {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();

});



       myApp.modalLogin('Enter your username and password', 'Login: ',function (username, password) {         
            /*xhr.simpleCall({
                    func:'user_login',
                    data:{
                        loginname:username,
                        password:password
                    }
                },function(response){
                    setTimeout(function(){
                     //   if(response.err_code === 0){

                            //var login = response.data;
                            //GS.setCurrentUser(login.sid,login.user);
                           */ mainView.loadPage('test.html');
                            //myApp.hidePreloader();
                       /* }else{
                            myApp.hidePreloader();
                            myApp.alert(response.err_msg);
                        }*/
                   // },5000);

               // });

        });










