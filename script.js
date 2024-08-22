const prod = window.location.hostname === "localhost" ? 0 : 1;
let data = [];
let serieInput;
let pieChart;
let lineChart;
let stackedBarChart;
let barChartMomentoDia;
let heatmapChart;
let saldoFinalChart;
let top10MetroLinesChart;
let top10MetroStationsChart;
let top10MetrobusLinesChart;
let top10MetrobusStationsChart;
let ecobiciHeatmapViajes;
let ecobiciHeatmapTiempo;
let resultsDataTable;
let viajesPorHoraChart;
let ecobiciViajes;

const colorPalette = {
  "STC": 'rgba(254, 80, 0, 0.8)', // FE5000
  "ECOBICI": 'rgba(0, 154, 68, 0.8)', // #009A44
  "METROBÚS": 'rgba(200, 16, 46, 0.8)', // #C8102E
  "RUTA": 'rgba(155, 38, 182, 0.8)', //#9B26B6
  "CABLEBUS": 'rgba(78, 195, 224, 0.8)', // #4EC3E0
  "CETRAM": "rgba(240, 78, 152, 0.8)", // #F04E98
  "STE": 'rgba(0, 87, 184, 0.8)', // #0057B8
  "RTP": 'rgba(120, 190, 32, 0.8)', // #78BE20
  "Mañana": 'rgba(75, 192, 192, 0.8)',
  "Tarde": 'rgba(153, 102, 255, 0.8)',
  "Noche": 'rgba(22, 192, 67, 0.8)',
  // Añade más organismos y colores según sea necesario
};
const metroLineColors = {
  "1": '#F04E98',
  "2": '#005EB8',
  "3": '#AF9800',
  "4": '#6BBBAE',
  "5": '#FFD100',
  "6": '#DA291C',
  "7": '#E87722',
  "8": '#009A44',
  "9": '#512F2E',
  "A": '#981D97',
  "B": '#B1B3B3',
  "12": '#B0A32A',
}
const sistemas = {
  "STC": "Metro",
  "METROBÚS": "Metrobús",
  "ECOBICI": "Ecobici",
  "RUTA": "Ruta",
  "CABLEBUS": "Cablebús",
  "CETRAM": "Cetram",
  "STE": "STE",
  "RTP": "RTP"
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  serieInput = document.getElementById('serieInput');
  window.mapInstances = {};
  setupCollapsibleSections();

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      processSubmit();
  });

  const infoIcon = document.getElementById('yearInfo');
  const popup = document.getElementById('infoPopup');

  infoIcon.addEventListener('click', function(e) {
      e.preventDefault();
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
      popup.style.top = (e.clientY + 10) + 'px';
      popup.style.left = (e.clientX + 10) + 'px';
  });

  document.addEventListener('click', function(e) {
      if (e.target !== infoIcon && !popup.contains(e.target)) {
          popup.style.display = 'none';
      }
  });

  if (!prod) {
    testContent();
  }
});

document.getElementById('downloadCSV').addEventListener('click', function() {
  // Convierte los datos a CSV
  const csv = convertDataToCSV(data);

  // Crear un Blob con el contenido CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  // Crear un enlace para la descarga
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `datos-MI-${serieInput.value.trim()}.csv`);
  link.style.visibility = 'hidden';

  // Añadir el enlace al documento y simular un clic
  document.body.appendChild(link);
  link.click();

  // Eliminar el enlace del documento
  document.body.removeChild(link);

  function convertDataToCSV(data) {
    const header = Object.keys(data[0]).join(","); // Encabezado con los nombres de las claves
    const rows = data.map(row => Object.values(row).join(",")); // Filas con los valores
    return [header, ...rows].join("\n"); // Une encabezado y filas con saltos de línea
  }
});

document.getElementById('downloadJSON').addEventListener('click', function() {
    // Convertir el objeto data a una cadena JSON
    const json = JSON.stringify(data, null, 2); // El parámetro '2' es para formatear el JSON con indentación

    // Crear un Blob con el contenido JSON
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });

    // Crear un enlace para la descarga
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `datos-MI-${serieInput.value.trim()}.json`);
    link.style.visibility = 'hidden';

    // Añadir el enlace al documento y simular un clic
    document.body.appendChild(link);
    link.click();

    // Eliminar el enlace del documento
    document.body.removeChild(link);
});

async function processSubmit() {
  data = [];
  showLoadingMessage();
  const serie = serieInput.value.trim();
  const anio = document.getElementById('yearSelect').value;
  if (serie) {
      try {
          data = await fetchData(serie, anio);
          updateSectionContents(data);
      } catch (error) {
          console.error('Error:', error);
          alert('Hubo un error al obtener los datos. Por favor, intente de nuevo.');
          document.getElementById('loadingMessage').remove();
      }
  }
}

async function testContent() {
  showLoadingMessage();
  data = await fetchTestdata();
  updateSectionContents(data);
}


function setupCollapsibleSections() {
  const sections = document.querySelectorAll('.collapsible-section h2');
  sections.forEach(section => {
      section.addEventListener('click', () => {
          section.classList.toggle('active');
          const content = section.nextElementSibling;
          content.classList.toggle('active');
          if (content.classList.contains('active')) {
              content.style.display = 'block';
              setTimeout(() => {
                  // Busca todos los contenedores de mapas en este contenido
                  const mapContainers = content.querySelectorAll('[id^="map"]');
                  mapContainers.forEach(mapContainer => {
                      const mapId = mapContainer.id;
                      if (window.mapInstances[mapId]) {
                          window.mapInstances[mapId].invalidateSize();
                      }
                  });
              }, 100);
          } else {
              content.style.display = 'none';
          }
      });
  });
}

