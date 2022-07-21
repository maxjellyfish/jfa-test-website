const data = {
  default_users:[
    {
      user_id:"AOvhCKnzLl",
      user_name: "Basilius Thorsten",
      user_type: "member",
      user_email: "Basilius.Thorsten@jellyfish.com"
    },
    {
      user_id:"uWRdYY13VY",
      user_name: "Wilfred Regin",
      user_type: "member",
      user_email: "Wilfred.Regin@jellyfish.com"
    },
    {
      user_id:"hQnsuofwLO",
      user_name: "Kristin Ceara",
      user_type: "member",
      user_email: "Kristin.Ceara@jellyfish.com"
    },
    {
      user_id:"0NFYCEQqOs",
      user_name: "Maximiliane Iole",
      user_type: "member",
      user_email: "Maximiliane.Iole@jellyfish.com"
    },
    {
      user_id:"1h3WwXanXB",
      user_name: "Bettie Joyce",
      user_type: "member",
      user_email: "Bettie.Joyce@jellyfish.com"
    },
    {
      user_id:"bx5T8Zwa0v",
      user_name: "Hannah Temitope",
      user_type: "member",
      user_email: "Hannah.Temitope@jellyfish.com"
    },
    {
      user_id:"4EOBocUTS5",
      user_name: "Elin Tuuli",
      user_type: "member",
      user_email: "Elin.Tuuli@jellyfish.com"
    },
    {
      user_id:"F0EU_rwBnj",
      user_name: "Havryil Mitrodora",
      user_type: "member",
      user_email: "Havryil.Mitrodora@jellyfish.com"
    },
    {
      user_id:"XTrnf8H-JV",
      user_name: "Maglocunos Sharifah",
      user_type: "member",
      user_email: "Maglocunos.Sharifah@jellyfish.com"
    },
    {
      user_id:"4MSsPaVMFi",
      user_name: "Chatzkel Pompeius",
      user_type: "member",
      user_email: "Chatzkel.Pompeius@jellyfish.com"
    },
  ],
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
      name: "Colourless Stylish Top",
      categoryId: 'shirts',
      img: "img/product-1.jpg",
      price: 123,
      originalPrice: 150,
      brand : 'jellyfish',
      imgs: ["img/product-1.jpg", "img/product-1.jpg"]
    },
    {
      id:"bags-1",
      name: "Wolf Face Bag",
      categoryId: 'bags',
      img: "img/product-2.jpg",
      price: 234,
      originalPrice: 470,
      brand : 'jellyfish',
      imgs: ["img/product-2.jpg", "img/product-2.jpg"]
    },
    {
      id:"shoes-1",
      name: "Merrell Shoes",
      categoryId: 'shoes',
      img: "img/product-3.jpg",
      price: 80,
      originalPrice: 90,
      brand : 'jellyfish',
      imgs: ["img/product-3.jpg", "img/product-3.jpg"]
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