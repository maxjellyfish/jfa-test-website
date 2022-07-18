import db from "./db.js"
//db.products.find(prod => prod.id == paramId)

// data-interval="false"

(function ($) {
    "use strict";

    window.dataLayer = window.dataLayer || []
    window.dl = 'y';

    var getQueryParam = function(key){
        var value = undefined;
        if(window.params && typeof window.params[key] != 'undefined' && window.params[key] && window.params[key] !='null'){
            value = window.params[key];
        }
        return value;
    }

    // <--- SETTINGS START --->

    if(getQueryParam("dl")) {
        window.dl = getQueryParam("dl")
    } else if(localStorage && localStorage.getItem("dl")){
        window.dl = localStorage.getItem("dl");
    }
    localStorage.setItem("dl", window.dl);

    window.dlLog = 'y';
    if(getQueryParam("dlLog")) {
        window.dlLog = getQueryParam("dlLog");
    } else if(localStorage && localStorage.getItem("dlLog")){
        window.dlLog = localStorage.getItem("dlLog");
    }
    localStorage.setItem("dlLog", window.dlLog);

    // const values
    var userId = "u12345abc";
    var loginStatus = "logged_in";
    var userType = "member";
    var currency = "AUD";
    var pageType = $('meta[name="page-type"]').attr('content');

    // <--- SETTINGS END --->

    // <--- TRACKING HELPERS START --->

    var track = function(ob) {
        if(window.dataLayer && window.dl == 'y') {
            window.dataLayer.push(ob);
        }
        if(window.dlLog == 'y') {
            console.log('track', ob);
        }
        
    }

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
        ob["content_type"] = pageType;
        ob["page_location"] = window.location.href;
        return ob;
    }

    var addEventDataClickLink = function(ob, target) {
        var domain = (new URL(target.href));
        ob["link_domain"] = domain.hostname;
        ob["link_url"] = target.href;
        ob["element_id"] = target.id
        ob["element_text"] = $(target).text();
        return ob;
    }


    var addCartData = function(ob){

        var cart = localStorage.getItem("user-cart")
        cart = cart ? JSON.parse(cart) : [];

        var items = [];
        var total = 0;
        for(var i=0; i<cart.length; i++){
            items.push({
                "item_brand": cart[i].brand,
                "item_category": cart[i].categoryId,
                "item_id": cart[i].id,
                "item_name": cart[i].name,
                //"item_variant": "item_variant",
                "price": cart[i].price,
                "item_original_price" : cart[i].originalPrice,
                "quantity": "quantity",
                "item_img" : cart[i].img
            });
            total += (cart[i].price * cart[i].qty);
        }

        ob.ecommerce = typeof ob.ecommerce != 'undefined' ? ob.ecommerce : {};
        ob.ecommerce.value = typeof ob.ecommerce.value != 'undefined' ? ob.ecommerce.value : 0;
        ob.ecommerce.items = typeof ob.ecommerce.items != 'undefined' ? ob.ecommerce.items : [];

        ob.ecommerce.value = total;
        ob.ecommerce.items = items;
    }

    // event hooks 
    window.eventHooks = window.eventHooks || {};

    window.eventHooks["addToCart"] = function(product) {
        //console.log("eventHooks", product);
        var ob = createEventData("add_to_cart");
        ob['ecommerce'] = {
            "currency": currency,
            "value": product.price,
            "items": [
                {
                    "item_brand": product.brand,
                    "item_category": product.categoryId,
                    "item_id": product.id,
                    "item_name": product.name,
                    //"item_variant": "item_variant",
                    "price": product.price,
                    "item_original_price" : product.originalPrice,
                    "quantity": (typeof product.qty == 'undefined' && product.qty > 0 ? product.qty : 1),
                    "item_img" : product.img

                }
            ]
        }
        track(ob);
    };

    window.eventHooks["removeFromCart"] = function(product) {
        //console.log("eventHooks", product);
        var ob = createEventData("remove_from_cart");
        ob['ecommerce'] = {
            "currency": currency,
            "value": product.price,
            "items": [
                {
                    "item_brand": product.brand,
                    "item_category": product.categoryId,
                    "item_id": product.id,
                    "item_name": product.name,
                    //"item_variant": "item_variant",
                    "price": product.price,
                    "item_original_price" : product.originalPrice,
                    "quantity": (typeof product.qty == 'undefined' && product.qty > 0 ? product.qty : 1),
                    "item_img" : product.img

                }
            ]
        }
        track(ob);
    };

    // <--- TRACKING HELPERS END --->

    // <--- COMMON ACTIONS START --->

    // event: page_view
    var ob = createEventData("page_view");
    addEventDataPageMeta(ob);
    addEventDataUser(ob);
    track(ob);

    // event: click_social
    $(".social-link").click(function(event){
        var ob = createEventData("click_social");
        addEventDataClickLink(ob, this);
        track(ob);
    });

    // event: click_footer
    $(".footer .quick-links a").click(function(event){
        var ob = createEventData("click_footer");
        addEventDataClickLink(ob, this);
        track(ob);
    });

    // event: click_cart
    $("#view-cart").click(function(event){
        var ob = createEventData("click_cart");
        addEventDataClickLink(ob, this);
        ob["event_context"] = "header";
        track(ob);
    });

    // event: sign_up
    $("#register-link").click(function(event){

        var ob = createEventData("sign_up");
        ob["type"] = "standard";
        addEventDataUser(ob);
        track(ob);

        alert("user sign up");
        event.preventDefault();
        return false;
    });

    // event: login
    $("#login-link").click(function(event){

        var ob = createEventData("login");
        ob["type"] = "standard";
        addEventDataUser(ob);
        track(ob);
        
        alert("user login");
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
            track(ob);
            alert("user subscribed footer");
        }
        event.preventDefault();
        return false;
    });

    // <--- COMMON ACTIONS END --->

    // <--- HOME ACTIONS START --->

    /*
    // event: view_promotion
    $(".hero-carousel .carousel-item a").click(function(event){

        var ob = createEventData("view_promotion");
        addEventDataClickLink(ob, this);

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
        track(ob);
    });
    */
    // event: select_promotion
    $(".hero-carousel .carousel-item a").click(function(event){

        var ob = createEventData("select_promotion");
        addEventDataClickLink(ob, this);

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
        track(ob);
    });

    // event: select_promotion
    $(".promotion-tiles a").click(function(event){

        var ob = createEventData("select_promotion");
        addEventDataClickLink(ob, this);

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
        track(ob);
    });

    // event: search
    $("#site-search-form").submit(function(event){
        
        var searchTerm = $(this).find("#search-term").val();
        var ob = createEventData("search");
        ob["search_term"] = searchTerm;
        ob["search_type"] = "site_search";
        track(ob);
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
            track(ob);
            alert("user subscribed banner");
        }
        event.preventDefault();
        return false;
    });

    // <--- HOME ACTIONS END --->

    // <--- CATEGORY ACTIONS START --->

    // event: click_sort
    $(".sort-menu a").click(function(event){

        var ob = createEventData("click_sort");
        addEventDataClickLink(ob, this);
        ob["name"] = $(this).text().toLowerCase(),
        ob["type"] = "product";
        track(ob);
        
        //alert("products sorted");
        //event.preventDefault();
        //return false;
    });

    // event: search
    $("#product-search").submit(function(event){
        
        var searchTerm = $(this).find("#product-search-term").val();
        var ob = createEventData("search");
        ob["search_term"] = searchTerm;
        ob["search_type"] = "product_search";
        track(ob);
        alert("user product search submitted");
        event.preventDefault();
        return false;
    });

    // event: select_item
    $(".product-link").click(function(event){
        var ob = createEventData("select_item");
        var productId = $(this).attr("data-product-id");
        var listname = $(this).attr("data-listname");
        var index = $(this).attr("data-index");
        var product = db.products.find(prod => prod.id == productId);
        if(product) {
            ob['ecommerce'] = {
                "currency": currency,
                //"value": product.price,
                "items": [
                    {
                        "item_brand": product.brand,
                        "item_category": product.categoryId,
                        "item_id": product.id,
                        "item_name": product.name,
                        "item_list_id": listname,
                        "item_list_name": listname,
                        //"item_variant": "item_variant",
                        "price": product.price,
                        "item_original_price" : product.originalPrice,
                        //"quantity": "quantity",
                        "item_img" : product.img,
                        "index" : index
                    }
                ]
            }
            track(ob);
        }
    });

    // <--- CATEGORY ACTIONS END --->

    // <--- PDP ACTIONS START --->

    var productId = getQueryParam("product-id");
    if(productId && pageType == 'product-detail') {
        var product = db.products.find(prod => prod.id == productId);
        var ob = createEventData("view_item");
        ob['ecommerce'] = {
            "currency": currency,
            "value": product.price,
            "items": [
                {
                    "item_brand": product.brand,
                    "item_category": product.categoryId,
                    "item_id": product.id,
                    "item_name": product.name,
                    //"item_variant": "item_variant",
                    "price": product.price,
                    "item_original_price" : product.originalPrice,
                    //"quantity": "quantity",
                    "item_img" : product.img

                }
            ]
        }
        track(ob);
    }

    $(".product-information-tabs a.nav-item").click(function(event){

        var ob = createEventData("click_tab");
        addEventDataClickLink(ob, this);
        ob["name"] = $(this).text().toLowerCase(),
        ob["event_context"] = "product-detail";
        ob["name"] = "product information";
        track(ob);
        
        //alert("products sorted");
        //event.preventDefault();
        //return false;
    });

    $(".social-share-links .social-share").click(function(event){
        var ob = createEventData("share");
        ob["content_type"] = 'product';
        ob["item_id"] = $('meta[name="product-id"]').attr('content');
        ob["method"] = 'share';
        ob["type"] = $(this).attr("data-type");

        addEventDataClickLink(ob, this);
        track(ob);
    })

    // <--- PDP ACTIONS END --->

    // <--- CART ACTIONS START --->

    //event: view_cart

    if(pageType == 'cart') {

        var ob = createEventData("view_cart");
        ob['ecommerce'] = {
            "currency": currency,
            "value": 0,
            "items": []
        }
        addCartData(ob);
        track(ob);
    }

    //event: use_valid_coupon
    $("#coupon-form").submit(function(event){
        //use_valid_coupon
        var coupon = $("#coupon-form input").val();

        if(coupon && coupon.length > 0 && coupon == "FREESHIP") {
            var ob = createEventData("use_valid_coupon");
            ob['ecommerce'] = {
                "currency": currency,
                "value": 0,
                "items": []
            }

            addCartData(ob);
            ob['ecommerce'].coupon = coupon;
            track(ob);

            alert("coupon applied")
        } else {
            var ob = createEventData("use_invalid_coupon");
            ob['ecommerce'] = {
                "currency": currency,
                "value": 0,
                "items": []
            }

            addCartData(ob);
            ob['ecommerce'].coupon = coupon;
            track(ob);

            alert("invalid coupon")
        }
        
        event.preventDefault();
        return false;
    })
    
    $("#checkout").click(function(event){

        var ob = createEventData("begin_checkout");
        ob['ecommerce'] = {
            "currency": currency,
            "value": 0,
            "items": []
        }
        
        addCartData(ob);
        ob['ecommerce'].coupon = $("#coupon-form input").val() == "FREESHIP" ? "FREESHIP" : undefined;
        addEventDataClickLink(ob, this);

        track(ob);
        alert("proceed to checkout")
    });
    
    // <--- CART ACTIONS END --->

    // <--- CONTACT ACTIONS START --->

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
            track(ob);
            alert("contact us form submitted");
        }
        event.preventDefault();
        return false;
    });

    // <--- CONTACT ACTIONS END --->

    // <--- VIDEO ACTIONS START --->

    var player;

    function onPlayerStateChange(e) {
        var playerStatus = e.data;
        var event;
        var ob = createEventData("tbc");
        var videoData = player.getVideoData();
        ob["video_current_time"] = player.getCurrentTime();
        ob["video_duration"] = player.getDuration();
        ob["video_percent"] = Math.round((player.getCurrentTime()/player.getDuration()*100))
        ob["video_provider"] = "youtube";
        ob["video_title"] = videoData.title;
        ob["video_url"] = player.getVideoUrl();
        ob["visible"] = undefined;

        if (playerStatus == -1) {
            // unstarted
        } else if (playerStatus == 0) {
            // ended
            event = "video_complete";
        } else if (playerStatus == 1) {
            // playing
            event = "video_start";
        } else if (playerStatus == 2) {
            // paused
            event = "video_pause";
        } else if (playerStatus == 3) {
            // buffering
        } else if (playerStatus == 5) {
            // video cued
        }

        if(event){
            ob["event"] = event;
            track(ob);
        }

    }
    
    function onPlayerReady(event) {
        //console.log("onPlayerReady", event)
    }

    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('video-target', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    var tag = document.createElement('script');
    tag.id = 'iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // <--- VIDEO ACTIONS END --->
})(jQuery);

