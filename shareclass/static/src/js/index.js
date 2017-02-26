
var navbar_height = 60;
var carousel_height = 500;

/* change photo size */
function set_photo_size(){
    var screen_width = screen.width;
    for(i=1;i<4;i++){
        document.getElementById("photo"+String(i)).style.maxWidth = screen_width+ "px";
        if (document.getElementById("photo"+String(i)).style.width < screen_width){
          document.getElementById("photo"+String(i)).style.width = screen_width+ "px";   
        }
    }
}
set_photo_size();
/*
$(document).ready(function(){
    set_photo_size();
    $(window).resize(function() {
        set_photo_size();
    });
});
*/

/* change carousel time */
$('.carousel').carousel({
  interval: 6000 //ms
})
/* to-top icon */
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


jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function sameOrigin(url) {
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
 
    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});


function logout(){
    $.ajax({
        url: "/accounts/logout/",
        type: "POST",
        complete: function(jqXHR,ajaxOptions, thrownError) {
            if (jqXHR.status === 200){ //logout success
                window.location.href = "/";
            }                 
        }
    });
}

/* catch nickname */


/*
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
*/