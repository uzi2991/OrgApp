import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import List from '../models/List.js';

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

    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
};

export const deleteList = async (req, res) => {
  const { id } = req.params;
  await List.deleteOne({ _id: id });
  console.log('delete list');

  res.send({ msg: 'Delete successfully' });
};

export const updateList = async (req, res) => {
  const { id } = req.params;
  const list = await List.findByIdAndUpdate(id, req.body, { new: true });

  res.status(200).json(list);
};

export const showStats = async (req, res) => {
  res.send('show stats');
};
