// Animación de viajes Ecobici con D3
// Módulo ES: adjunta manejadores y usa datos desde un getter

let currentFrame = 0;
let startButton;
let pauseButton;
let prevButton;
let nextButton;
let svg;
let isPlaying = false;
let runAnimate;
let animate;
let g;
let estaciones;
let projection;
let lastAddedArrow;
let rutasConteo;
let currentData = [];

const widthSVG = 800;
const heightSVG = 600;

async function createSVG() {
  svg = d3.select('#visualization').select('svg');
  if (svg && !svg.empty()) {
    svg.remove();
  }

  svg = d3.select('.svg-container')
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${widthSVG} ${heightSVG}`)
    .attr('width', widthSVG)
    .attr('height', heightSVG)
    .attr('style', 'border: 1px solid black;');

  // Grupo para zoom/pan
  g = svg.append('g');

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  svg.call(zoom);

  try {
    const [stations, colonias] = await Promise.all([
      d3.json('maps/cicloestaciones_ecobici.geojson'),
      d3.json('maps/colonias_ecobici_bordes.geojson'),
    ]);

    // Proyección y paths
    projection = d3.geoMercator().fitExtent([[0, 0], [widthSVG, heightSVG]], colonias);
    const path = d3.geoPath().projection(projection);

    // Colonias
    g.selectAll('path.colonia')
      .data(colonias.features)
      .enter().append('path')
      .attr('class', 'colonia')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 0.25);

    // Estaciones
    g.selectAll('circle.estacion')
      .data(stations.features)
      .enter().append('circle')
      .attr('class', 'estacion')
      .attr('cx', d => projection(d.geometry.coordinates)[0])
      .attr('cy', d => projection(d.geometry.coordinates)[1])
      .attr('r', 1)
      .attr('fill', 'black');

    // Guarda estaciones
    estaciones = stations;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startAnimation(ecobiciViajes) {
  await createSVG();

  // Diccionario de coordenadas
  const estacionesCoords = {};
  if (!estaciones || !estaciones.features) return;
  estaciones.features.forEach(feature => {
    const id = feature.properties.estacion;
    const [lon, lat] = feature.geometry.coordinates;
    estacionesCoords[id] = [lon, lat];
  });

  const data = [...ecobiciViajes].reverse();

  const arrowsGroup = g.append('g').attr('class', 'arrows');
  const title = svg.append('text').attr('x', 10).attr('y', 30).attr('font-size', '16px');
  const counter = svg.append('text').attr('x', 10).attr('y', 60).attr('font-size', '14px');
  const fecha = svg.append('text').attr('x', 10).attr('y', 90).attr('font-size', '14px');

  // Punta de flecha
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 5)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 4)
    .attr('markerHeight', 4)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', 'black')
    .style('stroke', 'none');

  rutasConteo = {};

  const getRutaKey = (inicio, fin) => `${inicio}->${fin}`;
  const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, 1]);

  function updateArrowIntensities() {
    const vals = Object.values(rutasConteo);
    const maxViajes = vals.length ? Math.max(...vals) : 1;
    colorScale.domain([0, maxViajes]);
    arrowsGroup.selectAll('line').each(function () {
      const arrow = d3.select(this);
      if (this !== lastAddedArrow) {
        const rutaKey = arrow.attr('data-ruta');
        const viajes = rutasConteo[rutaKey] || 0;
        arrow.attr('stroke', colorScale(viajes))
          .attr('stroke-opacity', 0.7)
          .attr('stroke-width', 2);
      }
    });
  }

  const popup = d3.select('body').append('div')
    .attr('class', 'popup-animation')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background', 'white')
    .style('border', '1px solid black')
    .style('padding', '5px')
    .style('pointer-events', 'none');

  animate = function () {
    updateButtonState();
    if (currentFrame >= data.length) {
      isPlaying = false;
      return;
    }
    const viaje = data[currentFrame];
    const start = projection(estacionesCoords[viaje.estacionInicio]);
    const end = projection(estacionesCoords[viaje.estacionFin]);
    const rutaKey = getRutaKey(viaje.estacionInicio, viaje.estacionFin);
    rutasConteo[rutaKey] = (rutasConteo[rutaKey] || 0) + 1;

    const existing = arrowsGroup.selectAll(`line[data-ruta="${rutaKey}"]`);
    if (existing.empty()) {
      const newArrow = arrowsGroup.append('line')
        .attr('data-ruta', rutaKey)
        .attr('x1', start[0])
        .attr('y1', start[1])
        .attr('x2', end[0])
        .attr('y2', end[1])
        .attr('stroke-width', 4)
        .attr('stroke', 'black')
        .attr('marker-end', 'url(#arrowhead)')
        .on('mouseover', function (event) {
          const mouseX = event.pageX;
          const mouseY = event.pageY;
          const svgRect = svg.node().getBoundingClientRect();
          popup.transition().duration(200).style('opacity', .9);
          popup.html(`Origen: ${viaje.estacionInicio}<br>Destino: ${viaje.estacionFin}<br>Viajes: ${rutasConteo[rutaKey]}`)
            .style('left', (mouseX - svgRect.left + 5) + 'px')
            .style('top', (mouseY - svgRect.top - 14) + 'px');
        })
        .on('mouseout', function () {
          popup.transition().duration(500).style('opacity', 0);
        });
      lastAddedArrow = newArrow.node();
    }

    updateArrowIntensities();
    title.text(`Viaje de estación ${viaje.estacionInicio} a ${viaje.estacionFin}`);
    counter.text(`Total de viajes: ${currentFrame + 1}`);
    const fechaTxt = viaje.fechaInicio instanceof Date ? viaje.fechaInicio.toISOString().slice(0, 19) : String(viaje.fechaInicio);
    fecha.text(`Hora y duración: ${fechaTxt} (${viaje.duracion} minutos)`);
    updateButtonState();
  };

  runAnimate = function () {
    const speed = parseFloat(document.getElementById('animationSpeed').value);
    const ms = (200 / Math.pow(1.5, speed));
    if ((currentFrame < data.length - 1) && isPlaying) {
      currentFrame++;
      animate();
      delay(ms).then(runAnimate);
    } else {
      isPlaying = false;
      updateButtonState();
    }
  };

  // Guarda referencia actual para botones
  currentData = data;
  animate();
  runAnimate();
}

function updateButtonState() {
  if (!pauseButton || !prevButton || !nextButton) return;
  if (isPlaying) {
    pauseButton.disabled = false;
    pauseButton.textContent = 'Pausa';
    prevButton.disabled = true;
    nextButton.disabled = true;
  } else {
    if (currentFrame < (currentData.length - 1)) {
      nextButton.disabled = false;
      prevButton.disabled = currentFrame === 0;
      pauseButton.disabled = false;
      pauseButton.textContent = 'Continuar';
    } else {
      prevButton.disabled = currentData.length === 0;
      pauseButton.disabled = true;
      nextButton.disabled = true;
    }
  }
}

function togglePause() {
  if (isPlaying) {
    isPlaying = false;
    updateButtonState();
  } else {
    isPlaying = true;
    runAnimate();
  }
}

function prevFrame() {
  if (currentFrame > 0) {
    const oldFrame = currentFrame;
    currentFrame = 0;
    g.selectAll('line').remove();
    rutasConteo = {};
    currentData.slice(0, oldFrame).forEach((_viaje, i) => {
      currentFrame = i;
      animate();
    });
    updateButtonState();
  }
}

function nextFrame() {
  if (currentFrame < currentData.length - 1) {
    currentFrame++;
    animate();
  }
  updateButtonState();
}

export function attachEcobiciAnimation(getData) {
  // Debe llamarse después de DOMContentLoaded
  startButton = document.getElementById('startAnimation');
  pauseButton = document.getElementById('pauseAnimation');
  prevButton = document.getElementById('previousFrame');
  nextButton = document.getElementById('nextFrame');

  // Render base vacío de una vez
  createSVG();

  if (startButton) {
    startButton.addEventListener('click', async () => {
      const svgEl = d3.select('#visualization').select('svg');
      if (!svgEl.empty()) svgEl.remove();
      currentFrame = 0;
      isPlaying = true;
      const data = typeof getData === 'function' ? (getData() || []) : [];
      await startAnimation(data);
    });
  }
  if (pauseButton) pauseButton.addEventListener('click', togglePause);
  if (prevButton) prevButton.addEventListener('click', prevFrame);
  if (nextButton) nextButton.addEventListener('click', nextFrame);
  updateButtonState();
}

