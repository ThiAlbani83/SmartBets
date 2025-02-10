import express from 'express';
import { getXMLFile } from '../controllers/sigap.controller.js';

const router = express.Router();

router.get("/getXML", getXMLFile);

export default router;