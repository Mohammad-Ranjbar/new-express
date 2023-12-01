import express,{Request} from 'express';
import { body, param,validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/UserController';

const prisma = new PrismaClient();
const validateUniqueEmail = body('email').custom(async (value, {req}) => {
    const existingUser = await prisma.users.findUnique({ where: { email: value } });
    // @ts-ignore
    if (existingUser && existingUser.id !== Number(req.params.id)) {
        throw new Error('Email is already in use');
    }
    return true;
});
const router = express.Router();


// Validation middleware for create and update routes
const validateCreateUpdate = [
    body('email').isEmail().withMessage('Email is incorrect').normalizeEmail(),
    body('name').notEmpty().withMessage('Name cannot be empty').trim(),
    body('family').notEmpty().withMessage('Family cannot be empty').trim(),
    validateUniqueEmail,
];

// Validation middleware for routes with :id parameter
const validateIdParam = [
    param('id').isInt().toInt(),
];

// Middleware to check validation errors
const checkValidationResult = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

router.get('/users', getUsers);

router.get('/users/:id', validateIdParam, checkValidationResult, getUserById);

router.post('/users', validateCreateUpdate, checkValidationResult, createUser);

router.patch('/users/:id', validateIdParam, validateCreateUpdate, checkValidationResult, updateUser);

router.delete('/users/:id', validateIdParam, checkValidationResult, deleteUser);

export default router;
