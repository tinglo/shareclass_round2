/* confirm input */

var error_password_format = true;
var error_password_same = true;

//control button
function control_button(){
    var token = document.getElementById("token").value.length;
    if(error_password_format == false && error_password_same == false && token !==0){
        document.getElementById("submit-button").disabled = false;
    }
    else{
        document.getElementById("submit-button").disabled = true;
    }
}
//confirm email
//Regular expression Testing

emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
pwdRule = /^.[A-Za-z0-9]+$/;

function validate_password_format(){
    var pwd1 = $("#password").val();

    if (pwd1.length < 21 && pwd1.length > 5 && pwd1.search(pwdRule)!= -1){
        $("#validate-error-password-format").text("");  
        error_password_format = false; 
    }
    else{
        if(pwd1.length == 0 ){
            $("#validate-error-password-format").text("");
        }   
        else{
            $("#validate-error-password-format").text("密碼格式不符"); 
        } 
        error_password_format = true;
    }
    control_button(); 
}
function validate_password_same(){
    $(document).ready(function() {
        $("#password").keyup(check_pwd);
        $("#confirm-password").keyup(check_pwd);
        $("#token").keyup(check_pwd);
    });
}


function check_pwd() {
    var pwd1 = $("#password").val();
    var pwd2 = $("#confirm-password").val();


    if(pwd1 == pwd2) {
        $("#validate-error-password").text(""); 
        error_password_same = false;       
    }
    else {
        $("#validate-error-password").text("輸入密碼不相同");  
        error_password_same = true;
    }
    control_button();  
} 

/* ajax csrf validation */
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
    	url: location.pathname,
        type: "POST",
		data: {'new_password':$('input[name=new_password]').val(),
               'confirm_new_password':$('input[name=confirm_new_password]').val(),
               'entry_token':$('input[name=entry_token]').val()
        },
        dataType: "json",
        complete: function(jqXHR,ajaxOptions, thrownError) {
            if (jqXHR.status === 200){ //reset success
                alert("密碼設置成功!");
                window.location.href = "/accounts/login/";

            }
            else{
                document.getElementById('error').style.display = "block";
                document.getElementById("error").innerHTML = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' + jqXHR.responseText.split('"')[3];
                document.getElementById("form-id").reset();
            }   	            
        }
    });
});

