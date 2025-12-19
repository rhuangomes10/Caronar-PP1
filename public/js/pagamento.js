const corrida = JSON.parse(localStorage.getItem("corrida"));

if (!corrida || !corrida.motorista) {
  window.location.href = "/index";
}

// Exibir resumo
document.getElementById("resumoPreco").innerText = `R$ ${corrida.preco}`;
document.getElementById("resumoTransporte").innerText = corrida.tipo;
document.getElementById("resumoMotorista").innerText =
  `${corrida.motorista.nome} ⭐ ${corrida.motorista.avaliacao}`;

document.getElementById("confirmarCorrida").addEventListener("click", async () => {
  try {
    const response = await fetch("/finalizar-corrida", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(corrida)
    });

    const result = await response.json();

    if (result.sucesso) {
      localStorage.removeItem("corrida");
      window.location.href = "/index";
    } else {
      alert("Erro ao finalizar corrida");
    }
  } catch (error) {
    console.error(error);
    alert("Erro de conexão");
  }
});
