const cartList = document.getElementById('cart');

export function handleProduct(event) {
  const current = event.currentTarget;
  const urlImg = current.getElementsByTagName('img')[0].getAttribute('src')

  if (!current.style.outline) {
    current.style.outline = "3px solid var(--main-color)";
    createCartItem()
  } else {
    current.style.outline = "";
  }
}

class Product {
  constructor (url, price, stock, cartCnt, getCnt) {
    this.url = url
    this.price = price
    this.stock = stock
    this.cartCnt = cartCnt
    this.getCnt = getCnt
  }
}

const originalCola = new Product('original-cola', 1000, 5, 0, 0);
const violetCola = new Product('violet-cola', 1000, 5, 0, 0);
const yellowCola = new Product('yellow-cola', 1000, 5, 0, 0);
const coolCola = new Product('cool-cola', 1000, 5, 0, 0);
const greenCola = new Product('green-cola', 1000, 5, 0, 0);
const orangeCola = new Product('orange-cola', 1000, 5, 0, 0);

function createCartItem() {
  const li = document.createElement('li')
  const img = document.createElement('img')
  const p = document.createElement('p')
  const input = document.createElement('input')
  
  input.setAttribute('value', '1');
  input.setAttribute('type', 'number');
  
  cartList.appendChild(li);
  li.appendChild(img);
  li.appendChild(p);
  li.appendChild(input);
}

function deleteCartItem() {
}