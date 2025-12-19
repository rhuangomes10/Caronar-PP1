const Sequelize = require("sequelize");
const sequelize = require("../src/config/database");
const Usuario = require("./Usuario");

const Corrida = sequelize.define("Corrida", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

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

  // 🔑 CHAVE ESTRANGEIRA
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // 🔥 NECESSÁRIO PARA createdAt
});


// RELAÇÃO
Usuario.hasMany(Corrida, { foreignKey: "usuarioId" });
Corrida.belongsTo(Usuario, { foreignKey: "usuarioId" });

module.exports = Corrida;
