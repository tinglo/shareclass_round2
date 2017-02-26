window.location.href = "/";

$.ajax({
    url: "/accounts/logout/",
    type: "POST",
    complete: function(jqXHR,ajaxOptions, thrownError) {

        if (jqXHR.status === 200){ //login success
            window.location.href = "/";
        }                
    }
});