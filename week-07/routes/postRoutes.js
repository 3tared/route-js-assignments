import express from 'express';
import { createPost, deletePost, getPostsWithDetails, getPostsWithCommentCount } from '../controllers/postController.js';

const router = express.Router();

// Post routes
router.post('/', createPost);
router.delete('/:postId', deletePost);
router.get('/details', getPostsWithDetails);
router.get('/comment-count', getPostsWithCommentCount);

export default router;
