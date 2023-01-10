import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../../features/users/usersSlice";
import "./Header.css";

function Header() {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <section className="header">
      <div className="invisible"></div>
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
            <button>My cart</button>
          </Link>
        )}
        {currentUser.user && (
          <Link to={"/logout"}>
            <button>Logout</button>
          </Link>
        )}
      </div>
    </section>
  );
}

export default Header;
