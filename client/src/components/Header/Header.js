import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  currentUserUpdated,
  selectCurrentUser,
} from "../../features/users/usersSlice";
import apiAxios from "../../apis/axios";
import "./Header.css";
import { cartBooksUpdated, selectCart } from "../../features/cart/cartsSlice";
import { ordersUpdated } from "../../features/orders/ordersSlice";

function Header() {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  const cartItemsNum = Object.keys(cart).reduce(
    (acc, key) => acc + cart[key].quantity,
    0
  );

  const handleLogout = async () => {
    try {
      // clear current user
      await dispatch(currentUserUpdated({}));
      // clear cart
      await dispatch(cartBooksUpdated({}));
      // clear orders
      await dispatch(ordersUpdated({}));
      // Logout in server
      await apiAxios.get("/logout");
    } catch (err) {
      throw err;
    }
  };

  return (
    <section className="header">
      <div className="invisible">
        <Link to={"/"}>
          <button>Books</button>
        </Link>
      </div>
      <div className="header-title">
        <p>The Bookstore</p>
      </div>
      <div className="header-link-elements">
        {!currentUser.user && (
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
        )}
        {!currentUser.user && (
          <Link to={"/register"}>
            <button>Register</button>
          </Link>
        )}
        {currentUser.user && (
          <Link to={"/cart"}>
            <button>
              My cart <span className="counter">{cartItemsNum}</span>
            </button>
          </Link>
        )}
        {currentUser.user && (
          <Link to={"/"}>
            <button onClick={handleLogout}>Logout</button>
          </Link>
        )}
      </div>
    </section>
  );
}

export default Header;
