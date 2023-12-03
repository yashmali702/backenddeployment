import { Router } from 'express';
import pool from '../DBConnecton.mjs'; // Assuming pool is the default export in connection.js
import verifyToken from '../middleware.mjs'; // Import your authentication middleware.

const router = Router();

const productsController = {
  getAllProducts: async (req, res) => {
    try {
      verifyToken(req, res, async () => {
        const { VendorID } = req.user;
        const selectQuery = 'SELECT * FROM Products WHERE VendorID = ?';
        const connection = await pool.getConnection();

        try {
          const [results] = await connection.execute(selectQuery, [VendorID]);
          console.log('Products fetched successfully:', results);
          res.status(200).json({ products: results });
        } finally {
          connection.release();
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },

  getProductsByName: async (req, res) => {
    try {
      verifyToken(req, res, async () => {
        const productName = req.params.Name;
        const { VendorID } = req.user;
        const selectQuery = 'SELECT * FROM Products WHERE VendorID = ? AND ProductName LIKE ?';

        try {
          const [results] = await pool.query(selectQuery, [VendorID, `%${productName}%`]);

          if (results.length === 0) {
            return res.status(404).json({ error: `Product with name "${productName}" not found for the given VendorID` });
          }

          console.log(`Products with name "${productName}" fetched successfully for VendorID ${VendorID}:`, results);
          res.json({ products: results });
        } catch (error) {
          console.error('Error fetching products by name and VendorID:', error);
          res.status(500).json({ error: 'Error fetching products by name and VendorID' });
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },

  createProduct: async (req, res) => {
    try {
      verifyToken(req, res, async () => {
        const { VendorID } = req.user;
        const newProduct = { ...req.body, VendorID };
        const insertQuery = 'INSERT INTO Products SET ?';

        try {
          const [results] = await pool.query(insertQuery, newProduct);
          console.log('Product added successfully:', results);
          res.status(200).json({ message: 'Item created successfully' });
        } catch (error) {
          console.error('Error inserting product:', error);

          if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Duplicate product name. Product names must be unique.' });
          } else {
            res.status(500).json({ error: 'Error inserting product' });
          }
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },

  updateProductByName: async (req, res) => {
    try {
      verifyToken(req, res, async () => {
        const productName = req.params.Name;
        const updatedProductData = req.body;
        const updateQuery = 'UPDATE Products SET ? WHERE ProductName = ?';

        try {
          const [results] = await pool.query(updateQuery, [updatedProductData, productName]);

          if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Product with name "${productName}" not found` });
          }

          console.log(`Product with name "${productName}" updated successfully:`, results);
          res.json({ message: `Product with name "${productName}" updated successfully` });
        } catch (error) {
          console.error('Error updating product:', error);
          res.status(500).json({ error: 'Error updating product' });
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },

  deleteProductByName: async (req, res) => {
    try {
      verifyToken(req, res, async () => {
        const productName = req.params.Name;
        const { VendorID } = req.user;
        const deleteQuery = 'DELETE FROM Products WHERE VendorID = ? AND ProductName LIKE ?';

        try {
          const [results] = await pool.query(deleteQuery, [VendorID, `%${productName}%`]);
          console.log(`Product with ID ${productName} deleted successfully`);
          res.json({ message: `Product with ID ${productName} deleted successfully` });
        } catch (error) {
          console.error('Error deleting product:', error);
          res.status(500).json({ error: 'Error deleting product' });
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  },
};

// Export
export default productsController;
