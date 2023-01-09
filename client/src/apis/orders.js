import apiAxios from "./axios";

// API interface for loading a user's orders
export const fetchOrders = async () => {
  try {
    const response = await apiAxios.get(`orders`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// API interface for loading a user's order by order ID
export const fetchOrder = async (orderId) => {
  try {
    const response = await apiAxios.get(`orders/${orderId}`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
