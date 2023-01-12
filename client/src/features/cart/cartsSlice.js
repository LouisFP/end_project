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
    const data = fetchCart();
    const cart = {};

    data.forEach((cartBook) => {
      cart[cartBook.book_id] = cartBook;
    });
    console.log(cart);
    return cart;
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
  "carts/changeQuantity",
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
  reducers: {
    cartBooksUpdated(state, action) {
      state.cartBooks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.fetchCartStatus = "pending";
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.fetchCartStatus = "fulfilled";
        state.cartBooks = action.payload;
      })
      .addCase(loadCart.rejected, (state) => {
        state.fetchCartStatus = "rejected";
      })
      .addCase(addItem.pending, (state) => {
        state.addItemStatus = "pending";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.addItemStatus = "fulfilled";
        state.cartBooks[action.payload.book_id] = action.payload;
      })
      .addCase(addItem.rejected, (state) => {
        state.addItemStatus = "rejected";
      })
      .addCase(changeQuantity.pending, (state) => {
        state.changeQuantityStatus = "pending";
      })
      .addCase(changeQuantity.fulfilled, (state, action) => {
        state.changeQuantityStatus = "fulfilled";
        state.cartBooks[action.payload.book_id].quantity =
          action.payload.quantity;
      })
      .addCase(changeQuantity.rejected, (state) => {
        state.changeQuantityStatus = "rejected";
      })
      .addCase(removeItem.pending, (state) => {
        state.removeItemStatus = "pending";
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.removeItemStatus = "fulfilled";
        delete state.cartBooks[action.payload.book_id];
      })
      .addCase(removeItem.rejected, (state) => {
        state.removeItemStatus = "rejected";
      })
      .addCase(checkoutCart.pending, (state) => {
        state.checkoutCartStatus = "pending";
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.checkoutCartStatus = "fulfilled";
      })
      .addCase(checkoutCart.rejected, (state) => {
        state.checkoutCartStatus = "rejected";
      });
  },
});

export const { cartBooksUpdated } = cartsSlice.actions;
export const selectCart = (state) => state.carts.cartBooks;
export const selectFetchCartStatus = (state) => state.carts.fetchCartStatus;

export default cartsSlice.reducer;
