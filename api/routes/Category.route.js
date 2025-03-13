import express from 'express'
import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../controllers/Category.controller.js'
//import { onlyadmin } from '../middleware/onlyadmin.js'
import { authenticate } from '../middleware/authenticate.js'

const CategoryRoute = express.Router()

CategoryRoute.post('/add', authenticate, addCategory)
CategoryRoute.put('/update/:categoryid', authenticate, updateCategory)
CategoryRoute.get('/show/:categoryid', authenticate, showCategory)
CategoryRoute.delete('/delete/:categoryid', authenticate, deleteCategory)
CategoryRoute.get('/all-category', getAllCategory)


export default CategoryRoute