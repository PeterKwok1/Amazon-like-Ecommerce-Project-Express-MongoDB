import { getProduct } from "../api.js";
import { getCartItems, setCartItems } from "../localStorage.js";
import { parseRequestURL, rerender, showMessage } from "../utils.js";

const addToCart = (item, forceUpdate = false) => {
  let cartItems = getCartItems();
  const existItem = cartItems.find((x) => x.product === item.product);
  if (existItem) {
    if (forceUpdate) {
      cartItems = cartItems.map((x) =>
        x.product === existItem.product ? item : x,
      );
    }
  } else {
    cartItems = [...cartItems, item];
  }
  setCartItems(cartItems);
  if (forceUpdate) {
    rerender(CartScreen);
  }
};

const removeFromCart = (id) => {
  setCartItems(getCartItems().filter((x) => x.product !== id));
  if (id === parseRequestURL().id) {
    document.location.hash = "/cart";
  } else {
    rerender(CartScreen);
  }
};

const CartScreen = {
  after_render: () => {
    const qtySelects = document.getElementsByClassName("qty-select");
    Array.from(qtySelects).forEach((qtySelect) => {
      qtySelect.addEventListener("change", (e) => {
        const item = getCartItems().find((x) => x.product === qtySelect.id);
        addToCart({ ...item, qty: Number(e.target.value) }, true);
      });
    });
    const deleteButtons = document.getElementsByClassName("delete-button");
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        removeFromCart(deleteButton.id);
      });
    });

    document.getElementById("checkout-button").addEventListener("click", () => {
      document.location.hash = "/signin";
    });
  },
  render: async () => {
    const request = parseRequestURL();
    if (request.id) {
      const data = await getProduct(request.id);

      if (data.error) {
        showMessage(data.error);
      } else {
        addToCart({
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          countInStock: data.countInStock,
          qty: 1,
        });
      }
    }

    const cartItems = getCartItems();
    return `
      <div class="content cart">
        <div class="cart-list">
          <ul class="cart-list-container">
            <li>
              <h3>Shopping Cart</h3>
              <div>Price</div>
            </li>
            ${
              cartItems.length === 0
                ? `<div>Cart is empty. <a href="/#/">Go Shopping</a></div>`
                : cartItems
                    .map(
                      (item) => `
                      <li>
                        <div class="cart-image">
                          <img src="${item.image}" alt="${item.name}"/>
                        </div>
                        <div class="cart-name">
                          <div>
                            <a href="/#/product/${item.product}">
                              ${item.name}
                            </a>
                          </div>
                          <div>
                            Qty: <select class="qty-select" id="${item.product}">
                              ${[...Array(item.countInStock).keys()]
                                .map((x) =>
                                  item.qty === x + 1
                                    ? `<option selected value="${x + 1}">${x + 1}</>`
                                    : `<option value="${x + 1}">${x + 1}</>`,
                                )
                                .join("\n")}
                            </select>
                            <button type="button" class="delete-button" id="${item.product}">
                              Delete
                            </button>
                          </div>
                        </div>
                        <div class="cart-price">
                          $${item.price}
                        </div>
                      </li>
                      `,
                    )
                    .join("\n")
            }
          </ul>
        </div>    
        <div class="cart-action">
          <h3>
            Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items)
            :
            $${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
          </h3>
          <button id="checkout-button" class="primary fw">
            Proceed to Checkout
          </button>
        </div>
      </div>
    `;
  },
};

export default CartScreen;