function displayResults(data) {
    const resultsTable = document.getElementById('resultsTable');

    if (data && data.length > 0) {
        // Get all unique keys from all objects in the data array
        const allKeys = [...new Set(data.flatMap(Object.keys))];

        // If DataTable doesn't exist or has different columns, initialize/reinitialize it
        if (!$.fn.DataTable.isDataTable('#resultsTable') ||
            resultsDataTable.columns().header().length !== allKeys.length) {

            if (resultsDataTable) {
                resultsDataTable.destroy();
            }

            resultsDataTable = $('#resultsTable').DataTable({
                columns: allKeys.map(key => ({
                    title: key,
                    data: key,
                    defaultContent: '' // Use this for missing data
                })),
                scrollX: true
            });
        }

        // Clear existing data and add new data
        resultsDataTable.clear().rows.add(data).draw();

        resultsTable.style.display = 'table';
    } else {
        // If there's no data, destroy the DataTable if it exists
        if ($.fn.DataTable.isDataTable('#resultsTable')) {
            resultsDataTable.destroy();
            resultsDataTable = null;
        }

        resultsTable.style.display = 'none';
        alert('No se encontraron resultados para el número de serie proporcionado.');
    }
}

function updateSectionContents(data) {
  const viajes = processViajes(data);
  const metro = createMetroObject(viajes, 'STC');
  const metrobus = createMetroObject(viajes, 'METROBÚS');
  const ecobici = data.filter(d => d.organismo === 'ECOBICI');
  const inicioViaje = ecobici.filter(d => d.operacion === '70-INICIO DE VIAJE');
  const finViaje = ecobici.filter(d => d.operacion === '71-FIN DE VIAJE');
  ecobiciViajes = matchInicioFinViaje(inicioViaje, finViaje);
  console.log(ecobiciViajes);
  showAllSections();
  // Actualizar gráficos y estadísticas generales
  getTotalViajes(viajes);
  getTotalRecargas(data);
  createPieChart(viajes);
  createLineChart(viajes);
  createStackedBarChart(viajes);
  crearGraficoViajesPorHoraYOrganismo(viajes);
  createBarChartByMomentoDia(viajes);
  populateOrganismoSelector(viajes);
  createHeatmap(viajes);
  document.getElementById('organismoSelector').addEventListener('change', function() {
    const selectedOrganismo = this.value;
    createHeatmap(viajes, selectedOrganismo);
  });
  createSaldoFinalChart(data);
  // Actualizar y mostrar/ocultar secciones según corresponda
  updateSection('metroSection', metro, updateMetroSection);
  updateSection('metrobusSection', metrobus, updateMetrobusSection);
  updateSection('ecobiciSection', ecobici, () => updateEcobiciSection(inicioViaje, finViaje));
  displayResults(data);
}

function updateSection(sectionId, data, updateFunction) {
  const section = document.getElementById(sectionId);
  if (data && data.length > 0) {
      updateFunction(data);
      section.style.display = 'block';
  } else {
      section.style.display = 'none';
  }
}

function updateMetroSection(metro) {
  getMetroStats(metro, 'STC');
  createTop10MetroLinesChart(metro, 'STC');
  createTop10MetroStationsChart(metro, 'STC');
  createMetroMap(metro);
}

function updateMetrobusSection(metrobus) {
  getMetroStats(metrobus, 'METROBÚS');
  createTop10MetroLinesChart(metrobus, 'METROBÚS');
  createTop10MetroStationsChart(metrobus, 'METROBÚS');
  createMetroMap(metrobus, 'METROBÚS');
}

function updateEcobiciSection(inicioViaje, finViaje) {
  getEcobiciStats(inicioViaje, finViaje);
  createEcobiciHeatmap(inicioViaje, finViaje, tipo='viajes');
  createEcobiciHeatmap(inicioViaje, finViaje, tipo='tiempo');
  createEcobiciMap(inicioViaje, finViaje);
}

function showLoadingMessage() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => { section.style.display = 'none'; });
  const loadingMessage = document.getElementById('loadingMessage');
  loadingMessage.innerText = 'Espere mientras se cargan sus datos...';
}

function showAllSections() {
    // Cuando los datos estén listos, mostrar las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      if (section.id === 'statsContainer') {
        section.style.display = 'flex';
      }
      else {
        section.style.display = 'block';
      }
     });
    // Eliminar el mensaje de carga
    document.getElementById('loadingMessage').innerHTML = "";
}

async function fetchData(serie, anio) {
  const response = await fetch('https://app.semovi.cdmx.gob.mx/micrositio/291-trazabilidad_tarjetas.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://app.semovi.cdmx.gob.mx',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
          serie: serie,
          anio: anio,
          operacion: 'todas',
      }),
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  const jsonResponse = await response.json();
  return jsonResponse.data;
}

async function fetchTestdata() {
  const response = await fetch('http://localhost:8000/datos/data.json');
  const data = await response.json();
  return data.data //.filter(item => item.serie === serie);
}

function createMetroObject(viajes, selectedOrganismo = 'STC') {
  return viajes.filter(viaje => viaje.organismo === selectedOrganismo);
}

