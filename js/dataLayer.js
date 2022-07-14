(function ($) {
    "use strict";

    window.dl = 1;
    if(window.params && typeof window.params.dl != 'undefined' && window.params.dl && window.params.dl !='null') {
        window.dl = window.params.dl;
        localStorage.setItem("dl", window.dl);
    } else if(localStorage && localStorage.getItem("dl")){
        window.dl = localStorage.getItem("dl");
    }


    // values
    var userId = "u12345abc";
    var loginStatus = "logged_in";
    var userType = "member";


    // dl helpers
    var createEventData = function(event){
        var ob = {};
        ob["event"] = event;
        ob["timestamp"] = new Date().getTime();
        return ob;
    }

    var addEventDataUser = function(ob){
        ob["user_id"] = userId;
        ob["login_status"] = loginStatus;
        ob["user_type"] = userType;
        return ob;
    }

    var addEventDataPageMeta = function(ob){
        ob["content_type"] = $('meta[name="page-type"]').attr('content');
        ob["page_location"] = window.location.href;
        return ob;
    }

    var addClickLinkData = function(ob, target) {
        var domain = (new URL(target.href));
        ob["link_domain"] = domain.hostname;
        ob["link_url"] = target.href;
        ob["element_id"] = target.id
        ob["element_text"] = $(target).text();
        return ob;
    }

    if(window.dl == 1) {


        // <--- COMMON ACTIONS START --->

        // event: page_view
        var ob = createEventData("page_view");
        addEventDataPageMeta(ob);
        addEventDataUser(ob);
        dataLayer.push(ob);

        $(".social-link").click(function(event){

            var ob = createEventData("click_social");
            //ob["type"] = "standard";
            addClickLinkData(ob, this);
            dataLayer.push(ob);

            //alert("");
            //event.preventDefault();
            //return false;
        });

        // <--- COMMON ACTIONS END --->

        // <--- USER ACTIONS START --->

        $("#register-link").click(function(event){

            var ob = createEventData("sign_up");
            ob["type"] = "standard";
            addEventDataUser(ob);
            dataLayer.push(ob);

            alert("user sign up");
            event.preventDefault();
            return false;
        });

        $("#login-link").click(function(event){

            var ob = createEventData("login");
            ob["type"] = "standard";
            addEventDataUser(ob);
            dataLayer.push(ob);
            
            alert("user login");
            event.preventDefault();
            return false;
        });

        // <--- USER ACTIONS END --->


        // <--- FORMS START --->

        // event: search
        $("#site-search-form").submit(function(event){
            
            var searchTerm = $(this).find("#search-term").val();
            var ob = createEventData("search");
            ob["search_term"] = searchTerm;
            ob["search_type"] = "site_search";
            dataLayer.push(ob);
            alert("user search submitted");
            event.preventDefault();
            return false;
        });

        // event: subscribe
        $("#subscribe-banner").submit(function(event){

            var email = $(this).find("input").val();
            if(email && email.length > 0 && email.indexOf("@")) {
                var ob = createEventData("subscribe");
                ob["optin_newlestter"] = "yes";
                ob["event_context"] = "subscribe_banner";
                ob["user_email"] = email;
                dataLayer.push(ob);
                alert("user subscribed banner");
            }
            event.preventDefault();
            return false;
        });

        $("#subscribe-footer").submit(function(event){
            
            var email = $(this).find("input.email-input").val();
            if(email && email.length > 0 && email.indexOf("@")) {
                var ob = createEventData("subscribe");
                ob["optin_newlestter"] = "yes";
                ob["event_context"] = "subscribe_footer";
                ob["user_email"] = email;
                dataLayer.push(ob);
                alert("user subscribed footer");
            }
            event.preventDefault();
            return false;
        });

        // <--- FORMS END --->

    }
})(jQuery);

