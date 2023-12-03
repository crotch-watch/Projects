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
    constructor(renderHookId) {
        this.renderHookId = renderHookId;
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

    get totalAmount() {
        return this.items.reduce(
            (previousValue, currentItem) => previousValue + currentItem.price,
            0
        );
    }

    set cartItems(item) {
        this.items = item;
        this.cartValue.innerHTML = `<h2>Total ${this.totalAmount.toFixed(
            2
        )}</h2>`;
    }

    addToCart(product) {
        this.items.push(product);
        this.cartItems = this.items;
    }

    init() {
        const cart = this.createRootElement("section", "cart");

        cart.innerHTML = `
            <h2>Total $${this.totalAmount}</h2>
            <button>Order Now</button>
    `;

        this.cartValue = cart.querySelector("h2");

        return cart;
    }
}

class ProductsListItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId);
        this.product = product;
        this.renderHookId = renderHookId;
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

        return productItem;
    }
}

class ProductsList extends Component {
    constructor(renderHookId) {
        super();
        this.renderHookId = renderHookId;
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
        const idAttribute = new ElementAttribute("id", "product-list");
        const productsList = this.createRootElement("ul", "product-list", [
            idAttribute,
        ]);

        this.products.forEach((product) => {
            const productListItem = new ProductsListItem(
                product,
                productsList.id
            );
            productListItem.init();
        });

        return productsList;
    }
}

class Shop {
    render() {
        const renderHookId = "app";

        this.cart = new Cart(renderHookId);
        this.cart.init();

        const productList = new ProductsList(renderHookId);
        productList.init();
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
