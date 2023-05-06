import ForbiddenError from '../errors/Forbidden.js';
import User from '../models/User.js';

const ProjectAuthMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const projectId = req.params.pid;
    const user = await User.findById(userId);
    if (user.projects.includes(projectId)) {
      next();
    } else {
      throw new ForbiddenError('Forbidden');
    }
  } catch (err) {
    next(err);
  }
};

export default ProjectAuthMiddleware;
