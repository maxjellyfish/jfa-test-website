import db from "./db.js"

export default function () {

  const urlParams = new URLSearchParams(document.location.search)
  const pageType = $('meta[name="page-type"]').attr('content')

  window.pageData = window.pageData || {};
  window.pageData.pageType = pageType;
  window.pageData.categoryName = $('meta[name="category-name"]').attr('content');
  window.pageData.user = undefined;
  //console.log("userUpdate clear user", window.pageData.user)

  userUpdate();

  initCommon();





  switch (pageType) {
    case 'home':
      initHome()
      break;
    case 'contact':
      initContact()
      break;
    case 'category':
      initPLP()
      break;
    case 'product-detail':
      initPDP()
      break
    case 'cart':
      initCart()
      break;
    case 'checkout':
      initCheckout()
      break;
    case 'confirmation':
      initConfirmation()
      break;
    case 'blog-index':
      initBlog()
      break;
    default:
      console.log("content-inject.js: unknown page type", pageType)
      break
  }

  ////////////////////////////////////

  function userLogin(){
    var user;
    var userId;
    if(localStorage && localStorage.getItem("userId")){
      userId = localStorage.getItem("userId");
      user = db.default_users.find(usr => usr.user_id == userId);
      localStorage.setItem("userStatus", "active");
    } else {
      var count = db.default_users.length-1;
      var random = Math.round(Math.random()*count);
      user = db.default_users[random];
      localStorage.setItem("userStatus", "active");
      localStorage.setItem("userId", user.user_id);
    }
    userUpdate();
    if(window.eventHooks && typeof window.eventHooks["userLogin"] != 'undefined') {
      window.eventHooks["userLogin"](user);
    }

  }

  function userUpdate(){
    var userStatus = localStorage.getItem("userStatus");
    if(userStatus == "active") {

      var userId = localStorage.getItem("userId");
      var user = db.default_users.find(usr => usr.user_id == userId);
      //console.log("userUpdate", userId, user)
      $("#login-link").hide();
      $("#logout-link").text("Logout ("+user.user_name+")");
      $("#logout-link").show();
      $("#register-link").hide();
      window.pageData.user = user;
      //console.log("userUpdate set user", window.pageData.user)

    } else {
      $("#login-link").show();
      $("#logout-link").hide();
      $("#logout-link").text("Logout");
      $("#register-link").show();
      window.pageData.user = undefined;
      //console.log("userUpdate clear user", window.pageData.user)
    }
  }

  function userRegister(){

    var count = db.default_users.length-1;
    var random = Math.round(Math.random()*count);
    var user = db.default_users[random];

    if(localStorage){
      localStorage.setItem("userId", user.user_id);
      localStorage.setItem("userStatus", "active");
    }

    userUpdate();
    if(window.eventHooks && typeof window.eventHooks["userRegister"] != 'undefined') {
      window.eventHooks["userRegister"](user);
    }
  }

  function userLogout(){
    localStorage.setItem("userStatus", "offline");
    userUpdate();
    if(window.eventHooks && typeof window.eventHooks["userLogout"] != 'undefined') {
      window.eventHooks["userLogout"]();
    }
  }

  function initHome() {

    const catTileContainer = $(".category-tiles > .row")
    catTileContainer.find(".tile").remove()

    const catEls = db.categories.map(cat => getCategoryTile(cat))
    catTileContainer.append(catEls)

  }

  function getCategoryTile(cat){
    return $(/*html */`
        <div data-category-id="${cat.id}" class="tile col-lg-4 col-md-6 pb-1">
          <div class="cat-item d-flex flex-column border mb-4" style="padding: 30px;">
              <p class="text-right">${cat.productCount} Product(s)</p>
              <a href="shop.html?category=${cat.id}" title="Shirts" data-type="category" class="cat-img position-relative overflow-hidden mb-3">
                  <img class="img-fluid" src="${cat.img}" alt="">
              </a>
              <h5 class="font-weight-semi-bold m-0">${cat.name}</h5>
          </div>
      </div>
    `)
  }

  function initContact() {

  }

  function initPLP() {

    const catPageId = urlParams.get('category') || 'all'
    const catData = db.categories.find(cat => cat.id === catPageId)

    // Update the meta tag on page to match
    $('meta[name="category-name"]').attr('content', catPageId)

    // Update title
    $('#page-title').text(`Category - ${catData ? catData.name : 'All'}`)
    
    // Prod tiles
    const prods = catData ? db.products.filter(prod => prod.categoryId === catData.id) : db.products
    $(".product-listing .product-tile").remove()
    prods.map((prod, index) => getProductTile(prod, "category-"+catPageId, index)).reverse().forEach( item =>  item.insertAfter(".product-list-controls"))
    

    window.pageData.products = prods;
  }

  function getProductTile(prod, listname, index) {
    const item = $(/*html */`
          <div data-product-id="${prod.id}" class="product-tile col-lg-4 col-md-6 col-sm-12 pb-1">
            <div class="card product-item border-0 mb-4">
                <div class="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                    <img class="img-fluid w-100" src="${prod.img}" alt="${prod.name}">
                </div>
                <div class="card-body border-left border-right text-center p-0 pt-4 pb-3">
                    <h6 class="text-truncate mb-3">${prod.name}</h6>
                    <div class="d-flex justify-content-center">
                        <h6>$${prod.price}.00</h6><h6 class="text-muted ml-2"><del>$${prod.originalPrice}.00</del></h6>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between bg-light border">
                    <a data-location="product-listing" data-product-name="${prod.name}" data-product-id="${prod.id}" data-listname="${listname}" data-index="${index}" href="detail.html?product-id=${prod.id}" title="Colorful Stylish Shirt" class="product-link btn btn-sm text-dark p-0"><i class="fas fa-eye text-primary mr-1"></i>View Detail</a>
                    <button data-location="product-listing" data-product-name="${prod.name}" data-product-id="${prod.id}" data-listname="${listname}" data-index="${index}" class="add-to-cart-link btn btn-sm text-dark p-0"><i class="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart</button>
                </div>
            </div>
        </div>`)

    item.find(".add-to-cart-link").on("click", e => {
      alert(`Added ${prod.name} to cart!`)
      addToCart(prod)
    })

    return item
  }

  function initCheckout(){

    let cart = localStorage.getItem("user-cart")
    cart = cart ? JSON.parse(cart) : []

    // Product list
    const container = $("#products-list")
    if(cart.length) container.append(cart.map(item => {
      return $(/*html */`
      <li class="d-flex justify-content-between">
          <p>${item.name}${item.qty > 1 ? ` (x${item.qty})` : ''}</p>
          <p>$${item.price * item.qty}.00</p>
      </li>`)
    }))
    else  container.append($(`<li><td colspan="5">Nothing in cart</td></li>`))

    // Summary
    let subtotal = 0
    cart.forEach(item => {
      subtotal += (item.price * item.qty)
    })

    const subtotalEl = $("#subtotal-text")
    subtotalEl.text(`$${subtotal}.00`)

    const totalEl = $("#total-text")
    totalEl.text(`$${subtotal + 10}.00`)

     window.pageData.checkout = {
      products : cart,
      subtotal : subtotal,
      total : subtotal + 10
     }


    // Submit listener
    $("#checkout-form").on("submit", e => {
      e.preventDefault()
      const formData = Object.fromEntries(new FormData(e.target))
      
      const data = {
        ...formData,
        products: cart,
        shipping: 10,
        subtotal,
        total: subtotal + 10,
        orderId: (Math.random() + "").slice(2)
      }
      // fix for payment
      data.payment_method = $('input[type=radio][name=payment_method]:checked')[0].id;

      if(window.eventHooks && typeof window.eventHooks["checkoutSubmit"] != 'undefined') {
        window.eventHooks["checkoutSubmit"](data);
      }

      localStorage.setItem("user-transaction", JSON.stringify(data))
      window.location.href = "confirmation.html"
    })

    if(!cart.length){
      $("#place-order").prop("disabled", true)
    }

  }

  function initConfirmation(){

    let purchaseData =  localStorage.getItem("user-transaction")

    // If no purchase info, redirect to home
    if(!purchaseData){
      window.location.href = "index.html"
      return
    }

    purchaseData = JSON.parse(purchaseData)

    $("#order-id").text(purchaseData.orderId)
    $("#subtotal-text").text(`$${purchaseData.subtotal}.00`)
    $("#total-text").text(`$${purchaseData.total}.00`)

    const prodList = $("#products-list")

    prodList.append(purchaseData.products.map(item => {
      return $(/*html */`
      <li class="mt-3 d-flex align-items-center">
          <img src="${item.img}" width="60" class="d-block" />
          <p class="ml-3 mb-0"><a href="/detail.html?product-id=${item.id}">${item.name}</a>${item.qty > 1 ? ` (x${item.qty})` : ''}</p>
          <p class="mb-0 ml-auto">$${item.price * item.qty}.00</p>
      </li>`)
    }))

    // Here so dataLayer.js can access
    window.pageData.purchase = purchaseData

    // then clear local cart and transaction
    localStorage.removeItem('user-transaction')
    localStorage.removeItem('user-cart')
  }

  function initBlog(){
    
    window.addEventListener("popstate", e => {
      onBlogHistoryChange()
    })

    onBlogHistoryChange()

  }

  function onBlogHistoryChange(){
    const urlObj = new URL(window.location.href)
    const postId = urlObj.searchParams.get('post-id')
    if(!postId) {
      populateBlogIndex()
    } else {
      populateBlogPost(db.blog.posts.find(p => p.id == postId))
    }

    if(window.eventHooks && typeof window.eventHooks["pageRoute"] != 'undefined') {
      setTimeout(window.eventHooks["pageRoute"], 250);
    }
  }

  function populateBlogPost(post){
    $("#page-title").text(post.title)

    const postsContainer = $("#blog-posts")
    postsContainer.empty()

    postsContainer.append($(/*html */`
      <p class="d-flex w-100 text-center"><span>By <strong>${post.author}</strong> &bull; ${post.date}</span><span class="d-block ml-auto small text-uppercase">${post.tags}</span></p>
      <img class="w-100 d-block mb-4" src="${post.heroImage}" />
    `))
    postsContainer.append($(post.html))
  }
  
  function populateBlogIndex(){

    $("#page-title").text("Blog")
 
    const posts = db.blog.posts
    const postsContainer = $("#blog-posts")
    postsContainer.empty()

    postsContainer.append(posts.map(post => {
      const el =  $(/*html */`
        <a href="#" class="blog-post-tile m-2" style="width: 300px;">
            <img src="${post.heroImage}" class="d-block w-100" height="185" style="object-fit: cover;" />
            <h4 class="mt-2">${post.title}</h4>
            <p>${post.date}</p>
        </a>`)

      el.on("click", e => {
        e.preventDefault()

        const urlObj = new URL(window.location.href)
        urlObj.searchParams.set('post-id', post.id)
        history.pushState({}, "", urlObj)

        onBlogHistoryChange()
      })

      return el
    }))
  }

  function initPDP() {

    const prodPageId = urlParams.get('product-id')
    if(!prodPageId){
      console.log("content-inject.js: no product-id provided in URL")
      return
    }

    const prod = db.products.find(prod => prod.id === prodPageId)
    const cat = db.categories.find(cat => cat.id === prod.categoryId)

    // Update page title
    $("#page-title").text(prod.name);
    $(".product-title").text(prod.name);

    $('meta[name="product-name"]').attr('content', prod.name)
    $('meta[name="product-id"]').attr('content', prod.id)
    $('meta[name="product-price"]').attr('content', prod.price)


    // Update breadcrumb
    $(".breadcrumb-links p:last-child").html(`<a href="shop.html?category=${cat.id}">${cat.name}</a>`)

    // Updates Images
    var carouselItems = '';
    for(var i=0; i<prod.imgs.length; i++){
      var active = i == 0 ? "active" : '';
      var imgSrc = prod.imgs[i];
      carouselItems += '<div class="carousel-item '+active+'"><img class="w-100 h-100" src="'+imgSrc+'" alt="'+prod.name+'"></div>';
    }

    //Update add to cart button
    $("button.add-to-cart-link").attr("data-product-id", prod.id);
    $("button.add-to-cart-link").attr("data-product-name", prod.name);

    $(".carousel-inner").html(carouselItems);
    
    // Update price
    $(".product-price").text(`$${prod.price}.00`)

    // Init add to cart
    $(".add-to-cart-link").on("click", e => {
      alert(`Added ${prod.name} to cart!`)
      addToCart(prod)
    });

    window.pageData.products = [prod];

  }

  function addToCart(prod){
    
    let cart = localStorage.getItem("user-cart")
    cart = cart ? JSON.parse(cart) : []

    let lineItem = cart.find(item => item.id === prod.id)
    if(!lineItem){
      lineItem = {...prod, qty: 0}
      cart.push(lineItem)
    }

    lineItem.qty++

    localStorage.setItem('user-cart', JSON.stringify(cart))

    if(window.eventHooks && typeof window.eventHooks["addToCart"] != 'undefined') {
      window.eventHooks["addToCart"](prod);
    }
  }

  function removeFromCart(prodId, entirely = false){

    let cart = localStorage.getItem("user-cart")
    cart = cart ? JSON.parse(cart) : []

    let lineItem = cart.find(item => item.id === prodId)
    if(!lineItem) return false


    let removed = false

    lineItem.qty--
    if(lineItem.qty <= 0 || entirely){
      cart = cart.filter(item => item.id !== prodId)
      removed = true
    }

    localStorage.setItem('user-cart', JSON.stringify(cart))

    if(window.eventHooks && typeof window.eventHooks["removeFromCart"] != 'undefined') {
      window.eventHooks["removeFromCart"](lineItem);
    }

    return removed
  }

  function initCart(){

    $("#coupon-form input.form-control").val("FREESHIP");

    let cart = localStorage.getItem("user-cart")
    cart = cart ? JSON.parse(cart) : []

    // Product list
    const container = $(".product-table tbody")
    container.empty()
    if(cart.length) container.append(cart.map(item => getCartLineItem(item)))
    else  container.append($(`<tr><td colspan="5">Nothing in cart</td></tr>`))

    // Summary
    let subtotal = 0
    cart.forEach(item => {
      subtotal += (item.price * item.qty)
    })

    const subtotalEl = $(".cart-subtotal")
    subtotalEl.text(`$${subtotal}.00`)

    const totalEl = $(".cart-total")
    totalEl.text(`$${subtotal + 10}.00`)


    // Disable checkout button if empty cart
    if(!cart.length){
      $("#checkout").addClass("disabled")
    }
  }

  function getCartLineItem(prod){
    const item = $(/*html */`<tr>
          <td class="align-middle"><img src="${prod.img}" alt="" style="width: 50px;"> ${prod.name}</td>
          <td class="align-middle">$${prod.price}.00</td>
          <td class="align-middle">
              <div class="input-group quantity mx-auto" style="width: 100px;">
                  <div class="input-group-btn">
                      <button class="btn btn-sm btn-primary btn-minus">
                      <i class="fa fa-minus"></i>
                      </button>
                  </div>
                  <input type="text" class="form-control form-control-sm bg-secondary text-center" value="${prod.qty}">
                  <div class="input-group-btn">
                      <button class="btn btn-sm btn-primary btn-plus">
                          <i class="fa fa-plus"></i>
                      </button>
                  </div>
              </div>
          </td>
          <td class="align-middle">$${prod.price * prod.qty}.00</td>
          <td class="align-middle"><button class="btn-remove btn btn-sm btn-primary"><i class="fa fa-times"></i></button></td>
      </tr>`)

    const remove = item.find(".btn-remove")
    remove.on("click", e => {
      removeFromCart(prod.id, true)
      initCart()
    })

    const plus = item.find(".btn-plus")
    plus.on("click", e => {
      addToCart(prod)
      initCart()
    })

    const minus = item.find(".btn-minus")
    minus.on("click", e => {
      removeFromCart(prod.id)
      initCart()
    })


    return item
  }


  function initCommon() {

    // Category nav
    const catNav = $(".sidebar-list-items .navbar-nav")
    catNav.empty()
    const cats = [ {name:"All", id: "all"}, ...db.categories]
    const catEls = cats.map(cat => $(/*html */`<a href="shop.html?category=${cat.id}" id="category-${cat.id}-link" class="nav-item nav-link">${cat.name}</a>`))
    catNav.append(catEls)

    // Main nav
    const navContainer = $(".main-menu.navbar-nav")
    navContainer.empty()
    /*
    const navEls = db.nav.map(item => $(/--html --/`<a id="main-menu-${item.pageType}" href="${item.url}" class="nav-item nav-link ${pageType === item.pageType ? "active" : ""}">${item.name}</a>`))
    */
    

    const navEls = db.nav.map(function(item){
      if(typeof item.items != 'undefined' && item.items.length > 0) {
        var html = /*html */`<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Other <span class="caret"></span></a><ul class="dropdown-menu">`
        for(var i=0; i<item.items.length; i++){
          html += `<li><a id="main-menu-${item.items[i].pageType}" href="${item.items[i].url}" class="nav-item nav-link ${pageType === item.items[i].pageType ? "active" : ""}">${item.items[i].name}</li></a>`
        }
        html += `</ul>`
        return $(html);

      } else {
        return $(/*html */`<a id="main-menu-${item.pageType}" href="${item.url}" class="nav-item nav-link ${pageType === item.pageType ? "active" : ""}">${item.name}</a>`);
      }
      
    })
    navContainer.append(navEls)

    // User
    $("#login-link").click(function(event){
      userLogin();
    });
    $("#logout-link").click(function(event){
      userLogout();
    });
    $("#register-link").click(function(event){
      userRegister();
    });


    // Search
    $("#site-search-form .input-group-append").click(function(event){
      var val = $("#site-search-form #search-term").val();
      if(val && val.length > 0) { 
        $("#site-search-form").submit();
      }
      event.preventDefault();
      return false;
    });

    let cart = localStorage.getItem("user-cart")
    cart = cart ? JSON.parse(cart) : []

    // Summary
    let subtotal = 0
    cart.forEach(item => {
      subtotal += (item.price * item.qty)
    })

    window.pageData.cart = {"items" : cart, "total": subtotal};
    window.pageData.products = cart;

    var gtmId = localStorage.getItem("gtmId");
    gtmId = gtmId ? gtmId : window.gtmId;
    var dlLog = localStorage.getItem("dlLog");
    dlLog = dlLog == "y" ? 'y' : 'n';
    var dl = localStorage.getItem("dl");
    dl = dl == "y" ? 'y' : 'n';
    $("small.setting-info").text("["+gtmId+ " | log:"+dlLog+" | dl:"+dl+"]");


    // modal
    var modal = $(/*html */`
      <div id="modal-common"class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body">
              <div class="image"></div>
              <p></p>
            </div>
          </div>/.modal-content -->
        </div><!-- /.modal-dialog -->
      </div><!-- /.modal -->`
    );
    $("body").append(modal);
  }


}