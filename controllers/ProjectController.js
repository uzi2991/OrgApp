import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import List from '../models/List.js';
import Task from '../models/Task.js';
import UnAuthenticatedError from '../errors/UnAuthenticated.js';
import ForbiddenError from '../errors/Forbidden.js';
import { listDeleteHelper, listInfoHelper } from './ListController.js';

const projectInfoHelper = async (project) => {
  if (project === null) {
    return null;
  }

  const lists = await List.find({ project: project._id });
  const members = await User.find({ _id: { $in: project.members } }).select(
    'first_name last_name email',
  );

  const projectRes = project.toObject();

  projectRes.lists = [];
  for (const list of lists) {
    const listRes = await listInfoHelper(list);
    projectRes.lists.push(listRes);
  }

  projectRes.members = members;

  return projectRes;
};

const projectDeleteHelper = async (projectId) => {
  const project = await Project.findOneAndDelete({ _id: projectId });
  const lists = await List.find({ project: projectId });
  for (const list of lists) {
    await listDeleteHelper(list._id);
  }

  await User.updateMany(
    {
      _id: {
        $in: project.members,
      },
    },
    {
      $pull: {
        projects: projectId,
      },
    },
  );
};

export const createProject = async (req, res, next) => {
  console.log('create project');
  try {
    const { title, description } = req.body;

    if (!title) {
      throw new BadRequestError('Please provide all values');
    }

    const project = await Project.create({
      title,
      description: description || '',
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
  console.log('delete Project');
  const { pid } = req.params;
  await projectDeleteHelper(pid);

  res.send({ msg: 'Delete successfully' });
};

export const inviteMembers = async (req, res, next) => {
  console.log('Invite members');
  try {
    const { pid } = req.params;
    const { users } = req.body;
    const project = await Project.findById(pid);

    if (!project) {
      throw new BadRequestError('Project not exist');
    }

    if (project.createdBy.toString() !== req.user.userId) {
      throw new ForbiddenError('Forbidden');
    }

    const newUsers = [];

    await Promise.all(
      users.map(async (userEmail) => {
        const user = await User.findOne({ email: userEmail });
        if (user && !project.members.includes(user._id)) {
          user.projects.push(project._id);
          await user.save();

          newUsers.push({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            _id: user._id,
          });
          project.members.push(user._id);
        }
      }),
    );

    await project.save();

    res.status(200).json(newUsers);
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  console.log('remove member');
  try {
    const { pid } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(pid);

    if (!project) {
      throw new BadRequestError('Project not exist');
    }

    if (project.createdBy.toString() === userId) {
      throw new BadRequestError('Cannot remove admin');
    }

    if (
      project.createdBy.toString() !== req.user.userId &&
      userId !== req.user.userId
    ) {
      throw new ForbiddenError('Forbidden');
    }

    project.members.pull(userId);

    const list = await List.find({ project: project._id });
    const listIds = list.map((list) => list._id);
    await Task.updateMany(
      {
        list: {
          $in: listIds,
        },
      },
      {
        $pull: {
          members: userId,
        },
      },
    );

    await project.save();

    await User.findByIdAndUpdate(userId, {
      $pull: {
        projects: pid,
      },
    });

    res.json({ msg: 'Delete successfully' });
  } catch (err) {
    next(err);
  }
};

export const getProjectInfo = async (req, res) => {
  const project = await Project.findById(req.params.pid);

  const projectInfo = await projectInfoHelper(project);

  res.status(200).json(projectInfo);
};

export const updateProject = async (req, res) => {
  console.log('Update Project');
  const project = await Project.findByIdAndUpdate(req.params.pid, req.body, {
    new: true,
  });

  const projectInfo = await projectInfoHelper(project);

  res.status(200).json(projectInfo);
};

export const getAllProjects = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const projects = await Project.find({ _id: { $in: user.projects } });
  // let projectsRes = [];
  // for (const project of projects) {
  //   const _project = await projectInfoHelper(project);
  //   projectsRes.push(_project);
  // }

  let projectsRes = projects;

  if (req.query.q) {
    projectsRes = projectsRes.filter((project) =>
      project.title.toLowerCase().startsWith(req.query.q.toLowerCase()),
    );
  }

  res.status(200).json(projectsRes);
};
