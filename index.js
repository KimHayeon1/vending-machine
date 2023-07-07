const order = document.querySelector('.order-wrap');
const cart = order.querySelector('#cart');
const balance = order.querySelector('#balance');
const amountInp = order.querySelector('.form-input.order-left');
const depositBtn = order.querySelector('#deposit-btn');
const changeBtn = order.querySelector('#change-btn');
const getBtn = order.querySelector('#get-btn');
const getList = document.querySelector('#get-list');
const total = document.querySelector('.total span');
const myMoney = document.querySelector('#my-money');

let productList;

// 상품 데이터 가져오기
/***** 모든 함수: 데이터 가져온 후 실행 *****/
let products;

const getData = async () => {
  const res = await fetch('./productsData.json');
  return await res.json();
};

(async () => {
  products = await getData();
  createProducts();
})();

// 상품 동적 생성
const createProducts = () => {
  const ul = document.querySelector('.product-list');

  let allProductEl = '';
  const keys = Object.keys(products);
  keys.forEach((key) => {
    console.log(products[key].stock);
    allProductEl += `<li>
      <button data-name=${key} class="product" type="button" ${
      !products[key].stock ? 'disabled' : ''
    }>
      ${!products[key].stock ? '<span class="cover"></span>' : ''}
      <img src=${products[key].img} alt="" />
      <span class="name">${products[key].name}</span>
      <span class="round-text-box">${products[key].price}원</span>
      </button>
      </li>`;
  });
  ul.innerHTML = allProductEl;
  // 상품 이벤트 리스너
  productList = document.querySelectorAll('.product');
  productList.forEach((product) => {
    product.addEventListener('click', handleProduct);
  });
};

const createCartItem = (name, ul) => {
  ul.innerHTML += `
  <li id=${name}>
  <img src="${products[name].img}" alt="">
  <p class="name">${products[name].name}</p>
  <input type="number" class="amount" value=1>
  </li>
  `;
};

const deleteCartItem = (name) => {
  const item = document.getElementById(name);
  cart.removeChild(item);
};

const handleProduct = (event) => {
  const current = event.currentTarget;
  const name = current.dataset.name;
  current.classList.toggle('on');
  if (current.classList.contains('on')) {
    createCartItem(name, cart);
  } else {
    deleteCartItem(name, cart);
  }
};

const depositBtnHandle = () => {
  if (amountInp.value) {
    const myMoneyVal = parseInt(myMoney.textContent.replace(/\,/g, ''));
    const amountVal = parseInt(amountInp.value);
    if (amountVal % 1000 !== 0) {
      alert('1,000원 단위로 입금 가능합니다.');
      return;
    }
    if (amountVal > myMoneyVal) {
      alert('소지금이 부족합니다.');
    } else {
      const balanceVal = parseInt(balance.textContent.replace(/\,/g, ''));
      balance.textContent = new Intl.NumberFormat().format(
        balanceVal + amountVal
      );
      myMoney.textContent = new Intl.NumberFormat().format(
        myMoneyVal - amountVal
      );
      amountInp.value = '';
    }
  } else {
    alert('금액을 입력해주세요.');
  }
};

const quantityInpHandle = (e) => {
  const obj = quantityCheck(e);
  if (obj) {
    alert(obj.alertTxt);
    e.target.value = obj.val;
  }
};

const quantityCheck = (e) => {
  const stock = products[e.target.parentNode.id].stock;
  if (!e.target.value) {
    return { alertTxt: '숫자를 입력해주세요.', val: 1 };
  }
  if (e.target.value < 1) {
    return { alertTxt: '1개 이상 입력해주세요.', val: 1 };
  }
  if (e.target.value > stock) {
    return {
      alertTxt: `재고수량이 ${stock}개 존재합니다. 재고수량 이하로 구입 수량을 입력해주세요.`,
      val: stock,
    };
  }
  if (e.target.value > 100) {
    return { alertTxt: '최대 100개까지 구매 가능합니다.', val: 100 };
  }
};

const drawSoldOut = (id) => {
  if (!products[id].stock) {
    const span = document.createElement('span');
    span.classList.add('cover');
    const btn = document.querySelector(`[data-name="${id}"]`);
    btn.setAttribute('disabled', '');
    btn.prepend(span);
  }
};

const drawGottenList = () => {
  const idList = [...getList.children].map((v) => v.id);
  // 획득한 음료에 같은 상품이 있다면
  if (idList.includes(v.id)) {
    getList.querySelector(`#${v.id}`).children[2].textContent =
      parseInt(v.children[2].value) +
      parseInt(getList.querySelector(`#${v.id}`).children[2].textContent);
  } else {
    // 획득한 음료에 같은 상품이 없다면
    const clone = v.cloneNode(true);
    // input -> span 변경
    const input = clone.querySelector('input');
    const span = document.createElement('span');
    span.className = 'amount';
    span.textContent = input.value;
    clone.appendChild(span);
    clone.removeChild(input);
    getList.appendChild(clone);
  }
};

const drawBuyProducts = () => {
  const cartList = cart.children;
  [...cartList].forEach((v) => {
    // 데이터 재고 변경
    products[v.id].stock -= parseInt(v.children[2].value);
    // 획득한 음료 생성 및 변경
    drawGottenList();
    // 품절 표시
    drawSoldOut(v.id);
  });
};

const getBtnHandle = () => {
  const balanceVal = parseInt(balance.textContent.replace(/\,/g, ''));
  const cartTotalAmount = getCartTotal(cart.children);
  // 잔액 부족하면 얼리리턴
  if (balanceVal < cartTotalAmount) {
    alert(`잔액이 ${cartTotalAmount - balanceVal}원 부족합니다.`);
    return;
  }
  // 상품 선택 표시 모두 제거
  productList.forEach((v) => v.classList.remove('on'));
  // 잔액 변경
  balance.textContent = balanceVal - cartTotalAmount;
  // 총금액 변경
  changeTotalAmount(cartTotalAmount);
  // 획득한 음료 추가
  drawBuyProducts();
  // 장바구니 비우기
  cart.replaceChildren();
};

const getCartTotal = (cartList) => {
  let cartTotalAmount = 0;
  [...cartList].forEach((v) => {
    cartTotalAmount += products[v.id].price * v.children[2].value;
  });
  return cartTotalAmount;
};

const changeTotalAmount = (cartTotalAmount) => {
  const totalAmount = parseInt(total.textContent.replace(/\,/g, ''));
  total.textContent = new Intl.NumberFormat().format(
    totalAmount + cartTotalAmount
  );
};

const handleChangeBtn = () => {
  // 잔액이 없으면 얼리리턴
  if (balance.textContent === '0') return;
  const balanceVal = balance.textContent.replace(',', '');
  const myMoneyVal = myMoney.textContent.replace(',', '');
  const sumMoney = parseInt(myMoneyVal) + parseInt(balanceVal);
  myMoney.textContent = new Intl.NumberFormat().format(sumMoney);
  balance.textContent = 0;
};

depositBtn.addEventListener('click', depositBtnHandle);
getBtn.addEventListener('click', getBtnHandle);
changeBtn.addEventListener('click', handleChangeBtn);

// 장바구니 상품 수량 input에 이벤트 등록
cart.addEventListener('change', quantityInpHandle);
