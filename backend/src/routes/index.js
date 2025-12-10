import express from 'express';
import dividaRoutes from './dividaRoutes.js';

const router = express.Router();

router.use('/dividas', dividaRoutes);

export default router;