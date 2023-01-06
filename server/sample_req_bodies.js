// Books JSON
// {
//     "title": "The Return Of The King",
//     "author": "J.R.R Tolkien",
//     "num_of_pages": "1567",
//     "genre": "Fantasy",
//     "price": "6.99"
// }

// User JSON
// {
//     "username": "BobRoss",
//     "password": "RossBob",
//     "email": "BobRoss@gmail.com"
// }

// `SELECT
// cart_items.id,
// books.id AS book_id,
// books.title,
// books.author,
// books.price,
// cart_items.quantity
// FROM carts
// INNER JOIN cart_items
// ON carts.user_id = cart_items.user_id
// INNER JOIN books
// ON cart_items.book_id = books.id
// WHERE carts.user_id = $1`
