const map = L.map('map').setView([6.2518, -75.5636], 12);

// mapa base
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  {
    attribution:'&copy; OpenStreetMap & CartoDB'
  }).addTo(map);

let geojsonLayer;
let geojsonData;

// función para colores
function obtenerColor(Estado) {
  switch (Estado) {
    case "Blanqueado":
      return "#131B22";
    case "Conservado":
      return "#FAD218";
    case "Descontinuado":
      return "#A9A7A8";
    case "Desconocido":
      return "#B6402C";
    default:
      return "#3A86FF";
  }
}

// offset estable para que no se mueva distinto cada vez que recargas
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function obtenerOffset(Nombre, latlng) {
  const h = Math.abs(hashString(Nombre || ""));
  const angle = (h % 360) * (Math.PI / 180);
  const distance = ((h % 5) + 1) * 0.00008; // muy pequeño

  return {
    lat: latlng.lat + Math.sin(angle) * distance,
    lng: latlng.lng + Math.cos(angle) * distance
  };
}

// función para dibujar puntos
function crearCapa(data, filtro = "todos") {
  if (geojsonLayer) {
    map.removeLayer(geojsonLayer);
  }

  geojsonLayer = L.geoJSON(data, {
    filter: function(feature) {
      return filtro === "todos" || feature.properties.Estado === filtro;
    },

    pointToLayer: function(feature, latlng) {

      return L.circleMarker(latlng, {
        radius: 10,
        fillColor: obtenerColor(feature.properties.Estado),
        color: "#B5C8D7",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      });
    },

    onEachFeature: function(feature, layer) {
      layer.bindPopup(`
        <div style="
          font-family: Arial, sans-serif;
          max-width: 280px;
          line-height: 1.5;
          padding: 4px;
        ">
          <img 
            src="${feature.properties.Foto || 'images/placeholder.jpg'}"
            alt="${feature.properties.Nombre || 'Imagen del mural'}"
            style="
              width: 100%;
              border-radius: 8px;
              margin-bottom: 10px;
              object-fit: cover;
              max-height: 180px;
            "
          >

          <h3 style="
            margin: 0 0 10px 0;
            color: #B93E29;
            font-size: 18px;
          ">
            ${feature.properties.Nombre || "Sin nombre"}
          </h3>

          <p><strong>📅 Fecha estimada:</strong> ${feature.properties["Fecha estimada de realizacion"] || "No disponible"}</p>
          <p><strong>📍 Lugar:</strong> ${feature.properties["Lugar"] || "No disponible"}</p>
          <p><strong>📝 Historia:</strong> ${feature.properties["Historia"] || "No disponible"}</p>
          <p>
            <a href="${feature.properties["Link gmaps"]}"
              target="_blank"
              style="
                color:#FAD218;
                text-decoration:none;
                font-weight:bold;
              ">
              Ver ubicación
            </a>
          </p>
          <p><strong>🎨 Estado:</strong> ${feature.properties.Estado || "No disponible"}</p>
        </div>
      `);
    }
  }).addTo(map);
}

// cargar geojson
fetch('data/map.geojson')
  .then(response => response.json())
  .then(data => {

    console.log("GeoJSON cargado correctamente");
    console.log("Cantidad de puntos:", data.features.length);

    geojsonData = data;
    crearCapa(geojsonData);

    document.getElementById("filtro")
      .addEventListener("change", function(e) {
        crearCapa(geojsonData, e.target.value);
      });

  })
  .catch(error => {
    console.error("ERROR CARGANDO GEOJSON:", error);
  });


  // =====================================
// SWIPER STORYTELLING
// =====================================

const swiper = new Swiper(".storySwiper", {

  loop: true,

  speed: 1200,

  spaceBetween: 0,

  effect: "slide",

  autoplay: {

    delay: 5000,

    disableOnInteraction: false,

  },

  pagination: {

    el: ".swiper-pagination",

    clickable: true,

  },

  navigation: {

    nextEl: ".swiper-button-next",

    prevEl: ".swiper-button-prev",

  },

});