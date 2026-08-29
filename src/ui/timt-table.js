import { TIMT_UNKNOWN_STATION } from '../data/timt.js';

const TABLE_CLASS = 'timt-od-table';
const UNKNOWN_KEY = TIMT_UNKNOWN_STATION.toLowerCase();

function formatLabel(label) {
  if (!label || String(label).trim() === '') return TIMT_UNKNOWN_STATION;
  return label;
}

function normalize(label) {
  return String(label || TIMT_UNKNOWN_STATION).trim().toLowerCase();
}

function orderDestinations(destinations) {
  const ordered = [];
  let unknownLabel = null;
  (destinations || []).forEach(dest => {
    if (normalize(dest) === UNKNOWN_KEY) {
      unknownLabel = dest || TIMT_UNKNOWN_STATION;
      return;
    }
    ordered.push(dest);
  });
  ordered.push(unknownLabel || TIMT_UNKNOWN_STATION);
  return ordered;
}

export function renderTimtMatrix(matrix, metric = 'viajes') {
  const container = document.getElementById('timtODContainer');
  if (!container) return;

  const titleEl = document.getElementById('timtODTitle');
  if (titleEl) {
    titleEl.textContent = metric === 'duracion'
      ? 'Matriz origen-destino (Duración promedio en minutos)'
      : 'Matriz origen-destino (Número de viajes)';
  }

  if (!matrix || (matrix.origins.length === 0 && matrix.destinations.length === 0)) {
    container.innerHTML = '<p>No hay viajes del TIMT para mostrar.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = TABLE_CLASS;

  const destinations = orderDestinations(matrix.destinations);
  const isDuracion = metric === 'duracion';

  // Encabezados
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const corner = document.createElement('th');
  corner.textContent = 'Origen \\ Destino';
  headerRow.appendChild(corner);
  destinations.forEach(dest => {
    const th = document.createElement('th');
    th.textContent = formatLabel(dest);
    headerRow.appendChild(th);
  });
  const totalHeader = document.createElement('th');
  totalHeader.textContent = isDuracion ? 'Promedio origen' : 'Total viajes';
  headerRow.appendChild(totalHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Filas
  const tbody = document.createElement('tbody');
  matrix.origins.forEach(origin => {
    const row = document.createElement('tr');
    const originCell = document.createElement('th');
    originCell.textContent = formatLabel(origin);
    row.appendChild(originCell);

    destinations.forEach(dest => {
      const cell = document.createElement('td');
      if (isDuracion) {
        const avg = matrix.getAvgDuration(origin, dest);
        cell.textContent = avg > 0 ? `${avg} min` : '–';
      } else {
        const count = matrix.getCount(origin, dest);
        cell.textContent = count > 0 ? count.toLocaleString() : '0';
      }
      row.appendChild(cell);
    });

    const totalCell = document.createElement('td');
    totalCell.style.fontWeight = 'bold';
    if (isDuracion) {
      const avgOrigin = matrix.getOriginAvgDuration(origin);
      totalCell.textContent = avgOrigin > 0 ? `${avgOrigin} min` : '–';
    } else {
      totalCell.textContent = matrix.getOriginTotal(origin).toLocaleString();
    }
    row.appendChild(totalCell);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Pie de tabla con totales / promedios de destino
  const tfoot = document.createElement('tfoot');
  const footerRow = document.createElement('tr');
  const totalLabel = document.createElement('th');
  totalLabel.textContent = isDuracion ? 'Promedio destino' : 'Total viajes';
  footerRow.appendChild(totalLabel);

  destinations.forEach(dest => {
    const cell = document.createElement('th');
    if (isDuracion) {
      const avgDest = matrix.getDestinationAvgDuration(dest);
      cell.textContent = avgDest > 0 ? `${avgDest} min` : '–';
    } else {
      cell.textContent = matrix.getDestinationTotal(dest).toLocaleString();
    }
    footerRow.appendChild(cell);
  });

  const grandTotalCell = document.createElement('th');
  if (isDuracion) {
    grandTotalCell.textContent = matrix.grandAvgDuration > 0 ? `${matrix.grandAvgDuration} min` : '–';
  } else {
    grandTotalCell.textContent = matrix.grandTotal.toLocaleString();
  }
  footerRow.appendChild(grandTotalCell);
  tfoot.appendChild(footerRow);
  table.appendChild(tfoot);

  container.innerHTML = '';
  container.appendChild(table);
}

export function setupTimtTableEvents(matrix) {
  const select = document.getElementById('timtMetricSelect');
  if (!select) return;

  // Reemplazar nodo para limpiar eventos previos
  const newSelect = select.cloneNode(true);
  select.parentNode.replaceChild(newSelect, select);

  newSelect.addEventListener('change', e => {
    renderTimtMatrix(matrix, e.target.value);
  });
}
