import { getOrder, getPaypalClientId } from "../api.js";
import { apiURL } from "../config.js";
import { getUserInfo } from "../localStorage.js";
import {
  hideLoading,
  parseRequestURL,
  rerender,
  showLoading,
  showMessage,
} from "../utils.js";
import { loadScript } from "@paypal/paypal-js";

const addPaypalSdk = async (totalPrice) => {
  showLoading();

  const clientId = await getPaypalClientId();

  let paypal;
  try {
    paypal = await loadScript({ clientId });
  } catch (error) {
    console.error("failed to load the PayPal JS SDK script", error);
  }
  if (paypal) {
    handlePayment(paypal, totalPrice);
  }

  hideLoading();
};
const handlePayment = (paypal, totalPrice) => {
  paypal
    .Buttons({
      style: {
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal",
      },

      async createOrder() {
        try {
          const { token } = getUserInfo();
          const response = await fetch(`${apiURL}/api/paypal`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // use the "body" param to optionally pass additional order information
            // like product ids and quantities
            body: JSON.stringify({
              totalPrice,
            }),
          });

          const orderData = await response.json();

          // paypal api has changed so i'm not saving it's order id in order to follow the tutorial
          if (orderData.id) {
            return orderData.id;
          }
          const errorDetail = orderData?.details?.[0];
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
            : JSON.stringify(orderData);

          throw new Error(errorMessage);
        } catch (error) {
          console.error(error);
          showMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
        }
      },

      async onApprove(data, actions) {
        try {
          const { token } = getUserInfo();
          const response = await fetch(
            `${apiURL}/api/paypal/${data.orderID}/capture`, // data.orderID is the paypal order id
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: parseRequestURL().id,
                orderID: data.orderID,
                payerID: data.payerID,
                paymentID: data.paymentID,
              }),
            },
          );

          const orderData = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you message

          const errorDetail = orderData?.details?.[0];

          if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per
            // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            return actions.restart();
          } else if (errorDetail) {
            // (2) Other non-recoverable errors -> Show a failure message
            throw new Error(
              `${errorDetail.description} (${orderData.debug_id})`,
            );
          } else if (!orderData.purchase_units) {
            throw new Error(JSON.stringify(orderData));
          } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            const transaction =
              orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
              orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
            showMessage(
              `Transaction ${transaction.status}: ${transaction.id}<br><br>Thank you for shopping!`,
            );
            rerender(OrderScreen);
          }
        } catch (error) {
          console.error(error);
          showMessage(
            `Sorry, your transaction could not be processed...<br><br>${error}`,
          );
        }
      },
    })
    .render("#paypal-button");
};

const OrderScreen = {
  after_render: () => {},
  render: async () => {
    const request = parseRequestURL();
    const {
      _id,
      shipping,
      payment,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt,
    } = await getOrder(request.id);

    if (!isPaid) {
      addPaypalSdk(totalPrice);
    }

    return `
      <div>
        <h1>Order ${_id}</h1>
        <div class="order">
          <div class="order-info">
            <div>
              <h2>Shipping</h2>
              <div>
                ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}
              </div>
              ${
                isDelivered
                  ? `<div class="success">Delivered on ${deliveredAt}</div>`
                  : `<div class="error">Not Delivered</div>`
              }
            </div>
            <div>
              <h2>Payment</h2>
              <div>
                Payment Method : ${payment.paymentMethod}
              </div>
              ${
                isPaid
                  ? `<div class="success">Paid on ${paidAt}</div>`
                  : `<div class="error">Not Paid</div>`
              }
            </div>
            <div>
              <ul class="cart-list-container">
                <li>
                  <h2>Shipping Cart</h2>
                  <div>Price</div>
                </li>
                ${orderItems.map(
                  (item) => `
                    <li>
                      <div class="cart-image">
                        <img src="${item.image}" alt="{item.name}" />
                      </div>
                      <div class="cart-name">
                        <div>
                          <a href="/#/product/${item.product}">${item.name}</a>
                        </div>
                        <div>Qty: ${item.qty}</div>
                      </div>
                      <div class="cart-price">$${item.price}</div>
                    </li>
                  `,
                )}
              </ul>
            </div>
          </div>
          <div class="order-action">
            <ul>
                <li>
                  <h2>Order Summary</h2>
                </li>
                <li>
                  <div>Items</div>
                  <div>$${itemsPrice}</div>
                </li>
                <li>
                  <div>Shipping</div>
                  <div>$${shippingPrice}</div>
                </li>
                <li>
                  <div>Tax</div>
                  <div>$${taxPrice}</div>
                </li>
                <li>
                  <div class="total">Order Total</div>
                  <div>$${totalPrice}</div>
                </li>
                <li>
                  <div class="fw" id="paypal-button"></div>
                </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },
};

export default OrderScreen;
