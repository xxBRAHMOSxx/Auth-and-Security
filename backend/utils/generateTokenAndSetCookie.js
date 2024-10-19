import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });


    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure : process.env.NODE_ENV === 'production' 
    });

    return token;
}