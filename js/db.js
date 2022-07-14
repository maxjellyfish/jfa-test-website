const data = {
  nav:[
    {
      pageType:"home",
      name: "Home",
      url: "index.html"
    },
    {
      pageType:"category",
      name: "Shop",
      url: "shop.html"
    },
    {
      pageType:"contact",
      name: "Contact",
      url: "contact.html"
    },
  ],
  categories: [
    {
      id: "shirts",
      name: "Shirts",
      img: "img/cat-1.jpg"
    },
    {
      id: "bags",
      name: "Bags",
      img: "img/cat-5.jpg"
    },
    {
      id: "shoes",
      name: "Shoes",
      img: "img/cat-6.jpg"
    }
  ],
  products: [
    {
      id:"shirts-1",
      name: "Colourful Stylish Shirt",
      categoryId: 'shirts',
      img: "img/product-1.jpg",
      price: 123,
      originalPrice: 150
    },
    {
      id:"bags-1",
      name: "Colourful Stylish Bag",
      categoryId: 'bags',
      img: "img/product-2.jpg",
      price: 234,
      originalPrice: 470
    },
    {
      id:"shoes-1",
      name: "Colourful Stylish Shoes",
      categoryId: 'shoes',
      img: "img/product-3.jpg",
      price: 80,
      originalPrice: 90
    },
  ]
}

// Some helpful meta
data.products.forEach(prod => {

  const cat = data.categories.find(cat => cat.id == prod.categoryId)
  if(cat){
    cat.productCount = cat.productCount || 0
    cat.productCount++
  }

})

export default data