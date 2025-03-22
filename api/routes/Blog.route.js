import express from 'express'
import { addBlog, deleteBlog, editBlog, getAllBlogs, getBlog, getBlogByCategory, getRelatedBlog, search, showAllBlog, updateBlog } from '../controllers/Blog.controller.js'
import upload from '../config/multer.js'
// import { authenticate } from '../middleware/authenticate.js'
import userauth from '../middleware/userauth.js'
import onlyadmin from '../middleware/onlyadmin.js'
const BlogRoute = express.Router()

BlogRoute.post('/add', onlyadmin, upload.single('file'), addBlog)
BlogRoute.get('/edit/:blogid', onlyadmin, editBlog)
BlogRoute.put('/update/:blogid', onlyadmin, upload.single('file'), updateBlog)
BlogRoute.delete('/delete/:blogid', onlyadmin, deleteBlog)
BlogRoute.get('/get-all', onlyadmin, showAllBlog)

BlogRoute.get('/get-blog/:slug', getBlog)
BlogRoute.get('/get-related-blog/:category/:blog', getRelatedBlog)
BlogRoute.get('/get-blog-by-category/:category', getBlogByCategory)
BlogRoute.get('/search', search)

BlogRoute.get('/blogs', getAllBlogs)

export default BlogRoute