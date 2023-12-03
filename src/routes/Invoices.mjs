// routes/invoices.js
import express from 'express';
const router = express.Router();
import invoicesController from '../controllers/Invoices.mjs';



router.get('/getinvoices', invoicesController.getInvoices);
router.post('/addinvoices', invoicesController.createInvoice);

export default router;