import { Router } from 'express'

import {
  getUsers,
  getUser,
  // getCurrentUser,
  createUser,
  updateUser,
  deleteUser
} from '@/controllers/userController'

// import authMiddleware from 'middleware/authMiddleware'

const router = Router()
router.route('/').get(getUsers).post(createUser)

// router.get('/current', authMiddleware, getCurrentUser)
router.get('/:id', getUser)

// ⚠️ Ultimately, this should have authMiddleware on it.
router.patch('/:id', updateUser)

// ⚠️ Ultimately, this should have authMiddleware on it.
router.delete('/:id', deleteUser) // eslint-disable-line

export default router
