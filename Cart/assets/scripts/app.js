class Product {
  title;
  image;
  description;
  price;

  constructor(title, image, description, price) {
    this.title = title;
    this.image = image;
    this.description = description;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class Component {
  constructor(renderHookId, shouldInit) {
    this.renderHookId = renderHookId;
    if (shouldInit) {
      this.init();
    }
  }

  createRootElement(element, classes, attributes) {
    const rootElement = document.createElement(element);

    if (classes) {
      rootElement.className = classes;
    }

    if (attributes) {
      for (let attribute of attributes) {
        rootElement.setAttribute(attribute.name, attribute.value);
      }
    }

    document.getElementById(this.renderHookId).append(rootElement);
    return rootElement;
  }
}

class Cart extends Component {
  items = [];

  constructor(renderHookId) {
    super(renderHookId, false);
    this.orderProducts = () => {
      console.log(this.items)
    }
    this.init();
  }

  get totalAmount() {
    return this.items.reduce(
      (previousValue, currentItem) => previousValue + currentItem.price,
      0
    );
  }

  addToCart(product) {
    this.items.push(product);
    this.cartValue.innerHTML = `<h2>Total ${this.totalAmount.toFixed(2)}</h2>`;
  }

  init() {
    const cart = this.createRootElement("section", "cart");

    cart.innerHTML = `
        <h2>Total $${this.totalAmount}</h2>
        <button>Order Now</button>
    `;

    this.cartValue = cart.querySelector("h2");

    const button = cart.querySelector("button")
    button.addEventListener("click", this.orderProducts)
  }
}

class ProductsListItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.renderHookId = renderHookId;
    this.init();
  }

  addProductToCart() {
    App.addProductToCart(this.product);
  }

  init() {
    const productItem = this.createRootElement("li", "product-item");

    productItem.innerHTML = `
    <section>
      <img src="${this.product.image}" alt="${this.product.title}"/>
      <div class="product-item__content">
        <h2>${this.product.title}</h2>
        <h3>$${this.product.price}</h3>
        <p>${this.product.description}</p>
        <button>Buy</button>
      </div>
    </section>
  `;

    const buyBtn = productItem.querySelector("button");
    buyBtn.addEventListener("click", this.addProductToCart.bind(this));
  }
}

class ProductsList extends Component {
  #products;
  #fetchedProducts

  constructor(renderHookId) {
    super(renderHookId, false);
    this.renderHookId = renderHookId;
    this.#fetchProducts();
    this.init();
    this.initProducts();
  }

  #fetchProducts() {
    this.#products = [
      new Product(
        "Heading",
        "https://en.wikipedia.org/wiki/Cinematography#/media/File:Arri_Alexa_camera.jpg",
        "Dummy Description",
        19.99
      ),
      new Product(
        "Heading",
        "https://en.wikipedia.org/wiki/Cinematography#/media/File:Arri_Alexa_camera.jpg",
        "Dummy Description",
        29.99
      ),
      new Product(
        "Heading",
        "https://en.wikipedia.org/wiki/Cinematography#/media/File:Arri_Alexa_camera.jpg",
        "Dummy Description",
        39.99
      ),
      new Product(
        "Heading",
        "https://en.wikipedia.org/wiki/Cinematography#/media/File:Arri_Alexa_camera.jpg",
        "Dummy Description",
        49.99
      ),
    ];
  }

  initProducts() {
    for (let product of this.#products) {
      new ProductsListItem(product, this.productsList.id);
    }
  }

  init() {
    const idAttribute = new ElementAttribute("id", "product-list");
    this.productsList = this.createRootElement("ul", "product-list", [
      idAttribute,
    ]);

    return this.productsList;
  }
}

class Shop {
  constructor() {
    this.render();
  }

  render() {
    const renderHookId = "app";
    this.cart = new Cart(renderHookId);
    new ProductsList(renderHookId);
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addToCart(product);
  }
}

App.init();
