import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import List from '../models/List.js';
import Task from '../models/Task.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, listId } = req.body;

    if (!title || !description || !listId) {
      throw new BadRequestError('Please provide all values');
    }

    const Task = await Task.create({
      title,
      description,
      list: listId,
      members: [],
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

export const Task = async (req, res) => {
  const { id } = req.params;
  await Task.deleteOne({ _id: id });

  res.send({ msg: 'Delete successfully' });
};

export const updateTask = async (req, res) => {
  res.send('update list');
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  await Task.deleteOne({ _id: id });

  res.send({ msg: 'Delete successfully' });
};

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ list: req.params.listId });

  res.status(200).json({ tasks, totalTasks: tasks.length });
};

export const showStats = async (req, res) => {
  res.send('show stats');
};
