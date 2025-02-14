import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import config from "../config.js";
import Order from "../models/orderModel.js";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: config.PAYPAL_CLIENT_ID,
    oAuthClientSecret: config.PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true,
    },
    logResponse: {
      logHeaders: true,
    },
  },
});
const ordersController = new OrdersController(client);

const paypalRouter = express.Router();

paypalRouter.get("/clientId", (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID });
});

paypalRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      // use the cart information passed from the front-end to calculate the order amount detals
      const { totalPrice } = req.body;
      const { jsonResponse, httpStatusCode } = await createOrder(totalPrice);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  }),
);
const createOrder = async (totalPrice) => {
  const collect = {
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: totalPrice.toString(),
          },
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.ordersCreate(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

paypalRouter.post(
  "/:paypalID/capture",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { jsonResponse, httpStatusCode } = await captureOrder(
        req.params.paypalID,
      );

      const order = await Order.findById(req.body.id);

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.payment.paymentResult = {
          orderID: req.body.orderID,
          payerID: req.body.payerID,
          paymentID: req.body.paymentID,
        };
        await order.save();
      } else {
        res.status(404).send({ message: "Order not found" });
      }

      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  }),
);
const captureOrder = async (paypalID) => {
  const collect = {
    id: paypalID,
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.ordersCapture(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

export default paypalRouter;
