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

// adicionando os produtos da  API do mercado livre na função
function createProductItemElement({ sku, name, image }) {
  const items = document.querySelector('.items');//modificado
  const section = document.createElement('section');
  
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  items.appendChild(section);//modificado

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//Para deixar nosso programa estruturado, irei criar uma função para listar os produtos,
//Utiizando *fetch para capturar informações da API
function listarProdutos() {
  //realizar chamada através do fetch() ->promessa, desta forma teremos que utilizar o .then para obter
  // os valores(informações) que desejamos, pois o fetch é assincrono
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json()) //transformando em formato json
    .then((json) => { //manipular/obter informações
      const Resultsjson = json.results;
      console.log(Resultsjson);
      Resultsjson.forEach((computador) => {
       createProductItemElement({
          sku: computador.id, 
          name: computador.title, 
          image: computador.thumbnail 
        });
      });
  });
}

//Listar produtos(computadores)
listarProdutos();

window.onload = () => {}; 