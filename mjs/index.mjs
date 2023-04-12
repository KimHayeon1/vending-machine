import { handleProduct,
  inpAmountHandle
} from './main.mjs';

const products = document.getElementsByClassName('product');
const cart = document.getElementById('cart');

[...products].forEach(product => {
  product.addEventListener('click', handleProduct);
});

// 장바구니 상품 수량 input에 이벤트 등록
cart.addEventListener('keyup', inpAmountHandle)