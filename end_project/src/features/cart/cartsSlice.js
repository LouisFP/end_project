import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  modifyQuantity,
  removeFromCart,
  checkoutCart,
} from "../../apis/carts";

export const loadCart = createAsyncThunk("carts/loadCart", async () => {
  try {
    const response = fetchCart();
    return response;
  } catch (err) {
    throw err;
  }
});

export const addItem = createAsyncThunk(
  "carts/addItem",
  async (bookId, quantity) => {
    try {
      const response = await addToCart(bookId, quantity);
      return response;
    } catch (err) {
      throw err;
    }
  }
);
