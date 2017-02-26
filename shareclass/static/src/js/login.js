/* confirm input */

$(document).ready(function() {
    $("#username").keyup(check_input);
    $("#password").keyup(check_input);
});
function check_input(){
	var name = $("#username").val();
	var pwd = $("#password").val();
	if (name.length != 0 && pwd.length != 0){
		document.getElementById("submit-button").disabled = false;
	}
	else{
		document.getElementById("submit-button").disabled = true;
	}
}
/* ajax CSRF validation */
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

/* submit input */
$("form").submit(function(e){
	e.preventDefault();
    $.ajax({
    	url: "/accounts/login/",
        type: "POST",
		data: {'username':$('input[name=username]').val(),
               'password':$('input[name=password]').val()
        },
        dataType: "json",
        complete: function(jqXHR,ajaxOptions, thrownError) {
            if (jqXHR.status === 200){ //login success
                window.location.href = "/";

            }
            else{
                document.getElementById('error').style.display = "block";
                document.getElementById("error").innerHTML = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' + jqXHR.responseText.split('"')[3];
                document.getElementById("form-id").reset();
            }   	            
        }
    });
});


