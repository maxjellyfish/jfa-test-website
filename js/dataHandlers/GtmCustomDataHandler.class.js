import BaseDataHandler from "./BaseDataHandler.class.js"

export default class GtmCustomDataHandler extends BaseDataHandler {
  constructor(){
    super();
    window.dataLayer = window.dataLayer || []
  }

  // Override
  transform(ob){
    return ob
  }

  // Override
  push(ob){
    if(ob) {

      var event = typeof ob.event != 'undefined' ? ob.event : undefined;

      var transform = {};

      switch(event) {
        case "page_view" : 
          transform.event = "custom.page.view";
          break;
        case "add_to_cart" : 
          transform.event = "custom.ecom.add";
          break;
        case "remove_from_cart" : 
          transform.event = "custom.ecom.remove";
          break;
        case "select_item" : 
          transform.event = "custom.ecom.product.click";
          break;
        case "view_item" : 
          transform.event = "custom.ecom.product.view";
          break;
        case "view_cart" : 
          transform.event = "custom.ecom.cart.view";
          break;
        case "use_valid_coupon" : 
          transform.event = "custom.ecom.coupon.valid";
          break;
        case "use_invalid_coupon" : 
          transform.event = "custom.ecom.coupon.invalid";
          break;
        case "begin_checkout" : 
          transform.event = "custom.ecom.checkout.step";
          transform.step = {label:'start', number:1}
          break;
        case "add_shipping_info" : 
          transform.event = "custom.ecom.checkout.step";
          transform.step = {label:'shipping', number:2}
          break;
        case "add_payment_info" : 
          transform.event = "custom.ecom.checkout.step";
          transform.step = {label:'payment', number:3}
          break;
        case "checkout_submit" : 
          transform.event = "custom.ecom.checkout.step";
          transform.step = {label:'submit', number:4}
          break;
        case "purchase" : 
          transform.event = "custom.ecom.purchase";
          break;
        case "select_promotion" : 
          transform.event = "custom.ecom.promotion.click";
          break;
        case "click_cart" : 
          transform.event = "custom.ecom.cart.click";
          break;
        case "click_filter" : 
          transform.event = "custom.filter.click";
          break;
        case "click_sort" : 
          transform.event = "custom.sort.click";
          break;
        case "click_tab" : 
          transform.event = "custom.tab.click";
          break;
        case "share" : 
          transform.event = "custom.social.share";
          break;
        case "click_social" : 
          transform.event = "custom.social.click";
          break;
        case "click_footer" : 
          transform.event = "custom.nav.click";
          transform['type'] = "footer";
          break;
        case "click_phone" : 
          transform.event = "custom.nav.click";
          transform['type'] = "phone";
          break;
        case "click_email" : 
          transform.event = "custom.nav.click";
          transform['type'] = "email";
          break;
        case "contact" : 
          transform.event = "custom.form.submit";
          transform.name = "contact";
          break;
        case "subscribe" : 
          transform.event = "custom.form.submit";
          transform.name = "subscribe";
          break;
        case "search" : 
          transform.event = "custom.search.submit";
          break;
        case "logout" : 
          transform.event = "custom.user.logout";
          break;
        case "login" : 
          transform.event = "custom.user.login";
          break;
        case "sign_up" : 
          transform.event = "custom.user.sign_up";
          break;
        case "video_complete" : 
          transform.event = "custom.user.sign_up";
          break;
        case "video_start" : 
          transform.event = "custom.user.sign_up";
          break;
        case "video_pause" : 
          transform.event = "custom.user.sign_up";
          break;
      }

      if(event == "page_view") {
        transform.event = "custom.page.view";
      }
      
      if(typeof ob['timestamp'] != 'undefined' && ob['timestamp']) {
        transform['timestamp'] = ob['timestamp']
      }
      if(typeof ob['item_id'] != 'undefined' && ob['item_id']) {
        transform['itemId'] = ob['item_id']
      }
      if(typeof ob['method'] != 'undefined' && ob['method']) {
        transform['method'] = ob['method']
      }
      if(typeof ob['type'] != 'undefined' && ob['type']) {
        transform['type'] = ob['type']
      }
      if(typeof ob['context'] != 'undefined' && ob['context']) {
        transform['context'] = ob['context']
      }

      // data data
      addDataKey("optinNewlestter", transform, "optin_newlestter", ob);
      addDataKey("email", transform, "form_email", ob);

      // user data
      addUserKey("type", transform, "user_type", ob);
      addUserKey("email", transform, "user_email", ob);
      addUserKey("name", transform, "user_name", ob);
      addUserKey("id", transform, "user_id", ob);
      addUserKey("status", transform, "login_status", ob);

      //content data
      addContentKey("type", transform, "content_type", ob);
      addContentKey("location", transform, "page_location", ob);

      //click data
      addElementKey("domain", transform, "link_domain", ob);
      addElementKey("url", transform, "link_url", ob);
      addElementKey("id", transform, "element_id", ob);
      addElementKey("text", transform, "element_text", ob);

      //search data
      addSearchKey("term", transform, "search_term", ob);
      addSearchKey("type", transform, "search_type", ob);

      //video data
      addDataKey("time", transform, "video_current_time", ob);
      addDataKey("duration", transform, "video_duration", ob);
      addDataKey("percent", transform, "video_percent", ob);
      addDataKey("provider", transform, "video_provider", ob);
      addDataKey("visible", transform, "visible", ob);


      if(typeof ob['video_title'] != 'undefined' && ob['video_title']) {
        transform['title'] = ob['video_title']
      }
      if(typeof ob['video_url'] != 'undefined' && ob['video_url']) {
        transform['url'] = ob['video_url']
      }


      //ecommerce data

      if(typeof ob.ecommerce != 'undefined' && ob.ecommerce) {

        if(event != "select_promotion" && typeof ob.ecommerce.items != 'undefined' &&  ob.ecommerce.items) {
          transform.products = convertProducts(ob.ecommerce.items);
        }

        if(event == "select_promotion" && typeof ob.ecommerce.items != 'undefined' &&  ob.ecommerce.items) {
          transform.promotions = convertPromotion(ob.ecommerce.items);
        }

        if(typeof ob.ecommerce.payment_type != 'undefined') {
          transform.paymentType = ob.ecommerce.payment_type;
        }

        if(typeof ob.ecommerce.transaction_id != 'undefined') {
          transform.transactionId = ob.ecommerce.transaction_id;
        }

        if(typeof ob.ecommerce.tax != 'undefined') {
          transform.tax = ob.ecommerce.tax;
        }

        if(typeof ob.ecommerce.shipping != 'undefined') {
          transform.shipping = ob.ecommerce.shipping;
        }

        if(typeof ob.ecommerce.coupon != 'undefined') {
          transform.coupon = ob.ecommerce.coupon;
        }

        transform.value = typeof ob.ecommerce.value != 'undefined' ? ob.ecommerce.value : 0;
        transform.currency = typeof ob.ecommerce.currency != 'undefined' ? ob.ecommerce.currency : undefined;
      }

      window.dataLayer.push(transform);
    }

    function convertProducts(list) {
      var products = [];
      for(var i=0; i<list.length; i++){
            products.push({
                "brand": typeof list[i].item_brand != 'undefined' ? list[i].item_brand : undefined,
                "category": typeof list[i].item_category != 'undefined' ? list[i].item_category : undefined,
                "sku": typeof list[i].item_id != 'undefined' ? list[i].item_id : undefined,
                "name": typeof list[i].item_name != 'undefined' ? list[i].item_name : undefined,
                "price": typeof list[i].price != 'undefined' ? list[i].price : undefined,
                "originalPrice" : typeof list[i].item_original_price != 'undefined' ? list[i].item_original_price : undefined,
                "quantity": typeof list[i].quantity != 'undefined' ? list[i].quantity : undefined,
                "img" : typeof list[i].item_img != 'undefined' ? list[i].item_img : undefined,
            });
        }
        return products;
    }

    function convertPromotion(list) {
      var promotions = [];
      for(var i=0; i<list.length; i++){
            products.push({
                "name": typeof list[i].creative_name != 'undefined' ? list[i].creative_name : undefined,
                "slot": typeof list[i].creative_slot != 'undefined' ? list[i].creative_slot : undefined,
                "id": typeof list[i].promotion_id != 'undefined' ? list[i].promotion_id : undefined,
                "promotionName": typeof list[i].promotion_name != 'undefined' ? list[i].promotion_name : undefined
            });
        }
        return promotions;
    }

    function addSearchKey(transformKey, transformData, targetKey, targetData){

      if(targetData[targetKey]) {
        if(typeof transformData.search == 'undefined') {
          transformData.search = {};
        }
        transformData.search[transformKey] = targetData[targetKey];
      }
    }

    function addDataKey(transformKey, transformData, targetKey, targetData){

      if(targetData[targetKey]) {
        if(typeof transformData.data == 'undefined') {
          transformData.data = {};
        }
        transformData.data[transformKey] = targetData[targetKey];
      }
    }

    function addElementKey(transformKey, transformData, targetKey, targetData){

      if(targetData[targetKey]) {
        if(typeof transformData.element == 'undefined') {
          transformData.element = {};
        }
        transformData.element[transformKey] = targetData[targetKey];
      }
    }

    function addContentKey(transformKey, transformData, targetKey, targetData){

      if(targetData[targetKey]) {
        if(typeof transformData.content == 'undefined') {
          transformData.content = {};
        }
        transformData.content[transformKey] = targetData[targetKey];
      }
    }

    function addUserKey(transformKey, transformData, targetKey, targetData){

      if(targetData[targetKey]) {
        if(typeof transformData.user == 'undefined') {
          transformData.user = {};
        }
        transformData.user[transformKey] = targetData[targetKey];
      }
    }
    
  }
}