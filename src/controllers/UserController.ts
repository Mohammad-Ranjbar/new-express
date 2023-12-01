import  {Request,Response} from 'express'
import { PrismaClient } from '@prisma/client'
import { validationResult } from 'express-validator';


const prisma = new PrismaClient()


export const getUsers = async (req:Request, res:Response) => {
    try {
        const response = await prisma.users.findMany()
        res.status(200).json(response)
    } catch (error:any) {
        res.status(500).json({ msg: error.message })
    }
}

export const getUserById = async (req:Request, res:Response) => {
    try {
        const response = await prisma.users.findUnique({
            where: {
                id: Number(req.params.id),
            },
        })
        res.status(200).json(response)
    } catch (error:any) {
        res.status(404).json({ msg: error.message })
    }
}

export const createUser = async (req:Request, res:Response) => {
    console.log('Request Body:', req.body);

    const {email, name, family } = req.body
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await prisma.users.create({
            data: {
                email:email,
                name: name,
                family: family,
            },
        })
        res.status(201).json(user)
    } catch (error:any) {
        res.status(400).json({ msg: error.message })
    }
}

export const updateUser = async (req:Request, res:Response) => {

    const { email,name, family } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await prisma.users.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                email:email,
                name: name,
                family: family,
            },
        })
        res.status(200).json(user)
    } catch (error:any) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteUser = async (req:Request, res:Response) => {
    try {
        const user = await prisma.users.delete({
            where: {
                id: Number(req.params.id),
            },
        })
        res.status(200).json(user)
    } catch (error:any) {
        res.status(400).json({ msg: error.message })
    }
}