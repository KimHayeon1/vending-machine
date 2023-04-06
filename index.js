const products = document.getElementsByClassName('product');
const cartList = document.getElementById('cart');

[...products].forEach(product => {
  product.addEventListener('click', handleProduct);
});

function handleProduct(event) {
  const current = event.currentTarget;
  const urlImg = current.getElementsByTagName('img')[0].getAttribute('src')

  if (!current.style.outline) {
    current.style.outline = "3px solid var(--main-color)";
    createCartItem()
  } else {
    current.style.outline = "";
  }
}

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