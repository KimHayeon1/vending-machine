const order = document.querySelector('.order-wrap');
const balance = order.querySelector('#balance');
const amountInp = order.querySelector('.form-input.order-left');
const depositBtn = order.querySelector('[value="입금"]');

const btnGet = document.querySelector('[value="획득"]');
const cart = document.getElementById('cart');
const getList = document.querySelector('#get-list');
const total = document.querySelector('.total span');
const productList = document.querySelectorAll('.product');

const myMoney = document.querySelector('#my-money');

depositBtn.addEventListener('click', depositBtnHandle);

export function handleProduct(event) {
  const current = event.currentTarget;
  const name = current.dataset.name;
  if (!current.style.outline) {
    current.style.outline = "3px solid var(--main-color)";
    createCartItem(name, cart);
  } else {
    current.style.outline = "";
    deleteCartItem(name, cart);
  }
}

class Product {
  constructor (img, name, price, stock) {
    this.img = img
    this.name = name
    this.price = price
    this.stock = stock
  }
}
// json으로 바꾸기
const products = {};
products.originalCola = new Product('original-cola.png', 'Original_Cola',  1000, 15);
products.violetCola = new Product('violet-cola.png', 'Violet_Cola', 1000, 15);
products.yellowCola = new Product('yellow-cola.png', 'Yellow_Cola', 1000, 15);
products.coolCola = new Product('cool-cola.png', 'Cool_Cola', 1000, 15);
products.greenCola = new Product('green-cola.png', 'Green_Cola', 1000, 150);
products.orangeCola = new Product('orange-cola.png', 'Orange_Cola', 1000, 5);

// 장바구니 상품 추가
function createCartItem(name, ul) {
  ul.innerHTML += `
    <li id=${name}>
      <img src="images/${products[name].img}" alt="">
      <p class="name">${products[name].name}</p>
      <input type="number" class="amount" value=1>
    </li>
  `
}

function deleteCartItem(name) {
  const item = document.getElementById(name);
  cart.removeChild(item)
}

function depositBtnHandle() {
  if (amountInp.value) {
    const myMoneyVal = parseInt((myMoney.textContent).replace(/\,/g, ''));
    const amountVal = parseInt(amountInp.value);
    if (amountVal % 1000 !== 0) {
      alert('1,000원 단위로 입금 가능합니다.');
      return
    }
    if (amountVal > myMoneyVal) {
      alert('소지금이 부족합니다.');
    } else {
      const balanceVal = parseInt((balance.textContent).replace(/\,/g, ''));
      balance.textContent = new Intl.NumberFormat().format(balanceVal + amountVal);
      myMoney.textContent = new Intl.NumberFormat().format(myMoneyVal - amountVal);
      amountInp.value = '';
    }
  } else {
    alert('금액을 입력해주세요.');
  }
}

export function inpQuantityHandle(e) {
  const obj = quantityCheck(e)
  if (obj) {
    alert(obj.alertTxt);
    e.target.value = obj.val;
  }
}

function quantityCheck(e) {
  const stock = products[e.target.parentNode.id].stock;
  if (!e.target.value) {
    return {alertTxt: '숫자를 입력해주세요.', val: 1}
  }
  if (e.target.value < 1) {
    return {alertTxt: '1개 이상 입력해주세요.', val: 1}
  }
  if (e.target.value > stock) {
    return {alertTxt: `재고수량이 ${stock}개 존재합니다. 재고수량 이하로 구입 수량을 입력해주세요.`, val: stock}
  }
  if (e.target.value > 100) {
    return {alertTxt: '최대 100개까지 구매 가능합니다.', val: 100}
  }
}

btnGet.addEventListener('click', btnGetHandle)

function btnGetHandle() {
  const balanceVal = parseInt((balance.textContent).replace(/\,/g, ''));
  const cartTotalAmount = cartTotal(cart.childNodes);
  // 잔액 부족한지 체크
  if (balanceVal < cartTotalAmount) {
    alert(`잔액이 ${cartTotalAmount- balanceVal}원 부족합니다.`)
    return;
  }
  // 잔액 변경
  balance.textContent = balanceVal - cartTotalAmount;
  // 총금액 변경
  changeTotalAmount(cartTotalAmount);

  const list = [];
  getList.childNodes.forEach(v => list.push(v.id));
  cart.childNodes.forEach(v => {
    // getCnt 속성 없애기
    products[v.id].stock -= parseInt(v.childNodes[2].value)
    if (list.includes(v.id)) {
      getList.querySelector(`#${v.id}`).childNodes[2].value = parseInt(v.childNodes[2].value) + parseInt(getList.querySelector(`#${v.id}`).childNodes[2].value)
    } else {
      getList.appendChild(v.cloneNode(true))
    }
    // 품절되면
    if(!products[v.id].stock) {
      soldOut(document.querySelector(`[data-name="${v.id}"]`));
    }
  });
  cart.replaceChildren();
  productList.forEach(v => v.style.outline = "");
}

function cartTotal(cartList) {
  let cartTotalAmount = 0;
  cartList.forEach(v => {
    cartTotalAmount += products[v.id].price * v.childNodes[2].value
  });
  return cartTotalAmount;
}

function changeTotalAmount(cartTotalAmount) {
  const totalAmount = parseInt(total.textContent.replace(/\,/g, ''));
  total.textContent = new Intl.NumberFormat().format(totalAmount + cartTotalAmount);
}

function soldOut(target) {
  const span = document.createElement('span');
  span.classList.add('cover');
  target.setAttribute('disabled', '')
  target.prepend(span);
}