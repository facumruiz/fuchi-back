import express from 'express';
// import { verifyRole } from '../middleware/authMiddleware.js';
import { createPlayer, deletePlayer, getAllPlayers, getPlayerById, updatePlayer, updatePlayerStatus } from '../controllers/playerController.js';


const router = express.Router();


router.get('/', getAllPlayers);


router.get('/:id', getPlayerById);


 router.post('/', /*(req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['admin']),*/ createPlayer);



router.patch('/:id', updatePlayer);

router.patch('/:id/status', updatePlayerStatus);



router.delete('/:id', deletePlayer);

export default router;
