import express, {Router} from 'express';
import {body, param, Result, ValidationChain, validationResult} from 'express-validator';
import {PrismaClient} from '@prisma/client';
import {createUser, deleteUser, getUserById, getUsers, updateUser} from '../controllers/UserController';

const prisma: PrismaClient = new PrismaClient();
const router: Router = express.Router();


const validateUniqueEmail:ValidationChain = body('email').custom(async (value, {req}) => {
    const existingUser = await prisma.users.findUnique({where: {email: value}});

    // @ts-ignore
    if (existingUser && existingUser.id !== Number(req.params.id)) {
        throw new Error('Email is already in use');
    }
    return true;
});

const validateCreateUpdate:ValidationChain[] = [
    body('email').isEmail().withMessage('Email is incorrect').normalizeEmail(),
    body('name').notEmpty().withMessage('Name cannot be empty').trim(),
    body('family').notEmpty().withMessage('Family cannot be empty').trim(),
    validateUniqueEmail,
];

const validateIdParam:ValidationChain[] = [
    param('id').isInt().toInt(),
];

const checkValidationResult = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const errors:Result = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    next();
};

router.get('/users', getUsers);

router.get('/users/:id', validateIdParam, checkValidationResult, getUserById);

router.post('/users', validateCreateUpdate, checkValidationResult, createUser);

router.patch('/users/:id', validateIdParam, validateCreateUpdate, checkValidationResult, updateUser);

router.delete('/users/:id', validateIdParam, checkValidationResult, deleteUser);

export default router;
