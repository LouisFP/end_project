import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllBooks, fetchBook } from "../../apis/books";

export const loadAllBooks = createAsyncThunk("books/loadAllBooks", async () => {
  try {
    const response = await fetchAllBooks();
    return {
      books: response,
    };
  } catch (err) {
    throw err;
  }
});

export const loadBook = createAsyncThunk("books/loadBook", async (params) => {
  try {
    const response = await fetchBook(params);
    return {
      book: response,
    };
  } catch (err) {
    throw err;
  }
});

const booksSlice = createSlice({
  name: "books",
  initialState: {
    loadingAllBooks: false,
    failedToLoadBooks: false,
    loadingBook: false,
    failedToLoadBook: false,
    books: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAllBooks.pending, (state) => {
        state.loadingAllBooks = true;
        state.failedToLoadBooks = false;
      })
      .addCase(loadAllBooks.fulfilled, (state, action) => {
        state.loadingAllBooks = false;
        state.failedToLoadBooks = false;
        const { books } = action.payload;
        books.forEach((book) => {
          const { id } = book;
          state[id] = book;
        });
      })
      .addCase(loadAllBooks.rejected, (state) => {
        state.loadingAllBooks = false;
        state.failedToLoadBooks = true;
      })
      .addCase(loadBook.pending, (state) => {
        state.loadingBook = true;
        state.failedToLoadBook = false;
      })
      .addCase(loadBook.fulfilled, (state, action) => {
        state.loadingBook = false;
        state.failedToLoadBook = false;
        const { book } = action.payload;
        state[book.id] = book;
      })
      .addCase(loadBook.rejected, (state) => {
        state.loadingBook = false;
        state.failedToLoadBook = true;
      });
  },
});

export const selectBooks = (state) => state.books.books;
export const selectLoadingAllBooks = (state) => state.books.loadingAllBooks;
export const selectFailedToLoadBooks = (state) => state.books.failedToLoadBooks;
export const selectLoadingBook = (state) => state.books.loadingBook;
export const selectFailedToLoadBook = (state) => state.books.failedToLoadBook;

export default booksSlice.reducer;
