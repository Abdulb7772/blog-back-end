import express from 'express';
import { createBlog, getBlogs, getBlogById, deleteBlog, updateBlog } from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.delete('/:id', deleteBlog);
router.put('/:id', updateBlog);

export default router;
