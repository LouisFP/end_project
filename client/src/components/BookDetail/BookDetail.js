import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { loadBook, selectBooks } from "../../features/books/booksSlice";
import {
  changeQuantity,
  loadCart,
  selectCart,
} from "../../features/cart/cartsSlice";
import {
  needsLoginRedirectUpdated,
  selectCurrentUser,
} from "../../features/users/usersSlice";

function BookDetail() {
  const dispatch = useDispatch();
  const id = useParams().bookId;
  const books = useSelector(selectBooks);
  const [counter, setCounter] = useState(0);
  const cartContent = useSelector(selectCart);
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  console.log(currentUser.user);

  useEffect(() => {
    if (!books[id]) {
      (async function load() {
        let book = await dispatch(loadBook(id));
        setCounter(0);
        return book.payload;
      })();
    }
  }, [dispatch, id, books]);

  function handleIncrement() {
    setCounter(counter + 1);
  }

  function handleDecrement() {
    if (counter === 1) {
      return;
    }
    setCounter(counter - 1);
  }

  const handleAddToCart = async () => {
    try {
      // If not logged in send to login page
      if (!currentUser.user) {
        dispatch(needsLoginRedirectUpdated(true));
        navigate("/login");
        // Checks to see if item is in the cart already
        //   } else if(cartContent.includes) {
      }
    } catch (err) {
      throw err;
    }
  };

  const testCart = async () => {
    await dispatch(loadCart());
  };

  return (
    <section className="book-detail">
      <div className="book-info"></div>
      <div className="counter">
        <p>
          <button onClick={handleDecrement}>-</button>
          {counter}
          <button onClick={handleIncrement}>+</button>
        </p>
      </div>
      <div className="add-to-cart">
        <button onClick={handleAddToCart}>Add to cart</button>
      </div>
      <div>
        <button onClick={testCart}>Test cart</button>
      </div>
    </section>
  );
}

export default BookDetail;
