import Record from '../models/playerModel.js';



// Validación para controlar el número máximo de suplentes
const validarSuplentes = async (jugadores) => {
  // Filtra los jugadores con estado "Suplente" de los que intentas insertar
  const suplentesNuevos = jugadores.filter(jugador => jugador.perfilFutbolistico.estado === "Suplente");
  const suplentesExistentes = await Record.countDocuments({ "perfilFutbolistico.estado": "Suplente" });
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
  const titularesExistentes = await Record.countDocuments({ "perfilFutbolistico.estado": "Titular" });
  const totalTitulares = titularesExistentes + titularesNuevos.length;

  console.log(`Número total de titulares: ${totalTitulares}`); // Muestra el número total de titulares
  if (totalTitulares > 11) {
    throw new Error('No se pueden agregar más de 11 titulares.');
  }
};

// Crear múltiples jugadores
const createRecord = async (req, res) => {
  try {
    // Primero, validamos el número de suplentes o titulares antes de guardar los jugadores
    const jugadores = req.body; // Asumiendo que el cuerpo de la solicitud contiene un array de jugadores

    await validarSuplentes(jugadores);
    await validarTitulares(jugadores);

    // Luego, insertamos los jugadores
    const newPlayers = await Record.insertMany(jugadores);

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




const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
};

const deleteRecord = async (req, res) => {
  try {
    const result = await Record.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json({ message: 'Record deleted successfully' });
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

    const record = await Record.findByIdAndUpdate(
      req.params.id,
      { 'perfilFutbolistico.estado': estado },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    res.status(200).json(record);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
};

export { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord, updatePlayerStatus };
