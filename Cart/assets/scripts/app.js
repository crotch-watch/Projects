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

class ProductsListItem {
  constructor(product) {
    this.product = product;
  }

  render() {
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

    return productItem;
  }
}

class ProductsList {
  products = [
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

  constructor(productsList) {
    this.productsList = productsList;
  }

  render() {
    const renderHook = document.getElementById("app");
    const productsList = document.createElement("ul");
    productsList.className = "product-list";

    this.products.forEach((product) => {
      const productItem = new ProductsListItem(product)
      productsList.append(productItem.render());
    });

    renderHook.append(productsList);
  }
}

const productList1 = new ProductsList();
productList1.render();
