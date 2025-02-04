import Player from '../models/playerModel.js';



// Límite de suplentes y titulares
const LIMITE_SUPLENTES = 25;
const LIMITE_TITULARES = 11;
const LIMITE_PRESELECCIONADOS = 15; // El límite para los preseleccionados

// Validación para controlar el número máximo de suplentes
const validarSuplentes = async (jugadores) => {
  const suplentesNuevos = jugadores.filter(jugador => jugador.perfilFutbolistico.estado === "Suplente");
  const suplentesExistentes = await Player.countDocuments({ "perfilFutbolistico.estado": "Suplente" });
  const totalSuplentes = suplentesExistentes + suplentesNuevos.length;

  console.log(`Número total de suplentes: ${totalSuplentes}`);
  if (totalSuplentes > LIMITE_SUPLENTES) {
    throw new Error(`No se pueden agregar más de ${LIMITE_SUPLENTES} suplentes.`);
  }
};

// Validación para controlar el número máximo de titulares
const validarTitulares = async (jugadores) => {
  const titularesNuevos = jugadores.filter(jugador => jugador.perfilFutbolistico.estado === "Titular");
  const titularesExistentes = await Player.countDocuments({ "perfilFutbolistico.estado": "Titular" });
  const totalTitulares = titularesExistentes + titularesNuevos.length;

  console.log(`Número total de titulares: ${totalTitulares}`);
  if (totalTitulares > LIMITE_TITULARES) {
    throw new Error(`No se pueden agregar más de ${LIMITE_TITULARES} titulares.`);
  }
};

// Validación para controlar el número máximo de preseleccionados
const validarPreseleccionados = async (jugadores) => {
  const preseleccionadosNuevos = jugadores.filter(jugador => jugador.perfilFutbolistico.estado === "Preseleccionado");
  const preseleccionadosExistentes = await Player.countDocuments({ "perfilFutbolistico.estado": "Preseleccionado" });
  const totalPreseleccionados = preseleccionadosExistentes + preseleccionadosNuevos.length;

  console.log(`Número total de preseleccionados: ${totalPreseleccionados}`);
  if (totalPreseleccionados > LIMITE_PRESELECCIONADOS) {
    throw new Error(`No se pueden agregar más de ${LIMITE_PRESELECCIONADOS} preseleccionados.`);
  }
};

// Crear múltiples jugadores
const createPlayer = async (req, res) => {
  try {
    const jugadores = req.body; // Los jugadores enviados en la solicitud

    // Primero, validamos los suplentes, titulares y preseleccionados
    await validarSuplentes(jugadores);
    await validarTitulares(jugadores);
    await validarPreseleccionados(jugadores);

    // Insertamos los jugadores
    const newPlayers = await Player.insertMany(jugadores);

    res.status(201).json(newPlayers);
  } catch (err) {
    if (err.message.includes('No se pueden agregar más de')) {
      res.status(400).json({ message: err.message });
    } else if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Error de validación', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Error interno del servidor', error: err.message });
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
