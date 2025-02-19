import { getUserInfo, setPayment } from "../localStorage.js";
import CheckoutSteps from "../components/CheckoutSteps.js";

const PaymentScreen = {
  after_render: () => {
    document
      .getElementById("payment-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const paymentMethod = document.querySelector(
          "input[name='payment-method']:checked",
        ).value;
        setPayment({ paymentMethod });
        document.location.hash = "/placeorder";
      });
  },
  render: () => {
    const { name } = getUserInfo();
    if (!name) {
      document.location.hash = "/";
    }

    return `
      ${CheckoutSteps.render({ step1: true, step2: true, step3: true })}
      <div class="form-container">
        <form id="payment-form">
          <ul class="form-items">
            <li>
              <h1>Payment</h1>
            </li>
            <li>
              <div>
                <label for="paypal">PayPal</label>
                <input type="radio" name="payment-method" id="paypal" value="Paypal" checked />
              </div>
            </li>
            <li>
              <div>
                <label for="stripe">Stripe</label>
                <input type="radio" name="payment-method" id="stripe" value="Stripe" />
                <div class="requirements">(Not supported for testing)</div>
              </div>
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

export default PaymentScreen;
