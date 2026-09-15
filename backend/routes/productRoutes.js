const router = require("express").Router();
const db = require("../config/db");

/* ================= GET ALL PRODUCTS ================= */

router.get("/", async (req, res) => {
  try {
    const [products] = await db.query(`
            SELECT
                id,
                name,
                price,
                category,
                image,
                description,
                stock,
                created_at AS createdAt
            FROM products
            ORDER BY created_at DESC
        `);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= ADD PRODUCT ================= */

router.post("/", async (req, res) => {
  try {
    const { name, price, category, image, description, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    const [result] = await db.query(
      `
            INSERT INTO products
            (
                name,
                price,
                category,
                image,
                description,
                stock
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,

      [name, price, category, image || "", description || "", stock || 0],
    );

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

/* ================= UPDATE PRODUCT ================= */

router.put("/:id", async (req, res) => {
  try {
    const { name, price, category, image, description, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    const [result] = await db.query(
      `
            UPDATE products

            SET
                name = ?,
                price = ?,
                category = ?,
                image = ?,
                description = ?,
                stock = ?

            WHERE id = ?
            `,

      [
        name,
        price,
        category,
        image || "",
        description || "",
        stock || 0,
        req.params.id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

/* ================= DELETE PRODUCT ================= */

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
