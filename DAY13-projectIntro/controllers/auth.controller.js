const prisma = require('../prisma/db.config.js')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/jwtToken.js')

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('All fields required');
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existing = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (existing) {
            console.log("User already exists");
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        const token = generateToken(user);
        console.log('Token generated')

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
        console.log("User created and cookie stored")

    } catch (err) {
        console.log("Registration Unsuccessful", err)
        return res.status(401).json({ message: 'Registration error', err });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            console.log('All fields required');
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        })
    
        const hashedPassword = bcrypt.compare(password, user.password);
    
        if (!user || !hashedPassword) {
            console.log('Invalid email or password')
            return res.status(401).json({ message: 'Invalid email or password' })
        }
    
        
        const token = generateToken(user);
        console.log('Token generated')
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        
        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
        console.log("User found and cookie stored")
    } catch (error) {
        console.log("Login Unsuccessful", err)
        return res.status(401).json({ message: 'Login error', err });
    }
}