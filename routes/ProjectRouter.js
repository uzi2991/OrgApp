import { Router } from 'express';
import {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  showStats,
  inviteMembers,
} from '../controllers/ProjectController.js';
import ProjectAuthMiddleware from '../middlewares/ProjectAuth.js';

const router = Router();

router.route('/').get(getAllProjects).post(createProject);

router.route('/stats').get(showStats);

router
  .route('/:pid')
  .delete(ProjectAuthMiddleware, deleteProject)
  .patch(ProjectAuthMiddleware, updateProject);
router.route('/:pid/invite').post(ProjectAuthMiddleware, inviteMembers);

export default router;
