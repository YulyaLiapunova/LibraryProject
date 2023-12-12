const Book = require("../models/book");
const usersService = require("../services/users");
const NotFoundError = require("../errors/notFoundError");

const getBooks = (params) => {
  return Book.find(params).select("-borrowHistory").populate("borrowedBy", "name email -_id");
};

const getBook = (id) => {
  return Book.findById(id).select("-borrowHistory");
};

const addBook = (book) => {
  return Book.create(book);
};

const updateBook = async (bookId, bookPayload) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new NotFoundError("Book not found.");
  }

  for (const [field, value] of Object.entries(bookPayload)) {
    if (book[field]) {
      book[field] = value;
    }
  }

  await book.save();
};

const archiveBook = async (bookId) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new NotFoundError("Book not found.");
  }

  book.isDeleted = true;

  await book.save();
};

const borrowBook = async (bookId, userId) => {
  const borrowingPeriod = 14; // days
  const borrowedDate = new Date();
  const dueDate = new Date(borrowedDate);
  dueDate.setDate(dueDate.getDate() + borrowingPeriod);

  const book = await Book.findById(bookId);

  if (!book) {
    throw new NotFoundError("Book not found.");
  }

  const user = await usersService.getUser(userId);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  book.borrowedBy = user.id;
  book.dueDate = dueDate;
  book.borrowHistory.push({
    user: user.id,
    borrowedDate: borrowedDate,
  });

  await book.save();
};

const returnBook = async (bookId) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new NotFoundError("Book not found.");
  }

  book.borrowedBy = null;
  book.dueDate = null;

  if (book.borrowHistory.length > 0) {
    book.borrowHistory[book.borrowHistory.length - 1].returnedDate = new Date();
  }

  await book.save();
};

const getOverdueBooks = () => {
  const today = new Date();
  return Book.find({ dueDate: { $lt: today } }).select("-borrowHistory").populate("borrowedBy");
};

const getBookHistory = async (bookId) => {
  const book = await Book.findById(bookId).populate(
    "borrowHistory.user",
    "name email"
  );

  if (!book) {
    throw new NotFoundError("Book not found.");
  }

  return book;
};

module.exports = {
  addBook,
  getBook,
  getBooks,
  updateBook,
  archiveBook,
  borrowBook,
  returnBook,
  getOverdueBooks,
  getBookHistory,
};
