import { configureStore } from "@reduxjs/toolkit";
import usersReducer from ".//features/users/usersSlice";
import booksReducer from ".//features/books/booksSlice";
import ordersReducer from ".//features/orders/ordersSlice";

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
  },
});
