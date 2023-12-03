// routes/queries.js
import express from 'express';
const router = express.Router();
import productsController from '../controllers/queries.mjs';
import verifyToken from '../middleware.mjs'; // Import your authentication middleware.

// Route: Get all items for the logged-in user
router.get('/Items', verifyToken, productsController.getAllProducts);

// Route: Get items by Name for the logged-in user
router.get('/Items/:Name', verifyToken, productsController.getProductsByName);

// Route: Create a new item
router.post('/Items', verifyToken, productsController.createProduct);

// Route: Update item by Name
router.put('/Items/:Name', verifyToken, productsController.updateProductByName);

// Route: Delete item by Name
router.delete('/Items/:Name', verifyToken, productsController.deleteProductByName);


export default router ;