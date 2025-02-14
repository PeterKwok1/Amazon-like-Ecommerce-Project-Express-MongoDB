import axios from "axios";
import Rating from "../components/Rating.js";
import { hideLoading, showLoading } from "../utils.js";
import { apiURL } from "../config.js";

console.log(apiURL);

const HomeScreen = {
  render: async () => {
    showLoading();

    const response = await axios({
      url: `${apiURL}/api/products`,
      headers: {
        "Content-type": "application/json",
      },
    });

    hideLoading();

    console.log(response.statusText);
    console.log(response.status, typeof response.status);
    if (!response || response.status !== 200) {
      return "<div>Error getting data</div>";
    }

    const products = response.data;

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
