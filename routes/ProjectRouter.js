import { Router } from 'express';
import {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  showStats,
  inviteMembers,
} from '../controllers/ProjectController.js';

const router = Router();

router.route('/').get(getAllProjects).post(createProject);

router.route('/stats').get(showStats);

router.route('/:id').delete(deleteProject).patch(updateProject);
router.route('/:id/invite').post(inviteMembers);

export default router;