function getEcobiciODViajes(inicioViaje, finViaje) {
  // Crear un mapa de viajes
  const viajesMap = new Map();
  inicioViaje.forEach(inicio => {
      const fin = finViaje.find(f => f.numero === inicio.numero - 1);
      if (fin) {
          const key = `${inicio.estacion}+${fin.estacion}`;
          viajesMap.set(key, (viajesMap.get(key) || 0) + 1);
      }
  });

  // Convertir el mapa a un array de objetos para ApexCharts
  return Array.from(viajesMap, ([key, value]) => {
      const [inicio, fin] = key.split('+');
      return { x: inicio, y: fin, value: value };
  });
}

function getEcobiciODMeanTime(inicioViaje, finViaje) {
  // Crear un mapa para almacenar tiempos de viaje entre estaciones
  const viajesMap = new Map();

  inicioViaje.forEach(inicio => {
      const fin = finViaje.find(f => f.numero === inicio.numero - 1);
      if (fin) {
          const key = `${inicio.estacion}+${fin.estacion}`;

          // Convertir las fechas a objetos Date
          const fechaInicio = parseDateTime(inicio.fecha);
          const fechaFin = parseDateTime(fin.fecha);

          // Calcular el tiempo de viaje en minutos
          const tiempoViaje = (fechaFin - fechaInicio) / (1000 * 60);

          // Si el tiempo de viaje es válido, almacenarlo
          if (tiempoViaje > 0) {
              if (!viajesMap.has(key)) {
                  viajesMap.set(key, { sumTiempo: 0, count: 0 });
              }
              const entry = viajesMap.get(key);
              entry.sumTiempo += tiempoViaje;
              entry.count += 1;
          }
      }
  });

  // Convertir el mapa a un array de objetos para ApexCharts
  return Array.from(viajesMap, ([key, { sumTiempo, count }]) => {
      const [inicio, fin] = key.split('+');
      const promedioTiempo = sumTiempo / count;
      return { x: inicio, y: fin, value: Math.round(promedioTiempo) };
  });
}

function getTotalViajes(viajes) {
  const totalViajes = viajes.length;
  document.getElementById('totalViajes').textContent = totalViajes.toLocaleString();
}

function getTotalRecargas(data) {
  const totalRecargas = data.reduce((total, viaje) => {
    if (viaje.operacion === '00-RECARGA') {
        return total + parseFloat(viaje.monto);
    }
    return total;
  }, 0);

  document.getElementById('totalRecargas').textContent = `$${totalRecargas.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
}

function getMomentoDia(hora) {
  if (hora <= 11) {
      return "Mañana";
  } else if (hora <= 18) {
      return "Tarde";
  } else {
      return "Noche";
  }
}

function processViajes(data) {
  return data
      .filter(item => (item.operacion !== "71-FIN DE VIAJE") && (item.operacion !== "00-RECARGA"))
      .map(item => {
          const dateParts = item.fecha.split(' ');
          const date = new Date(dateParts[0].split('-').reverse().join('-'));
          const hora = parseInt(dateParts[1].split(':')[0]);
          const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
          item.dayOfWeek = days[date.getDay()]; // Calcula el día de la semana
          item.momento_dia = getMomentoDia(hora); // Calcula el momento del día
          item.hora = hora;
          return item;
      });
}

function getEcobiciStats(inicioViaje, finViaje) {
  let totalViajes = 0;
  let tiempoTotal = 0;
  const estacionesUnicas = new Set();

  inicioViaje.forEach(inicio => {
    const fin = finViaje.find(f => f.numero === inicio.numero - 1);
    if (fin) {
      const fechaInicio = parseDateTime(inicio.fecha);
      const fechaFin = parseDateTime(fin.fecha);

      const tiempoViaje = (fechaFin - fechaInicio) / (1000 * 60); // Tiempo en minutos

      if (tiempoViaje > 0) {
        totalViajes++;
        tiempoTotal += tiempoViaje;
        estacionesUnicas.add(inicio.estacion);
        estacionesUnicas.add(fin.estacion);
      }
    }
  });

  const tiempoPromedio = totalViajes > 0 ? tiempoTotal / totalViajes : 0;
  document.getElementById('totalViajesEcobici').textContent = totalViajes.toLocaleString();
  document.getElementById('totalTiempoEcobici').textContent = `${tiempoTotal.toLocaleString()} minutos`;
  document.getElementById('tiempoPromedioEcobici').textContent = `${tiempoPromedio.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} minutos`;
  document.getElementById('estacionesVisitadas').textContent = estacionesUnicas.size;

  document.querySelectorAll(`#ecobiciStatsContainer p`).forEach((p) => {
    p.parentElement.style.setProperty('background-color', colorPalette['ECOBICI'].replace(/[\d\.]+\)$/g, '0.5)'));
  }
  );
  }

function getMetroStats(data, organismo = 'STC') {
  const totalViajes = data.length;
  const estacionesUnicas = new Set(data.map(viaje => viaje.estacion));
  const fechasUnicas = new Set(data.map(viaje => viaje.fecha.split(' ')[0]));
  const gastoTotal = data.reduce((total, viaje) => {
    if (viaje.operacion === '03-VALIDACION') {
        return total + parseFloat(viaje.monto);
    }
    return total;
  }, 0);

  if (organismo === 'STC') {
    elementId = 'Metro';
  } else if (organismo === 'METROBÚS') {
    elementId = 'Metrobus';
  } else {
    console.log('Organismo no encontrado');
  }

  document.getElementById(`totalViajes${elementId}`).textContent = totalViajes.toLocaleString();
  document.getElementById(`estacionesVisitadas${elementId}`).textContent = estacionesUnicas.size;
  document.getElementById(`diasUso${elementId}`).textContent = fechasUnicas.size;
  document.getElementById(`montoGastado${elementId}`).textContent = `$${gastoTotal.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;

  document.querySelectorAll(`#${elementId}StatsContainer p`).forEach((p) => {
    p.parentElement.style.setProperty('background-color', colorPalette[organismo].replace(/[\d\.]+\)$/g, '0.5)'));
  }
  );
}

