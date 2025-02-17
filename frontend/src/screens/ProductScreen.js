import { hideLoading, parseRequestURL, showLoading } from "../utils.js";
import { getProduct } from "../api.js";
import Rating from "../components/Rating.js";

const ProductScreen = {
  after_render: () => {
    const request = parseRequestURL();
    const add_button = document.getElementById("add-button");
    if (add_button) {
      add_button.addEventListener("click", () => {
        document.location.hash = `/cart/${request.id}`;
      });
    }
  },
  render: async () => {
    const request = parseRequestURL();

    showLoading();

    const product = await getProduct(request.id);
    if (product.error) {
      return `<div>${product.error}</div>`;
    }

    hideLoading();

    return `
    <div class="content">
      <div class="back-to-result">
        <a href="/#/">Back to result</a>
      </div>  
      <div class="details">
        <div class="details-image">
          <img src="${product.image}" alt="${product.name}"/>
        </div>
        <div class="details-info">
          <ul>
            <li>
              <h1>
                ${product.name}
              </h1>
            </li>
            <li>
                ${Rating.render({
                  value: product.rating,
                  text: `${product.numReviews} reviews`,
                })}
            </li>
            <li>
              Price: <strong>$${product.price}</strong>
            </li>
            <li>
              Description:
              <div>
                ${product.description}
              </div>
            </li>
          </ul>
        </div>
        <div class="details-action">
          <ul>
            <li>
              Price: $${product.price}
            </li>
            <li>
              Status: ${product.countInStock > 0 ? `<span class="success">In Stock</span>` : `<span class="error">Unavailable</span>`}
            </li>
            <li>
              ${product.countInStock > 0 ? `<button id="add-button" class="fw primary">Add to Cart</button>` : ""}
            </li>
          </ul>
        </div>
      </div>
    </div>
    `;
  },
};

export default ProductScreen;
