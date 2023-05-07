import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import List from '../models/List.js';
import Task from '../models/Task.js';

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

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res) => {
  console.log('Update task');
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json(task);
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
