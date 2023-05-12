import { Router } from 'express';
import {
  createTask,
  updateTask,
  deleteTask,
  assignMember,
} from '../controllers/TaskController.js';

const router = Router();

router.route('/').post(createTask);
router.route('/:id').delete(deleteTask).post(updateTask);
router.route('/:id/assign').post(assignMember);

export default router;
