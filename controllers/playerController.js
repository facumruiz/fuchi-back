import Player from '../models/playerModel.js';



// Validación para controlar el número máximo de suplentes
const validarSuplentes = async (jugadores) => {
  // Filtra los jugadores con estado "Suplente" de los que intentas insertar
  const suplentesNuevos = jugadores.filter(jugador => jugador.perfilFutbolistico.estado === "Suplente");
  const suplentesExistentes = await Player.countDocuments({ "perfilFutbolistico.estado": "Suplente" });
  const totalSuplentes = suplentesExistentes + suplentesNuevos.length;

  console.log(`Número total de suplentes: ${totalSuplentes}`); // Muestra el número total de suplentes
  if (totalSuplentes > 11) {
    throw new Error('No se pueden agregar más de 11 suplentes.');
  }
};

// Validación para controlar el número máximo de titulares
const validarTitulares = async (jugadores) => {
  // Filtra los jugadores con estado "Titular" de los que intentas insertar
  const titularesNuevos = jugadores.filter(jugador => jugador.perfilFutbolistico.estado === "Titular");
  const titularesExistentes = await Player.countDocuments({ "perfilFutbolistico.estado": "Titular" });
  const totalTitulares = titularesExistentes + titularesNuevos.length;

  console.log(`Número total de titulares: ${totalTitulares}`); // Muestra el número total de titulares
  if (totalTitulares > 11) {
    throw new Error('No se pueden agregar más de 11 titulares.');
  }
};

// Crear múltiples jugadores
const createPlayer = async (req, res) => {
  try {
    // Primero, validamos el número de suplentes o titulares antes de guardar los jugadores
    const jugadores = req.body; // Asumiendo que el cuerpo de la solicitud contiene un array de jugadores

    await validarSuplentes(jugadores);
    await validarTitulares(jugadores);

    // Luego, insertamos los jugadores
    const newPlayers = await Player.insertMany(jugadores);

    res.status(201).json(newPlayers);
  } catch (err) {
    if (err.message === 'No se pueden agregar más de 11 suplentes.' || err.message === 'No se pueden agregar más de 11 titulares.') {
      res.status(400).json({ message: err.message });
    } else if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
};




const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    const player = await Player.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true, omitUndefined: true } 
    );

    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.status(200).json(player);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Error de validación', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
  }
};


const deletePlayer = async (req, res) => {
  try {
    const result = await Player.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Nuevo controlador para actualizar el estado del jugador
const updatePlayerStatus = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ message: 'El estado es obligatorio' });
    }

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { 'perfilFutbolistico.estado': estado },
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.status(200).json(player);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
};

export { createPlayer, getAllPlayers, getPlayerById, updatePlayer, deletePlayer, updatePlayerStatus };
