import { Router } from 'express';
import {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  showStats,
} from '../controllers/ProjectController.js';

const router = Router();

router.route('/').get(getAllProjects).post(createProject);

router.route('/stats').get(showStats);

router.route('/:id').delete(deleteProject).patch(updateProject);

export default router;
