import Rating from "../components/Rating.js";
import { hideLoading, showLoading } from "../utils.js";
import { apiURL } from "../config.js";

const HomeScreen = {
  render: async () => {
    showLoading();

    const response = await fetch(`${apiURL}/api/products`);

    hideLoading();

    if (response.status !== 200) {
      return "<div>Error getting products.</div>";
    }

    const products = await response.json();

    return `
      <ul class="products">
        ${products
          .map(
            (product) => `
              <li>
                <div class="product">
                  <a href="/#/product/${product._id}">
                    <img src="${product.image}" alt="${product.name}" />
                  </a>
                  <div class="product-name">
                    <a href="/#/product/${product._id}">
                      ${product.name}
                    </a>
                  </div>
                  <div class="product-rating">
                    ${Rating.render({
                      value: product.rating,
                      text: `${product.numReviews} reviews`,
                    })}
                  </div>
                  <div class="product-brand">
                      ${product.brand}
                  </div>
                  <div class="product-price">
                      $${product.price}
                  </div>
                </div>
              </li>
            `,
          )
          .join("\n")}
      </ul>
    `;
  },
};

export default HomeScreen;
