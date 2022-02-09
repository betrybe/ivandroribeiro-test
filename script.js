const cartItems = '.cart__items';
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;  
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveLocalStorage() {
  const getCartList = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('card', getCartList);
}

function sumCart() {
  const getCartList = document.querySelectorAll('.cart__item'); 
  const list = [];
  getCartList.forEach((item) => {
    const price = Number(item.innerText.split('$')[1]);
    list.push(price);
  });
  const sum = list.reduce((a, b) => a + b, 0);
  document.querySelector('.total-price').innerText = sum;
}

function criarTituloPreco() {
  const preco = document.querySelector('.cart');
  preco.appendChild(createCustomElement('span', 'price', 'Preço Total: $'));

  const somaPreco = localStorage.getItem('sumPrice');
  if (somaPreco == null) {
    preco.appendChild(createCustomElement('span', 'total-price', '0'));
  } else {
    preco.appendChild(createCustomElement('span', 'total-price', `${somaPreco}`));
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
  sumCart();
}

function loadLocalStorage() {
  const getCartList = document.querySelector(cartItems);
  getCartList.innerHTML = localStorage.getItem('card');
  getCartList.addEventListener('click', cartItemClickListener);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector(cartItems);
  
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

function clearItemClickListener() {
  localStorage.clear();
  const getCartList = document.querySelector(cartItems);
  getCartList.innerHTML = localStorage.getItem('card');
  sumCart();
}

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearItemClickListener);
}

 function adiconarlista(event) {
  // modifiquei aqui
  const itemID = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => response.json())
  .then((json) => {
    const product = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
    createCartItemElement(product);
    saveLocalStorage();   
    sumCart();
    });
}

function createProductItemElement({ sku, name, image }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')) 
  .addEventListener('click', adiconarlista);

  items.appendChild(section);

  return section;
}

function listarProdutos() {
  const container = document.querySelector('.items');
  container.appendChild(createCustomElement('span', 'loading', 'loading...'));
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
   .then((r) => r.json())
   .then((json) => {
   document.querySelector('.loading').remove();
      const Resultsjson = json.results;
      console.log(Resultsjson);
      Resultsjson.forEach((computador) => {
       createProductItemElement({
          sku: computador.id, 
          name: computador.title, 
          image: computador.thumbnail,
        });
      });
 });
}

window.onload = () => {
  loadLocalStorage();
  listarProdutos();
  criarTituloPreco();
  clearCart();
}; 