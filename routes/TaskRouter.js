import { Router } from 'express';
import {
  createTask,
  updateTask,
  deleteTask,
  assignMember,
  removeMember,
} from '../controllers/TaskController.js';

const router = Router();

router.route('/').post(createTask);
router.route('/:id').delete(deleteTask).post(updateTask);
router.route('/:id/assign').post(assignMember);
router.route('/:id/remove').post(removeMember);

export default router;
