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

//Multer (multimídia)
const multer = require("multer");

const upload = multer({
  dest: "public/uploads/"
});

//Ler os dados
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Diretorio onde esta as paginas
app.use(express.static(path.join(__dirname, "../../public")));

//Bootstrap
app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')));

//Sessão
const session = require("express-session");
app.use(session({secret: "segredo-super-seguro", resave: false, saveUninitialized: false,}));




//Engine do Handlebars
app.engine("handlebars", exphbs.engine({
    defaultLayout: 'main',
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

app.get("/atualizarPerfil" , (req,res) =>{
    res.render("atualizarPerfil")
})

//Metodo de cadastro
app.post("/cadastro", urlencodedParser, (req, res) => {
  try {
    const {cadastroNome , cadastroEmail , cadastroData , cadastroSenha} = req.body
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

//Método de Login
app.post("/login",urlencodedParser ,async (req, res) => {
  const { loginEmail, loginSenha } = req.body;

  const usuario = await Usuario.findOne({
    where: { email: loginEmail },
  });

  if (!usuario) {
    return res.send("Usuário ou senha inválidos");
  }

  const senhaValida = await bcrypt.compare(loginSenha, usuario.senha);

  if (!senhaValida) {
    return res.send("Usuário ou senha inválidos");
  }

//Sessão
  req.session.usuarioId = usuario.id;

  res.redirect("/index");
  
});

function verificarLogin(req, res, next) {
  if (!req.session.usuarioId) {
    return res.redirect("/");
  }
  next();
}

// Página inicial
app.get("/index", verificarLogin, (req, res) => {
  res.render("index");
});

// Perfil
app.get("/perfil", verificarLogin, async (req, res) => {
  const usuario = await Usuario.findByPk(req.session.usuarioId);

  res.render("perfil", {
    usuario,
  });
});

// Configurações
app.get("/config", verificarLogin, (req, res) => {
  res.render("config");
});

//Método de atualizar dados
app.post("/atualizar", verificarLogin, urlencodedParser, async (req, res) => {
  const { cadastroNome, cadastroEmail, cadastroData, cadastroSenha } = req.body;

  let dados = {};

  if (cadastroNome && cadastroNome.trim() !== "") {
    dados.nome = cadastroNome;
  }

  if (cadastroEmail && cadastroEmail.trim() !== "") {
    dados.email = cadastroEmail;
  }

  if (cadastroData && cadastroData.trim() !== "") {
    dados.dataNasc = cadastroData;
  }

  if (cadastroSenha && cadastroSenha.trim() !== "") {
    dados.senha = await bcrypt.hash(cadastroSenha, 10);
  }
  if (req.file)
      dados.fotoPerfil = "/uploads/" + req.file.filename;

  // 🔒 Evita update vazio
  if (Object.keys(dados).length === 0) {
    return res.redirect("/perfil");
  }

  await Usuario.update(dados, {
    where: { id: req.session.usuarioId },
  });

  res.redirect("/perfil");
});


//Método para deletar a conta
app.post("/deletar", verificarLogin, async (req, res) => {
  await Usuario.destroy({
    where: { id: req.session.usuarioId },
  });

  req.session.destroy(() => {
    res.redirect("/");
  });
});

//Método de logout

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

//Funcionamento do Banco de dados
async function iniciar() {
  try {
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.log(error);
  }
}

iniciar();
//Servidor Rodando
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
