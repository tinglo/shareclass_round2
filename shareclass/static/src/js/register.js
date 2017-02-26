/* confirm input */
var error_username = true;
var error_password = true;

//control button
function control_button(){
    if(error_username == false && error_password == false){
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

//check useranme 
function validate_username(){
    var name = $("#username").val();
    if(name.length == 0 ){
        $("#validate-error-username").text("");
        error_username = true;  
        control_button();   
    }
    if(name.length !=0 && name.search(emailRule)== -1){
        $("#validate-error-username").text("信箱格式不符");
        error_username = true;
        control_button();
    }
    if(name.search(emailRule)!= -1){
        $("#validate-error-username").text("");
        error_username = false; 
        control_button();           
    }
}
// check pwd format
function validate_password_format(){
    var pwd1 = $("#password").val();

    if (pwd1.length < 21 && pwd1.length > 5 && pwd1.search(pwdRule)!= -1){
        $("#validate-error-password-format").text("");  
        error_password = false; 
    }
    else{
        if(pwd1.length == 0 ){
            $("#validate-error-password-format").text("");
        }   
        else{
            $("#validate-error-password-format").text("密碼格式不符"); 
        } 
        error_password = true;
    }
}
//check confirm pwd
function validate_password_same(){
    $(document).ready(function() {
        $("#password").keyup(check_pwd);
        $("#confirm-password").keyup(check_pwd);
    });
}
function check_pwd() {
    var pwd1 = $("#password").val();
    var pwd2 = $("#confirm-password").val();

    if(pwd1 == pwd2) {
        $("#validate-error-password").text(""); 
        error_password = false;       
    }
    else {
        $("#validate-error-password").text("輸入密碼不相同");  
        error_password = true;
    }   
    //control button
    control_button();
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
    	url: "/accounts/register/",
        type: "POST",
		data: {'username':$('input[name=username]').val(),
               'password':$('input[name=password]').val(), 
               'confirm_password':$('input[name=confirm_password]').val()
        },
        dataType: "json",
        complete: function(jqXHR,ajaxOptions, thrownError) {
            if (jqXHR.status === 201){ //login success;
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