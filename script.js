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
          } catch (error) {
              console.error('Error:', error);
              alert('Hubo un error al obtener los datos. Por favor, intente de nuevo.');
          }
      }
  });

  async function fetchData(serie) {
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

  function processViajes(data) {
    return data.filter(item => (item.operacion !== "71-FIN DE VIAJE") && (item.operacion !== "00-RECARGA"));
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
          type: 'pie',
          data: {
              labels: labels,
              datasets: [{
                  data: dataValues,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.8)',
                      'rgba(54, 162, 235, 0.8)',
                      'rgba(255, 206, 86, 0.8)',
                      'rgba(75, 192, 192, 0.8)',
                      'rgba(153, 102, 255, 0.8)',
                  ],
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
});