function generateRandomColor() {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`;
}

function getColorForOrganismo(organismo) {
    return colorPalette[organismo] || generateRandomColor();
}

function createPieChart(viajes) {
  const organismoCounts = viajes.reduce((acc, viaje) => {
      acc[viaje.organismo] = (acc[viaje.organismo] || 0) + 1;
      return acc;
  }, {});

  const series = Object.values(organismoCounts);
  const labels = Object.keys(organismoCounts);

  const options = {
      series: series,
      chart: {
          type: 'donut',
          height: 380
      },
      labels: labels,
      colors: labels.map(label => getColorForOrganismo(label)),
      title: {
          text: 'Número de Viajes por sistema de transporte',
          align: 'center'
      },
      legend: {
          position: 'bottom'
      },
      plotOptions: {
          pie: {
              donut: {
                  size: '50%'
              }
          }
      },
      dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
              return opts.w.config.series[opts.seriesIndex]
          }
      },
      tooltip: {
          y: {
              formatter: function(value) {
                  return value + " viajes";
              }
          }
      },
      responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 300
              },
              legend: {
                  position: 'bottom'
              }
          }
      }]
  };

  if (pieChart) {
      pieChart.destroy();
  }

  pieChart = new ApexCharts(document.querySelector("#pieChart"), options);
  pieChart.render();
}

function createLineChart(viajes) {
  const organismoDates = viajes.reduce((acc, viaje) => {
      const date = new Date(viaje.fecha.split(' ')[0].split('-').reverse().join('-'));
      const organismo = viaje.organismo;
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Agrupa por mes y año
      const key = `${organismo}+${monthYear}`;

      acc[key] = (acc[key] || 0) + 1;
      return acc;
  }, {});

  const labels = [];
  const dataValues = {};

  Object.keys(organismoDates).forEach(key => {
      const [organismo, monthYear] = key.split('+');
      if (!labels.includes(monthYear)) labels.push(monthYear);

      if (!dataValues[organismo]) dataValues[organismo] = [];
      dataValues[organismo].push({ date: monthYear, value: organismoDates[key] });
  });

  // Ordenar labels por fecha
  labels.sort((a, b) => new Date(a) - new Date(b));

  // Crear las series de datos para ApexCharts
  const series = Object.keys(dataValues).map(organismo => {
    return {
      name: organismo,
      data: labels.map(monthYear => {
        const found = dataValues[organismo].find(d => d.date === monthYear);
        return found ? found.value : 0;
      }),
      color: colorPalette[organismo] // Añadir el color correspondiente
    };
  });

  const options = {
      series: series,
      colors: series.map(s => s.color),
      chart: {
          type: 'line',
          height: 350,
          zoom: {
              enabled: false
          }
      },
      title: {
          text: 'Total de Viajes Mensuales por sistema de transporte',
          align: 'center'
      },
      xaxis: {
          categories: labels,
          title: {
              text: 'Mes y Año'
          }
      },
      yaxis: {
          title: {
              text: 'Número de Viajes'
          }
      },
      stroke: {
          curve: 'smooth'
      },
      markers: {
          size: 5,
      },
      tooltip: {
          shared: true,
          intersect: false
      }
  };

  if (lineChart) {
      lineChart.destroy();
  }

  lineChart = new ApexCharts(document.getElementById('lineChart'), options);
  lineChart.render();
}

function createStackedBarChart(viajes) {
  const organismoDays = viajes.reduce((acc, viaje) => {
      const organismo = viaje.organismo;
      const dayOfWeek = viaje.dayOfWeek;
      const key = `${organismo}+${dayOfWeek}`;

      acc[key] = (acc[key] || 0) + 1;
      return acc;
  }, {});

  const labels = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const dataValues = {};

  Object.keys(organismoDays).forEach(key => {
      const [organismo, dayOfWeek] = key.split('+');
      if (!dataValues[organismo]) dataValues[organismo] = [];
      dataValues[organismo].push({ day: dayOfWeek, value: organismoDays[key] });
  });

  const series = Object.keys(dataValues).map(organismo => {
      return {
          name: organismo,
          data: labels.map(day => {
              const found = dataValues[organismo].find(d => d.day === day);
              return found ? found.value : 0;
          }),
          color: colorPalette[organismo]
      };
  });

  const options = {
      series: series,
      colors: series.map(s => s.color),
      chart: {
          type: 'bar',
          height: 350,
          stacked: true,
      },
      plotOptions: {
          bar: {
              horizontal: false,
          },
      },
      xaxis: {
          categories: labels,
          title: {
              text: 'Día de la semana'
          }
      },
      yaxis: {
          title: {
              text: 'Número de viajes'
          }
      },
      title: {
          text: 'Total de viajes por sistema y día de la semana',
          align: 'center'
      },
      fill: {
          opacity: 1
      },
      tooltip: {
          y: {
              formatter: function (val) {
                  return val + " viajes";
              }
          }
      },
      legend: {
          position: 'top',
          horizontalAlign: 'left'
      }
  };

  if (stackedBarChart) {
    stackedBarChart.destroy();
  }

  stackedBarChart = new ApexCharts(document.getElementById('stackedBarChart'), options);
  stackedBarChart.render();
}

function createBarChartByMomentoDia(viajes) {
  const momentoData = viajes.reduce((acc, viaje) => {
      const organismo = viaje.organismo;
      const momentoDia = viaje.momento_dia;
      const key = `${organismo}+${momentoDia}`;

      acc[key] = (acc[key] || 0) + 1;
      return acc;
  }, {});

  const organismos = [...new Set(viajes.map(v => v.organismo))];
  const momentos = ['Mañana', 'Tarde', 'Noche'];
  const seriesData = momentos.map(momento => {
      return {
          name: momento,
          data: organismos.map(organismo => momentoData[`${organismo}+${momento}`] || 0)
      };
  });

  const options = {
      series: seriesData,
      chart: {
          type: 'bar',
          height: 350,
          stacked: false,
      },
      plotOptions: {
          bar: {
              horizontal: false,
          },
      },
      xaxis: {
          categories: organismos,
          title: {
              text: 'Sistema de Transporte'
          }
      },
      yaxis: {
          title: {
              text: 'Número de Viajes'
          }
      },
      legend: {
          position: 'top',
      },
      fill: {
          opacity: 1
      },
      title: {
          text: 'Total de viajes por sistema y momento del día',
          align: 'center'
      },
      tooltip: {
          y: {
              formatter: function (val) {
                  return `${val} viajes`;
              }
          }
      }
  };

  if (barChartMomentoDia) {
    barChartMomentoDia.destroy();
  }

  barChartMomentoDia = new ApexCharts(document.getElementById('barChartMomentoDia'), options);
  barChartMomentoDia.render();
}

function procesarViajesPorHoraYOrganismo(viajes) {
  const organismos = [...new Set(viajes.map(v => v.organismo))];
  const viajesPorHoraYOrganismo = organismos.reduce((acc, org) => {
    acc[org] = Array(24).fill(0);
    return acc;
  }, {});

  viajes.forEach(viaje => {
    viajesPorHoraYOrganismo[viaje.organismo][viaje.hora] += 1;
  });

  return { organismos, viajesPorHoraYOrganismo };
}

function crearGraficoViajesPorHoraYOrganismo(viajes) {
  const { organismos, viajesPorHoraYOrganismo } = procesarViajesPorHoraYOrganismo(viajes);
  const series = organismos.map(org => ({
    name: org,
    data: viajesPorHoraYOrganismo[org],
    color: colorPalette[org]
  }));

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true
    },
    series: series,
    xaxis: {
      categories: Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0') + ':00'),
      title: {
        text: 'Hora del día'
      }
    },
    yaxis: {
      title: {
        text: 'Número de viajes'
      }
    },
    title: {
      text: 'Viajes por hora del día y sistema de transporte',
      align: 'center'
    },
    plotOptions: {
      bar: {
        horizontal: false,
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: series.map(s => s.color),
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };

  if (viajesPorHoraChart) {
    viajesPorHoraChart.destroy();
  }

  viajesPorHoraChart = new ApexCharts(document.querySelector("#viajesPorHora"), options);
  viajesPorHoraChart.render();
}

function createHeatmap(viajes, selectedOrganismo = 'Todos') {
  const heatmapElement = document.getElementById('heatmapChart');
  if (!heatmapElement) {
      console.error('Elemento con ID "heatmapChart" no encontrado');
      return;
  }

  const filteredViajes = selectedOrganismo === 'Todos' ? viajes : viajes.filter(viaje => viaje.organismo === selectedOrganismo);

  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const momentosDia = ['Mañana', 'Tarde', 'Noche'];

  const data = diasSemana.map(dia => {
      return momentosDia.map(momento => {
          const count = filteredViajes.filter(viaje => viaje.dayOfWeek === dia && viaje.momento_dia === momento).length;
          return {
              x: momento,
              y: count,
              dia: dia,
          };
      });
  }).flat();

  const options = {
      series: diasSemana.map(dia => ({
          name: dia,
          data: data.filter(item => item.dia === dia)
      })),
      chart: {
          height: 350,
          type: 'heatmap',
      },
      dataLabels: {
          enabled: true,
      },
      colors: ["#008FFB"],
      title: {
          text: 'Viajes por día de la semana y momento'
      },
      xaxis: {
          categories: momentosDia
      },
      yaxis: {
          categories: diasSemana.reverse()
      }
  };

  if (heatmapChart) {
      heatmapChart.destroy();
  }

  heatmapChart = new ApexCharts(document.getElementById("heatmapChart"), options);
  heatmapChart.render();
}

function createSaldoFinalChart(data) {
  const filteredData = data.filter(item => {
      const monto = parseFloat(item.monto);
      return !isNaN(monto) && monto > 0;
  });

  const sortedData = filteredData.sort((a, b) => {
      const dateA = parseDateTime(a.fecha);
      const dateB = parseDateTime(b.fecha);
      return dateA - dateB;
  });

  const chartData = sortedData.map(item => ({
      x: parseDateTime(item.fecha),
      y: parseFloat(item.saldo_final) || null
  }));

  const options = {
      series: [{
          name: 'Saldo Final',
          data: chartData
      }],
      chart: {
          type: 'line',
          height: 350,
          zoom: {
              enabled: true
          }
      },
      dataLabels: {
          enabled: false
      },
      stroke: {
          curve: 'straight'
      },
      title: {
          text: 'Histórico de Saldo de tarjeta MI',
          align: 'left'
      },
      grid: {
          row: {
              colors: ['#f3f3f3', 'transparent'],
              opacity: 0.5
          },
      },
      xaxis: {
          type: 'datetime',
          labels: {
              datetimeFormatter: {
                  year: 'yyyy',
                  month: 'MMM \'yy',
                  day: 'dd MMM',
                  hour: 'HH:mm'
              }
          },
          title: {
              text: 'Fecha'
          }
      },
      yaxis: {
          title: {
              text: 'Saldo Final'
          },
          labels: {
              formatter: function (value) {
                  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
              }
          }
      },
      tooltip: {
          x: {
              format: 'dd MMM yyyy'
          },
          y: {
              formatter: function (value) {
                  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
              }
          }
      }
  };

  if (saldoFinalChart) {
      saldoFinalChart.destroy();
  }

  saldoFinalChart = new ApexCharts(document.querySelector("#saldoFinalChart"), options);
  saldoFinalChart.render();
}

function parseDateTime(dateString) {
    return new Date(dateString).getTime();
}

function createTop10MetroLinesChart(metro, organismo = 'STC') {

  // Contar viajes por línea
  const lineaCounts = metro.reduce((acc, viaje) => {
      acc[viaje.linea] = (acc[viaje.linea] || 0) + 1;
      return acc;
  }, {});

  // Convertir a array, ordenar y tomar los top 10
  const top10Lines = Object.entries(lineaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

  const labels = top10Lines.map(([linea]) => linea);
  const data = top10Lines.map(([, count]) => count);
  const colors = top10Lines.map(([linea]) => metroLineColors[linea] || generateRandomColor()); // Color negro por defecto si no se encuentra

  const formattedData = labels.map((label, index) => ({
    x: label,
    y: data[index],
    fillColor: colors[index],      // Color de relleno para la barra
    strokeColor: colors[index]     // Color del borde de la barra
}));

  let elementId = organismo === "STC" ? "top10MetroLinesChart" : "top10MetrobusLinesChart";
  let sistema = sistemas[organismo]

  const options = {
      series: [{
          data: formattedData
      }],
      chart: {
          type: 'bar',
          height: 350
      },
      plotOptions: {
          bar: {
              borderRadius: 4,
              horizontal: true,
          }
      },
      dataLabels: {
          enabled: false
      },
      xaxis: {
          categories: labels,
          title: {
              text: 'Número de viajes'
          }
      },
      yaxis: {
          title: {
              text: `Línea de ${sistema}`
          }
      },
      title: {
          text: `Top 10 Líneas de ${sistema} con más viajes`,
          align: 'center'
      },
      tooltip: {
          y: {
              title: {
                  formatter: function (seriesName) {
                      return "Viajes:";
                  }
              }
          }
      }
  };

  if (organismo === 'STC') {
    if (top10MetroLinesChart) {
        top10MetroLinesChart.destroy();
    }
    top10MetroLinesChart = new ApexCharts(document.getElementById(elementId), options);
    top10MetroLinesChart.render();
  } else {
    if (top10MetrobusLinesChart) {
        top10MetrobusLinesChart.destroy();
    }
    top10MetrobusLinesChart = new ApexCharts(document.getElementById(elementId), options);
    top10MetrobusLinesChart.render();
  }
}

function createTop10MetroStationsChart(metro, organismo = 'STC') {
  // Contar viajes por estación
  const stationCounts = metro.reduce((acc, viaje) => {
      acc[viaje.estacion] = (acc[viaje.estacion] || 0) + 1;
      return acc;
  }, {});

  const stationColors = metro.reduce((acc, viaje) => {
      acc[viaje.estacion] = metroLineColors[viaje.linea] || generateRandomColor(); // Color
      return acc;
  }
  , {});

  // Convertir a array, ordenar y tomar los top 10
  const top10Stations = Object.entries(stationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

  const labels = top10Stations.map(([station]) => station);
  const data = top10Stations.map(([, count]) => count);
  const colors = top10Stations.map(([station]) => stationColors[station] || '#000000'); // Color

  const formattedData = labels.map((label, index) => ({
    x: label,
    y: data[index],
    fillColor: colors[index],      // Color de relleno para la barra
    strokeColor: colors[index]     // Color del borde de la barra
}));

  let elementId = organismo === "STC" ? "top10MetroStationsChart" : "top10MetrobusStationsChart";
  let sistema = sistemas[organismo];

  const options = {
      series: [{
          data: formattedData
      }],
      chart: {
          type: 'bar',
          height: 350
      },
      plotOptions: {
          bar: {
              borderRadius: 4,
              horizontal: true,
          }
      },
      dataLabels: {
          enabled: false
      },
      xaxis: {
          categories: labels,
          title: {
              text: 'Número de viajes'
          }
      },
      yaxis: {
          title: {
              text: `Estación de ${sistema}`
          }
      },
      title: {
          text: `Top 10 Estaciones de ${sistema} con más viajes`,
          align: 'center'
      },
      tooltip: {
          y: {
              title: {
                  formatter: function (seriesName) {
                      return "Viajes:";
                  }
              }
          }
      }
  };

  if (organismo === 'STC') {
    if (top10MetroStationsChart) {
      top10MetroStationsChart.destroy();
    }
    top10MetroStationsChart = new ApexCharts(document.getElementById(elementId), options);
    top10MetroStationsChart.render();
  } else {
    if (top10MetrobusStationsChart) {
      top10MetrobusStationsChart.destroy();
    }
    top10MetrobusStationsChart = new ApexCharts(document.getElementById(elementId), options);
    top10MetrobusStationsChart.render();
  }
}

function initializeMap(sistema, lat, lng, zoom) {
  const mapId = `map${sistema}`;

  if (window.mapInstances[mapId]) {
    window.mapInstances[mapId].remove();
  }

  const map = L.map(mapId).setView([lat, lng], zoom);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

  window.mapInstances[mapId] = map;
}

function hoverPopup(layer) {
  layer.on('mouseover', function (e) {
    this.openPopup();
  });
  layer.on('mouseout', function (e) {
    this.closePopup();
  });
}

function createMetroMap(metro, organismo = 'STC') {
  // Inicializa el mapa y establece la vista inicial
  // Colores de las líneas del metro
  const sistema = sistemas[organismo];
  // Inicializa el mapa y establece la vista inicial

  initializeMap(sistema, 19.432608, -99.133209, 12);

  // Cargar y mostrar las líneas del metro
  fetch(`maps/lineas_${sistema.toLowerCase()}.geojson`)
  .then(response => response.json())
  .then(data => {
  L.geoJSON(data,
    {
  style: function (feature) {
    return {
      color: metroLineColors[feature.properties.LINEA] || "red",
      weight: 3
    };
  },
  onEachFeature: function(feature, layer) {
    if (feature.properties && feature.properties.LINEA) {
      layer.bindPopup(`Línea ${feature.properties.LINEA}: ${feature.properties.RUTA}`);
      hoverPopup(layer);
    }
  }
  }).addTo(window.mapInstances[`map${sistema}`]);
  })
  .catch(error => console.error('Error al cargar las líneas del metro:', error));

  // Cargar los datos de viajes (Simulando datos de ejemplo para ilustrar)
  const viajesEstaciones = metro.reduce((acc, viaje) => {
    acc[viaje.estacion.toLowerCase()] = (acc[viaje.estacion.toLowerCase()] || 0) + 1;
    return acc;
  }, {});

  // Cargar y mostrar las estaciones del metro
  fetch(`maps/estaciones_${sistema.toLowerCase()}.geojson`)
  .then(response => response.json())
  .then(data => {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
    var nombreEstacion = feature.properties.NOMBRE.toLowerCase();
    var numViajes = viajesEstaciones[nombreEstacion] || 0;
    if (numViajes > 0) {
    return L.circleMarker(latlng, {
      radius: Math.min(numViajes, 20),  // Ajustar el factor de escala según sea necesario
      color: "blue",
      fillColor: "blue",
      fillOpacity: 0.8
    }).bindPopup("<strong>" + feature.properties.NOMBRE + "</strong><br>Viajes: " + numViajes);
  }
  },
  onEachFeature: function(feature, layer) {
    if (feature.properties && feature.properties.LINEA) {
      hoverPopup(layer);
    }
  }
  }).addTo(window.mapInstances[`map${sistema}`]);
  })
  .catch(error => console.error('Error al cargar las estaciones del metro:', error));
}

function createEcobiciHeatmap(inicioViaje, finViaje, tipo='viajes') {
  // Procesar los datos
  const viajes = getEcobiciODViajes(inicioViaje, finViaje);
  const processedData = tipo=='viajes' ? viajes : getEcobiciODMeanTime(inicioViaje, finViaje);
  // Obtener estaciones únicas
  const estaciones = [...new Set([...processedData.map(d => d.x), ...processedData.map(d => d.y)])];

  // Crear un objeto para contar los viajes totales por estación
  const viajeCounts = {};

  // Contar los viajes para cada estación de inicio y fin
  viajes.forEach(({ x: origen, y: destino, value }) => {
      viajeCounts[origen] = (viajeCounts[origen] || 0) + value;
      viajeCounts[destino] = (viajeCounts[destino] || 0) + value;
  });

  // Filtrar las estaciones que tienen al menos 2 viajes en total
  const estacionesPopulares = estaciones.filter(estacion => viajeCounts[estacion] >= 2);

  function convertDataToHeatmapSeries(data) {
    // Crear un objeto para mapear las estaciones y sus valores
    const seriesMap = {};

    // Inicializar las series para cada estación de origen filtrada
    estacionesPopulares.forEach(origen => {
        seriesMap[origen] = {
            name: origen, // El nombre de la serie será la estación de origen
            data: []
        };
    });
    // Añadir datos al mapa
    data.forEach(({ x: origen, y: destino, value }) => {
        if (seriesMap[origen] && estacionesPopulares.includes(destino)) {
            seriesMap[origen].data.push({ x: destino, y: value });
        }
    });

    // Ordenar los datos de cada serie de acuerdo al orden de `estacionesFiltradas`
    estacionesPopulares.forEach(origen => {
        seriesMap[origen].data.sort((a, b) => estacionesPopulares.indexOf(a.x) - estacionesPopulares.indexOf(b.x));
    });

    // Rellenar los destinos faltantes con valor 0 y ordenar de nuevo
    estacionesPopulares.forEach(origen => {
        estacionesPopulares.forEach(destino => {
            if (!seriesMap[origen].data.some(item => item.x === destino)) {
                seriesMap[origen].data.push({ x: destino, y: 0 });
            }
        });
        seriesMap[origen].data.sort((a, b) => estacionesPopulares.indexOf(a.x) - estacionesPopulares.indexOf(b.x));
    });

    // Convertir el objeto en un array de series
    return Object.values(seriesMap);
  }

  const seriesMap = convertDataToHeatmapSeries(processedData, estaciones);
  const ordenEstaciones = seriesMap.map(s => s.name);
  const prefixTitle = tipo === 'viajes' ? 'Número de viajes' : 'Tiempo promedio de viaje';
  const prefixUnit = tipo === 'viajes' ? 'viajes' : 'minutos';

  // Configurar y crear el gráfico
  const options = {
      series: seriesMap,
      chart: {
          type: 'heatmap',
          height: 350
      },
      dataLabels: {
          enabled: true,
      },
      colors: ["#008FFB"],
      title: {
          text: `${prefixTitle} entre tus rutas más comunes de Ecobici`,
      },
      xaxis: {
          categories: ordenEstaciones,
          labels: {
              rotate: -45,
              rotateAlways: true,
              maxHeight: 60
          }
      },
      yaxis: {
          categories: ordenEstaciones
      },
      tooltip: {
          y: {
              formatter: function (value) {
                  return `${value} ${prefixUnit}`;
              }
          }
      },
  };

  if (tipo === 'viajes'){
    if (ecobiciHeatmapViajes){
      ecobiciHeatmapViajes.destroy();
    }
    ecobiciHeatmapViajes = new ApexCharts(document.querySelector(`#ecobici-${tipo}`), options);
    ecobiciHeatmapViajes.render();
    } else {
      if (ecobiciHeatmapTiempo){
        ecobiciHeatmapTiempo.destroy();
      }
      ecobiciHeatmapTiempo = new ApexCharts(document.querySelector(`#ecobici-${tipo}`), options);
      ecobiciHeatmapTiempo.render();
    }
}

