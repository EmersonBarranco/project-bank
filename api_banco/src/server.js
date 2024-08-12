const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

const startServer = async () => {
    try {
        await sequelize.sync();
        app.listen(3000, () => {
            console.log('Servidor corriendo en http://localhost:3000');
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();
