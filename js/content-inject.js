import db from "./db.js"

export default function () {

  const urlParams = new URLSearchParams(document.location.search)
  const pageType = $('meta[name="page-type"]').attr('content')
  initCommon()

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
    default:
      console.log("content-inject.js: unknown page type", pageType)
      break
  }

  ////////////////////////////////////

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
    prods.map(prod => getProductTile(prod)).reverse().forEach( item =>  item.insertAfter(".product-list-controls"))
  }

  function getProductTile(prod) {
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
                    <a href="detail.html?product-id=${prod.id}" title="Colorful Stylish Shirt" class="product-link btn btn-sm text-dark p-0"><i class="fas fa-eye text-primary mr-1"></i>View Detail</a>
                    <button class="add-to-cart-link btn btn-sm text-dark p-0"><i class="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart</button>
                </div>
            </div>
        </div>`)

    item.find(".add-to-cart-link").on("click", e => {
      alert(`Added ${prod.name} to cart!`)
      addToCart(prod)
    })

    return item
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
    $("#page-title").text(prod.name)

    // Update breadcrumb
    $(".breadcrumb-links p:last-child").html(`<a href="shop.html?category=${cat.id}">${cat.name}</a>`)

    // Update price
    $(".product-price").text(`$${prod.price}.00`)

    // Init add to cart
    $(".add-to-cart-link").on("click", e => {
      alert(`Added ${prod.name} to cart!`)
      addToCart(prod)
    })

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

    return removed
  }

  function initCart(){
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
    const navEls = db.nav.map(item => $(/*html */`<a id="main-menu-${item.pageType}" href="${item.url}" class="nav-item nav-link ${pageType === item.pageType ? "active" : ""}">${item.name}</a>`))
    navContainer.append(navEls)

  }


}