function createEcobiciMap(inicioViaje, finViaje) {
  initializeMap('Ecobici', 19.389688, -99.167158, 13);

  const viajesEstacionesInicio = inicioViaje.reduce((acc, viaje) => {
    acc[viaje.estacion] = (acc[viaje.estacion] || 0) + 1;
    return acc;
  }, {});

  const viajesEstacionesFin = finViaje.reduce((acc, viaje) => {
    acc[viaje.estacion] = (acc[viaje.estacion] || 0) + 1;
    return acc;
  } , {});

  // Cargar y mostrar las estaciones del metro
  fetch('maps/cicloestaciones_ecobici.geojson')
  .then(response => response.json())
  .then(ecobici => {
  L.geoJSON(ecobici, {
    pointToLayer: function (feature, latlng) {
    var nombreEstacion = feature.properties.estacion;
    var numViajes = (viajesEstacionesInicio[nombreEstacion] || 0) + (viajesEstacionesFin[nombreEstacion] || 0);
    if (numViajes > 0) {
    return L.circleMarker(latlng, {
      radius: Math.min(numViajes, 20),  // Ajustar el factor de escala según sea necesario
      color: "green",
      fillColor: "green",
      fillOpacity: 0.8
    }).bindPopup("<strong>" + feature.properties.estacion +
       "</strong><br>Total viajes: " + numViajes +
       "<br> inicio de viaje: " + (viajesEstacionesInicio[nombreEstacion] || 0) +
        "<br> fin de viaje: " + (viajesEstacionesFin[nombreEstacion] || 0)
      );
  }
  },
  onEachFeature: function(feature, layer) {
    if (feature.properties && feature.properties.estacion) {
      hoverPopup(layer);
    }
  }
  }).addTo(window.mapInstances['mapEcobici']);
  })
  .catch(error => console.error('Error al cargar las estaciones de ecobici', error));
}

