
import { Router } from 'express';
import pool from '../DBConnecton.mjs'; // Assuming pool is the default export in connection.js
import verifyToken from '../middleware.mjs'; // Import your authentication middleware.



const invoicesController = {


  createInvoice: async (req, res) => {
    try {
      await new Promise((resolve, reject) => {
        verifyToken(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // If the token is valid, you can proceed with creating invoices
      const { VendorID } = req.user;
  
      // Rest of your code for creating invoices
      const { products } = req.body;

      const invoice_id = generateInvoiceID(new Date());

      const productsWithTotal = products.map(product => {
        const gstAmount = (product.gst_percentage / 100) * product.subtotal;
        const total_with_gst = product.subtotal - product.discount + gstAmount;
        return { ...product, total_with_gst };
      });

      const insertQuery = 'INSERT INTO invoices (InvoiceNo, ProductName, Quantity, SubTotal, Discount, Total, PaymentStatus, DatePurchased, VendorID) VALUES ?';

      const values = productsWithTotal.map(product => [
        invoice_id,
        product.product_name,
        product.quantity,
        product.subtotal,
        product.discount,
        product.total_with_gst,
        product.payment_status,
        product.datepurchased,
        VendorID,
      ]);

      const [results] = await pool.query(insertQuery, [values]);

      if (results.affectedRows > 0) {
        res.status(201).json({ message: 'Invoice created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create invoice' });
      }
    } catch (error) {
      console.error('Error creating invoice:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Duplicate invoice ID. Invoice IDs must be unique.' });
      } else {
        res.status(500).json({ error: 'Error creating invoice' });
      }
    }
  


// Function to generate a unique invoice ID based on the current date and time
function generateInvoiceID(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
  },

  getInvoices: async (req, res) => {
    try {
      await new Promise((resolve, reject) => {
        verifyToken(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // If the token is valid, you can proceed with retrieving invoices
      const { VendorID } = req.user;

      // SQL query to fetch invoices for the specific user
      const selectQuery = 'SELECT * FROM Invoices WHERE VendorID = ?';

      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Execute the SQL query with the VendorID parameter
      const [results] = await connection.execute(selectQuery, [VendorID]);

      // Release the connection back to the pool
      connection.release();

      console.log('Invoices fetched successfully:', results);
      res.status(200).json({ invoices: results });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error');
    }
  }
};

export default invoicesController;
