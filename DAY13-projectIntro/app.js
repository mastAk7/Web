const express = require('express');
require('dotenv').config();
const protect = require('./middlewares/auth.middleware.js')
const authRoutes = require('./routes/auth.routes.js');
const organizationRoutes = require('./routes/organization.routes.js');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/auth', authRoutes);
app.use('/org', protect, organizationRoutes);

app.get('/', protect, (req, res) => {
    try {
        res.json({
            message: 'Welcome to the protected route!',
            user: req.user
        });
    } catch (error) {
        console.error('Route error:', error);
        return res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
});

app.listen(PORT, ()=> {
    console.log(`http://localhost:${PORT}`);
})