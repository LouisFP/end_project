import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  modifyQuantity,
  removeFromCart,
  checkout,
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

export const changeQuantity = createAsyncThunk(
  "cart/changeQuantity",
  async (bookId, quantity) => {
    try {
      const response = await modifyQuantity(bookId, quantity);
      return response;
    } catch (err) {
      throw err;
    }
  }
);

export const removeItem = createAsyncThunk(
  "carts/removeItem",
  async (bookId) => {
    try {
      const response = await removeFromCart(bookId);
      return response;
    } catch (err) {
      throw err;
    }
  }
);

export const checkoutCart = createAsyncThunk(
  "carts/checkout",
  async (paymentInfo) => {
    try {
      const response = await checkout(paymentInfo);
      return response;
    } catch (err) {
      throw err;
    }
  }
);

const cartsSlice = createSlice({
  name: "carts",
  initialState: {
    cartBooks: {},
    fetchCartStatus: "idle",
    addItemStatus: "idle",
    changeQuantityStatus: "idle",
    removeItemStatus: "idle",
    checkoutCartStatus: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.fetchCartStatus = "pending";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.fetchCartStatus = "fulfilled";
        state.cartBooks = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.fetchCartStatus = "rejected";
      })
      .addCase(addItem.pending, (state) => {
        state.addItemStatus = "pending";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.addItemStatus = "fulfilled";
        state[action.payload.user_Id] = action.payload;
      })
      .addCase(addItem.rejected, (state) => {})
      .addCase(changeQuantity.pending, (state) => {})
      .addCase(changeQuantity.fulfilled, (state, action) => {})
      .addCase(changeQuantity.rejected, (state) => {})
      .addCase(removeItem.pending, (state) => {})
      .addCase(removeItem.fulfilled, (state, action) => {})
      .addCase(removeItem.rejected, (state) => {})
      .addCase(checkoutCart.pending, (state) => {})
      .addCase(checkoutCart.fulfilled, (state, action) => {})
      .addCase(checkoutCart.rejected, (state) => {});
  },
});

export default cartsSlice.reducer;
