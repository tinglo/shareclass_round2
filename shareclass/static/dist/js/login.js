function check_input(){var e=$("#username").val(),t=$("#password").val();0!=e.length&&0!=t.length?document.getElementById("submit-button").disabled=!1:document.getElementById("submit-button").disabled=!0}$(document).ready(function(){$("#username").keyup(check_input),$("#password").keyup(check_input)}),jQuery(document).ajaxSend(function(e,t,n){function o(e){var t=null;if(document.cookie&&""!=document.cookie)for(var n=document.cookie.split(";"),o=0;o<n.length;o++){var u=jQuery.trim(n[o]);if(u.substring(0,e.length+1)==e+"="){t=decodeURIComponent(u.substring(e.length+1));break}}return t}function u(e){var t=document.location.host,n=document.location.protocol,o="//"+t,u=n+o;return e==u||e.slice(0,u.length+1)==u+"/"||e==o||e.slice(0,o.length+1)==o+"/"||!/^(\/\/|http:|https:).*/.test(e)}function r(e){return/^(GET|HEAD|OPTIONS|TRACE)$/.test(e)}!r(n.type)&&u(n.url)&&t.setRequestHeader("X-CSRFToken",o("csrftoken"))}),$("form").submit(function(e){e.preventDefault(),$.ajax({url:"/accounts/login/",type:"POST",data:{username:$("input[name=username]").val(),password:$("input[name=password]").val()},dataType:"json",complete:function(e,t,n){200===e.status?window.location.href="/":(document.getElementById("error").style.display="block",document.getElementById("error").innerHTML='<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'+e.responseText.split('"')[3],document.getElementById("form-id").reset())}})});