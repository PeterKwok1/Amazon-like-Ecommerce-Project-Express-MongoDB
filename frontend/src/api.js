import { apiURL } from "./config.js";
import axios from "axios";

export const getProduct = async (id) => {
  try {
    const response = await axios({
      url: `${apiURL}/api/products/${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.statusText !== "OK") {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};
export const signin = async ({ email, password }) => {
  try {
    const response = await axios({
      url: `${apiURL}/api/users/signin`,
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        password,
      },
    });
    if (response.statusText !== "OK") {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (err) {
    console.log(err);
    return { error: err.response.data.message || err.message };
  }
};
