import express from 'express';
import { deleteProduct, registerProduct, searchProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/register', registerProduct);
router.get('/search', searchProducts);
router.delete('/delete/:id', deleteProduct); 
router.put('/update/:id', updateProduct);


export default router;