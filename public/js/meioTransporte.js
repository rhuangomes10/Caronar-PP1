const corrida = JSON.parse(localStorage.getItem("corrida"));

if (!corrida || !corrida.distanciaKm) {
  alert("Corrida inválida");
  window.location.href = "/index";
}

const transportes = [
  { tipo: "moto", nome: "Moto", precoKm: 1.5 },
  { tipo: "carro", nome: "Carro", precoKm: 2.5 },
  { tipo: "van", nome: "Van", precoKm: 4.0 },
];

const container = document.getElementById("opcoesTransporte");

transportes.forEach((t) => {
  const preco = (corrida.distanciaKm * t.precoKm).toFixed(2);

  const div = document.createElement("div");
  div.className = "opcao-transporte";
  div.innerHTML = `
    <strong>${t.nome}</strong>
    <p>Preço estimado: R$ ${preco}</p>
    <button>Selecionar</button>
  `;

  div.querySelector("button").onclick = () => {
    corrida.tipo = t.tipo;
    corrida.preco = preco;
    localStorage.setItem("corrida", JSON.stringify(corrida));
    window.location.href = "/motoristaEncontrado";
  };

  container.appendChild(div);
});
