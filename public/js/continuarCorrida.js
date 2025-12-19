const corrida = JSON.parse(localStorage.getItem("corrida"));

if (!corrida) {
  window.location.href = "/solicitarCorrida";
}

const mapa = L.map("mapa").setView(
  [corrida.partida.lat, corrida.partida.lng],
  14
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapa);

// Marcadores
L.marker([corrida.partida.lat, corrida.partida.lng]).addTo(mapa);
L.marker([corrida.chegada.lat, corrida.chegada.lng]).addTo(mapa);

// 🔥 ROTA
L.Routing.control({
  waypoints: [
    L.latLng(corrida.partida.lat, corrida.partida.lng),
    L.latLng(corrida.chegada.lat, corrida.chegada.lng),
  ],
  addWaypoints: false,
  draggableWaypoints: false,
  show: false,
}).addTo(mapa);
