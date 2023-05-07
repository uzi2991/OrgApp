import { Router } from 'express';
import {
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/TaskController.js';

const router = Router();

router.route('/').post(createTask);
router.route('/:id').delete(deleteTask).post(updateTask);

export default router;
