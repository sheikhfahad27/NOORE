require("dotenv").config();
const mysql = require("mysql2/promise");

async function setupDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log("Aiven MySQL connected");

    await connection.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(100) NOT NULL,
                image TEXT,
                description TEXT,
                stock INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    await connection.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                city VARCHAR(100) NOT NULL,
                address TEXT NOT NULL,
                product VARCHAR(255) NOT NULL,
                product_id INT,
                size VARCHAR(50) NOT NULL,
                quantity INT DEFAULT 1,
                total_price DECIMAL(10,2) NOT NULL,
                status ENUM(
                    'Pending',
                    'Confirmed',
                    'Shipped',
                    'Delivered',
                    'Cancelled'
                ) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    console.log("Products table ready");
    console.log("Orders table ready");
    console.log("Database setup completed successfully");
  } catch (error) {
    console.error("Database setup error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
