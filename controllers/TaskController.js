import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import List from '../models/List.js';
import Task from '../models/Task.js';

export const taskInfoHelper = async (task) => {
  if (task === null) {
    return null;
  }

  const members = await User.find({ _id: { $in: task.members } }).select(
    'first_name last_name email',
  );

  const taskRes = task.toObject();
  taskRes.members = members;

  return taskRes;
};

export const assignMember = async (req, res, next) => {
  console.log('Assign member');
  try {
    const { id } = req.params;
    const { user } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      throw new BadRequestError('Task not exist');
    }

    const member = await User.findOne({ email: user });
    if (!member) {
      throw new BadRequestError('Member not exist');
    }

    const list = await List.findById(task.list);
    const project = await Project.findById(list.project);

    if (!project.members.includes(member._id)) {
      throw new BadRequestError('Member not in this project');
    }

    task.members.push(member._id);
    await task.save();

    const taskRes = await taskInfoHelper(task);
    res.status(200).json(taskRes);
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  console.log('remove member');
  try {
    const { id } = req.params;
    const { user } = req.body;
    const task = await Task.findByIdAndUpdate(id, {
      $pull: {
        members: user,
      },
    });
    const taskRes = await taskInfoHelper(task);

    res.status(200).json(taskRes);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  console.log('create task');
  try {
    const { title, list } = req.body;

    if (!title || !list) {
      throw new BadRequestError('Please provide all values');
    }

    const task = await Task.create({
      title,
      description: '',
      list,
      members: [],
    });

    const taskRes = await taskInfoHelper(task);

    res.status(201).json(taskRes);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res) => {
  console.log('Update task');
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(id, req.body, { new: true });

  const taskRes = await taskInfoHelper(task);

  res.status(200).json(taskRes);
};

export const deleteTask = async (req, res) => {
  console.log('Delete task');
  const { id } = req.params;
  await Task.deleteOne({ _id: id });

  res.send({ msg: 'Delete successfully' });
};

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ list: req.params.listId });

  res.status(200).json({ tasks, totalTasks: tasks.length });
};
