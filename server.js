import express from 'express';
import cors from 'cors';
import connectDB from './services/dbService.js';

import playerRoutes from './routes/playerRoutes.js';
// import userRoutes from './routes/userRoutes.js';

import errorMiddleware from './middleware/errorMiddleware.js';
//import swaggerUi from 'swagger-ui-express';
//import swaggerDocs from './config/swaggerConfig.js';
import { PORT, FRONT_URL } from './config/env.js';

import jwt from 'jsonwebtoken';

// Conectar a la base de datos
connectDB();

const app = express();

app.set("secretKey", "1863");


const allowedOrigins = [
  'http://localhost:3000',
  'https://fuchi-manager.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origen (por ejemplo, Postman) o si el origen está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-access-token'],
}));



// Rutas de Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app.use(cors());
app.use(express.json());
app.use('/player', playerRoutes);
// app.use('/record', verifyToken, recordRoutes);
// app.use('/user', userRoutes);

// Ruta para el estado del servidor
app.get('/status', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'El servidor está funcionando correctamente.' 
  });
});

// Middleware de manejo de errores
app.use(errorMiddleware);

function verifyToken(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function (err, payload) {
    if (err) {
      res.json({ message: err.message });
    } else {
      console.log("Payload", payload);
      req.body.userId = payload.userId;
      next();
    }
  });
}

app.verifyToken = verifyToken;

// Iniciar el servidor y enviar mensaje al frontend
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Servidor iniciado correctamente.');
});
