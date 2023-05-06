import { Router } from 'express';
import {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  showStats,
  inviteMembers,
  getProjectInfo,
} from '../controllers/ProjectController.js';
import ProjectAuthMiddleware from '../middlewares/ProjectAuth.js';

const router = Router();

router.route('/').get(getAllProjects).post(createProject);

router.route('/stats').get(showStats);

router
  .route('/:pid')
  .get(ProjectAuthMiddleware, getProjectInfo)
  .delete(ProjectAuthMiddleware, deleteProject)
  .post(ProjectAuthMiddleware, updateProject);
router.route('/:pid/invite').post(ProjectAuthMiddleware, inviteMembers);

export default router;
