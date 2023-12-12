const booksService = require("../services/books");

const getBooks = async (req, res, next) => {
  try {
    const books = await booksService.getBooks();
    res.send(books);
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await booksService.getBook(req.params.id);
    res.send(book);
  } catch (error) {
    next(error);
  }
};

const addBook = async (req, res, next) => {
  try {
    const book = await booksService.addBook(req.body);
    res.send(book);
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    await booksService.updateBook(req.params.id, req.body);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const archiveBook = async (req, res, next) => {
  try {
    await booksService.archiveBook(req.params.id);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const borrowBook = async (req, res, next) => {
  try {
    await booksService.borrowBook(req.params.id, req.params.userId);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    await booksService.returnBook(req.params.id);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const getOverdueBooks = async (req, res, next) => {
  try {
    const books = await booksService.getOverdueBooks(req.params.id);
    res.send(books);
  } catch (error) {
    next(error);
  }
};

const getBookHistory = async (req, res, next) => {
  try {
    const book = await booksService.getBookHistory(req.params.id);
    res.send(book);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBook,
  addBook,
  updateBook,
  archiveBook,
  borrowBook,
  returnBook,
  getOverdueBooks,
  getBookHistory,
};
