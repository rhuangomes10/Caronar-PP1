const Sequelize = require("sequelize");
const sequelize = require("../src/config/database.js");
const { Hooks } = require("sequelize/lib/hooks");
const bcrypt = require("bcrypt");

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
        isEmail: {
          msg: "O email deve ser válido",
        },
        notEmpty: {
          msg: "O email não pode ser vazio",
        },
      },
    },
    dataNasc:{
     type: Sequelize.DATEONLY,
     allowNull: false 
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  }
);
module.exports = Usuario;
