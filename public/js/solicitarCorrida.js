// ================== VARIÁVEIS GLOBAIS ==================
let mapa;
let marcadorPartida;
let marcadorChegada;
let rotaControl;

let estado = {
  partida: null,
  chegada: null,
  cidadePartida: null,
  cidadeChegada: null,
};

// ================== INICIAR MAPA ==================
document.addEventListener("DOMContentLoaded", () => {
  mapa = L.map("mapa").setView([-8.0476, -34.877], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(mapa);

  obterLocalizacao();
  avancar();
});

// ================== LOCALIZAÇÃO ATUAL ==================
function obterLocalizacao() {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      estado.partida = { lat, lng };

      marcadorPartida = L.marker([lat, lng])
        .addTo(mapa)
        .bindPopup("Você está aqui")
        .openPopup();

      mapa.setView([lat, lng], 15);

      // Nome da rua/cidade
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      document.getElementById("partida").value = data.display_name;

      const cidade = document.getElementById("cidade");

      const endereco = data.address;

      // tenta pegar cidade, depois town, depois village
      cidade.innerHTML =
        endereco.city ||
        endereco.town ||
        endereco.village ||
        endereco.municipality ||
        "Cidade não encontrada";

        estado.cidadePartida = endereco.city || endereco.town || endereco.village || endereco.municipality;

      localStorage.setItem("corrida", JSON.stringify(estado));
    },
    () => alert("Permita o acesso à localização")
  );
}

// ================== BUSCAR DESTINO ==================
document
  .getElementById("selecionarLocal")
  .addEventListener("click", async () => {
    const destinoTexto = document.getElementById("chegada").value.trim();
    if (!destinoTexto) {
      alert("Digite um destino");
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        destinoTexto
      )}`
    );
    const data = await res.json();

    if (!data || data.length === 0) {
      alert("Destino não encontrado");
      return;
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    estado.chegada = { lat, lng };

    estado.cidadeChegada = data[0].address.city || data[0].address.town || data[0].address.village || data[0].address.municipality ;

    if (marcadorChegada) mapa.removeLayer(marcadorChegada);

    marcadorChegada = L.marker([lat, lng])
      .addTo(mapa)
      .bindPopup("Destino")
      .openPopup();

    desenharRota();

    localStorage.setItem("corrida", JSON.stringify(estado));
  });

// ================== DESENHAR ROTA ==================
function desenharRota() {
  if (!estado.partida || !estado.chegada) return;

  if (rotaControl) {
    mapa.removeControl(rotaControl);
  }

  rotaControl = L.Routing.control({
    waypoints: [
      L.latLng(estado.partida.lat, estado.partida.lng),
      L.latLng(estado.chegada.lat, estado.chegada.lng),
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    show: false,
  }).addTo(mapa);

  const from = L.latLng(estado.partida.lat, estado.partida.lng);
  const to = L.latLng(estado.chegada.lat, estado.chegada.lng);

  estado.distanciaKm = from.distanceTo(to) / 1000;

  localStorage.setItem("corrida", JSON.stringify(estado));
}

function avancar() {
  document.getElementById("confirmarCorrida")?.addEventListener("click", () => {
    const path = location.pathname;

    if (path.includes("solicitarCorrida")) {
      location.href = "/meioTransporte";
      return;
    }

    if (path.includes("meioTransporte")) {
      location.href = "/motoristaEncontrado";
      return;
    }

    if (path.includes("motoristaEncontrado")) {
      location.href = "/pagamento";
    }
  });

  document
    .getElementById("pagarCorrida")
    ?.addEventListener("click", async () => {
      await fetch("/finalizar-corrida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estado),
      });

      localStorage.removeItem("corrida");
      location.href = "/index";
    });
}
