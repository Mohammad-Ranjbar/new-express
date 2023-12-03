import {Request, Response} from 'express'
import {PrismaClient} from '@prisma/client'
import {validationResult} from 'express-validator';

const prisma: PrismaClient = new PrismaClient()

export const getPosts = async (req: Request, res: Response) => {
    try {
        const response = await prisma.posts.findMany()
        res.status(200).json(response)
    } catch (error: any) {
        res.status(500).json({msg: error.message})
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try {
        const response = await prisma.posts.findUnique({
            where: {
                id: Number(req.params.id),
            },
        })
        res.status(200).json(response)
    } catch (error: any) {
        res.status(404).json({msg: error.message})
    }
}

export const createPost = async (req: Request, res: Response) => {

    const {title, content, published, authorId} = req.body
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const post = await prisma.posts.create({
            data: {
                title: title, content: content, published: published, authorId: authorId
            },
        })
        res.status(201).json(post)
    } catch (error: any) {
        res.status(400).json({msg: error.message})
    }
}

export const updatePost = async (req: Request, res: Response) => {

    const {title, content, published, authorId} = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const post = await prisma.posts.update({
            where: {
                id: Number(req.params.id),
            }, data: {
                title: title, content: content, published: published, authorId: authorId
            },
        })
        res.status(200).json(post)
    } catch (error: any) {
        res.status(400).json({msg: error.message})
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const post = await prisma.posts.delete({
            where: {
                id: Number(req.params.id),
            },
        })
        res.status(200).json(post)
    } catch (error: any) {
        res.status(400).json({msg: error.message})
    }
}