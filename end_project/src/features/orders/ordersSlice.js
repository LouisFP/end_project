import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchOrder, fetchOrders } from "../../apis/orders";

export const loadAllOrders = createAsyncThunk("orders/loadOrders", async () => {
  try {
    const response = await fetchOrders();
    return response;
  } catch (err) {
    throw err;
  }
});

export const loadOrder = createAsyncThunk(
  "orders/loadOrder",
  async (orderId) => {
    try {
      const response = await fetchOrder(orderId);
      return response;
    } catch (err) {
      throw err;
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    loadingAllOrders: false,
    failedToLoadOrders: false,
    loadingOrder: false,
    failedToLoadOrder: false,
    orders: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAllOrders.pending, (state) => {
        state.loadingAllOrders = true;
        state.failedToLoadOrders = false;
      })
      .addCase(loadAllOrders.fulfilled, (state, action) => {
        state.loadingAllOrders = false;
        state.failedToLoadOrders = false;
        const { orders } = action.payload;
        orders.forEach((order) => {
          const { id } = order;
          state[id] = order;
        });
      })
      .addCase(loadAllOrders.rejected, (state) => {
        state.loadingAllOrders = false;
        state.failedToLoadOrders = true;
      })
      .addCase(loadOrder.pending, (state) => {
        state.loadingOrder = true;
        state.failedToLoadOrder = false;
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.loadingOrder = false;
        state.failedToLoadOrder = false;
        const { order } = action.payload;
        state[order.id] = order;
      })
      .addCase(loadOrder.rejected, (state) => {
        state.loadingOrder = false;
        state.failedToLoadOrder = true;
      });
  },
});

export const selectOrders = (state) => state.orders.orders;
export const selectLoadingAllBooks = (state) => state.orders.loadingAllOrders;
export const selectFailedToLoadOrders = (state) =>
  state.orders.failedToLoadOrders;
export const selectLoadingOrder = (state) => state.books.loadingOrder;
export const selectFailedToLoadOrder = (state) => state.books.failedToLoadOrder;

export default ordersSlice.reducer;
