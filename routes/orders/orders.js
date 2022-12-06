const express = require("express");
const db = require("../../db");
const orders = express.Router();

// Select all orders by userId
orders.get("/", (req, res, next) => {
  const { userId } = req.user.id;
  db.query(
    "SELECT * FROM orders where user_id = $1",
    [userId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
});

// Select all orders by orderId and userId
orders.get("/:orderId", (req, res, next) => {
  const { userId } = req.user.id;
  db.query(
    `SELECT * FROM orders 
    WHERE user_id = $1
    AND id = $2`,
    [userId, req.params.orderId],
    (error, results) => {
      if (error) {
        res.status(400).send(error.stack);
      } else {
        res.status(200).json(results.rows);
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
      res.write("Order has been deleted");
      res.end();
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
