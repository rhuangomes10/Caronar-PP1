const corrida = JSON.parse(localStorage.getItem("corrida"));

if (!corrida || !corrida.tipo) {
  window.location.href = "/index";
}

const motoristas = {
  moto: { nome: "Carlos", avaliacao: 4.9 },
  carro: { nome: "João", avaliacao: 4.8 },
  van: { nome: "Marcos", avaliacao: 4.7 }
};

const motorista = motoristas[corrida.tipo];

document.getElementById("nomeMotorista").innerText = motorista.nome;
document.getElementById("avaliacaoMotorista").innerText =
  `⭐ ${motorista.avaliacao}`;

document.getElementById("confirmarMotorista").addEventListener("click", () => {
  corrida.motorista = motorista;
  localStorage.setItem("corrida", JSON.stringify(corrida));
  window.location.href = "/pagamento";
});
