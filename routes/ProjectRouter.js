import { Router } from 'express';
import {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  inviteMembers,
  getProjectInfo,
  removeMember,
} from '../controllers/ProjectController.js';
import ProjectAuthMiddleware from '../middlewares/ProjectAuth.js';

const router = Router();

router.route('/').get(getAllProjects).post(createProject);


router
  .route('/:pid')
  .get(ProjectAuthMiddleware, getProjectInfo)
  .delete(ProjectAuthMiddleware, deleteProject)
  .post(ProjectAuthMiddleware, updateProject);
router.route('/:pid/invite').post(ProjectAuthMiddleware, inviteMembers);
router.route('/:pid/remove').post(ProjectAuthMiddleware, removeMember);

export default router;
