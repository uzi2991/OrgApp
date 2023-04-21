import { Router } from 'express';
import {
  createList,
  updateList,
  deleteList,
  getAllLists,
  showStats,
} from '../controllers/ListController.js';

const router = Router();

router.route('/').get(getAllProjects).post(createProject);

router.route('/stats').get(showStats);

router.route('/:id').delete(deleteProject).patch(updateProject);

export default router;
