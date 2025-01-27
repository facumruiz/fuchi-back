import express from 'express';
import cors from 'cors';
import connectDB from './services/dbService.js';

import recordRoutes from './routes/playerRoutes.js';
import userRoutes from './routes/userRoutes.js';

import errorMiddleware from './middleware/errorMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swaggerConfig.js';
import { PORT, FRONT_URL } from './config/env.js';

import jwt from 'jsonwebtoken';

// Conectar a la base de datos
connectDB();

const app = express();

app.set("secretKey", "1863")

/*
app.use(cors({
  origin: FRONT_URL, // Cambia esto por la URL de tu frontend desde la variable de entorno
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'x-access-token'], // Headers permitidos
}));
*/

// Rutas de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use('/record', recordRoutes);
//app.use('/record', verifyToken, recordRoutes);

app.use('/user', userRoutes);

// Middleware de manejo de errores
app.use(errorMiddleware);

function verifyToken(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function (err, payload) {
    if (err) {
      res.json({ message: err.message })
    } else {
      console.log("Payload", payload)
      req.body.userId = payload.userId
      next()
    }
  })
}

app.verifyToken = verifyToken

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
