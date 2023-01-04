const e = require("express");
const express = require("express");
const db = require("../../db");
const orders = express.Router();

// Select all orders for the user
orders.get("/", (req, res, next) => {
  db.query(
    `SELECT  
      orders.id,
      users.username,
      users.email,
      orders.order_total,
      orders.created_at
    FROM orders
    INNER JOIN users
    ON orders.user_id = users.id
    WHERE user_id = $1`,
    [req.user.id],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
});

// Select an order for the user by orderId
orders.get("/:orderId", (req, res, next) => {
  db.query(
    `SELECT * FROM orders 
    WHERE user_id = $1
    AND id = $2`,
    [req.user.id, req.params.orderId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else if (results.rows.length) {
        res.status(200).json(results.rows);
      } else {
        res.status(404).json({ message: "No order found!" });
      }
    }
  );
});

// Deletes an order
const deleteOrder = (orderId) => {
  db.query(
    `DELETE FROM orders
    WHERE id = $1`,
    [orderId],
    (error, results) => {
      if (error) {
        throw new error();
      }
      res.json({ message: "Order has been deleted" });
    }
  );
};

// Creates an order
const createOrder = (userId) => {
  db.query(
    `INSERT INTO orders
        (user_id)
        VALUES ($1)`,
    [userId],
    (error, results) => {
      if (error) {
        throw new error();
      } else {
        return results.rows;
      }
    }
  );
};

module.exports = {
  orders,
  createOrder,
  deleteOrder,
};
