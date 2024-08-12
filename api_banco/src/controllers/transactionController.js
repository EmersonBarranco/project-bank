const User = require('../models/User');

exports.withdraw = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await User.findByPk(userId);

        if (user.balance >= amount) {
            user.balance -= amount;
            await user.save();
            res.status(200).json({ message: 'Retiro exitoso', balance: user.balance });
        } else {
            res.status(400).json({ message: 'Saldo insuficiente' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el retiro', error });
    }
};

exports.deposit = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await User.findByPk(userId);

        user.balance += amount;
        await user.save();
        res.status(200).json({ message: 'Depósito exitoso', balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el depósito', error });
    }
};

exports.transfer = async (req, res) => {
    try {
        const { fromUserId, toUserCedula, amount } = req.body;
        const fromUser = await User.findByPk(fromUserId);
        const toUser = await User.findOne({ where: { cedula: toUserCedula } });

        if (!toUser) {
            return res.status(404).json({ message: 'Usuario destinatario no encontrado' });
        }

        if (fromUser.balance >= amount) {
            fromUser.balance -= amount;
            toUser.balance += amount;

            await fromUser.save();
            await toUser.save();

            res.status(200).json({ message: 'Transferencia exitosa', fromUserBalance: fromUser.balance });
        } else {
            res.status(400).json({ message: 'Saldo insuficiente para la transferencia' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar la transferencia', error });
    }
};
