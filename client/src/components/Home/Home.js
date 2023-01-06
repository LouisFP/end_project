import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadAllBooks, selectBooks } from "../../features/books/booksSlice";

function Home() {
  const dispatch = useDispatch();
  const books = useSelector(selectBooks);

  useEffect(() => {
    async function load() {
      await dispatch(loadAllBooks());
    }
    load();
  }, [dispatch]);

  return (
    <div className="grid">
      <p>Hello World!</p>
    </div>
  );
}

export default Home;
