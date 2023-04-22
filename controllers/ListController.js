import BadRequestError from '../errors/BadRequest.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import List from '../models/List.js';

export const createList = async (req, res, next) => {
  try {
    const { name, projectId } = req.body;

    if (!name || !projectId) {
      throw new BadRequestError('Please provide all values');
    }

    const list = await List.create({
      name,
      project: projectId,
    });

    res.status(201).json({ list });
  } catch (err) {
    next(err);
  }
};

export const deleteList = async (req, res) => {
  const { id } = req.params;
  await List.deleteOne({ _id: id });

  res.send({ msg: 'Delete successfully' });
};

export const updateList = async (req, res) => {
  res.send('update list');
};


export const showStats = async (req, res) => {
  res.send('show stats');
};
