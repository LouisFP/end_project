import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadAllBooks } from "../../features/books/booksSlice";

const Home = () => {
  const dispatch = useDispatch();

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
};

export default Home;
