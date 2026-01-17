import express from 'express';
import {
  bulkCreateComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentWithDetails
} from '../controllers/commentController.js';

const router = express.Router();

// Comment routes
router.post('/', bulkCreateComments);
router.patch('/:commentId', updateComment);
router.post('/find-or-create', findOrCreateComment);
router.get('/search', searchComments);
router.get('/newest/:postId', getNewestComments);
router.get('/details/:id', getCommentWithDetails);

export default router;
