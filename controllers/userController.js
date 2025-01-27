import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuración del transporte de correo (ejemplo usando Gmail)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);

        // Generar token de confirmación
        const emailToken = crypto.randomBytes(32).toString('hex');
        newUser.emailConfirmationToken = emailToken;

        // Guardar el usuario
        await newUser.save();

        // Enviar correo de confirmación
        const confirmationUrl = `${process.env.BACKEND_URL}/user/confirm/${emailToken}`;
        await transporter.sendMail({
            from: '"MiApp" <miapp@example.com>',
            to: newUser.email,
            subject: 'Confirma tu correo electrónico',
            html: `<p>Gracias por registrarte. Haz clic en el siguiente enlace para confirmar tu correo electrónico:</p>
                   <a href="${confirmationUrl}">Confirmar correo</a>`,
        });

        res.status(201).json({ message: 'Usuario creado, por favor revisa tu correo para confirmar tu cuenta' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: 'Validation error', errors: err.errors });
        } else if (err.code === 11000) {
            // Error de clave duplicada
            res.status(409).json({ message: 'El correo electrónico ya está en uso. Por favor, prueba con otro.' });
        } else {
            res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
};

const confirmEmail = async (req, res) => {
    try {
        const user = await User.findOne({ emailConfirmationToken: req.params.token });
        if (!user) {
            return res.status(400).json({ message: 'Token de confirmación inválido o expirado' });
        }

        user.isEmailConfirmed = true;
        user.emailConfirmationToken = undefined; // Eliminar el token de confirmación
        await user.save();

        res.status(200).json({ message: 'Correo confirmado con éxito, ahora puedes iniciar sesión' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.isEmailConfirmed) {
            return res.status(400).json({ message: 'Usuario no encontrado o email no confirmado' });
        }

        // Generar token de recuperación
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hora de expiración
        await user.save();

        // Enviar correo de recuperación
        const resetUrl = `${process.env.FRONT_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: '"MiApp" <miapp@example.com>',
            to: user.email,
            subject: 'Recuperación de contraseña',
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                   <a href="${resetUrl}">Restablecer contraseña</a>`,
        });

        res.status(200).json({ message: 'Correo de recuperación enviado' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
};


const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }, // Verificar que no esté expirado
        });

        if (!user) {
            return res.status(400).json({ message: 'Token de recuperación inválido o expirado' });
        }

        // Actualizar la contraseña
        user.password = newPassword; // Asegúrate de que la contraseña se encripte en el middleware
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
};



const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const validateUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Usuario o contraseña no validos' });

        if (!user.isEmailConfirmed) {
            return res.status(403).json({ message: 'Debes confirmar tu correo antes de iniciar sesión' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Usuario o contraseña no validos' });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, req.app.get("secretKey"), { expiresIn: '1h' });

        return res.json({ token });
    } catch (err) {
        return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: 'Validation error', errors: err.errors });
        } else {
            res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export { createUser, confirmEmail, requestPasswordReset, resetPassword, getAllUsers, validateUser, getUserById, updateUser, deleteUser };
