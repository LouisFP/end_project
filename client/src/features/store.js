import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users/usersSlice";
import booksReducer from "./books/booksSlice";
import ordersReducer from "./orders/ordersSlice";
import cartsReducer from "./cart/cartsSlice";

// Redux persist for persistence of the store upon reloading the app
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    users: usersReducer,
    books: booksReducer,
    orders: ordersReducer,
    carts: cartsReducer,
  },
});
