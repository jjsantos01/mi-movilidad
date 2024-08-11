document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  const serieInput = document.getElementById('serieInput');
  let resultsTable = document.getElementById('resultsTable');
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');
  const prod = 1  ; // 0 para usar datos locales, 1 para usar API
  let pieChart;
  let lineChart;
  let stackedBarChart;
  let barChartMomentoDia;
  let saldoFinalChart;
  let resultsTableDT;
  window.mapInstances = {};

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const serie = serieInput.value.trim();
      if (serie) {
          try {
              const data = await fetchData(serie);
              const viajes = processViajes(data);
              const metro = createMetroObject(viajes, 'STC');
              const metrobus = createMetroObject(viajes, 'METROBÚS');
              const ecobici = data.filter(d => d.organismo === 'ECOBICI');
              const inicioViaje = ecobici.filter(d => d.operacion === '70-INICIO DE VIAJE');
              const finViaje = ecobici.filter(d => d.operacion === '71-FIN DE VIAJE');
              setupCollapsibleSections();
              displayResults(data);
              createPieChart(viajes);
              createLineChart(viajes);
              createStackedBarChart(viajes);
              createBarChartByMomentoDia(viajes);
              populateOrganismoSelector(viajes);
              createHeatmap(viajes);
              document.getElementById('organismoSelector').addEventListener('change', function() {
                const selectedOrganismo = this.value;
                createHeatmap(viajes, selectedOrganismo);
              });
              createSaldoFinalChart(data);
              // Metro
              createTop10MetroLinesChart(metro, 'STC');
              createTop10MetroStationsChart(metro, 'STC');
              createMetroMap(metro);
              // Metrobús
              createTop10MetroLinesChart(metrobus, 'METROBÚS');
              createTop10MetroStationsChart(metrobus, 'METROBÚS');
              createMetroMap(metrobus, 'METROBÚS');
              // Ecobici
              createEcobiciHeatmap(inicioViaje, finViaje, tipo='viajes');
              createEcobiciHeatmap(inicioViaje, finViaje, tipo='tiempo');
          } catch (error) {
              console.error('Error:', error);
              alert('Hubo un error al obtener los datos. Por favor, intente de nuevo.');
          }
      }
  });

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

  async function fetchData(serie) {
    if (prod) {
        const response = await fetch('https://app.semovi.cdmx.gob.mx/micrositio/291-trazabilidad_tarjetas.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://app.semovi.cdmx.gob.mx',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            },
            body: JSON.stringify({
                serie: serie,
                anio: '2024',
                operacion: 'todas',
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        return jsonResponse.data;
    } else {
        const response = await fetch('http://localhost:8000/datos/data.json');
        const data = await response.json();
        return data.data //.filter(item => item.serie === serie);
    }
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
      if (data && data.length > 0) {
          resultsTable.style.display = 'table';

          // Clear previous results
          tableHeader.innerHTML = '';
          tableBody.innerHTML = '';

          // Create table header
          const headers = Object.keys(data[0]);
          headers.forEach(header => {
              const th = document.createElement('th');
              th.textContent = header;
              tableHeader.appendChild(th);
          });

          // Populate table body
          data.forEach(row => {
              const tr = document.createElement('tr');
              headers.forEach(header => {
                  const td = document.createElement('td');
                  td.textContent = row[header];
                  tr.appendChild(td);
              });
              tableBody.appendChild(tr);
          });
          if (resultsTableDT){
            resultsTableDT.destroy()
          }
          resultsTableDT = new DataTable('#resultsTable')
      } else {
          resultsTable.style.display = 'none';
          alert('No se encontraron resultados para el número de serie proporcionado.');
      }
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
            return item;
        });
  }

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

      const labels = Object.keys(organismoCounts);
      const dataValues = Object.values(organismoCounts);

      const ctx = document.getElementById('pieChart').getContext('2d');

      if (pieChart) {
          pieChart.destroy();
      }

      pieChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: labels,
              datasets: [{
                  data: dataValues,
                  backgroundColor: labels.map(label => getColorForOrganismo(label)),
              }]
          },
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      position: 'top',
                  },
                  title: {
                      display: true,
                      text: 'Número de Viajes por sistema de transporte'
                  }
              }
          }
      });
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
    labels.sort((a, b) => new Date(a) - new Date(b));
    const datasets = Object.keys(dataValues).map(organismo => {
        return {
            label: organismo,
            data: labels.map(monthYear => {
                const found = dataValues[organismo].find(d => d.date === monthYear);
                return found ? found.value : 0;
            }),
            fill: false,
            borderColor: getColorForOrganismo(organismo),
        };
    });
    const ctx = document.getElementById('lineChart').getContext('2d');

    if (lineChart) {
        lineChart.destroy();
    }

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Total de Viajes Mensuales por sistema de transporte'
                }
            }
        }
    });
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

    const datasets = Object.keys(dataValues).map(organismo => {
        return {
            label: organismo,
            data: labels.map(day => {
                const found = dataValues[organismo].find(d => d.day === day);
                return found ? found.value : 0;
            }),
            backgroundColor: getColorForOrganismo(organismo),
        };
    });

    const ctx = document.getElementById('stackedBarChart').getContext('2d');

    if (stackedBarChart) {
      stackedBarChart.destroy();
    }

    stackedBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Total de viajes por sistema y día de la semana'
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    });
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
    const dataValues = {};

    organismos.forEach(organismo => {
        momentos.forEach(momento => {
            const key = `${organismo}+${momento}`;
            if (!dataValues[organismo]) dataValues[organismo] = [];
            dataValues[organismo].push(momentoData[key] || 0);
        });
    });

    const datasets = momentos.map((momento, index) => {
        return {
            label: momento,
            data: organismos.map(organismo => dataValues[organismo][index]),
            backgroundColor: getColorForOrganismo(momento),
        };
    });

    const ctx = document.getElementById('barChartMomentoDia').getContext('2d');

    if (barChartMomentoDia) {
        barChartMomentoDia.destroy();
    }

    barChartMomentoDia = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: organismos,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Total de viajes por sistema y momento del día'
                }
            },
        }
    });
  }

  function createHeatmap(viajes, selectedOrganismo = 'Todos') {
    const heatmapElement = document.getElementById('heatmapChart');
    if (!heatmapElement) {
        console.error('Elemento con ID "heatmapChart" no encontrado');
        return;
    }

    // Limpiar el contenido existente
    heatmapElement.innerHTML = '';

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
    const chart = new ApexCharts(heatmapElement, options);
    chart.render();

    // Guardar la instancia del gráfico para poder actualizarla o destruirla más tarde si es necesario
    heatmapElement.chart = chart;
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

    const dates = sortedData.map(item => parseDateTime(item.fecha));
    const saldos = sortedData.map(item => {
        const saldo = parseFloat(item.saldo_final);
        return isNaN(saldo) ? null : saldo;
    });

    const ctx = document.getElementById('saldoFinalChart').getContext('2d');

    if (saldoFinalChart) {
      saldoFinalChart.destroy();
    }

    saldoFinalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Saldo Final',
                data: saldos,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Histórico de Saldo Final'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'dd-MM-yyyy'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Saldo Final'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
                        }
                    }
                }
            }
        }
    });
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
    const chartElement = document.getElementById(elementId);
    if (!chartElement) {
        console.error(`Elemento con ID no ${elementId} encontrado`);
        return;
    }

    // Limpiar el contenido existente
    chartElement.innerHTML = '';

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

    const chart = new ApexCharts(chartElement, options);
    chart.render();

    // Guardar la instancia del gráfico para poder actualizarla o destruirla más tarde si es necesario
    chartElement.chart = chart;
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
    const chartElement = document.getElementById(elementId);
    if (!chartElement) {
        console.error(`Elemento con ID no ${elementId} encontrado`);
        return;
    }


    // Limpiar el contenido existente
    chartElement.innerHTML = '';

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

    const chart = new ApexCharts(chartElement, options);
    chart.render();

    // Guardar la instancia del gráfico para poder actualizarla o destruirla más tarde si es necesario
    chartElement.chart = chart;
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
        }
    };

    const chart = new ApexCharts(document.querySelector(`#ecobici-${tipo}`), options);
    chart.render();

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
});
