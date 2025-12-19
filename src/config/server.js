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
const Corrida = require("../../models/Corrida.js");
const sequelize = require("./database.js");

//Criptografia
const bcrypt = require("bcrypt");

//Multer (multimídia)
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

//Ler os dados
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Diretorio onde esta as paginas
app.use(express.static(path.join(__dirname, "../../public")));

//Bootstrap
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "../../node_modules/bootstrap/dist"))
);

//Sessão
const session = require("express-session");
app.use(
  session({
    secret: "segredo-super-seguro",
    resave: false,
    saveUninitialized: false,
  })
);

//Meio de transporte
const transportes = {
  moto: { nome: "Moto", precoKm: 1.5 },
  carro: { nome: "Carro", precoKm: 2.5 },
  van: { nome: "Van", precoKm: 4.0 },
};

//Engine do Handlebars
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "../../views/layouts"),
    partialsDir: path.join(__dirname, "../../views/partials"),
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../../views"));

//Rota de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/Login/login.html"));
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
app.get("/perfil", verificarLogin, async (req, res) => {
  const usuario = await Usuario.findByPk(req.session.usuarioId, {
    raw: true,
  });

  if (!usuario) {
    return res.redirect("/");
  }

  // CALCULA IDADE AQUI
  let idade = null;
  if (usuario.dataNasc) {
    const hoje = new Date();
    const nasc = new Date(usuario.dataNasc);
    idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
  }

  res.render("perfil", {
    usuario: {
      ...usuario,
      idade,
      fotoPerfil: usuario.fotoPerfil || "/img/user-default.png",
    },
  });
});

//Rota da Página de configurações
app.get("/config", (req, res) => {
  res.render("config");
});
//Rota da Página para atulizar o perfil
app.get("/atualizarPerfil", (req, res) => {
  res.render("atualizarPerfil" , {layout: "main"});
});
//Rota da página de solicitação de corrida
app.get("/solicitarCorrida", (req, res) => {
  res.render("solicitarCorrida", { layout: "corrida" });
});
//Rota de meio de transporte
app.get("/meioTransporte", verificarLogin, (req, res) => {
  res.render("meioTransporte", { layout: "corrida" });
});
//Rota de motorista encontrado
app.get("/motoristaEncontrado", verificarLogin, (req, res) => {
  res.render("motoristaEncontrado", { layout: "corrida" });
});
//Rota de pagamento
app.get("/pagamento", verificarLogin, (req, res) => {
  res.render("pagamento", { layout: "corrida" });
});

//Metodo de cadastro
app.post("/cadastro", urlencodedParser, (req, res) => {
  try {
    const { cadastroNome, cadastroEmail, cadastroData, cadastroSenha } =
      req.body;
    let novoUsuario = Usuario.create({
      nome: cadastroNome,
      email: cadastroEmail,
      dataNasc: cadastroData,
      senha: cadastroSenha,
    });
    console.log("Usuário criado com sucesso!");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.send("Erro ao criar o usuário");
  }
});

//Método de Login
app.post("/login", urlencodedParser, async (req, res) => {
  const { loginEmail, loginSenha } = req.body;

  const usuario = await Usuario.findOne({
    where: { email: loginEmail },
  });

  if (!usuario) {
    return res.send(`
        <script>
          alert("Usuário não encontrado!");
          window.location.href = "/";
        </script>
      `);
  }

  const senhaValida = await bcrypt.compare(loginSenha, usuario.senha);

  if (!senhaValida) {
    return res.send(`
        <script>
          alert("Usuário não encontrado!");
          window.location.href = "/";
        </script>
      `);
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

// Histórico de corridas
app.get("/historico", verificarLogin, async (req, res) => {
  const corridas = await Corrida.findAll({
    where: { usuarioId: req.session.usuarioId },
    order: [["createdAt", "DESC"]],
    raw: true
  });

  res.render("historico", { corridas });
});




//Método de atualizar dados
app.post(
  "/atualizar",
  verificarLogin,
  urlencodedParser,
  upload.single("fotoPerfil"),
  async (req, res) => {
    const {
      fotoPerfil,
      cadastroNome,
      cadastroEmail,
      cadastroData,
      cadastroSenha,
    } = req.body;

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
    if (req.file) dados.fotoPerfil = "/uploads/" + req.file.filename;

    // 🔒 Evita update vazio
    if (Object.keys(dados).length === 0) {
      return res.redirect("/perfil");
    }

    await Usuario.update(dados, {
      where: { id: req.session.usuarioId },
    });

    res.redirect("/perfil");
  }
);

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

// Preços
app.post("/calcular-precos", verificarLogin, express.json(), (req, res) => {
  const { distanciaKm } = req.body;

  const opcoes = Object.entries(transportes).map(([tipo, t]) => ({
    tipo,
    nome: t.nome,
    preco: (distanciaKm * t.precoKm).toFixed(2),
  }));

  res.json(opcoes);
});

// Finalizar corrida
const motoristas = {
  moto: { nome: "Carlos", avaliacao: 4.9 },
  carro: { nome: "João", avaliacao: 4.8 },
  van: { nome: "Marcos", avaliacao: 4.7 },
};

app.post(
  "/finalizar-corrida",
  verificarLogin,
  express.json(),
  async (req, res) => {
    try {
      const { partida, chegada, distanciaKm, tipo, preco } = req.body;

      const motorista = motoristas[tipo];

      if (!motorista) {
        return res.json({ sucesso: false });
      }

      await Corrida.create({
        usuarioId: req.session.usuarioId,
        partida: "Localização atual",
        chegada: chegada.nome || `${chegada.lat}, ${chegada.lng}`,
        distanciaKm,
        tipoTransporte: tipo,
        preco,
        motoristaNome: motorista.nome,
        avaliacaoMotorista: motorista.avaliacao,
      });

      res.json({ sucesso: true });
    } catch (error) {
      console.error(error);
      res.json({ sucesso: false });
    }
  }
);


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
