import express from 'express';
const router = express.Router();
import { getUser, addSignupUser, loginUser, blog, getAllBlogs, getParticularBlog } from '../Controller/UserController.js';

import upload from '../utils/multersetup.js';


router.get('/', getUser);
router.post('/signup', addSignupUser);
router.post('/login', loginUser);
router.post('/blog', upload.single('image'), blog);
router.get('/getblogs', getAllBlogs);
router.get('/getparticularblog/:id', getParticularBlog)



export default router;