const cart = document.getElementById('cart');
const order = document.querySelector('.order-wrap');
const balance = order.querySelector('#balance');
const amountInp = order.querySelector('.form-input.order-left');
const depositBtn = order.querySelector('#deposit-btn');

const changeBtn = document.querySelector('#change-btn');
const btnGet = document.querySelector('#get-btn');
const getList = document.querySelector('#get-list');
const total = document.querySelector('.total span');

const myMoney = document.querySelector('#my-money');

depositBtn.addEventListener('click', depositBtnHandle);
let productList;

// 상품 데이터 가져오기
/***** 모든 함수: 데이터 가져온 후 실행 *****/
let products;
(async () => {
  const res = await fetch('./productsData.json');
  const json = await res.json();
  products = json;

  createProducts();
})();

// 상품 동적 생성
const createProducts = () => {
  const ul = document.querySelector('.product-list');

  let allProductEl = '';
  const keys = Object.keys(products);
  keys.forEach((key) => {
    if (products[key].stock) {
      console.log(products[key].stock);
      allProductEl += `<li>
      <button data-name=${key} class="product" type="button">
        <img src=${products[key].img} alt="" />
        <span class="name">${products[key].name}</span>
        <span class="round-text-box">${products[key].price}원</span>
      </button>
    </li>`;
    } else {
      // 품절 상품 표시
      allProductEl += `<li>
      <button data-name=${key} class="product" type="button" 
      disabled>
      <span class="cover"></span>
        <img src=${products[key].img} alt="" />
        <span class="name">${products[key].name}</span>
        <span class="round-text-box">${products[key].price}원</span>
      </button>
    </li>`;
    }
  });
  ul.innerHTML = allProductEl;
  // 상품 이벤트 리스너
  productList = document.querySelectorAll('.product');
  productList.forEach((product) => {
    product.addEventListener('click', handleProduct);
  });
};

export function handleProduct(event) {
  const current = event.currentTarget;
  const name = current.dataset.name;
  if (!current.style.outline) {
    current.style.outline = '3px solid var(--main-color)';
    createCartItem(name, cart);
  } else {
    current.style.outline = '';
    deleteCartItem(name, cart);
  }
}

// 장바구니 상품 추가
function createCartItem(name, ul) {
  ul.innerHTML += `
    <li id=${name}>
      <img src="${products[name].img}" alt="">
      <p class="name">${products[name].name}</p>
      <input type="number" class="amount" value=1>
    </li>
  `;
}

function deleteCartItem(name) {
  const item = document.getElementById(name);
  cart.removeChild(item);
}

function depositBtnHandle() {
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
}

export function inpQuantityHandle(e) {
  const obj = quantityCheck(e);
  if (obj) {
    alert(obj.alertTxt);
    e.target.value = obj.val;
  }
}

function quantityCheck(e) {
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
}

btnGet.addEventListener('click', btnGetHandle);

function btnGetHandle() {
  const balanceVal = parseInt(balance.textContent.replace(/\,/g, ''));
  const cartTotalAmount = getCartTotal(cart.children);
  // 잔액 부족한지 체크
  if (balanceVal < cartTotalAmount) {
    alert(`잔액이 ${cartTotalAmount - balanceVal}원 부족합니다.`);
    return;
  }
  // 잔액 변경
  balance.textContent = balanceVal - cartTotalAmount;
  // 총금액 변경
  changeTotalAmount(cartTotalAmount);

  const list = [];
  getList.childNodes.forEach((v) => list.push(v.id));
  const cartList = cart.children;
  [...cartList].forEach((v) => {
    products[v.id].stock -= parseInt(v.children[2].value);
    if (list.includes(v.id)) {
      getList.querySelector(`#${v.id}`).children[2].textContent =
        parseInt(v.children[2].value) +
        parseInt(getList.querySelector(`#${v.id}`).children[2].textContent);
    } else {
      const clone = v.cloneNode(true);

      /* input -> span 변경 */
      const input = clone.querySelector('input');
      const span = document.createElement('span');
      span.className = 'amount';
      span.textContent = input.value;
      clone.appendChild(span);
      clone.removeChild(input);

      getList.appendChild(clone);
    }
    // 품절 표시
    if (!products[v.id].stock) {
      soldOut(document.querySelector(`[data-name="${v.id}"]`));
    }
  });
  cart.replaceChildren();
  productList.forEach((v) => (v.style.outline = ''));
}

function getCartTotal(cartList) {
  let cartTotalAmount = 0;
  [...cartList].forEach((v) => {
    cartTotalAmount += products[v.id].price * v.children[2].value;
  });
  return cartTotalAmount;
}

function changeTotalAmount(cartTotalAmount) {
  const totalAmount = parseInt(total.textContent.replace(/\,/g, ''));
  total.textContent = new Intl.NumberFormat().format(
    totalAmount + cartTotalAmount
  );
}

function soldOut(target) {
  const span = document.createElement('span');
  span.classList.add('cover');
  target.setAttribute('disabled', '');
  target.prepend(span);
}

const handleChangeBtn = () => {
  // 잔액이 없으면 얼리리턴
  if (balance.textContent === '0') return;
  const balanceVal = balance.textContent.replace(',', '');
  const myMoneyVal = myMoney.textContent.replace(',', '');
  const sumMoney = parseInt(myMoneyVal) + parseInt(balanceVal);
  myMoney.textContent = new Intl.NumberFormat().format(sumMoney);
  balance.textContent = 0;
};

changeBtn.addEventListener('click', handleChangeBtn);

// 장바구니 상품 수량 input에 이벤트 등록
cart.addEventListener('change', inpQuantityHandle);
