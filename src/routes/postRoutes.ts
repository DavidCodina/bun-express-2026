import { Router } from 'express'

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
} from '@/controllers/postController'

// import authMiddleware from 'middleware/authMiddleware'

const router = Router()
router.route('/').get(getPosts).post(createPost)

router.get('/:id', getPost)

// ⚠️ Ultimately, this should have authMiddleware on it.
router.patch('/:id', updatePost)

// ⚠️ Ultimately, this should have authMiddleware on it.
router.delete('/:id', deletePost) // eslint-disable-line

export default router
