let mapa;
let marcadorPartida;
let marcadorChegada;

let partida = {};
let chegada = {};
let distanciaKm = 0;

// Inicializa mapa
mapa = L.map("mapa").setView([-8.0476, -34.8770], 13);

// Tile OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(mapa);

// Localização atual
navigator.geolocation.getCurrentPosition((pos) => {
  partida.lat = pos.coords.latitude;
  partida.lng = pos.coords.longitude;

  marcadorPartida = L.marker([partida.lat, partida.lng])
    .addTo(mapa)
    .bindPopup("Sua localização")
    .openPopup();

  mapa.setView([partida.lat, partida.lng], 15);

  document.getElementById("partida").value = "Localização atual";
});

// Clique no mapa = chegada
mapa.on("click", (e) => {
  chegada.lat = e.latlng.lat;
  chegada.lng = e.latlng.lng;

  if (marcadorChegada) mapa.removeLayer(marcadorChegada);

  marcadorChegada = L.marker([chegada.lat, chegada.lng])
    .addTo(mapa)
    .bindPopup("Destino")
    .openPopup();

  distanciaKm = calcularDistancia(
    partida.lat,
    partida.lng,
    chegada.lat,
    chegada.lng
  );

  document.getElementById("chegada").value =
    chegada.lat.toFixed(4) + ", " + chegada.lng.toFixed(4);

  buscarTransportes(distanciaKm);
});

// Haversine
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Busca preços
async function buscarTransportes(distancia) {
  const res = await fetch("/calcular-precos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ distanciaKm: distancia }),
  });

  const transportes = await res.json();
  mostrarTransportes(transportes);
}

// Mostra opções
function mostrarTransportes(lista) {
  const container = document.getElementById("opcoes");
  container.innerHTML = "";

  lista.forEach((t) => {
    const div = document.createElement("div");
    div.className = "opcao";
    div.innerHTML = `<strong>${t.nome}</strong> <span>R$ ${t.preco}</span>`;
    div.onclick = () => selecionarTransporte(t.tipo, t.preco);
    container.appendChild(div);
  });
}

// Seleciona transporte
function selecionarTransporte(tipo, preco) {
  localStorage.setItem("corrida", JSON.stringify({
    partida,
    chegada,
    distanciaKm,
    tipo,
    preco
  }));

  window.location.href = "/confirmarCorrida";
}
