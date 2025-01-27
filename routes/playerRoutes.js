import express from 'express';
import { verifyRole } from '../middleware/authMiddleware.js';
import { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord, updatePlayerStatus } from '../controllers/playerController.js';

const router = express.Router();

/**
 * @openapi
 * /record:
 *   get:
 *     tags:
 *       - Record
 *     summary: Obtener todos los registros
 *     responses:
 *       200:
 *         description: Lista de registros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 *       500:
 *         description: Error del servidor
 */
router.get('/', getAllRecords);

/**
 * @openapi
 * /record/{id}:
 *   get:
 *     tags:
 *       - Record
 *     summary: Obtener un registro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del registro a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getRecordById);

/**
 * @openapi
 * /record:
 *   post:
 *     tags:
 *       - Record
 *     summary: Crear un nuevo registro
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de acceso JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Record'
 *     responses:
 *       201:
 *         description: Registro creado
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
 router.post('/', /*(req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['admin']),*/ createRecord);


/**
 * @openapi
 * /record/{id}:
 *   patch:
 *     tags:
 *       - Record
 *     summary: Actualizar un registro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del registro a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Record'
 *     responses:
 *       200:
 *         description: Registro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/:id', updateRecord);

router.patch('/:id/status', updatePlayerStatus);


/**
 * @openapi
 * /record/{id}:
 *   delete:
 *     tags:
 *       - Record
 *     summary: Eliminar un registro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del registro a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro eliminado
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', deleteRecord);

export default router;
