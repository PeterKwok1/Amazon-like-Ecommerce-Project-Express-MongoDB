import { apiURL } from "./config.js";
import { getUserInfo } from "./localStorage.js";

// Products
export const getProduct = async (id) => {
  try {
    const response = await fetch(`${apiURL}/api/products/${id}`);

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

// User
export const signin = async ({ email, password }) => {
  try {
    const response = await fetch(`${apiURL}/api/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const register = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${apiURL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    // server will send data or db error
    return await response.json();
  } catch (error) {
    // failed to connect
    return { error: error.message };
  }
};

export const update = async ({ name, email, password }) => {
  try {
    const { _id, token } = getUserInfo();
    const response = await fetch(`${apiURL}/api/users/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

// Orders
export const createOrder = async (order) => {
  try {
    const { token } = getUserInfo();
    const response = await fetch(`${apiURL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const getOrder = async (id) => {
  try {
    const { token } = getUserInfo();
    const response = await fetch(`${apiURL}/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (err) {
    return { error: err.message };
  }
};

export const getMyOrders = async () => {
  try {
    const { token } = getUserInfo();
    const response = await fetch(`${apiURL}/api/orders/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

// PayPal
export const getPaypalClientId = async () => {
  const response = await fetch(`${apiURL}/api/paypal/clientId`);

  const data = await response.json();

  return data.clientId;
};
