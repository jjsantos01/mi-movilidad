document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  const serieInput = document.getElementById('serieInput');
  const resultsTable = document.getElementById('resultsTable');
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');
  let pieChart;

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const serie = serieInput.value.trim();
      if (serie) {
          try {
              const data = await fetchData(serie);
              const viajes = processViajes(data);
              displayResults(viajes);
              createPieChart(viajes);
              createLineChart(viajes);
              createStackedBarChart(viajes);
              createBarChartByMomentoDia(viajes);
              createHeatmap(viajes);
          } catch (error) {
              console.error('Error:', error);
              alert('Hubo un error al obtener los datos. Por favor, intente de nuevo.');
          }
      }
  });

  const prod = 0; // 0 para usar datos locales, 1 para usar API

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
    "STC": 'rgba(255, 99, 132, 0.8)',
    "ECOBICI": 'rgba(54, 162, 235, 0.8)',
    "METROBÚS": 'rgba(255, 206, 86, 0.8)',
    "Mañana": 'rgba(75, 192, 192, 0.8)',
    "Tarde": 'rgba(153, 102, 255, 0.8)',
    "Noche": 'rgba(22, 192, 67, 0.8)',
    // Añade más organismos y colores según sea necesario
  };


function getColorForOrganismo(organismo) {
    return colorPalette[organismo] || 'rgba(0, 0, 0, 0.8)'; // Color por defecto si no se encuentra el organismo
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

  let lineChart;
  function createLineChart(viajes) {
    const organismoDates = viajes.reduce((acc, viaje) => {
        const date = new Date(viaje.fecha.split(' ')[0].split('-').reverse().join('-'));
        const organismo = viaje.organismo;
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Agrupa por mes y año
        const key = `${organismo}+${monthYear}`;

        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    console.log(organismoDates);
    const labels = [];
    const dataValues = {};

    Object.keys(organismoDates).forEach(key => {
        const [organismo, monthYear] = key.split('+');
        if (!labels.includes(monthYear)) labels.push(monthYear);

        if (!dataValues[organismo]) dataValues[organismo] = [];
        dataValues[organismo].push({ date: monthYear, value: organismoDates[key] });
    });
    labels.sort((a, b) => new Date(a) - new Date(b));
    console.log(dataValues);
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
    console.log(datasets);
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

    new Chart(ctx, {
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

    new Chart(ctx, {
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

  function createHeatmap(viajes) {
    const heatmapData = viajes.reduce((acc, viaje) => {
        const dayOfWeek = viaje.dayOfWeek;
        const momentoDia = viaje.momento_dia;
        const key = `${dayOfWeek}+${momentoDia}`;

        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const labelsX = ['Mañana', 'Tarde', 'Noche'];
    const labelsY = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

    const zData = labelsY.map(day => {
        return labelsX.map(momento => {
            const key = `${day}+${momento}`;
            return heatmapData[key] || 0;
        });
    });

    const data = [{
        z: zData,
        x: labelsX,
        y: labelsY,
        type: 'heatmap',
        colorscale: 'Blues',
        reversescale: true,
        hovertemplate: 'Momento del día: %{x}<br>Día de la semana: %{y}<br>Número de viajes: %{z}<extra></extra>'
    }];

    const layout = {
        title: 'Viajes por día de la semana y momento',
        xaxis: {
            title: 'Momento del día'
        },
        yaxis: {
            title: 'Día de la semana',
            autorange: 'reversed' // Invertir el orden para que lunes esté en la parte superior
        },
        height: 400,
        width: 500
    };

    Plotly.newPlot('heatmapChart', data, layout);
  }

});
