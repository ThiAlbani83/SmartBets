import express from 'express';
import { deleteSupplier, registerSupplier, searchSuppliers, updateSupplier } from '../controllers/suppliers.controller.js';

const router = express.Router();

router.get('/search', searchSuppliers);
router.put('/edit/:id', updateSupplier);
router.post('/register', registerSupplier);
router.post('/delete/:id', deleteSupplier); 

export default router;