import mongoose from 'mongoose';

const { Schema } = mongoose;

// Definimos las posiciones con sus abreviaturas en inglés
const positionEnum = [
  'ST',  // Striker (Delantero)
  'LM',  // LeftMidfielder (Centrocampista izquierdo)
  'CM',  // CentralMidfielder (Centrocampista central)
  'RM',  // RightMidfielder (Centrocampista derecho)
  'LB',  // LeftBack (Lateral izquierdo)
  'CB',  // CenterBack (Defensa central)
  'CB',  // CenterBack (Defensa central)
  'RB',  // RightBack (Lateral derecho)
  'GK',  // Goalkeeper (Portero)
  'CAM', // AttackingMidfielder (Centrocampista ofensivo)
  'LWB', // LeftWingBack (Lateral izquierdo avanzado)
  'RWB', // RightWingBack (Lateral derecho avanzado)
  'CDM', // DefensiveMidfielder (Centrocampista defensivo)
  'LAM', // LeftAttackingMidfielder (Centrocampista ofensivo izquierdo)
  'RAM', // RightAttackingMidfielder (Centrocampista ofensivo derecho)
];


const jugadorSchema = new Schema({
  datosPersonales: {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },
    apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
    },
    img: {
      type: String,
    },
    fechaNacimiento: {
      type: Date,
      required: [true, 'La fecha de nacimiento es obligatoria'],
    },
    primeraNacionalidad: {
      type: String,
      required: [true, 'La primera nacionalidad es obligatoria'],
    },
    segundaNacionalidad: {
      type: String,
    },
    idiomas: {
      type: [String],
    },
    estadoCivil: {
      type: String,
    },
    hijos: {
      type: Number,
    },
  },
  perfilFutbolistico: {
    posicionNatural: {
      type: String,
      enum: {
        values: positionEnum,
        message: 'La posición debe ser una de las siguientes: ' + positionEnum.join(', '),
      },
      required: [true, 'La posición natural es obligatoria'],
    },
    posicionSecundaria: {
      type: String,
      enum: {
        values: positionEnum,
        message: 'La posición secundaria debe ser una de las siguientes: ' + positionEnum.join(', '),
      },
    },
    perfilHabil: {
      type: String,
      enum: ['Izquierdo', 'Derecho', 'Ambidiestro'],
    },
    estado: {
      type: String,
      enum: ['Titular', 'Suplente', 'Lesionado', 'Preseleccionado', 'Desafectado', 'Suspendido'],
      default: 'Titular',
      required: [true, 'El estado del jugador es obligatorio']
    },
  },
  fisico: {
    altura: {
      type: Number,
      min: [1, 'La altura debe ser al menos 1 metro'],
    },
    peso: {
      type: Number,
      min: [30, 'El peso debe ser al menos 30 kg'],
    },
  },
  atributos: {
    tecnico: {
      cabeceo: Boolean,
      centros: Boolean,
      control: Boolean,
      entradas: Boolean,
      marcaje: Boolean,
      pases: Boolean,
      penalties: Boolean,
      regate: Boolean,
      remate: Boolean,
      saquesDeEsquina: Boolean,
      tecnica: Boolean,
      tirosLejanos: Boolean,
      tirosLibres: Boolean,
      unoContraUno: Boolean,
    },
    fisico: {
      aceleracion: Boolean,
      agilidad: Boolean,
      alcanceDeSalto: Boolean,
      equilibrio: Boolean,
      fuerza: Boolean,
      recuperacionFisica: Boolean,
      resistencia: Boolean,
      velocidad: Boolean,
    },
    mental: {
      blocaje: Boolean,
      comunicacion: Boolean,
      excentricidad: Boolean,
      agresividad: Boolean,
      anticipacion: Boolean,
      colocacion: Boolean,
      decisiones: Boolean,
      desmarques: Boolean,
      determinacion: Boolean,
      juegoEnEquipo: Boolean,
      liderazgo: Boolean,
      sacrificio: Boolean,
      talento: Boolean,
      valentia: Boolean,
      vision: Boolean,
    },
    portero: {
      alcanceAereo: Boolean,
      golpeoDePunios: Boolean,
      mandoEnElArea: Boolean,
      reflejos: Boolean,
      salidas: Boolean,
      saquesConLaMano: Boolean,
      saquesDePuerta: Boolean,
    },
  },
  contrato: {
    agente: {
      type: String,
    },
    clubActual: {
      type: String,
    },
    situacionContractual: {
      type: String,
    },
    requierePisoDelClub: {
      type: Boolean,
    },
    interesEnElTraspaso: {
      type: Boolean,
    },
    fichajePrioritario: {
      type: Boolean,
    },
  },
});

const Jugador = mongoose.model('players', jugadorSchema, 'players');

export default Jugador;
