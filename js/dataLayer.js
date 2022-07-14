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

    var currency = "AUD";


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

        // event: click_social
        $(".social-link").click(function(event){
            var ob = createEventData("click_social");
            addClickLinkData(ob, this);
            dataLayer.push(ob);
        });

        // event: click_footer
        $(".footer .quick-links").click(function(event){
            var ob = createEventData("click_footer");
            addClickLinkData(ob, this);
            dataLayer.push(ob);
        });

        // event: click_cart
        $("#view-cart").click(function(event){
            var ob = createEventData("click_cart");
            addClickLinkData(ob, this);
            ob["event_context"] = "header";
            dataLayer.push(ob);
        });

        /*
        // event: view_promotion
        $(".hero-carousel .carousel-item a").click(function(event){

            var ob = createEventData("view_promotion");
            addClickLinkData(ob, this);

            ob["ecommerce"] = {
                "currency": currency,
                "items": [
                    {
                        "creative_name": undefined,
                        "creative_slot": "home_hero",
                        //"location_id": "location_id",
                        "promotion_id": $(this).attr("title"),
                        "promotion_name": $(this).attr("title")
                    }
                ]
            }
            dataLayer.push(ob);
        });
        */
        // event: select_promotion
        $(".hero-carousel .carousel-item a").click(function(event){

            var ob = createEventData("select_promotion");
            addClickLinkData(ob, this);

            ob["ecommerce"] = {
                "currency": currency,
                "items": [
                    {
                        "creative_name": undefined,
                        "creative_slot": "home_hero",
                        //"location_id": "location_id",
                        "promotion_id": $(this).attr("title"),
                        "promotion_name": $(this).attr("title")
                    }
                ]
            }
            dataLayer.push(ob);
        });

         // event: select_promotion
        $(".promotion-tiles a").click(function(event){

            var ob = createEventData("select_promotion");
            addClickLinkData(ob, this);

            ob["ecommerce"] = {
                "currency": currency,
                "items": [
                    {
                        "creative_name": undefined,
                        "creative_slot": "home_tiles",
                        //"location_id": "location_id",
                        "promotion_id": $(this).attr("title"),
                        "promotion_name": $(this).attr("title")
                    }
                ]
            }
            dataLayer.push(ob);
        });

        // <--- COMMON ACTIONS END --->

        // <--- USER ACTIONS START --->

        // event: sign_up
        $("#register-link").click(function(event){

            var ob = createEventData("sign_up");
            ob["type"] = "standard";
            addEventDataUser(ob);
            dataLayer.push(ob);

            alert("user sign up");
            event.preventDefault();
            return false;
        });

        // event: login
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

        // <--- CATEGORY ACTIONS START --->

        // event: click_sort
        $(".sort-menu a").click(function(event){

            var ob = createEventData("click_sort");
            addClickLinkData(ob, this);
            ob["name"] = $(this).text().toLowerCase(),
            ob["type"] = "product";
            dataLayer.push(ob);
            
            //alert("products sorted");
            //event.preventDefault();
            //return false;
        });

        // <--- CATEGORY ACTIONS END --->

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

        // event: search
        $("#product-search").submit(function(event){
            
            var searchTerm = $(this).find("#product-search-term").val();
            var ob = createEventData("search");
            ob["search_term"] = searchTerm;
            ob["search_type"] = "product_search";
            dataLayer.push(ob);
            alert("user product search submitted");
            event.preventDefault();
            return false;
        });

        $("#product-search").submit(function(event){
            
            var searchTerm = $(this).find("#product-search-term").val();
            var ob = createEventData("search");
            ob["search_term"] = searchTerm;
            ob["search_type"] = "product_search";
            dataLayer.push(ob);
            alert("user product search submitted");
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

        // event: subscribe
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

        // event: contact
        $("#contactForm").submit(function(event){
            
            var email = $(this).find("input.email").val();
            if(email && email.length > 0 && email.indexOf("@")) {
                var ob = createEventData("contact");
                ob["user_email"] = email;
                ob["subject"] = "general";
                ob["form_id"] = $(this).id;
                ob["form_name"] = "contact us";
                ob["method"] = "online form";
                ob["step_label"] = "details";
                ob["step_number"] = "1";
                dataLayer.push(ob);
                alert("contact us form submitted");
            }
            event.preventDefault();
            return false;
        });


        // <--- FORMS END --->

    }
})(jQuery);

