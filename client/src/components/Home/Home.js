import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllBooks, selectBooks } from "../../features/books/booksSlice";
import { Link } from "react-router-dom";

import ProductCard from "../BookCard/BookCard";

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
    <section className="grid">
      {books &&
        Object.keys(books).length > 0 &&
        Object.keys(books).map((key) => {
          const book = books[key];
          return (
            <Link to={`/books/${book.id}`} key={book.id}>
              <ProductCard data={book} key={book.id} />
            </Link>
          );
        })}
    </section>
  );
}

export default Home;
