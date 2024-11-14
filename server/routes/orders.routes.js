import express from 'express';
import multer from 'multer';
import { createOrder, getOrders, updateOrder, deleteOrder, getFile, getActiveOrders, getOrderById, getCompletedOrders, sendOrderNotification } from '../controllers/order.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/create', upload.array('orcamentos', 3), createOrder);
router.get('/search', getOrders);
router.put('/update/:id', updateOrder);
router.delete('/delete/:id', deleteOrder);
router.get('/files/:filename', getFile);
router.get('/active', getActiveOrders);
router.get('/find/:id', getOrderById);
router.get('/completed', getCompletedOrders);
router.post("/send-email", sendOrderNotification);

export default router;