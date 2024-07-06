const Wishlist = require("../models/Wishlist");
const { getBookByISBN } = require("../controllers/bookDetailsController");
const { findBookIdByISBN } = require("../services/bookService");

async function getWishlist(req, res) {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.body.userId });
    if (!wishlist) return res.status(404).send("Wishlist not found");
    res.json(wishlist);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function addBookToWishlist(req, res) {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.params.userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.body.userId, books: [] });
    }
    wishlist.books.push(getBookByISBN(req.body.isbn));
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function removeBookFromWishlist(req, res) {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    if (!wishlist) return res.status(404).send("Wishlist not found");

    wishlist.books = wishlist.books.filter(
      (book) => book.bookId !== findBookIdByISBN(req.params.isbn)
    );
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = { getWishlist, addBookToWishlist, removeBookFromWishlist };