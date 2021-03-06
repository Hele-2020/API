'use strict'

import { Router } from 'express'
import { checkSchema } from 'express-validator'

import { validate } from '../commons/helpers/validators'
import { loggedIn, IsRole } from '../commons/middlewares'
import { store, update } from './validators'
import HttpController from './HttpController'

const storeSchema = checkSchema(store, ['body'])
const updateSchema = checkSchema(update, ['body'])
const router = Router()

router.use(loggedIn, new IsRole('ADMIN'))
router.get('/', HttpController.index)
router.get('/:id', HttpController.show)
router.post('/', validate(storeSchema), HttpController.store)
router.put('/:id', validate(updateSchema), HttpController.update)
router.delete('/:id', HttpController.destroy)

export default router
