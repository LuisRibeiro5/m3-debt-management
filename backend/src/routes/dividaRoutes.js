import express from 'express';
import dividaController from '../controllers/dividaController.js';  
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.get('/', dividaController.getAllDividas);
router.post('/', upload.single('comprovante'), dividaController.createDivida);
router.delete('/:id', dividaController.deleteDivida);
router.get('/comprovante/:id', dividaController.getComprovante);

export default router;