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

  addToCart = (price) => {
    console.log(this);
    this.items.push(price);
    // Cart.items.push(price)
  };

  init() {
    const cart = document.createElement("section");
    cart.innerHTML = `
        <h2>Total ${this.items.reduce((acc, curr) => acc + curr)}</h2>
        <button>Order Now</button>
      `;
    cart.className = "cart";

    return cart;
  }
}

class ProductsListItem {
  constructor(product, addToCart, self) {
    this.product = product;
    this.addToCart = addToCart;
    this.self = self;
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
    buyBtn.addEventListener("click", () =>
      this.addToCart(this.product.price, this.self)
    );

    return productItem;
  }
}

class ProductsList {
  constructor(addToCart) {
    this.addToCart = addToCart;

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
      const productListItem = new ProductsListItem(product, this.addToCart);
      productsList.append(productListItem.init());
    });

    return productsList;
  }
}

class Shop {
  render() {
    const renderHook = document.getElementById("app");

    const cart = new Cart();
    console.dir(cart);
    renderHook.append(cart.init());

    const productList = new ProductsList(cart.addToCart);
    renderHook.append(productList.init());
  }
}

const shop = new Shop();
shop.render();
