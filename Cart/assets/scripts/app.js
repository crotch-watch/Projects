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

class Cart {
  constructor() {
    this.items = [0];
  }

  addToCart(product) {
    this.items.push(product.price);
    this.totalAmount.textContent = `Total $${this.items.reduce(
      (acc, curr) => acc + curr
    )}`;
  }

  init() {
    const cart = document.createElement("section");
    cart.innerHTML = `
        <h2>Total ${this.items.reduce((acc, curr) => acc + curr)}</h2>
        <button>Order Now</button>
      `;
    cart.className = "cart";

    this.totalAmount = cart.querySelector("h2");

    return cart;
  }
}

class ProductsListItem {
  constructor(product) {
    this.product = product;
  }

  addProductToCart() {
    App.addProductToCart(this.product);
  }

  init() {
    const productItem = document.createElement("li");
    productItem.className = "product-item";

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

    return productItem;
  }
}

class ProductsList {
  constructor() {
    this.products = [
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

  init() {
    const productsList = document.createElement("ul");
    productsList.className = "product-list";

    this.products.forEach((product) => {
      const productListItem = new ProductsListItem(product);
      productsList.append(productListItem.init());
    });

    return productsList;
  }
}

class Shop {
  render() {
    const renderHook = document.getElementById("app");

    this.cart = new Cart();
    renderHook.append(this.cart.init());

    const productList = new ProductsList();
    renderHook.append(productList.init());
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    shop.render();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addToCart(product);
  }
}

App.init();
