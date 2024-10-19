import { User } from '../models/user.model.js'

import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js'


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
        await sendVerificationEmail(user.email, verificationToken)
        // send email with verification token

        await user.save()
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined

            }
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export const verifyUser = async (req, res) => {
    const { code } = req.body

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token" })
        }
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()
        await sendWelcomeEmail(user.email, user.name)
        res.status(200).json({ success: true, message: "User verified successfully" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Please verify your email to login" })
        }
        generateTokenAndSetCookie(res, user._id)
        user.lastLogin = new Date()
        await user.save()
        res.status(200).json({
            success: true, message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }

}

export const logout = async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ success: true, message: "Logged out successfully" })
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "provide a valid email" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" })
        }

        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetPasswordToken = resetToken
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000

        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordExpiresAt = resetPasswordExpiresAt

        await user.save()
        // send email with reset token
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/resetpassword/${resetToken}`)

        res.status(200).json({ success: true, message: "Reset token sent to your email" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}


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