//API's
const http = require("http");
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

//Handlebars
const exphbs = require("express-handlebars");

//Banco de dados
const Usuario = require("../../models/Usuario.js");
const sequelize = require("./database.js");

//Criptografia
const bcrypt = require("bcrypt");

//Ler os dados
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Diretorio onde esta as paginas
app.use(express.static(path.join(__dirname, "../../public")));

//Bootstrap
app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')));


//Engine do Handlebars
app.engine("handlebars", exphbs.engine({
    defaultLayout: false,
    layoutsDir: path.join(__dirname, "../../views/layouts"),
    partialsDir: path.join(__dirname, "../../views/partials")
}));

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../../views"));


//Rota de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/Login/login.html") );
});

//Rota de cadastro
app.get("/cadastro.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/Cadastro/cadastro.html"));
});

//Rota da Página inicial
app.get("/index", (req, res) => {
    res.render("index");
});

//Rota da Página de perfil
app.get("/perfil" , (req,res) =>{
    res.render("perfil")
})

//Rota da Página de configurações
app.get("/config" , (req,res) =>{
    res.render("config")
})

//Metodo de cadastro
app.post("/cadastro", urlencodedParser, (req, res) => {
  try {
    let cadastroNome = req.body.cadastroNome;
    let cadastroEmail = req.body.cadastroEmail;
    let cadastroData = req.body.cadastroData;
    let cadastroSenha = req.body.cadastroSenha;
    let novoUsuario = Usuario.create({
      nome: cadastroNome,
      email: cadastroEmail,
      dataNasc: cadastroData,
      senha: cadastroSenha,
    });
    res.send("Usuário criado com sucesso!");
  } catch (error) {
    console.error(error);
    res.send("Erro ao criar o usuário");
  }
});
//Funcionamento do Banco de dados
async function iniciar() {
  try {
    await sequelize.sync({ force: true });
  } catch (error) {
    console.log(error);
  }
}

iniciar();
//Servidor Rodando
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
