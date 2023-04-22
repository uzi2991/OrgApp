import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res, next) => {
  console.log('create project');
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new BadRequestError('Please provide all values');
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.userId,
      members: [req.user.userId],
    });

    await User.findByIdAndUpdate(req.user.userId, {
      $push: { projects: project._id },
    });
    res.status(201).json(project);
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

export const inviteMembers = async (req, res, next) => {
  console.log('Invite members');
  try {
    const { id } = req.params;
    const { users } = req.body;
    const project = await Project.findById(id);

    if (!project) {
      throw new BadRequestError('Project not exist');
    }

    await Promise.all(
      users.map(async (userEmail) => {
        const user = await User.findOne({ email: userEmail });
        if (user && !project.members.includes(user._id)) {
          project.members.push(user._id);
        }
      }),
    );

    await project.save();
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req, res) => {
  res.send('update job');
};

export const getAllProjects = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const projects = await Project.find({ _id: { $in: user.projects } });

  res.status(200).json(projects);
};

export const showStats = async (req, res) => {
  res.send('show stats');
};
