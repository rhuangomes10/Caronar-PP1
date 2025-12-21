const Sequelize = require("sequelize");

const sequelize = new Sequelize("bancoCaronar", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(function () {
    console.log("Conectado!!");
  })
  .catch(function (erro) {
    console.log("Erro ao conectar: " + erro);
  });

module.exports = sequelize
