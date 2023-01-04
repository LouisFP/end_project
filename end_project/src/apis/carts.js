import apiAxios from "./axios";

// API interface for getting the user's cart
export const fetchCart = async () => {
  try {
    const response = await apiAxios.get(`/users/carts`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// API interface for adding a product to a user's cart
export const addToCart = async (bookId, quantity) => {
  try {
    const response = await apiAxios.post(`/users/carts/cart_items`, {
      bookId,
      quantity,
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// API interface for changing the quantity of an item in the cart
export const modifyQuantity = async (bookId, quantity) => {
  try {
    const response = await apiAxios.put(`/users/carts/cart_items/${bookId}`, {
      quantity,
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// API interface for removing a product from a user's cart
export const removeFromCart = async (bookId) => {
  try {
    const response = await apiAxios.delete(`/users/carts/cart_items/${bookId}`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// API interface for checking out a user's cart
export const checkoutCart = async (paymentInfo) => {
  try {
    const response = await apiAxios.post(`/users/carts/checkout`, {
      paymentInfo,
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
