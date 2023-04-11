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
products.originalCola = new Product('original-cola', 'Original_Cola',  1000, 15, 0, 0);
products.violetCola = new Product('violet-cola', 'Violet_Cola', 1000, 15, 0, 0);
products.yellowCola = new Product('yellow-cola', 'Yellow_Cola', 1000, 15, 0, 0);
products.coolCola = new Product('cool-cola', 'Cool_Cola', 1000, 15, 0, 0);
products.greenCola = new Product('green-cola', 'Green_Cola', 1000, 150, 0, 0);
products.orangeCola = new Product('orange-cola', 'Orange_Cola', 1000, 5, 0, 0);

// 장바구니 상품 추가
function createCartItem(value) {
  const li = document.createElement('li')
  const img = document.createElement('img')
  const p = document.createElement('p')
  const input = document.createElement('input')
  
  li.setAttribute('id', value);
  img.setAttribute('src', `images/${products[value].src}.png`);
  p.setAttribute('class', 'name');
  p.textContent = products[value].name;
  input.value = '1';
  input.setAttribute('type', 'number');
  input.setAttribute('class', 'amount');
  // input.setAttribute('max', '10');
  
  cartList.appendChild(li);
  li.appendChild(img);
  li.appendChild(p);
  li.appendChild(input);
  
  
  // 장바구니 상품 수량에 이벤트 등록
  input.addEventListener('keyup', inpAmountHandle)
}

function deleteCartItem(value) {
  const item = document.getElementById(value);
  cartList.removeChild(item)
}

function inpAmountHandle(e) {
  const stock = products[e.target.parentNode.id].stock;
  if (!e.target.value || !e.target.validity.valid) {
    alert('숫자를 입력해주세요.')
    e.target.value = 1
  } else if (e.target.value > 100) {
    alert('최대 100개까지 구매 가능합니다.')
    e.target.value = 100
  } else if (e.target.value < 1) {
    alert('1개 이상 입력해주세요.')
    e.target.value = 1
  } else if (e.target.value > stock) {
    alert(`재고수량이 ${stock}개 존재합니다. 재고수량 이하로 구입 수량을 입력해주세요.`)
    e.target.value = stock;
  }
}