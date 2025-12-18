const Sequelize = require("sequelize");
const sequelize = require("../src/config/database");
const Usuario = require("./Usuario");

const Corrida = sequelize.define("Corrida", {
  partida: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  chegada: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  distanciaKm: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  tipoTransporte: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preco: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  motoristaNome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  avaliacaoMotorista: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
},
  {
  timestamps: false,
  },);

// RELACIONAMENTOS
Usuario.hasMany(Corrida, {
  foreignKey: "usuarioId",
});

Corrida.belongsTo(Usuario, {
  foreignKey: "usuarioId",
});

module.exports = Corrida;
