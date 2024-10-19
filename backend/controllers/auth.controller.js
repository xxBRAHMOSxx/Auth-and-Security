import { User } from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'


export const getUser = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        // const user = await User.findMany(req.id)
        res.status(200).json({ success: true, user: users })


    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export const signup = async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ success: false, error: "User already exists" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })
        //jwt
        generateTokenAndSetCookie(res, user._id)
        // send email with verification token

        await user.save()
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: null

            }
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => { }

export const logout = async (req, res) => { }


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(400).json({ success: false, message: "provide a valid id" })
        }
        const deleteUser = await User.findById(id)
        if (!deleteUser) {
            return res.status(400).json({ success: false, message: "user not found" })
        }
        await deleteUser.deleteOne()
        res.status(200).json({ success: true, message: "user deleted successfully" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })

    }

}