const router = require("express").Router();
const db = require("../config/db");

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const [orders] = await db.query(`
            SELECT
                id,
                customer_name AS customerName,
                phone,
                city,
                address,
                product,
                product_id AS productId,
                size,
                quantity,
                total_price AS totalPrice,
                status,
                created_at AS createdAt
            FROM orders
            ORDER BY created_at DESC
        `);

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// TRACK ORDER
router.get("/track", async (req, res) => {
  try {
    const { orderId, phone } = req.query;

    if (!orderId || !phone) {
      return res.status(400).json({
        message: "Order ID and phone number are required",
      });
    }

    const [orders] = await db.query(
      `
            SELECT
                id,
                customer_name AS customerName,
                phone,
                city,
                address,
                product,
                product_id AS productId,
                size,
                quantity,
                total_price AS totalPrice,
                status,
                created_at AS createdAt
            FROM orders
            WHERE id = ? AND phone = ?
            LIMIT 1
            `,
      [orderId, phone],
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message:
          "Order not found. Please check your Order ID and phone number.",
      });
    }

    res.json({
      success: true,
      order: orders[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      city,
      address,
      product,
      productId,
      size,
      quantity,
      totalPrice,
    } = req.body;

    const [result] = await db.query(
      `
            INSERT INTO orders
            (
                customer_name,
                phone,
                city,
                address,
                product,
                product_id,
                size,
                quantity,
                total_price
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
      [
        customerName,
        phone,
        city,
        address,
        product,
        productId || null,
        size,
        quantity || 1,
        totalPrice,
      ],
    );

    const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE ORDER STATUS
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const [result] = await db.query(
      `
            UPDATE orders
            SET status = ?
            WHERE id = ?
            `,
      [status, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
