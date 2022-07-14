import data from "./db.js"

(function(db, $){

  const pageType = $('meta[name="page-type"]').attr('content')
  if(!pageType){
    console.log("content-inject.js: could not determine page type")
    return
  }

  initCommon()

  switch(pageType){
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
    default:
      console.log("content-inject.js: unknown page type")
    break
  }

  function initHome(){
    
    
  }

  function initContact() {

  }

  function initPLP(){

  }

  function initPDP(){

  }

  function initCommon(){

    // Category nav
    const catNav = $(".sidebar-list-items .navbar-nav")
    catNav.empty()
    const catEls = db.categories.map(cat => $(`<a href="shop.html?category=${cat.id}" id="category-${cat.id}-link" class="nav-item nav-link">${cat.name}</a>`))
    catNav.append(catEls)
    

  }


})(data, jQuery)