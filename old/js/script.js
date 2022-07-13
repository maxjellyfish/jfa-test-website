console.log("javascript file loaded correctly");
//alert("javascript file loaded correctly");
var product_name = "t-shirt";
var product_colour = "blue";
var product_size = "m";
var price = 30.00;
var quantity =  2;
var sizes  = ["s", "m", "l", "xl"];

var product_display_name = product_name+" "+product_colour;
console.log("product_display_name", product_display_name);

var cart_total = price*quantity;
console.log("cart_total", cart_total);

var product_has_size = sizes.indexOf(product_size) != -1 ? true : false;
// indexOf retuns -1 if the value provided is not fouind. Otherwise it returns the index (position) of the value in the array

// Another option:
//var product_has_size = false;
//if(sizes.indexOf(product_size) >= 0) {
//	product_has_size = true
//}

console.log("product_has_size", product_has_size);

var myProductInfo = function(product_display_name, cart_total, product_has_size){
	console.log("myProductInfo", "title: "+product_display_name, "total: "+cart_total, "has size: "+product_has_size);
}
myProductInfo(product_display_name, cart_total, product_has_size);