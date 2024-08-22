let currentFrame = 0;
let startButton;
let pauseButton;
let previousButton;
let nextButton;
let svg;
let isPlaying = false;
let intervalId;
let runAnimate;
let animate;
let g;
let estaciones;
let projection;

const widthSVG = 800;
const heightSVG = 600;

async function createSVG(){
  svg = d3.select('#visualization').select('svg');
  if (svg){
    svg.remove();
  }
  
  svg = d3.select('.svg-container')
  .append('svg')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 800 600`);

  svg.attr('width', widthSVG)
    .attr('height', heightSVG)
    .attr('style', 'border: 1px solid black;');

  // Crear un grupo para contener todos los elementos que se van a hacer zoom
  g = svg.append('g');

  // Configurar el zoom
  const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed);

  svg.call(zoom);

  function zoomed(event) {
      g.attr('transform', event.transform);
  }

  Promise.all([
    d3.json('maps/cicloestaciones_ecobici.geojson'),
    d3.json('maps/colonias_ecobici_bordes.geojson')
  ]).then(([stations, colonias]) => {
      // Configurar la proyección
  projection = d3.geoMercator().fitExtent([[0, 0], [widthSVG, heightSVG]], colonias);
  const path = d3.geoPath().projection(projection);

  // Dibujar las colonias
  g.selectAll('path.colonia')
      .data(colonias.features)
      .enter().append('path')
      .attr('class', 'colonia')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 0.25);

  // Dibujar las estaciones
  g.selectAll('circle.estacion')
      .data(stations.features)
      .enter().append('circle')
      .attr('class', 'estacion')
      .attr('cx', d => projection(d.geometry.coordinates)[0])
      .attr('cy', d => projection(d.geometry.coordinates)[1])
      .attr('r', 1)
      .attr('fill', 'black');

  // Guardar las estaciones en una variable global
  estaciones = stations;

  }).catch(error => console.error('Error al cargar los datos:', error));
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startAnimation(ecobiciViajes) {
  console.log('Datos cargados:', { ecobiciViajes});
  createSVG();

  // Crear un diccionario de coordenadas de estaciones
  const estacionesCoords = {};
  estaciones.features.forEach(feature => {
    const id = feature.properties.estacion;
      const [lon, lat] = feature.geometry.coordinates;
      estacionesCoords[id] = [lon, lat];
  });

  ecobiciViajes.reverse();
  // Preparar elementos para la animación
  const arrowsGroup = g.append('g').attr('class', 'arrows');

  const title = svg.append('text')
      .attr('x', 10)
      .attr('y', 30)
      .attr('font-size', '16px');

  const counter = svg.append('text')
      .attr('x', 10)
      .attr('y', 60)
      .attr('font-size', '14px');

  const fecha = svg.append('text')
  .attr('x', 10)
  .attr('y', 90)
  .attr('font-size', '14px');


  // Definir la punta de flecha
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

  // Crear un objeto para almacenar el recuento de viajes por ruta
  const rutasConteo = {};

  // Función para obtener la clave única de una ruta
  function getRutaKey(inicio, fin) {
      return `${inicio}->${fin}`;
  }

  // Escala de color para la intensidad de las rutas
  const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain([0, 1]);  // Ajustaremos el dominio más adelante

  // Función para actualizar la intensidad de color de las flechas
  function updateArrowIntensities() {
      const maxViajes = Math.max(...Object.values(rutasConteo));
      colorScale.domain([0, maxViajes]);

      arrowsGroup.selectAll('line').each(function() {
          const arrow = d3.select(this);
          const rutaKey = arrow.attr('data-ruta');
          const viajes = rutasConteo[rutaKey] || 0;
          arrow.attr('stroke', colorScale(viajes))
              .attr('stroke-opacity', 0.7);
      });
  }

  // Crear un div para el popup
  const popup = d3.select('body').append('div')
      .attr('class', 'popup-animation')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'white')
      .style('border', '1px solid black')
      .style('padding', '5px')
      .style('pointer-events', 'none');

  animate = function animate() {
    console.log('currentFrame:', currentFrame);
    showButtons();
    if (currentFrame >= ecobiciViajes.length) {
      isPlaying = false;
      return;
    }

      const viaje = ecobiciViajes[currentFrame];
      const start = projection(estacionesCoords[viaje.estacionInicio]);
      const end = projection(estacionesCoords[viaje.estacionFin]);
      const rutaKey = getRutaKey(viaje.estacionInicio, viaje.estacionFin);
      rutasConteo[rutaKey] = (rutasConteo[rutaKey] || 0) + 1;

      // Crear o actualizar la flecha
      const arrow = arrowsGroup.selectAll(`line[data-ruta="${rutaKey}"]`);
      if (arrow.empty()) {
          const newArrow = arrowsGroup.append('line')
              .attr('data-ruta', rutaKey)
              .attr('x1', start[0])
              .attr('y1', start[1])
              .attr('x2', end[0])
              .attr('y2', end[1])
              .attr('stroke-width', 2)
              .attr('marker-end', 'url(#arrowhead)')
              .on('mouseover', function(event) {
                  const mouseX = event.pageX;
                  const mouseY = event.pageY;
                  const svgRect = svg.node().getBoundingClientRect();
                  popup.transition()
                      .duration(200)
                      .style('opacity', .9);
                  popup.html(`Origen: ${viaje.estacionInicio}<br>Destino: ${viaje.estacionFin}<br>Viajes: ${rutasConteo[rutaKey]}`)
                      .style('left', (mouseX - svgRect.left + 10) + 'px')
                      .style('top', (mouseY - svgRect.top - 28) + 'px');
              })
              .on('mouseout', function() {
                  popup.transition()
                      .duration(500)
                      .style('opacity', 0);
              });
      }

      updateArrowIntensities();
      // Actualizar título y contador
      title.text(`Viaje de estación ${viaje.estacionInicio} a ${viaje.estacionFin}`);
      counter.text(`Total de viajes: ${currentFrame + 1}`);
      fecha.text(`Hora y duración: ${viaje.fechaInicio.toISOString().slice(0, 19)} (${viaje.duracion} minutos)`);
      showButtons();
  }

  runAnimate = function runAnimate(ms=70) {
    if ((currentFrame < ecobiciViajes.length - 1) && (isPlaying)) {
      currentFrame++;
      animate();
      delay(ms).then(runAnimate);
    } else {
      isPlaying = false;
      showButtons();
    }
  }
  runAnimate();
}

function showButtons() {
  if (isPlaying) {
    pauseButton.style.display = 'inline';
    pauseButton.textContent = 'Pausa';
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
  } else {
      if (currentFrame <= ecobiciViajes.length - 2) {
        nextButton.style.display = 'inline';
        prevButton.style.display = 'inline';
        pauseButton.style.display = 'inline';
        pauseButton.textContent = 'Continuar';
      } else if (currentFrame >= ecobiciViajes.length - 1){
        prevButton.style.display = 'inline';
        pauseButton.style.display = 'none';
        nextButton.style.display = 'none';
      } else {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        prevButton.style.display = 'none';
      }
  }

}

function togglePause() {
  if (isPlaying) {
    pauseAnimation();
  } else {
    resumeAnimation();
  }
}

function pauseAnimation() {
  isPlaying = false;
  showButtons();
}

function resumeAnimation() {
  isPlaying = true;
  runAnimate();
}

function prevFrame() {
  if (currentFrame > 0) {
    const oldFrame = currentFrame;
    currentFrame = 0;
    g.selectAll('line').remove();

    ecobiciViajes.slice(0, oldFrame).forEach((viaje, i) => {
      currentFrame = i;
      animate();
    }
    );
  }
}

function nextFrame() {
  if (currentFrame < ecobiciViajes.length - 1) {
    currentFrame++;
    animate();
  } else {
    showButtons();
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  startButton = document.getElementById('startAnimation');
  stopButton = document.getElementById('stopAnimation');
  pauseButton = document.getElementById('pauseAnimation');
  prevButton = document.getElementById('previousFrame');
  nextButton = document.getElementById('nextFrame');
  createSVG();
  startButton.addEventListener('click', function() {
    const svg = d3.select('#visualization').select('svg');
    svg.remove();
    currentFrame = 0;
    isPlaying = true;
    startAnimation(ecobiciViajes);
  });
  pauseButton.addEventListener('click', togglePause);
  prevButton.addEventListener('click', prevFrame);
  nextButton.addEventListener('click', nextFrame);
});
