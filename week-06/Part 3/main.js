const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "retail_store",
};

async function executeQuery(query) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results] = await connection.execute(query);
    console.log("Results:", results);
    return results;
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

async function executeMultipleQueries(queries) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    for (const query of queries) {
      console.log(`Query: ${query}\n`);
      const [results] = await connection.execute(query);
      console.log("Results:", results);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

async function main() {
  const rootConnection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  });

  await rootConnection.execute("CREATE DATABASE IF NOT EXISTS retail_store");
  await rootConnection.end();

  const createTables = [
    `CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT PRIMARY KEY AUTO_INCREMENT,
      SupplierName TEXT NOT NULL,
      ContactNumber TEXT
    )`,

    `CREATE TABLE IF NOT EXISTS Products (
      ProductID INT PRIMARY KEY AUTO_INCREMENT,
      ProductName TEXT,
      Price DECIMAL(10, 2),
      StockQuantity INT,
      SupplierID INT,
      FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    )`,

    `CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT PRIMARY KEY AUTO_INCREMENT,
      ProductID INT,
      QuantitySold INT,
      SaleDate DATE,
      FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    )`,
  ];

  await executeMultipleQueries(createTables, "Create the required tables");

  await executeQuery(
    "ALTER TABLE Products ADD COLUMN Category VARCHAR(100)",
    'Add a column "Category" to the Products table'
  );

  await executeQuery(
    "ALTER TABLE Products DROP COLUMN Category",
    'Remove the "Category" column from Products'
  );

  await executeQuery(
    "ALTER TABLE Suppliers MODIFY COLUMN ContactNumber VARCHAR(15)",
    'Change "ContactNumber" column in Suppliers to VARCHAR(15)'
  );

  await executeQuery(
    "ALTER TABLE Products MODIFY COLUMN ProductName TEXT NOT NULL",
    "Add a NOT NULL constraint to ProductName"
  );

  const insertQueries = [
    "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES ('FreshFoods', '01001234567')",

    "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES ('Milk', 15.00, 50, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods'))",
    "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES ('Bread', 10.00, 30, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods'))",
    "INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES ('Eggs', 20.00, 40, (SELECT SupplierID FROM Suppliers WHERE SupplierName = 'FreshFoods'))",

    "INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES ((SELECT ProductID FROM Products WHERE ProductName = 'Milk'), 2, '2025-05-20')",
  ];

  await executeMultipleQueries(insertQueries, "Perform Basic Inserts");

  await executeQuery(
    "UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'",
    "Update the price of 'Bread' to 25.00"
  );

  await executeQuery(
    "DELETE FROM Products WHERE ProductName = 'Eggs'",
    "Delete the product 'Eggs'"
  );

  await executeQuery(
    `SELECT p.ProductName, COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
     FROM Products p
     LEFT JOIN Sales s ON p.ProductID = s.ProductID
     GROUP BY p.ProductID, p.ProductName`,
    "Retrieve the total quantity sold for each product"
  );

  await executeQuery(
    `SELECT ProductName, StockQuantity
     FROM Products
     WHERE StockQuantity = (SELECT MAX(StockQuantity) FROM Products)`,
    "Get the product with the highest stock"
  );

  await executeQuery(
    "SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'",
    "Find suppliers with names starting with 'F'"
  );

  await executeQuery(
    `SELECT p.ProductID, p.ProductName, p.Price, p.StockQuantity
     FROM Products p
     LEFT JOIN Sales s ON p.ProductID = s.ProductID
     WHERE s.SaleID IS NULL`,
    "Show all products that have never been sold"
  );

  await executeQuery(
    `SELECT s.SaleID, p.ProductName, s.QuantitySold, s.SaleDate
     FROM Sales s
     INNER JOIN Products p ON s.ProductID = p.ProductID`,
    "Get all sales along with product name and sale date"
  );

  const userManagementQueries14 = [
    "CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'manager_password'",
    "GRANT SELECT, INSERT, UPDATE ON retail_store.* TO 'store_manager'@'localhost'",
    "FLUSH PRIVILEGES",
  ];

  await executeMultipleQueries(
    userManagementQueries14,
    'Create user "store_manager" with SELECT, INSERT, UPDATE permissions'
  );

  const userManagementQueries15 = [
    "REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost'",
    "FLUSH PRIVILEGES",
  ];

  await executeMultipleQueries(
    userManagementQueries15,
    'Revoke UPDATE permission from "store_manager"'
  );

  const userManagementQueries16 = [
    "GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost'",
    "FLUSH PRIVILEGES",
  ];

  await executeMultipleQueries(
    userManagementQueries16,
    'Grant DELETE permission to "store_manager" only on Sales table'
  );
}

main().catch(console.error);
