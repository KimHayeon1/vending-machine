const products = document.getElementsByClassName('product');

[...products].forEach(product => {
  product.addEventListener('click', handleProduct);
});

function handleProduct(event) {
  if (!event.currentTarget.style.outline) {
    event.currentTarget.style.outline = "3px solid var(--main-color)";
  } else {
    event.currentTarget.style.outline = "";
  }
}