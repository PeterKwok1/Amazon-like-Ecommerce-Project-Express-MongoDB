import { apiURL } from "./config.js";
import { getUserInfo } from "./localStorage.js";

// Products
export const getProduct = async (id) => {
  try {
    const response = await fetch(`${apiURL}/api/products/${id}`);

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return await response.json();
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
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
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return await response.json();
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};

export const register = async ({ name, email, password }) => {
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

  return await response.json();
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
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return await response.json();
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
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
    if (response.status !== 201) {
      throw new Error(response.data.message);
    }
    return await response.json();
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
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
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
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
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return await response.json();
  } catch (err) {
    return { error: err.response ? err.response.data.message : err.message };
  }
};

// PayPal
export const getPaypalClientId = async () => {
  const response = await fetch(`${apiURL}/api/paypal/clientId`);

  if (response.status !== 200) {
    throw new Error(response.data.message);
  }

  const data = await response.json();

  return data.clientId;
};
