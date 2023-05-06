import { Router } from 'express';
import {
  createList,
  updateList,
  deleteList,
} from '../controllers/ListController.js';

const router = Router();

router.route('/').post(createList);

export default router;
