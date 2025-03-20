import express from 'express'
import { addcomment, commentCount, deleteComment, getAllComments, getComments } from '../controllers/Comment.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import userauth from '../middleware/userauth.js'

const CommentRouote = express.Router()

CommentRouote.post('/add', userauth, addcomment)
CommentRouote.get('/get/:blogid', getComments)
CommentRouote.get('/get-count/:blogid', commentCount)
CommentRouote.get('/get-all-comment', userauth, getAllComments)
CommentRouote.delete('/delete/:commentid', userauth, deleteComment)


export default CommentRouote