function matchInicioFinViaje(inicioViaje, finViaje) {
  return inicioViaje.map(inicio => {
    const fin = finViaje.find(f => f.numero === inicio.numero - 1);
    if (fin) {
      const estacionInicio = inicio.estacion;
      const estacionFin = fin.estacion;
      const fechaInicio = parseDateTime(inicio.fecha);
      const fechaFin = parseDateTime(fin.fecha);
      const duracion = Math.round((fechaFin - fechaInicio) / 60000); // Diferencia en minutos
      return {
        estacionInicio,
        estacionFin,
        fechaInicio,
        fechaFin,
        duracion
      };
    }
    return null;
  }).filter(viaje => viaje !== null);
}

function parseDateTime(dateTimeString) {
    const [datePart, timePart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute, second);
}

function populateOrganismoSelector(viajes) {
  const organismos = [...new Set(viajes.map(viaje => viaje.organismo))];
  const selector = document.getElementById('organismoSelector');

  selector.innerHTML = '';

  // Añadir una opción predeterminada o vacía (opcional)
  const defaultOption = document.createElement('option');
  defaultOption.value = 'Todos';
  defaultOption.text = 'Todos';
  selector.add(defaultOption);

  organismos.forEach(organismo => {
      const option = document.createElement('option');
      option.value = organismo;
      option.text = organismo;
      selector.add(option);
  });
}

function openAboutModal() {
  document.getElementById('aboutModal').style.display = "block";
}

function closeAboutModal() {
  document.getElementById('aboutModal').style.display = "none";
}

// Cerrar el modal cuando se hace clic fuera de él
window.onclick = function(event) {
  if (event.target == document.getElementById('aboutModal')) {
    closeAboutModal();
  }
}
