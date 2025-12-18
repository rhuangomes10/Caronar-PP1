const Sequelize = require("sequelize");
const sequelize = require("../src/config/database");
const bcrypt = require("bcrypt"); // criptografia

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    dataNasc: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fotoPerfil: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },

  {
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      },
    },
  }
);

module.exports = Usuario;
