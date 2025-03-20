import express from 'express'
import { doLike, likeCount } from '../controllers/BlogLike.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import userauth from '../middleware/userauth.js'
const BlogLikeRoute = express.Router()

BlogLikeRoute.post('/do-like', userauth, doLike)
BlogLikeRoute.get('/get-like/:blogid/:userid?', likeCount)

export default BlogLikeRoute