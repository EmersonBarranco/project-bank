const { hashPassword, comparePassword } = require('./bcrypt.js');

// Uso en el registro de usuarios
app.post('/register', async (req, res) => {
    const { name, email, password, cedula } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const newUser = {
            name,
            email,
            password: hashedPassword,
            cedula,
            balance: 1000000
        };

        await pool.query(
            'INSERT INTO users (name, email, password, cedula, balance) VALUES ($1, $2, $3, $4, $5)',
            [newUser.name, newUser.email, newUser.password, newUser.cedula, newUser.balance]
        );

        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Uso en el inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rowCount === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const isMatch = await comparePassword(password, user.rows[0].password);

        if (isMatch) {
            // Generar JWT o manejar sesión aquí
            res.status(200).send('Inicio de sesión exitoso');
        } else {
            res.status(401).send('Contraseña incorrecta');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});
