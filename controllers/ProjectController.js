import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new BadRequestError('Please provide all values');
    }

    const project = await Project.create({
      name,
      createdBy: req.user.userId,
      members: [req.user.userId],
    });

    await User.findByIdAndUpdate(req.user.userId, {
      $push: { projects: project._id },
    });
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Project.deleteOne({ _id: id });
  await User.findByIdAndUpdate(req.user.userId, {
    $pull: {
      projects: id,
    },
  });
  res.send({ msg: 'Delete successfully' });
};

export const updateProject = async (req, res) => {
  res.send('update job');
};

export const getAllProjects = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  const projects = await Project.find({ _id: { $in: user.projects } });

  res.status(200).json({ projects, totalProjects: projects.length });
};

export const showStats = async (req, res) => {
  res.send('show stats');
};
