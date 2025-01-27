import express from 'express';
import { verifyRole } from '../middleware/authMiddleware.js';
import { createUser, confirmEmail, requestPasswordReset, resetPassword, getAllUsers, validateUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error del servidor
 */

/**
 * @openapi
 * /user/confirm/{token}:
 *   get:
 *     tags:
 *       - User
 *     summary: Confirmar el correo electrónico del usuario
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de confirmación enviado al correo electrónico del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Correo confirmado con éxito
 *       400:
 *         description: Token de confirmación inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.get('/confirm/:token', confirmEmail);

/**
 * @openapi
 * /user/request-password-reset:
 *   post:
 *     tags:
 *       - User
 *     summary: Solicitar recuperación de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado
 *       400:
 *         description: Error de validación o usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
 router.post('/request-password-reset', requestPasswordReset);

/**
 * @openapi
 * /user/reset-password/{token}:
 *   post:
 *     tags:
 *       - User
 *     summary: Restablecer la contraseña
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de recuperación enviado al correo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *       400:
 *         description: Error de validación o token inválido
 *       404:
 *         description: Usuario no encontrado o token expirado
 *       500:
 *         description: Error del servidor
 */
 router.post('/reset-password/:token', resetPassword);



router.get('/', (req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['admin']), getAllUsers);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getUserById);

/**
 * @openapi
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', createUser);

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Autenticación de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', validateUser);

/**
 * @openapi
 * /user/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Actualizar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/:id', updateUser);

/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Eliminar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', deleteUser);

export default router;
