import { handleProduct } from './main.mjs';

const products = document.getElementsByClassName('product');

[...products].forEach(product => {
  product.addEventListener('click', handleProduct);
});