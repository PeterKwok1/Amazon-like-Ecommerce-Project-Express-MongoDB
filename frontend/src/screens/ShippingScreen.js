import { getUserInfo, getShipping, setShipping } from "../localStorage.js";
import CheckoutSteps from "../components/CheckoutSteps.js";

const ShippingScreen = {
  after_render: () => {
    document
      .getElementById("shipping-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        setShipping({
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          postalCode: document.getElementById("postalCode").value,
          country: document.getElementById("country").value,
        });
        document.location.hash = "/payment";
      });
  },
  render: () => {
    const { name } = getUserInfo();
    if (!name) {
      document.location.hash = "/";
    }

    const { address, city, postalCode, country } = getShipping();

    return `
      ${CheckoutSteps.render({ step1: true, step2: true })}
      <div class="form-container">
        <form id="shipping-form">
          <ul class="form-items">
            <li>
              <h1>Shipping</h1>
            </li>
            <li>
              <label for="address">Address</label>
              <input type="text" name="address" id="address" value="${address}"/> 
              <div class="requirements">Required (Anything for testing purposes.)</div>
            </li>
            <li>
              <label for="city">City</label>
              <input type="text" name="city" id="city" value="${city}"/> 
              <div class="requirements">Required </div>
            </li>
            <li>
              <label for="postalCode">Postal Code</label>
              <input type="text" name="postalCode" id="postalCode" value="${postalCode}"/> 
              <div class="requirements">Required</div>
            </li>
            <li>
              <label for="country">Country</label>
              <input type="text" name="country" id="country" value="${country}"/> 
              <div class="requirements">Required</div>
            </li>
            <li>
              <button type="submit" class="primary">Continue</button>
            </li>
          </ul>
        </form>
      </div>
    `;
  },
};

export default ShippingScreen;
