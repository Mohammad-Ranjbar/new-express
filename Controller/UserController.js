import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export const getUsers = async (req, res) => {
    try {
        const response = await prisma.users.findMany()
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await prisma.users.findUnique({
            where: {
                id: Number(req.params.id),
            },
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const createUser = async (req, res) => {
    const {email, name, family } = req.body
    try {
        const user = await prisma.users.create({
            data: {
                email:email,
                name: name,
                family: family,
            },
        })
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const updateUser = async (req, res) => {
    const { email,name, family } = req.body
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
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await prisma.users.delete({
            where: {
                id: Number(req.params.id),
            },
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}