import { getProduct } from "../api.js";
import { getCartItems, setCartItems } from "../localStorage.js";
import { parseRequestURL } from "../utils.js";

const addToCart = (item, forceUpdate = false) => {
  let cartItems = getCartItems();
  const existItem = cartItems.find((x) => x.product === item.product);
  if (existItem) {
    cartItems = cartItems.map((x) =>
      x.product === existItem.product ? item : x,
    );
  } else {
    cartItems = [...cartItems, item];
  }
  setCartItems(cartItems);
};

const CartScreen = {
  after_render: () => {},
  render: async () => {
    const request = parseRequestURL();
    if (request.id) {
      const product = await getProduct(request.id);
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      });
    }
    // if (product.error) {
    //   return `<div>${product.error}</div>`;
    // }
    return `<div>Cart Screen</div>
    <div>${getCartItems().length}</div>`;
  },
};

export default CartScreen;
