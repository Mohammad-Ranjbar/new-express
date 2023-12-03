import express, {Router} from 'express';
import {body, param, Result, ValidationChain, validationResult} from 'express-validator';
import {PrismaClient} from '@prisma/client';
import {createPost, deletePost, getPostById, getPosts, updatePost} from '../controllers/PostController';

const prisma: PrismaClient = new PrismaClient();
const router: Router = express.Router();


const validateUniqueTitle: ValidationChain = body('title').custom(async (value, {req}) => {
    const existingUser = await prisma.posts.findUnique({where: {title: value}});

    // @ts-ignore
    if (existingUser && existingUser.id !== Number(req.params.id)) {
        throw new Error('Title is already in use');
    }
    return true;
});

const validateCreateUpdate: ValidationChain[] = [
    body('title').notEmpty().withMessage('Title cannot be empty').trim(),
    body('content').notEmpty().withMessage('Content cannot be empty').trim(),
    body('published').notEmpty().withMessage('Content cannot be empty'),
    validateUniqueTitle,
];

const validateIdParam: ValidationChain[] = [
    param('id').isInt().toInt(),
];

const checkValidationResult = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const errors: Result = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    next();
};

router.get('/posts', getPosts);

router.get('/posts/:id', validateIdParam, checkValidationResult, getPostById);

router.post('/posts', validateCreateUpdate, checkValidationResult, createPost);

router.patch('/posts/:id', validateIdParam, validateCreateUpdate, checkValidationResult, updatePost);

router.delete('/posts/:id', validateIdParam, checkValidationResult, deletePost);

export default router;
