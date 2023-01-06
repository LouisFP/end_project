import apiAxios from "./axios";

// API interface for getting all books
export const fetchAllBooks = async () => {
  try {
    const response = await apiAxios.get("/books");

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

// API interface for getting a product by product ID
export const fetchBook = async (bookId) => {
  try {
    const response = await apiAxios.get(`/books/${bookId}`);

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
