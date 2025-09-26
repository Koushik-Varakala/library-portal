import express from 'express';
import {
    createOrGetStudent,
    getStudentById,
    getStudentByStudentId,
    getAllStudents
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getAllStudents);
router.post('/', createOrGetStudent);
router.get('/studentId/:studentId', getStudentByStudentId);
router.get('/:id', getStudentById);

export default router;