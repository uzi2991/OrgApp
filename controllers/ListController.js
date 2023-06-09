import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import List from '../models/List.js';
import Task from '../models/Task.js';
import { taskInfoHelper } from './TaskController.js';

export const listInfoHelper = async (list) => {
  if (list === null) {
    return null;
  }

  const tasks = await Task.find({ list: list._id });

  const listRes = list.toObject();
  listRes.items = [];

  for (const task of tasks) {
    const taskRes = await taskInfoHelper(task);
    listRes.items.push(taskRes);
  }

  return listRes;
};

export const listDeleteHelper = async (listId) => {
  await List.deleteOne({ _id: listId });
  await Task.deleteMany({ list: listId });
};

export const createList = async (req, res, next) => {
  console.log('Create List');
  try {
    const { title, project } = req.body;

    if (!title || !project) {
      throw new BadRequestError('Please provide all values');
    }

    const list = await List.create({
      title,
      project,
    });

    const listRes = await listInfoHelper(list);

    res.status(201).json(listRes);
  } catch (err) {
    next(err);
  }
};

export const deleteList = async (req, res) => {
  const { id } = req.params;
  await listDeleteHelper(id);
  console.log('delete list');

  res.send({ msg: 'Delete successfully' });
};

export const updateList = async (req, res) => {
  const { id } = req.params;
  const list = await List.findByIdAndUpdate(id, req.body, { new: true });

  const listRes = await listInfoHelper(list);

  res.status(200).json(listRes);
};
