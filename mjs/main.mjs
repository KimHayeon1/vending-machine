const cartList = document.getElementById('cart');

export function handleProduct(event) {
  const current = event.currentTarget;
  const value = current.value;
  if (!current.style.outline) {
    current.style.outline = "3px solid var(--main-color)";
    createCartItem(value);
  } else {
    current.style.outline = "";
    deleteCartItem(value);
  }
}

class Product {
  constructor (src, name, price, stock, cartCnt, getCnt) {
    this.src = src
    this.name = name
    this.price = price
    this.stock = stock
    this.cartCnt = cartCnt
    this.getCnt = getCnt
  }
}
const products = {};
products.originalCola = new Product('original-cola', 'Original_Cola',  1000, 5, 0, 0);
products.violetCola = new Product('violet-cola', 'Violet_Cola', 1000, 5, 0, 0);
products.yellowCola = new Product('yellow-cola', 'Yellow_Cola', 1000, 5, 0, 0);
products.coolCola = new Product('cool-cola', 'Cool_Cola', 1000, 5, 0, 0);
products.greenCola = new Product('green-cola', 'Green_Cola', 1000, 5, 0, 0);
products.orangeCola = new Product('orange-cola', 'Orange_Cola', 1000, 5, 0, 0);

function createCartItem(value) {
  const li = document.createElement('li')
  const img = document.createElement('img')
  const p = document.createElement('p')
  const input = document.createElement('input')
  

  li.setAttribute('id', value);
  img.setAttribute('src', `images/${products[value].src}.png`);
  p.setAttribute('class', 'name');
  p.textContent = products[value].name;
  input.setAttribute('value', '1');
  input.setAttribute('type', 'number');
  input.setAttribute('class', 'amount');
  
  cartList.appendChild(li);
  li.appendChild(img);
  li.appendChild(p);
  li.appendChild(input);
}

function deleteCartItem(value) {
  const item = document.getElementById(value);
  cartList.removeChild(item)
}