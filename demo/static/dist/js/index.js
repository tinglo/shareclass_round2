
var navbar_height = 60;
var carousel_height = 500;

var screen_width = window.screen.width;
for(i=1;i<4;i++){
    document.getElementById("photo"+String(i)).style.maxWidth = window.screen.width+ "px";
    if (document.getElementById("photo"+String(i)).style.width < screen_width){
      document.getElementById("photo"+String(i)).style.width = window.screen.width+ "px";   
    }
}

function myFunction() {
    var x = document.getElementById("navbar-id");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
//change carousel time
$('.carousel').carousel({
  interval: 6000 //ms
})
//to-top
$(function(){
    $("#to-top").click(function(){
        $('html, body').animate({
            scrollTop:0
        },550);
    });
    $(window).scroll(function() {
        if($(this).scrollTop() > 100){
            $('#to-top').fadeIn("fast");
        } 
        else{
            $('#to-top').stop().fadeOut("fast");
        }
    });
});


var total_cookie = document.cookie;
if (total_cookie.indexOf("nickname")!=-1){
    var tmp = total_cookie.split(';');
    if (tmp[0].indexOf("nickname")!=-1){
        nickname =  tmp[0].split('=')[1];
    }
    else{
        nickname =  tmp[1].split('=')[1];
    }
}
if(nickname!='' && total_cookie.indexOf(";")!=-1){
    document.getElementById("log-id").style.display = 'none';
    document.getElementById("user-icon-id").style.display = 'block';
    document.getElementById("nickname").innerHTML = nickname + '<span class="caret"></span>';
}
else{
    document.getElementById("log-id").style.display = 'block';
    document.getElementById("user-icon-id").style.display = 'none';
}